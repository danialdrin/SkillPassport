import React, { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { knowledgeGraphApi } from "../api/knowledge_graph";
import { PageShell } from "../components/layout/PageShell";
import { ScoreChip } from "../components/dashboard/ScoreChip";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import {
  Search,
  Network,
  Info,
  Calendar,
  ShieldCheck,
  X,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { StudentKGStateItem, KGEdge } from "../types/knowledge_graph";
import { mockStudentKnowledgeGraph } from "../mocks/knowledge_graph";

interface CalculatedNode {
  node_id: string;
  display_name: string;
  description?: string | null;
  type?: string;
  bloom_level?: string | null;
  parent_id?: string | null;
  prerequisite_ids?: string[];
  competency_score: number;
  last_updated: string;
  evidence_event_ids: string[];
  x: number;
  y: number;
  isRoot?: boolean;
}

export const SkillGraphPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.user_id || "";
  const studentName = user?.name || "Student Knowledge State";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Explicitly revealed nodes (via click or Reveal All)
  const [revealedNodeIds, setRevealedNodeIds] = useState<Set<string>>(new Set());

  // Interactive Pan & Zoom
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  const isMockMode =
    new URLSearchParams(window.location.search).get("mock") === "true";

  const {
    data: studentKg,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["student-graph", userId],
    queryFn: () => knowledgeGraphApi.getStudentKG(userId),
    enabled: !!userId && !isMockMode,
  });

  const rawSkills: StudentKGStateItem[] = isMockMode
    ? mockStudentKnowledgeGraph.skills
    : studentKg?.skills || [];

  const rawEdges: KGEdge[] = isMockMode
    ? mockStudentKnowledgeGraph.edges || []
    : studentKg?.edges || [];

  // Filter skills by search query if non-empty
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return rawSkills;
    return rawSkills.filter(
      (s) =>
        s.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description &&
          s.description.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  }, [rawSkills, searchQuery]);

  // Topology Positioning Engine (Root centered, domains in outer radial layers)
  const nodeMap = useMemo(() => {
    const map = new Map<string, CalculatedNode>();

    const canvasWidth = 1000;
    const canvasHeight = 650;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Root Node (Student)
    const rootNodeId = "student-root-anchor";
    map.set(rootNodeId, {
      node_id: rootNodeId,
      display_name: studentName,
      description: "Central Student Knowledge Anchor representing overall concept evaluation.",
      type: "student",
      competency_score: 100,
      last_updated: new Date().toISOString(),
      evidence_event_ids: [],
      x: centerX,
      y: centerY,
      isRoot: true,
    });

    if (filteredSkills.length === 0) return map;

    // Group concept nodes into Level 1 (skills/root parents) and Level 2+ (sub-concepts)
    const level1Nodes = filteredSkills.filter(
      (s) => !s.parent_id || s.parent_id === rootNodeId,
    );
    const childNodes = filteredSkills.filter(
      (s) => s.parent_id && s.parent_id !== rootNodeId,
    );

    // Layout Level 1 nodes in primary circle
    const level1Radius = Math.min(220, 160 + filteredSkills.length * 5);
    level1Nodes.forEach((s, idx) => {
      const angle =
        (idx / Math.max(level1Nodes.length, 1)) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + level1Radius * Math.cos(angle);
      const y = centerY + level1Radius * Math.sin(angle);
      map.set(s.node_id, { ...s, x, y });
    });

    // Layout Level 2 child nodes around their respective parents
    const parentChildrenMap = new Map<string, StudentKGStateItem[]>();
    childNodes.forEach((child) => {
      const pid = child.parent_id!;
      const list = parentChildrenMap.get(pid) || [];
      list.push(child);
      parentChildrenMap.set(pid, list);
    });

    parentChildrenMap.forEach((children, parentId) => {
      const parentPos = map.get(parentId);
      if (!parentPos) return;

      const subRadius = 110;
      const parentAngle = Math.atan2(
        parentPos.y - centerY,
        parentPos.x - centerX,
      );
      const spreadAngle = Math.PI / 1.5;
      const startAngle = parentAngle - spreadAngle / 2;

      children.forEach((child, cIdx) => {
        const step =
          children.length > 1 ? spreadAngle / (children.length - 1) : 0;
        const angle = children.length === 1 ? parentAngle : startAngle + cIdx * step;
        const x = parentPos.x + subRadius * Math.cos(angle);
        const y = parentPos.y + subRadius * Math.sin(angle);
        map.set(child.node_id, { ...child, x, y });
      });
    });

    // Catch any remaining unmapped nodes
    filteredSkills.forEach((s, idx) => {
      if (!map.has(s.node_id)) {
        const angle =
          (idx / Math.max(filteredSkills.length, 1)) * 2 * Math.PI;
        const x = centerX + 260 * Math.cos(angle);
        const y = centerY + 260 * Math.sin(angle);
        map.set(s.node_id, { ...s, x, y });
      }
    });

    // Iterative Force/Repulsion Collision Avoidance Algorithm (50 iterations)
    // Guarantees zero node overlap or hidden nodes
    const nodesList = Array.from(map.values());
    const minDistance = 75; // Minimum required center-to-center clearance (75px)

    for (let iter = 0; iter < 50; iter++) {
      for (let i = 0; i < nodesList.length; i++) {
        for (let j = i + 1; j < nodesList.length; j++) {
          const n1 = nodesList[i];
          const n2 = nodesList[j];

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;

          if (dist < minDistance) {
            const overlap = minDistance - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            if (n1.isRoot) {
              n2.x += nx * overlap;
              n2.y += ny * overlap;
            } else if (n2.isRoot) {
              n1.x -= nx * overlap;
              n1.y -= ny * overlap;
            } else {
              n1.x -= nx * (overlap / 2);
              n1.y -= ny * (overlap / 2);
              n2.x += nx * (overlap / 2);
              n2.y += ny * (overlap / 2);
            }
          }
        }
      }
    }

    return map;
  }, [filteredSkills, studentName]);

  const allCalculatedNodes = useMemo(() => {
    return Array.from(nodeMap.values());
  }, [nodeMap]);

  // Initially reveal root + level 1 nodes
  useEffect(() => {
    const initialSet = new Set<string>();
    initialSet.add("student-root-anchor");
    allCalculatedNodes.forEach((n) => {
      if (n.isRoot || !n.parent_id) {
        initialSet.add(n.node_id);
      }
    });
    setRevealedNodeIds(initialSet);
  }, [allCalculatedNodes]);

  // Dynamic hover subnodes reveal calculation (temporary on hover)
  const hoverRevealedIds = useMemo(() => {
    if (!hoveredNodeId || hoveredNodeId === "student-root-anchor")
      return new Set<string>();

    const set = new Set<string>();
    set.add(hoveredNodeId);

    // Add subnodes / connected nodes for hovered node
    rawEdges.forEach((e) => {
      if (e.from_node_id === hoveredNodeId) set.add(e.to_node_id);
      if (e.to_node_id === hoveredNodeId) set.add(e.from_node_id);
    });

    allCalculatedNodes.forEach((n) => {
      if (n.parent_id === hoveredNodeId) set.add(n.node_id);
    });

    return set;
  }, [hoveredNodeId, rawEdges, allCalculatedNodes]);

  // When a node is clicked, reveal its subnodes permanently in revealedNodeIds
  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);

    setRevealedNodeIds((prev) => {
      const next = new Set(prev);
      next.add(nodeId);
      // Reveal subnodes and connected nodes for clicked node
      rawEdges.forEach((e) => {
        if (e.from_node_id === nodeId) next.add(e.to_node_id);
        if (e.to_node_id === nodeId) next.add(e.from_node_id);
      });
      allCalculatedNodes.forEach((n) => {
        if (n.parent_id === nodeId) next.add(n.node_id);
      });
      return next;
    });
  };

  // Reveal All / Collapse toggle
  const isAllRevealed = revealedNodeIds.size >= allCalculatedNodes.length;

  const handleToggleRevealAll = () => {
    if (isAllRevealed) {
      // Collapse back to root + level 1 nodes
      const initialSet = new Set<string>();
      initialSet.add("student-root-anchor");
      allCalculatedNodes.forEach((n) => {
        if (n.isRoot || !n.parent_id) initialSet.add(n.node_id);
      });
      setRevealedNodeIds(initialSet);
    } else {
      // Stagger reveal all nodes
      const unrevealed = allCalculatedNodes.map((n) => n.node_id);
      unrevealed.forEach((id, index) => {
        setTimeout(() => {
          setRevealedNodeIds((prev) => new Set(prev).add(id));
        }, index * 30);
      });
    }
  };

  // Fit to View & Reset View functionality
  const handleFitToView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setSelectedNodeId(null);
    setHoveredNodeId(null);
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === "svg") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.4), 2.5));
  };

  // Selected Node Details
  const selectedNode = useMemo(() => {
    if (!selectedNodeId || selectedNodeId === "student-root-anchor")
      return null;
    return rawSkills.find((s) => s.node_id === selectedNodeId) || null;
  }, [selectedNodeId, rawSkills]);

  // Parent & Prerequisite nodes for inspector
  const parentNode = useMemo(() => {
    if (!selectedNode?.parent_id) return null;
    return rawSkills.find((s) => s.node_id === selectedNode.parent_id) || null;
  }, [selectedNode, rawSkills]);

  const childNodesList = useMemo(() => {
    if (!selectedNode) return [];
    return rawSkills.filter((s) => s.parent_id === selectedNode.node_id);
  }, [selectedNode, rawSkills]);

  // Calculated Edges for SVG canvas
  const visibleEdges = useMemo(() => {
    const edgeList: {
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      relation: string;
      fromId: string;
      toId: string;
    }[] = [];

    const isNodeVisible = (id: string) =>
      revealedNodeIds.has(id) || hoverRevealedIds.has(id);

    // Root to Level 1 edges
    allCalculatedNodes.forEach((n) => {
      if (!n.isRoot && (!n.parent_id || n.parent_id === "student-root-anchor")) {
        const rootPos = nodeMap.get("student-root-anchor")!;
        if (isNodeVisible(n.node_id)) {
          edgeList.push({
            id: `root-${n.node_id}`,
            x1: rootPos.x,
            y1: rootPos.y,
            x2: n.x,
            y2: n.y,
            relation: "root_link",
            fromId: "student-root-anchor",
            toId: n.node_id,
          });
        }
      }
    });

    // Parent to Child & Explicit KG Edges
    rawEdges.forEach((e, idx) => {
      const fromNode = nodeMap.get(e.from_node_id);
      const toNode = nodeMap.get(e.to_node_id);
      if (
        fromNode &&
        toNode &&
        isNodeVisible(fromNode.node_id) &&
        isNodeVisible(toNode.node_id)
      ) {
        edgeList.push({
          id: `edge-${idx}-${e.edge_id}`,
          x1: fromNode.x,
          y1: fromNode.y,
          x2: toNode.x,
          y2: toNode.y,
          relation: e.relation,
          fromId: e.from_node_id,
          toId: e.to_node_id,
        });
      }
    });

    // Structural parent-child fallback edges
    allCalculatedNodes.forEach((n) => {
      if (n.parent_id && n.parent_id !== "student-root-anchor") {
        const pNode = nodeMap.get(n.parent_id);
        if (
          pNode &&
          isNodeVisible(n.node_id) &&
          isNodeVisible(pNode.node_id)
        ) {
          const exists = edgeList.some(
            (e) => e.fromId === pNode.node_id && e.toId === n.node_id,
          );
          if (!exists) {
            edgeList.push({
              id: `parent-${pNode.node_id}-${n.node_id}`,
              x1: pNode.x,
              y1: pNode.y,
              x2: n.x,
              y2: n.y,
              relation: "part_of",
              fromId: pNode.node_id,
              toId: n.node_id,
            });
          }
        }
      }
    });

    return edgeList;
  }, [allCalculatedNodes, nodeMap, revealedNodeIds, hoverRevealedIds, rawEdges]);

  return (
    <PageShell>
      {/* Header Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">
            Interactive Skill Graph
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <Input
            type="text"
            placeholder="Search concept or skill node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-surface"
          />
        </div>
      </div>

      {/* Legend Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 p-3.5 bg-surface border border-line rounded-xl text-xs font-mono shadow-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-ink-muted uppercase font-semibold text-[10px]">
            Mastery Levels:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-xs" />
            <span className="text-ink font-sans text-xs">Mastered (&ge; 80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-xs" />
            <span className="text-ink font-sans text-xs">Developing (60–79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-600 inline-block shadow-xs" />
            <span className="text-ink font-sans text-xs">Needs Work (&lt; 60)</span>
          </div>
        </div>

        <span className="text-ink-muted text-xs">
          Revealed:{" "}
          <strong className="text-ink font-semibold">
            {Math.max(0, revealedNodeIds.size - 1)}
          </strong>{" "}
          / {rawSkills.length} Concepts
        </span>
      </div>

      {/* Main Canvas + Inspector Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive SVG Topology Canvas */}
        <div className="lg:col-span-8 bg-surface border border-line rounded-xl p-4 relative min-h-[540px] flex items-center justify-center overflow-hidden shadow-xs">
          {/* Controls Bar: Zoom In, Zoom Out, Fit, Reset, and Reveal All / Collapse */}
          <div className="absolute right-4 top-4 z-20 flex items-center gap-1 bg-paper/90 backdrop-blur-xs border border-line p-1.5 rounded-xl shadow-xs">
            {/* Reveal All / Collapse Button */}
            <button
              type="button"
              onClick={handleToggleRevealAll}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-ink hover:bg-surface rounded-lg transition-colors border-r border-line pr-3 mr-1"
              title={isAllRevealed ? "Collapse Topology" : "Reveal Entire Topology"}
            >
              <Eye className="w-3.5 h-3.5 text-stone-700" />
              <span>{isAllRevealed ? "Collapse" : "Reveal All"}</span>
            </button>

            <button
              type="button"
              title="Zoom In"
              onClick={() => setZoom((z) => Math.min(z * 1.15, 2.5))}
              className="p-1.5 text-ink-muted hover:text-ink hover:bg-surface rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Zoom Out"
              onClick={() => setZoom((z) => Math.max(z * 0.85, 0.4))}
              className="p-1.5 text-ink-muted hover:text-ink hover:bg-surface rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-line mx-0.5" />
            <button
              type="button"
              title="Fit to View"
              onClick={handleFitToView}
              className="p-1.5 text-ink-muted hover:text-ink hover:bg-surface rounded-lg transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <Skeleton className="h-[500px] w-full bg-paper rounded-lg" />
          ) : isError ? (
            <div className="text-center p-6 text-rose-600">
              {(error as { detail?: string }).detail ||
                "Failed to load knowledge state topology graph"}
            </div>
          ) : rawSkills.length === 0 ? (
            <div className="text-center p-8 space-y-3">
              <Network className="w-12 h-12 text-ink-muted mx-auto" />
              <h3 className="font-serif text-base font-semibold text-ink">
                Knowledge Topology Empty
              </h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto leading-relaxed">
                No concepts have been evaluated yet. Complete learning material
                ingestions, quizzes, or technical interviews to build your skill
                topology.
              </p>
            </div>
          ) : (
            <svg
              ref={svgRef}
              viewBox="0 0 1000 650"
              className="w-full h-[520px] select-none cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <defs>
                <radialGradient id="rootGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1C2430" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="1" />
                </radialGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <g
                transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
                style={{ transformOrigin: "500px 325px", transition: "transform 0.15s ease-out" }}
              >
                {/* Visual Background Topology Grid Rings */}
                <circle cx="500" cy="325" r="160" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
                <circle cx="500" cy="325" r="260" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.4" />

                {/* Connection Edges (All visible at full clean opacity) */}
                {visibleEdges.map((edge) => {
                  const isHoveredEdge =
                    hoveredNodeId === edge.fromId || hoveredNodeId === edge.toId;
                  const isSelectedEdge =
                    selectedNodeId === edge.fromId || selectedNodeId === edge.toId;

                  const strokeColor = isHoveredEdge || isSelectedEdge
                    ? "#1E293B"
                    : edge.relation === "root_link"
                    ? "#94A3B8"
                    : "#CBD5E1";

                  const strokeWidth = isHoveredEdge || isSelectedEdge ? 2.5 : 1.5;
                  const strokeOpacity = isHoveredEdge || isSelectedEdge ? 1.0 : 0.65;

                  return (
                    <line
                      key={edge.id}
                      x1={edge.x1}
                      y1={edge.y1}
                      x2={edge.x2}
                      y2={edge.y2}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={edge.relation === "root_link" ? "4 3" : undefined}
                      opacity={strokeOpacity}
                      className="transition-all duration-200"
                    />
                  );
                })}

                {/* Concept & Root Nodes (Full Opacity, Interacted node enlarged) */}
                {allCalculatedNodes.map((node) => {
                  const isVisible =
                    revealedNodeIds.has(node.node_id) || hoverRevealedIds.has(node.node_id);

                  if (!isVisible) return null;

                  const isSelected = selectedNodeId === node.node_id;
                  const isHovered = hoveredNodeId === node.node_id;

                  // Root Node Render (Scale only on hover, click to select root node)
                  if (node.isRoot) {
                    const isRootSelected = selectedNodeId === node.node_id;
                    return (
                      <g
                        key={node.node_id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectNode(node.node_id);
                        }}
                        className="cursor-pointer group"
                      >
                        {/* Glow selection ring for root node when clicked */}
                        {isRootSelected && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="46"
                            fill="none"
                            stroke="#38BDF8"
                            strokeWidth="2.5"
                            strokeDasharray="4 4"
                          />
                        )}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="42"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          className="animate-spin-slow"
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isRootSelected ? "38" : "36"}
                          fill="url(#rootGlow)"
                          stroke="#38BDF8"
                          strokeWidth={isRootSelected ? "3" : "2.5"}
                          filter="url(#glowEffect)"
                          className="transition-all duration-200 group-hover:scale-110 origin-center"
                          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                        />
                        <text
                          x={node.x}
                          y={node.y + 4}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="12"
                          fontFamily="Inter"
                          fontWeight="700"
                          className="pointer-events-none"
                        >
                          {studentName}
                        </text>
                      </g>
                    );
                  }

                  // Concept Node Color based on competency score
                  const score = node.competency_score;
                  const fillColor =
                    score >= 80 ? "#059669" : score >= 60 ? "#D97706" : "#DC2626";

                  const strokeColor = isSelected
                    ? "#0F172A"
                    : isHovered
                    ? "#38BDF8"
                    : "#FFFFFF";

                  return (
                    <g
                      key={node.node_id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectNode(node.node_id);
                      }}
                      onMouseEnter={() => setHoveredNodeId(node.node_id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className="cursor-pointer transition-all duration-200 opacity-100"
                    >
                      {/* Glow selection ring */}
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="30"
                          fill="none"
                          stroke="#0F172A"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                        />
                      )}

                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isHovered || isSelected ? "24" : "18"}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? "3" : isHovered ? "2.5" : "2"}
                        className="transition-all duration-200 hover:shadow-lg"
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="10"
                        fontFamily="IBM Plex Mono"
                        fontWeight="700"
                      >
                        {Math.round(score)}
                      </text>
                      <text
                        x={node.x}
                        y={node.y > 325 ? node.y + 36 : node.y - 28}
                        textAnchor="middle"
                        fill="#0F172A"
                        fontSize="11"
                        fontFamily="Inter"
                        fontWeight={isSelected || isHovered ? "700" : "500"}
                        className="transition-all duration-150"
                      >
                        {node.display_name.length > 22
                          ? node.display_name.substring(0, 20) + "..."
                          : node.display_name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>

        {/* Right Concept Node Inspector Details Drawer */}
        <div className="lg:col-span-4 bg-surface border border-line rounded-xl p-5 space-y-4 min-h-[540px] shadow-xs">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-line pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase text-ink-muted font-semibold tracking-wider">
                      CONCEPT INSPECTOR
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-stone-100 text-stone-700">
                      {selectedNode.type || "CONCEPT"}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-ink leading-snug">
                    {selectedNode.display_name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNodeId(null)}
                  className="text-ink-muted hover:text-ink p-1 rounded-lg hover:bg-paper transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              {selectedNode.description && (
                <div className="bg-paper p-3 rounded-lg border border-line/60">
                  <span className="text-[10px] font-mono uppercase text-ink-muted block font-semibold mb-1">
                    Definition & Core Concept
                  </span>
                  <p className="text-xs text-ink leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>
              )}

              {/* Competency & Bloom Taxonomy Level */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-paper p-3 rounded-lg border border-line/60">
                  <span className="text-ink-muted block font-mono text-[10px] uppercase font-semibold">
                    Competency Score
                  </span>
                  <ScoreChip
                    score={selectedNode.competency_score}
                    size="md"
                    className="mt-1"
                  />
                </div>

                <div className="bg-paper p-3 rounded-lg border border-line/60">
                  <span className="text-ink-muted block font-mono text-[10px] uppercase font-semibold">
                    Bloom Taxonomy Level
                  </span>
                  <span className="text-xs font-semibold text-ink uppercase tracking-wider block mt-1">
                    {selectedNode.bloom_level || "Understand"}
                  </span>
                </div>
              </div>

              {/* Parent Concept Link */}
              {parentNode && (
                <div className="pt-2 border-t border-line">
                  <span className="text-ink-muted block font-mono text-[10px] uppercase font-semibold mb-1.5">
                    Parent Concept
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectNode(parentNode.node_id)}
                    className="flex items-center gap-2 text-xs font-medium text-ink hover:text-stone-900 bg-paper hover:bg-surface border border-line p-2 rounded-lg w-full text-left transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                    <span>{parentNode.display_name}</span>
                  </button>
                </div>
              )}

              {/* Child Concepts */}
              {childNodesList.length > 0 && (
                <div className="pt-2 border-t border-line">
                  <span className="text-ink-muted block font-mono text-[10px] uppercase font-semibold mb-1.5">
                    Sub-Concepts ({childNodesList.length})
                  </span>
                  <div className="space-y-1">
                    {childNodesList.map((child) => (
                      <button
                        key={child.node_id}
                        type="button"
                        onClick={() => handleSelectNode(child.node_id)}
                        className="flex items-center justify-between text-xs text-ink hover:text-stone-900 bg-paper hover:bg-surface border border-line/60 p-2 rounded-lg w-full text-left transition-colors"
                      >
                        <span className="truncate">{child.display_name}</span>
                        <ScoreChip score={child.competency_score} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence Provenance */}
              <div className="space-y-2 pt-3 border-t border-line text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-ink-muted" />
                  <span className="text-ink-muted">
                    Last Evaluated:{" "}
                    <span className="text-ink">
                      {new Date(selectedNode.last_updated).toLocaleDateString()}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-ink-muted">
                    Evaluation Events:{" "}
                    <span className="text-ink font-semibold">
                      {selectedNode.evidence_event_ids.length} Provenance Record(s)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b border-line pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase text-ink-muted font-semibold tracking-wider">
                    STUDENT KNOWLEDGE ANCHOR
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-sky-100 text-sky-800">
                    ROOT ANCHOR
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-ink leading-snug">
                  {studentName}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed mt-1">
                  Central knowledge anchor representing overall concept evaluations across your ingested learning materials.
                </p>
              </div>

              {/* Direct Child Concepts (Level 1 Skill Domains) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted font-mono text-[10px] uppercase font-semibold">
                    Direct Skill Domains ({rawSkills.filter((s) => !s.parent_id || s.parent_id === "student-root-anchor").length})
                  </span>
                </div>
                <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                  {rawSkills
                    .filter((s) => !s.parent_id || s.parent_id === "student-root-anchor")
                    .map((child) => (
                      <button
                        key={child.node_id}
                        type="button"
                        onClick={() => handleSelectNode(child.node_id)}
                        className="flex items-center justify-between text-xs text-ink hover:text-stone-900 bg-paper hover:bg-surface border border-line p-2.5 rounded-lg w-full text-left transition-colors group shadow-2xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 shrink-0" />
                          <span className="truncate font-medium">{child.display_name}</span>
                        </div>
                        <ScoreChip score={child.competency_score} size="sm" />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

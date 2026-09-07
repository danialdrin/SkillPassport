import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { knowledgeGraphApi } from "../api/knowledge_graph";
import { PageShell } from "../components/layout/PageShell";
import { ScoreChip } from "../components/dashboard/ScoreChip";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { Search, Network, Info, Calendar, ShieldCheck, X } from "lucide-react";
import { StudentKGStateItem } from "../types/knowledge_graph";
import { mockStudentKnowledgeGraph } from "../mocks/knowledge_graph";

export const SkillGraphPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.user_id || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<StudentKGStateItem | null>(
    null,
  );
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

  const skills = isMockMode
    ? mockStudentKnowledgeGraph.skills
    : studentKg?.skills || [];

  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return skills;
    return skills.filter((s) =>
      s.display_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [skills, searchQuery]);

  // Full Canvas SVG Graph Layout Parameters
  const width = 800;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 180;

  const nodePositions = useMemo(() => {
    return filteredSkills.map((skill, index) => {
      const angle =
        (index / Math.max(filteredSkills.length, 1)) * 2 * Math.PI -
        Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { skill, x, y };
    });
  }, [filteredSkills]);

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-muted block">
            Student Knowledge State Topology
          </span>
          <h1 className="font-serif text-2xl font-bold text-ink">
            Interactive Skill Graph
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <Input
            type="text"
            placeholder="Search concept node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-surface"
          />
        </div>
      </div>

      {/* Mastery Legend Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 p-3 bg-surface border border-line rounded-sm text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-ink-muted uppercase">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-mastered inline-block" />
            <span className="text-ink font-sans">Mastered (&ge; 80)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-developing inline-block" />
            <span className="text-ink font-sans">Developing (60–79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gap inline-block" />
            <span className="text-ink font-sans">Needs Work (&lt; 60)</span>
          </div>
        </div>

        <span className="text-ink-muted">
          Showing {filteredSkills.length} of {skills.length} Nodes
        </span>
      </div>

      {/* Main Canvas + Detail Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive SVG Canvas */}
        <div className="lg:col-span-8 bg-surface border border-line rounded-sm p-4 relative min-h-[480px] flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="h-[440px] w-full bg-paper" />
          ) : isError ? (
            <div className="text-center p-6 text-gap">
              {(error as { detail?: string }).detail ||
                "Failed to load skill graph"}
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center p-8 space-y-2">
              <Network className="w-10 h-10 text-ink-muted mx-auto" />
              <h3 className="font-serif text-sm font-semibold text-ink">
                Skill Graph Empty
              </h3>
              <p className="text-xs text-ink-muted max-w-sm mx-auto">
                No concepts have been evaluated yet. Complete quizzes or AI
                technical interviews to map your understanding.
              </p>
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto max-h-[460px] select-none"
            >
              {/* Hub Edges */}
              {nodePositions.map((pos, i) => (
                <line
                  key={`edge-${i}`}
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="#D8DDD3"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              ))}

              {/* Center Root Hub */}
              <g className="cursor-pointer">
                <circle cx={centerX} cy={centerY} r="26" fill="#1C2430" />
                <text
                  x={centerX}
                  y={centerY + 4}
                  textAnchor="middle"
                  fill="#EEF2ED"
                  fontSize="11"
                  fontFamily="IBM Plex Mono"
                  fontWeight="bold"
                >
                  ROOT
                </text>
              </g>

              {/* Nodes */}
              {nodePositions.map((pos, i) => {
                const isSelected = selectedNode?.node_id === pos.skill.node_id;
                const score = pos.skill.competency_score;
                const fillColor =
                  score >= 80 ? "#2F6F5E" : score >= 60 ? "#C99A3E" : "#A63D2F";

                return (
                  <g
                    key={pos.skill.node_id || i}
                    onClick={() => setSelectedNode(pos.skill)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? "22" : "18"}
                      fill={fillColor}
                      stroke={isSelected ? "#1C2430" : "#F5F7F3"}
                      strokeWidth={isSelected ? "3" : "2"}
                      className="transition-all duration-200 group-hover:scale-110"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontFamily="IBM Plex Mono"
                      fontWeight="bold"
                    >
                      {Math.round(score)}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y > centerY ? pos.y + 32 : pos.y - 24}
                      textAnchor="middle"
                      fill="#1C2430"
                      fontSize="11"
                      fontFamily="Inter"
                      fontWeight={isSelected ? "700" : "500"}
                    >
                      {pos.skill.display_name}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Right Details Drawer */}
        <div className="lg:col-span-4 bg-surface border border-line rounded-sm p-5 space-y-4 min-h-[480px]">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-line pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-ink-muted block font-semibold">
                    CONCEPT NODE DETAILS
                  </span>
                  <h3 className="font-serif text-lg font-bold text-ink leading-snug">
                    {selectedNode.display_name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNode(null)}
                  className="text-ink-muted hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-ink-muted block font-mono text-[10px] uppercase">
                    Competency Score
                  </span>
                  <ScoreChip
                    score={selectedNode.competency_score}
                    size="md"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-line">
                  <Calendar className="w-3.5 h-3.5 text-ink-muted" />
                  <span className="text-ink-muted font-mono">
                    Last Evaluated:{" "}
                    {new Date(selectedNode.last_updated).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-line">
                  <ShieldCheck className="w-3.5 h-3.5 text-mastered" />
                  <span className="text-ink-muted font-mono">
                    Evidence Provenance:{" "}
                    {selectedNode.evidence_event_ids.length} Assessment Events
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-2 text-ink-muted">
              <Info className="w-6 h-6 mx-auto opacity-60" />
              <h4 className="font-serif text-sm font-semibold text-ink">
                Node Inspector
              </h4>
              <p className="text-xs leading-relaxed max-w-xs">
                Click any concept node on the skill graph canvas to inspect
                score details, timestamps, and evaluation evidence.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

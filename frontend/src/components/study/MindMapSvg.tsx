import React from 'react';
import { MaterialKGResponse } from '../../types/knowledge_graph';
import { Skeleton } from '../ui/skeleton';

export interface MindMapSvgProps {
  materialKg?: MaterialKGResponse;
  isLoading?: boolean;
}

export const MindMapSvg: React.FC<MindMapSvgProps> = ({ materialKg, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="h-64 w-full bg-surface rounded-sm" />;
  }

  if (!materialKg || materialKg.nodes.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center p-6 text-center border border-dashed border-line rounded-sm bg-surface/40">
        <p className="text-xs font-mono text-ink-muted">MINDMAP_STATE: UNMAPPED</p>
        <p className="text-xs text-ink-muted mt-1">
          No material concept relationships extracted yet for this resource.
        </p>
      </div>
    );
  }

  const nodes = materialKg.nodes;
  // Center node: first concept node or primary node
  const centerNode = nodes[0];
  const branchNodes = nodes.slice(1, 7);

  const width = 440;
  const height = 280;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 110;

  const positions = branchNodes.map((node, i) => {
    const angle = (i / branchNodes.length) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { node, x, y };
  });

  return (
    <div className="w-full bg-white border border-slate-200 rounded-sm p-4 overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
          Material Concept Topology
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          {nodes.length} Nodes &bull; {materialKg.edges.length} Edges
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-[280px] select-none"
      >
        {/* Curved Bezier Connectors */}
        {positions.map((pos, idx) => (
          <path
            key={`edge-${idx}`}
            d={`M ${centerX} ${centerY} Q ${(centerX + pos.x) / 2} ${(centerY + pos.y) / 2 - 15} ${pos.x} ${pos.y}`}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.7"
          />
        ))}

        {/* Center Topic Node (Purple Pill) */}
        <g className="cursor-pointer">
          <rect
            x={centerX - 65}
            y={centerY - 18}
            width="130"
            height="36"
            rx="18"
            fill="url(#purpleGradient)"
            stroke="#8B5CF6"
            strokeWidth="1.5"
          />
          <text
            x={centerX}
            y={centerY + 4}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontFamily="Inter"
            fontWeight="600"
          >
            {centerNode.display_name.length > 16
              ? `${centerNode.display_name.slice(0, 14)}…`
              : centerNode.display_name}
          </text>
        </g>

        {/* Branch Concepts (Blue Pills) */}
        {positions.map((pos, idx) => (
          <g key={pos.node.node_id || idx} className="group cursor-pointer">
            <rect
              x={pos.x - 50}
              y={pos.y - 14}
              width="100"
              height="28"
              rx="14"
              fill="#EFF6FF"
              stroke="#3B82F6"
              strokeWidth="1"
              className="transition-transform duration-200 group-hover:scale-105"
            />
            <text
              x={pos.x}
              y={pos.y + 4}
              textAnchor="middle"
              fill="#1E40AF"
              fontSize="10"
              fontFamily="Inter"
              fontWeight="500"
            >
              {pos.node.display_name.length > 12
                ? `${pos.node.display_name.slice(0, 10)}…`
                : pos.node.display_name}
            </text>
          </g>
        ))}

        {/* Gradients */}
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

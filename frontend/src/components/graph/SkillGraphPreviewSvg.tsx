import React from 'react';
import { StudentKGStateItem } from '../../types/knowledge_graph';
import { getScoreSemantic } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface SkillGraphPreviewSvgProps {
  skills: StudentKGStateItem[];
  maxNodes?: number;
}

export const SkillGraphPreviewSvg: React.FC<SkillGraphPreviewSvgProps> = ({
  skills,
  maxNodes = 7,
}) => {
  const displaySkills = skills.slice(0, maxNodes);

  if (displaySkills.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center p-6 text-center border border-dashed border-line rounded-sm bg-surface/50">
        <p className="text-xs font-mono text-ink-muted mb-2">GRAPH_STATE: EMPTY</p>
        <p className="text-sm text-ink-muted max-w-xs leading-relaxed">
          No concepts mapped yet. Search or upload material to begin constructing your skill graph.
        </p>
      </div>
    );
  }

  // Radial positioning algorithm for SVG preview
  const width = 380;
  const height = 260;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 95;

  const nodePositions = displaySkills.map((skill, index) => {
    const angle = (index / displaySkills.length) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { skill, x, y };
  });

  return (
    <div className="relative w-full bg-surface border border-line rounded-sm p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase text-ink-muted">Concept Topology Preview</span>
        <Link
          to="/skill-graph"
          className="text-xs font-medium text-ink hover:text-mastered flex items-center gap-1 transition-colors"
        >
          Full Graph <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-[260px] select-none"
        aria-label="Student concept knowledge graph preview"
      >
        {/* Center hub lines */}
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

        {/* Center Hub */}
        <circle cx={centerX} cy={centerY} r="18" fill="#1C2430" />
        <text
          x={centerX}
          y={centerY + 4}
          textAnchor="middle"
          fill="#EEF2ED"
          fontSize="10"
          fontFamily="IBM Plex Mono"
          fontWeight="bold"
        >
          KG
        </text>

        {/* Skill Nodes */}
        {nodePositions.map((pos, i) => {
          const semantic = getScoreSemantic(pos.skill.competency_score);
          const fillColor = pos.skill.competency_score >= 80 ? '#2F6F5E' : pos.skill.competency_score >= 60 ? '#C99A3E' : '#A63D2F';
          
          return (
            <g key={pos.skill.node_id || i} className="group cursor-pointer">
              <circle
                cx={pos.x}
                cy={pos.y}
                r="16"
                fill={fillColor}
                stroke="#F5F7F3"
                strokeWidth="2"
                className="transition-transform duration-300 group-hover:scale-110"
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="9"
                fontFamily="IBM Plex Mono"
                fontWeight="bold"
              >
                {Math.round(pos.skill.competency_score)}
              </text>
              <text
                x={pos.x}
                y={pos.y > centerY ? pos.y + 28 : pos.y - 20}
                textAnchor="middle"
                fill="#1C2430"
                fontSize="10"
                fontFamily="Inter"
                fontWeight="500"
                className="pointer-events-none"
              >
                {pos.skill.display_name.length > 14
                  ? `${pos.skill.display_name.slice(0, 12)}…`
                  : pos.skill.display_name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

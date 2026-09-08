import React from 'react';
import { PassportNodeItem } from '../../types/passport';
import { ScoreChip } from '../dashboard/ScoreChip';
import { Calendar, ShieldCheck, RotateCcw } from 'lucide-react';
import { getScoreSemantic } from '../../lib/utils';

export interface ConceptCompetencyCardProps {
  node: PassportNodeItem;
}

export const ConceptCompetencyCard: React.FC<ConceptCompetencyCardProps> = ({ node }) => {
  const semantic = getScoreSemantic(node.competency_score);

  // Format date cleanly e.g. "28 Aug 2026"
  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(node.last_updated);
      if (isNaN(date.getTime())) return node.last_updated;
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return node.last_updated;
    }
  }, [node.last_updated]);

  // Grammatically correct event count text
  const eventCount = node.evidence_event_ids?.length || 0;
  const eventText = eventCount === 1 ? '1 Event' : `${eventCount} Events`;

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`Concept ${node.display_name}, Bloom level ${node.bloom_level || 'Understand'}, Score ${Math.round(node.competency_score)} out of 100 (${semantic.label}).`}
      className="group relative h-[210px] w-full [perspective:1000px] outline-none select-none"
    >
      <div
        className={`relative h-full w-full rounded-sm border transition-transform duration-500 [transform-style:preserve-3d] shadow-xs group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)] ${semantic.borderClass} bg-surface-raised`}
      >
        {/* ================= FRONT FACE ================= */}
        <div className="absolute inset-0 h-full w-full rounded-sm p-4 flex flex-col justify-between [backface-visibility:hidden] bg-surface-raised">
          {/* Header Row: Bloom level & Score chip */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold truncate max-w-[110px] ${semantic.bgClass} ${semantic.colorClass} ${semantic.borderClass}`}
            >
              {node.bloom_level || 'Understand'}
            </span>
            <ScoreChip score={node.competency_score} size="sm" showLabel={false} />
          </div>

          {/* Body Content */}
          <div className="my-auto py-1">
            <h3 className="font-serif font-bold text-ink text-base leading-snug line-clamp-1 group-hover:text-ink transition-colors">
              {node.display_name}
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 mt-1">
              {node.description || 'Core skill competency verified through structured learning assessment.'}
            </p>
          </div>

          {/* Footer Row: Status badge & hint */}
          <div className="flex items-center justify-between pt-2 border-t border-line/60 mt-auto">
            <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium ${semantic.colorClass}`}>
              <span className={`w-2 h-2 rounded-full ${semantic.bgClass.replace('/10', '')}`} />
              {semantic.label}
            </span>
            <span className="text-[10px] font-mono text-ink-faint group-hover:text-ink-muted flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3 h-3 opacity-60 group-hover:rotate-45 transition-transform" />
              Flip
            </span>
          </div>
        </div>

        {/* ================= BACK FACE (EVIDENCE PANEL) ================= */}
        <div className="absolute inset-0 h-full w-full rounded-sm p-4 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface border-t-2 border-t-current ${semantic.colorClass}">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between border-b border-line pb-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-ink-muted font-semibold">
                Evidence Panel
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs ${semantic.bgClass} ${semantic.colorClass} border ${semantic.borderClass}`}>
                {Math.round(node.competency_score)} / 100
              </span>
            </div>

            <h4 className="font-semibold text-ink text-xs line-clamp-1 mb-3">
              {node.display_name}
            </h4>

            {/* Evidence Metadata */}
            <div className="space-y-2.5">
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-muted block">Last Evaluated</span>
                <span className="text-xs font-mono text-ink flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                  {formattedDate}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-ink-muted block">Assessment Evidence</span>
                <span className="text-xs font-mono font-semibold text-ink flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-mastered shrink-0" />
                  {eventText}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-line/60 mt-auto">
            <span className="text-[10px] font-mono text-ink-muted">
              ID: <span className="font-mono text-ink-faint">{node.node_id}</span>
            </span>
            <span className="text-[10px] font-mono text-ink-faint flex items-center gap-1">
              <RotateCcw className="w-3 h-3 opacity-60" /> Back
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

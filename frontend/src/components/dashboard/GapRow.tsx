import React from 'react';
import { GapItem } from '../../types/passport';
import { ScoreChip } from './ScoreChip';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface GapRowProps {
  gap: GapItem;
}

export const GapRow: React.FC<GapRowProps> = ({ gap }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-paper border-l-4 border-gap border-t border-r border-b border-line rounded-r-sm gap-3 transition-colors hover:bg-surface">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-gap shrink-0" />
          <span className="font-medium text-sm text-ink">{gap.display_name}</span>
        </div>
        {gap.recommended_prerequisites && gap.recommended_prerequisites.length > 0 && (
          <div className="text-xs text-ink-muted flex flex-wrap items-center gap-1">
            <span className="font-mono text-[11px] uppercase">Needs:</span>
            {gap.recommended_prerequisites.map((prereq, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 bg-surface border border-line rounded-xs font-mono text-[11px] text-ink"
              >
                {prereq}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
        <ScoreChip score={gap.competency_score} size="sm" />
        <Link
          to={`/search?query=${encodeURIComponent(gap.recommended_prerequisites[0] || gap.display_name)}`}
          className="text-xs font-medium text-ink hover:text-gap flex items-center gap-1 transition-colors underline underline-offset-2"
        >
          Bridge Gap <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

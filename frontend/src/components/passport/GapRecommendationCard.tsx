import React from 'react';
import { GapItem } from '../../types/passport';
import { ScoreChip } from '../dashboard/ScoreChip';
import { AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface GapRecommendationCardProps {
  gaps: GapItem[];
}

export const GapRecommendationCard: React.FC<GapRecommendationCardProps> = ({ gaps }) => {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="p-6 bg-surface border border-line rounded-sm text-center">
        <p className="text-xs text-ink-muted">No priority gaps detected in your Digital Skill Passport.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {gaps.map((gap) => (
        <div
          key={gap.node_id}
          className="p-4 bg-surface border-l-4 border-gap border-t border-r border-b border-line rounded-r-sm space-y-2"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gap shrink-0" />
              <h4 className="font-serif font-semibold text-sm text-ink">{gap.display_name}</h4>
            </div>
            <ScoreChip score={gap.competency_score} size="sm" />
          </div>

          {gap.recommended_prerequisites && gap.recommended_prerequisites.length > 0 && (
            <div className="pt-2 border-t border-line/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-ink-muted">
                <span className="font-mono text-[11px] uppercase">Recommended Prerequisites:</span>
                {gap.recommended_prerequisites.map((p, idx) => (
                  <span key={idx} className="font-mono text-[11px] bg-paper px-1.5 py-0.5 border border-line rounded-xs text-ink font-semibold">
                    {p}
                  </span>
                ))}
              </div>

              <Link
                to={`/search?query=${encodeURIComponent(gap.recommended_prerequisites[0] || gap.display_name)}`}
                className="text-xs font-semibold text-ink hover:text-gap flex items-center gap-1 transition-colors underline underline-offset-2"
              >
                Find Material <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

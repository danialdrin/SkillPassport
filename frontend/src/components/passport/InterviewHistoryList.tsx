import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '../../api/exams';
import { Skeleton } from '../ui/skeleton';
import { MessageSquareText, ChevronDown, ChevronUp, Bot, User, CheckCircle2 } from 'lucide-react';

export interface InterviewHistoryListProps {
  userId: string;
}

export const InterviewHistoryList: React.FC<InterviewHistoryListProps> = ({ userId }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: history, isLoading } = useQuery({
    queryKey: ['interview-history', userId],
    queryFn: () => examsApi.getInterviewHistory(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-16 w-full bg-surface" />
        <Skeleton className="h-16 w-full bg-surface" />
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="p-6 bg-surface border border-line rounded-sm text-center">
        <MessageSquareText className="w-6 h-6 text-ink-muted mx-auto mb-2" />
        <p className="text-xs text-ink-muted">No mock technical interview sessions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((session) => {
        const isExpanded = expandedId === session.session_id;

        return (
          <div key={session.session_id} className="bg-surface border border-line rounded-sm overflow-hidden">
            {/* Header row */}
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : session.session_id)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-paper transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-paper border border-line rounded-xs text-ink">
                  <MessageSquareText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-sm text-ink">
                    Technical Interview Session ({session.session_id.slice(-8)})
                  </h4>
                  <span className="text-[11px] font-mono text-ink-muted block">
                    {new Date(session.created_at).toLocaleString()} &bull; {session.turns_count} Turns Completed
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-mastered uppercase bg-mastered/10 px-2 py-0.5 rounded-xs border border-mastered/30">
                  {session.status}
                </span>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-ink-muted" /> : <ChevronDown className="w-4 h-4 text-ink-muted" />}
              </div>
            </button>

            {/* Collapsible Turns Transcript */}
            {isExpanded && (
              <div className="p-4 bg-paper border-t border-line space-y-3">
                <h5 className="text-xs font-mono uppercase text-ink-muted">Session Transcript & Evaluations</h5>
                {session.turns.map((t, idx) => (
                  <div key={idx} className="p-3 bg-surface border border-line rounded-xs space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <Bot className="w-3.5 h-3.5 text-ink shrink-0 mt-0.5" />
                      <span className="font-serif font-semibold text-ink">Q{t.turn_index}: {t.question}</span>
                    </div>
                    <div className="flex items-start gap-2 pl-4 text-ink-muted">
                      <User className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>A: {t.answer}</span>
                    </div>
                    {t.evaluation && (
                      <div className="pl-4 pt-1 flex items-center justify-between text-[11px] font-mono text-mastered">
                        <span>Feedback: {t.evaluation.feedback}</span>
                        <span>Credit: {Math.round(t.evaluation.raw_score * 100)}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

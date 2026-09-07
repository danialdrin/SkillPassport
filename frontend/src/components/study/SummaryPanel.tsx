import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { interactiveApi } from '../../api/interactive';
import { Skeleton } from '../ui/skeleton';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';
import { Sparkles, HelpCircle, MessageSquareText, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SummaryContent } from '../../types/interactive';

export interface SummaryPanelProps {
  resourceId: string;
  mockData?: SummaryContent;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ resourceId, mockData }) => {
  const {
    data: summary,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['summary', resourceId],
    queryFn: () => interactiveApi.getSummary(resourceId),
    enabled: !!resourceId && !mockData,
  });

  const displayedSummary = mockData || summary;

  if (!mockData && isLoading) {
    return (
      <div className="space-y-3 p-4">
        <Skeleton className="h-6 w-48 bg-line/40" />
        <Skeleton className="h-16 w-full bg-surface" />
        <Skeleton className="h-16 w-full bg-surface" />
      </div>
    );
  }

  if (!mockData && isError) {
    return (
      <div className="p-4 space-y-3">
        <Alert variant="error">
          <span>Failed to generate resource summary: {(error as { detail?: string }).detail || 'API error'}</span>
        </Alert>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry Summary
        </Button>
      </div>
    );
  }

  if (!displayedSummary) return null;

  return (
    <div className="space-y-6">
      {/* Key Takeaway Card */}
      <div className="p-4 bg-mastered/10 border border-mastered/30 rounded-sm space-y-1">
        <span className="text-[11px] font-mono uppercase text-mastered tracking-wider flex items-center gap-1 font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Core Concept Takeaway
        </span>
        <p className="text-xs font-serif text-ink font-semibold leading-relaxed">
          "{displayedSummary.key_takeaway}"
        </p>
      </div>

      {/* Summary Bullets */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono uppercase text-ink-muted tracking-wider">
          Structured Takeaways
        </h4>
        <ul className="space-y-2 text-xs text-ink leading-relaxed font-sans">
          {displayedSummary.summary_points.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-2 bg-surface border border-line rounded-xs">
              <CheckCircle2 className="w-4 h-4 text-mastered shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Assessment Entry Buttons */}
      <div className="pt-4 border-t border-line flex flex-col sm:flex-row gap-3">
        <Link to={`/quiz/${resourceId}`} className="flex-1">
          <Button variant="primary" size="sm" className="w-full text-xs">
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            Start Adaptive Quiz
          </Button>
        </Link>
        <Link to={`/interview/${resourceId}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full text-xs">
            <MessageSquareText className="w-3.5 h-3.5 mr-1" />
            Start AI Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};

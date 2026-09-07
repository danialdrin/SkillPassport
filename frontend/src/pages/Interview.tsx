import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { InterviewThread } from '../components/assessment/InterviewThread';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const InterviewPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();

  if (!resourceId) return null;

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-line pb-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <Link to={`/resources/${resourceId}`}>
            <Button variant="outline" size="sm" className="h-8 px-2.5">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Study
            </Button>
          </Link>
          <div>
            <span className="text-[11px] font-mono uppercase text-ink-muted block">
              AI Technical Interview
            </span>
            <h1 className="font-serif text-xl font-bold text-ink">Turn-by-Turn Mock Interview</h1>
          </div>
        </div>
      </div>

      <InterviewThread resourceId={resourceId} />
    </PageShell>
  );
};

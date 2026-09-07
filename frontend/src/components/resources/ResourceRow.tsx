import React from 'react';
import { ResourceResponse } from '../../types/resources';
import { StatusBadge } from './StatusBadge';
import { Link } from 'react-router-dom';
import { FileText, Youtube, ArrowRight } from 'lucide-react';

export interface ResourceRowProps {
  resource: ResourceResponse;
}

export const ResourceRow: React.FC<ResourceRowProps> = ({ resource }) => {
  const isYoutube = resource.source_type === 'youtube';
  const isReady = resource.status === 'strong_analyzed';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-surface border border-line rounded-sm gap-3 hover:bg-paper transition-colors">
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2 bg-paper border border-line rounded-xs text-ink shrink-0">
          {isYoutube ? <Youtube className="w-4 h-4 text-gap" /> : <FileText className="w-4 h-4 text-mastered" />}
        </div>
        <div className="min-w-0">
          <h4 className="font-sans font-semibold text-sm text-ink truncate max-w-md">
            {resource.title}
          </h4>
          <span className="text-[11px] font-mono text-ink-muted block truncate max-w-sm">
            {resource.url_or_file}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
        <StatusBadge status={resource.status} />
        {isReady ? (
          <Link
            to={`/resources/${resource.resource_id}`}
            className="text-xs font-semibold text-ink hover:text-mastered flex items-center gap-1 transition-colors underline underline-offset-2"
          >
            Study <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="text-xs text-ink-muted italic">Processing</span>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Badge } from '../ui/badge';
import { Filter } from 'lucide-react';

export type SearchFilterOption = 'all' | 'transcript' | 'reviewed' | 'mock';

export interface SearchFilterChipsProps {
  activeFilter: SearchFilterOption;
  onFilterChange: (filter: SearchFilterOption) => void;
  count: number;
}

export const SearchFilterChips: React.FC<SearchFilterChipsProps> = ({
  activeFilter,
  onFilterChange,
  count,
}) => {
  const options: Array<{ id: SearchFilterOption; label: string }> = [
    { id: 'all', label: 'All Candidates' },
    { id: 'transcript', label: 'With Transcript' },
    { id: 'reviewed', label: 'Medium Reviewed' },
    { id: 'mock', label: 'Development Mocks' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-line">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-mono text-ink-muted uppercase mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {options.map((opt) => {
          const isActive = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onFilterChange(opt.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer border ${
                isActive
                  ? 'bg-ink text-paper border-ink font-semibold'
                  : 'bg-surface text-ink-muted hover:text-ink border-line hover:border-ink/50'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <span className="text-xs font-mono text-ink-muted">
        Showing {count} candidates
      </span>
    </div>
  );
};

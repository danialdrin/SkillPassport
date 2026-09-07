import React, { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { Input } from '../ui/input';

export interface TranscriptTabProps {
  transcriptOrText: string;
}

export const TranscriptTab: React.FC<TranscriptTabProps> = ({ transcriptOrText }) => {
  const [searchFilter, setSearchFilter] = useState('');

  const paragraphs = React.useMemo(() => {
    if (!transcriptOrText) return [];
    return transcriptOrText.split('\n').filter((p) => p.trim().length > 0);
  }, [transcriptOrText]);

  const filteredParagraphs = React.useMemo(() => {
    if (!searchFilter.trim()) return paragraphs;
    return paragraphs.filter((p) => p.toLowerCase().includes(searchFilter.toLowerCase()));
  }, [paragraphs, searchFilter]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
        <Input
          type="text"
          placeholder="Filter transcript keywords..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="pl-8 h-8 text-xs bg-paper border-line"
        />
      </div>

      <div className="max-h-80 overflow-y-auto space-y-3 pr-2 font-sans text-xs leading-relaxed text-ink border border-line p-3 rounded-xs bg-paper/50">
        {filteredParagraphs.length > 0 ? (
          filteredParagraphs.map((para, idx) => (
            <p key={idx} className="hover:bg-surface p-1.5 rounded-xs transition-colors">
              {para}
            </p>
          ))
        ) : (
          <div className="text-center py-6 text-ink-muted">
            <FileText className="w-5 h-5 mx-auto mb-1 opacity-60" />
            <span>No matching transcript lines found.</span>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = '', onSearch, loading = false }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <Input
          type="text"
          placeholder="Search learning topics, concepts, or YouTube video titles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 bg-surface text-ink placeholder:text-ink-muted/60"
        />
      </div>
      <Button type="submit" variant="primary" disabled={loading || !query.trim()}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Search className="w-4 h-4 mr-1" />}
        Search Material
      </Button>
    </form>
  );
};

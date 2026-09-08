import React, { useState, useMemo, useEffect } from 'react';
import { PassportNodeItem } from '../../types/passport';
import { ConceptCompetencyCard } from './ConceptCompetencyCard';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { Search, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

export interface ConceptCompetencyGridProps {
  nodes: PassportNodeItem[];
  isLoading?: boolean;
}

const PAGE_SIZE = 15;

export const ConceptCompetencyGrid: React.FC<ConceptCompetencyGridProps> = ({
  nodes,
  isLoading = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'mastered' | 'developing' | 'gap'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter nodes by search query and tier
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch = node.display_name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      if (filter === 'mastered') return node.competency_score >= 80;
      if (filter === 'developing') return node.competency_score >= 60 && node.competency_score < 80;
      if (filter === 'gap') return node.competency_score < 60;
      return true;
    });
  }, [nodes, search, filter]);

  // Reset to page 1 whenever filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const totalPages = Math.ceil(filteredNodes.length / PAGE_SIZE) || 1;

  // Ensure active page is within bounds
  const activePage = Math.min(currentPage, totalPages);

  const paginatedNodes = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    return filteredNodes.slice(start, start + PAGE_SIZE);
  }, [filteredNodes, activePage]);

  return (
    <div className="space-y-6">
      {/* Search & Tier Filter Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 border border-line rounded-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
          <Input
            type="text"
            placeholder="Search skill or concept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-paper border-line"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-mono text-ink-muted uppercase mr-1 flex items-center gap-1">
            <LayoutGrid className="w-3 h-3" /> Tier:
          </span>
          {(['all', 'mastered', 'developing', 'gap'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              className={`px-2.5 py-1 text-xs font-mono capitalize rounded-xs border transition-colors cursor-pointer ${
                filter === t
                  ? 'bg-ink text-paper border-ink font-semibold'
                  : 'bg-paper text-ink-muted hover:text-ink border-line'
              }`}
            >
              {t === 'gap' ? 'Needs Work' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <Skeleton key={idx} className="h-[210px] w-full rounded-sm bg-surface" />
          ))}
        </div>
      ) : paginatedNodes.length > 0 ? (
        <>
          {/* Exactly 5 columns on desktop (xl:grid-cols-5) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {paginatedNodes.map((node) => (
              <ConceptCompetencyCard key={node.node_id} node={node} />
            ))}
          </div>

          {/* Pagination Controls Footer */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-line">
              <span className="text-xs font-mono text-ink-muted">
                Showing{' '}
                <span className="text-ink font-semibold">
                  {(activePage - 1) * PAGE_SIZE + 1}–
                  {Math.min(activePage * PAGE_SIZE, filteredNodes.length)}
                </span>{' '}
                of <span className="text-ink font-semibold">{filteredNodes.length}</span> concepts
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={activePage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-2.5 py-1 text-xs font-mono border border-line rounded-xs bg-paper text-ink hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 text-xs font-mono rounded-xs border transition-colors ${
                          activePage === pageNum
                            ? 'bg-ink text-paper border-ink font-semibold'
                            : 'bg-paper text-ink-muted hover:text-ink border-line'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={activePage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-2.5 py-1 text-xs font-mono border border-line rounded-xs bg-paper text-ink hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-surface border border-line rounded-sm py-12 px-4 text-center">
          <LayoutGrid className="w-8 h-8 mx-auto text-ink-faint mb-2" />
          <h4 className="text-sm font-semibold text-ink">No competency concepts found</h4>
          <p className="text-xs text-ink-muted max-w-sm mx-auto mt-1">
            No verified skill nodes match your search query or selected tier filter.
          </p>
        </div>
      )}
    </div>
  );
};

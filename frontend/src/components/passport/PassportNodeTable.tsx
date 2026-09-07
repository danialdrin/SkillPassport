import React, { useState, useMemo } from 'react';
import { PassportNodeItem } from '../../types/passport';
import { ScoreChip } from '../dashboard/ScoreChip';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Input } from '../ui/input';
import { Search, Calendar, ShieldCheck } from 'lucide-react';

export interface PassportNodeTableProps {
  nodes: PassportNodeItem[];
}

export const PassportNodeTable: React.FC<PassportNodeTableProps> = ({ nodes }) => {
  const [filter, setFilter] = useState<'all' | 'mastered' | 'developing' | 'gap'>('all');
  const [search, setSearch] = useState('');

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

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
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

        <div className="flex items-center gap-1">
          <span className="text-xs font-mono text-ink-muted uppercase mr-1">Tier:</span>
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
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-line rounded-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concept / Skill Name</TableHead>
              <TableHead>Bloom Taxonomy Level</TableHead>
              <TableHead>Competency Score</TableHead>
              <TableHead>Last Evaluated</TableHead>
              <TableHead className="text-right">Evidence Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNodes.length > 0 ? (
              filteredNodes.map((node) => (
                <TableRow key={node.node_id}>
                  <TableCell className="font-semibold text-ink">
                    {node.display_name}
                    {node.description && (
                      <span className="block text-xs font-normal text-ink-muted leading-tight mt-0.5">
                        {node.description}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-ink-muted uppercase">
                    {node.bloom_level || 'Understand'}
                  </TableCell>
                  <TableCell>
                    <ScoreChip score={node.competency_score} size="sm" />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-ink-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(node.last_updated).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-ink font-semibold">
                    <span className="inline-flex items-center gap-1 text-mastered">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {node.evidence_event_ids.length} Events
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-ink-muted text-xs font-mono">
                  No verified skill nodes match the selected criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

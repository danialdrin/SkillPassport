import React from 'react';
import { getScoreSemantic } from '../../lib/utils';
import { cn } from '../../lib/utils';

export interface ScoreChipProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ScoreChip: React.FC<ScoreChipProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className,
}) => {
  const roundedScore = Math.round(score);
  const semantic = getScoreSemantic(roundedScore);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 font-mono font-medium rounded-xs border',
        semantic.bgClass,
        semantic.colorClass,
        semantic.borderClass,
        sizeClasses[size],
        className
      )}
      title={`Competency score: ${roundedScore}/100 (${semantic.label})`}
    >
      <span>{roundedScore}/100</span>
      {showLabel && (
        <span className="text-[10px] uppercase font-sans tracking-wide opacity-80 border-l border-current/30 pl-1.5">
          {semantic.label}
        </span>
      )}
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ActionTileProps {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  accentColor?: 'mastered' | 'ink' | 'developing';
  className?: string;
  onClick?: () => void;
}

export const ActionTile: React.FC<ActionTileProps> = ({
  title,
  description,
  to,
  icon: Icon,
  accentColor = 'mastered',
  className,
  onClick,
}) => {
  const borderAccents = {
    mastered: 'border-l-mastered',
    ink: 'border-l-ink',
    developing: 'border-l-developing',
  };

  const Content = (
    <div
      className={cn(
        'group relative bg-surface border-l-4 border-t border-r border-b border-line p-4 rounded-r-sm transition-all hover:border-r-ink hover:border-t-ink hover:border-b-ink hover:bg-paper',
        borderAccents[accentColor],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-paper border border-line rounded-sm text-ink group-hover:bg-surface transition-colors">
            <Icon className="w-5 h-5 text-ink" />
          </div>
          <div>
            <h4 className="font-serif font-semibold text-sm text-ink group-hover:text-ink transition-colors flex items-center gap-1">
              {title}
            </h4>
            <p className="text-xs text-ink-muted leading-snug mt-0.5">{description}</p>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-ink-muted group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left cursor-pointer">
        {Content}
      </button>
    );
  }

  return <Link to={to}>{Content}</Link>;
};

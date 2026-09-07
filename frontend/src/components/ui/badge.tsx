import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'mastered' | 'developing' | 'gap' | 'outline' | 'secondary';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-mono font-medium tracking-tight uppercase';

  const variants = {
    default: 'bg-ink/10 text-ink border border-ink/20',
    secondary: 'bg-surface text-ink-muted border border-line',
    mastered: 'bg-mastered/10 text-mastered border border-mastered/30',
    developing: 'bg-developing/10 text-developing border border-developing/30',
    gap: 'bg-gap/10 text-gap border border-gap/30',
    outline: 'bg-transparent text-ink border border-line',
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

import * as React from 'react';
import { cn } from '../../lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'error' | 'success' | 'warning';
}

export const Alert: React.FC<AlertProps> = ({ className, variant = 'info', children, ...props }) => {
  const variants = {
    info: 'bg-surface border-line text-ink',
    error: 'bg-gap/10 border-gap text-gap',
    success: 'bg-mastered/10 border-mastered text-mastered',
    warning: 'bg-developing/10 border-developing text-developing',
  };

  return (
    <div
      role="alert"
      className={cn('p-4 border rounded-sm text-sm font-sans flex items-start gap-3', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

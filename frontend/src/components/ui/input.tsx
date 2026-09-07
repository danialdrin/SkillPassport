import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-sm border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted/60 focus:bg-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-gap text-gap focus-visible:ring-gap' : 'border-line hover:border-ink/50',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

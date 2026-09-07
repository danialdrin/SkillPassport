import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'mastered';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer rounded-sm';

    const variants = {
      primary: 'bg-ink text-paper hover:bg-ink/90 active:bg-ink/95 border border-ink',
      secondary: 'bg-surface text-ink hover:bg-line/40 border border-line',
      outline: 'bg-transparent text-ink border border-line hover:border-ink hover:bg-surface',
      ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-surface',
      destructive: 'bg-gap text-paper hover:bg-gap/90 border border-gap',
      mastered: 'bg-mastered text-paper hover:bg-mastered/90 border border-mastered',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 min-h-[32px]',
      md: 'text-sm px-4 py-2 min-h-[40px]',
      lg: 'text-base px-6 py-2.5 min-h-[48px]',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

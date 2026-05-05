'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, invalid, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex h-11 w-full rounded-xl border bg-[var(--bg-elevated)] px-4 py-2 text-sm text-fg shadow-sm transition-colors',
          'border-[var(--border)] placeholder:text-fg-muted',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid && 'border-danger focus-visible:ring-danger',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

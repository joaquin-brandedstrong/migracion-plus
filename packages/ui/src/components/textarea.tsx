'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex min-h-24 w-full rounded-xl border bg-[var(--bg-elevated)] px-4 py-3 text-sm text-fg shadow-sm transition-colors',
          'border-[var(--border)] placeholder:text-fg-muted',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50 resize-y',
          invalid && 'border-danger focus-visible:ring-danger',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

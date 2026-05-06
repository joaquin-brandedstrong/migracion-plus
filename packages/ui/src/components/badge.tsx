import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-bold uppercase tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-100 text-brand-900 dark:bg-brand-900/40 dark:text-brand-200',
        // accent alias — Udemy "Bestseller"-style filled chip in brand teal.
        accent: 'border-transparent bg-brand-200 text-brand-900 dark:bg-brand-800 dark:text-brand-100',
        success: 'border-transparent bg-brand-200 text-brand-900 dark:bg-brand-800/60 dark:text-brand-100',
        outline: 'border-[var(--border)] text-fg',
        muted: 'border-transparent bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

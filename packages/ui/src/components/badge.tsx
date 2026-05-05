import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300',
        accent: 'border-transparent bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300',
        success: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
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

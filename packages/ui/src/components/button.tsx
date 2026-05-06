'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Flat solid teal — Udemy-style primary CTA.
        primary:
          'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900',
        // Legacy `accent` alias — same visual weight as primary, kept for
        // backwards-compat with components that still pass variant="accent".
        accent:
          'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900',
        secondary:
          'bg-white text-fg border border-[var(--border)] hover:bg-ink-50 dark:bg-ink-800 dark:hover:bg-ink-700',
        ghost: 'text-fg hover:bg-ink-100 dark:hover:bg-ink-800',
        outline:
          'border border-brand-700 bg-transparent text-brand-700 hover:bg-brand-50 dark:border-brand-400 dark:text-brand-300 dark:hover:bg-brand-900/30',
        link: 'text-brand-700 dark:text-brand-300 underline-offset-4 hover:underline rounded-none px-0',
        destructive: 'bg-danger text-white hover:bg-red-600 active:translate-y-px',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-9 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = 'Button';

export { buttonVariants };

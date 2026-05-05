'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-br from-brand-700 to-brand-900 text-white shadow-glass hover:shadow-glass-lg hover:from-brand-600 hover:to-brand-800 active:translate-y-px',
        accent:
          'bg-gradient-to-br from-accent-500 to-accent-600 text-ink-950 shadow-glass hover:shadow-glass-lg hover:from-accent-400 hover:to-accent-500 active:translate-y-px',
        secondary:
          'bg-white/70 dark:bg-ink-800/70 text-fg backdrop-blur-md border border-[var(--glass-border)] hover:bg-white/90 dark:hover:bg-ink-800/90',
        ghost: 'text-fg hover:bg-ink-100/60 dark:hover:bg-ink-800/60',
        outline:
          'border border-[var(--border)] bg-transparent text-fg hover:bg-ink-100/40 dark:hover:bg-ink-800/40',
        link: 'text-brand-700 dark:text-brand-400 underline-offset-4 hover:underline rounded-none px-0',
        destructive: 'bg-danger text-white hover:bg-red-600 active:translate-y-px',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 text-base',
        xl: 'h-14 px-10 text-base',
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

'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';
import { cn } from '../lib/utils';
import { springSoft } from '../motion';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  intensity?: 'subtle' | 'medium' | 'strong';
  noise?: boolean;
  hoverable?: boolean;
  children?: ReactNode;
}

const blurMap = {
  subtle: 'backdrop-blur-md',
  medium: 'backdrop-blur-xl',
  strong: 'backdrop-blur-3xl',
} as const;

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ intensity = 'medium', noise = true, hoverable = false, className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -4, transition: { ...springSoft, stiffness: 300, damping: 20 } } : undefined}
        className={cn(
          'relative overflow-hidden rounded-2xl border',
          blurMap[intensity],
          'bg-[var(--glass-bg)] border-[var(--glass-border)] shadow-[var(--glass-shadow)]',
          className,
        )}
        {...props}
      >
        {noise ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[var(--noise-opacity)]"
            style={{ backgroundImage: 'url("/textures/noise.png")', backgroundSize: '256px 256px' }}
          />
        ) : null}
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  },
);
GlassCard.displayName = 'GlassCard';

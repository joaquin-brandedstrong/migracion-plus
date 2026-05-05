'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../lib/utils';

interface GradientMeshProps {
  className?: string;
  intensity?: 'soft' | 'bold';
}

/**
 * Animated gradient mesh background. Hue rotation runs in CSS via the
 * `gradient-rotate` keyframe (defined in the tailwind preset). Honors
 * prefers-reduced-motion by freezing the rotation.
 */
export function GradientMesh({ className, intensity = 'soft' }: GradientMeshProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        intensity === 'soft' ? 'opacity-70' : 'opacity-90',
        className,
      )}
    >
      <div
        className={cn(
          'absolute inset-0 bg-gradient-mesh dark:bg-gradient-mesh-dark',
          !reduce && 'animate-gradient-rotate',
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)]" />
    </motion.div>
  );
}

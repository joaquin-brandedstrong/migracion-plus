import type { Transition, Variants } from 'framer-motion';

export const springSoft: Transition = { type: 'spring', stiffness: 260, damping: 26 };
export const springSnappy: Transition = { type: 'spring', stiffness: 400, damping: 30 };
export const springGentle: Transition = { type: 'spring', stiffness: 180, damping: 22 };

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: springSoft },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: springSoft },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};

export const stagger = (delay = 0.06): Variants => ({
  animate: { transition: { staggerChildren: delay } },
});

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

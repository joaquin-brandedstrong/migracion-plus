import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'primary' | 'footer';
  className?: string;
  /** Pixel width to render at; height auto-calculated to preserve aspect. */
  width?: number;
  priority?: boolean;
}

const SOURCES = {
  primary: { light: '/brand/logo-primary.png', dark: '/brand/logo-primary-dark.png', w: 350, h: 84 },
  footer: { light: '/brand/logo-footer.png', dark: '/brand/logo-footer-dark.png', w: 470, h: 235 },
} as const;

/**
 * Brand wordmark. Renders both light and dark PNGs and CSS-toggles between
 * them based on `data-theme`, so there's no hydration flash from reading
 * theme state on the client.
 */
export function Logo({ variant = 'primary', className, width, priority = false }: LogoProps) {
  const src = SOURCES[variant];
  const w = width ?? (variant === 'primary' ? 160 : 200);
  const h = Math.round((w * src.h) / src.w);

  return (
    <span className={cn('relative inline-block leading-none', className)} style={{ width: w, height: h }}>
      <Image
        src={src.light}
        alt="Migración Plus"
        width={src.w}
        height={src.h}
        priority={priority}
        sizes={`${w}px`}
        className="absolute inset-0 h-full w-full object-contain dark:hidden"
      />
      <Image
        src={src.dark}
        alt="Migración Plus"
        width={src.w}
        height={src.h}
        priority={priority}
        sizes={`${w}px`}
        aria-hidden="true"
        className="absolute inset-0 hidden h-full w-full object-contain dark:block"
      />
    </span>
  );
}

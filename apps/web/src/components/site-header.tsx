'use client';

import { Button, ThemeToggle, LanguageToggle } from '@migracionplus/ui';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from '@/i18n/routing';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';

export function SiteHeader() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 8));

  const nav = [
    { href: '/cursos', label: t('courses') },
    { href: '/libros', label: t('books') },
    { href: '/sobre-nosotros', label: t('about') },
    { href: '/blog', label: t('blog') },
    { href: '/contacto', label: t('contact') },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-sm'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container flex h-20 items-center justify-between gap-4 lg:h-24">
        <Link
          href={`/${locale}`}
          className="flex items-center"
          aria-label="Migración Plus — Inicio"
        >
          <Logo variant="primary" width={320} priority />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${locale}${item.href}`}
                  className="rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-ink-100/60 hover:text-fg dark:hover:bg-ink-800/60"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle
            currentLocale={locale}
            locales={[
              { code: 'es', label: 'Español' },
              { code: 'en', label: 'English' },
            ]}
            onSelect={(code) => router.push(pathname, { locale: code as 'es' | 'en' })}
            className="hidden sm:inline-flex"
          />
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Link href={`/${locale}/iniciar-sesion`}>{tCommon('signIn')}</Link>
          </Button>
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href={`/${locale}/registro`}>{tCommon('getStarted')}</Link>
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[var(--glass-border)] bg-[var(--bg-elevated)] lg:hidden"
          >
            <ul className="container flex flex-col gap-1 py-4">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${locale}${item.href}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-fg hover:bg-ink-100 dark:hover:bg-ink-800"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 grid grid-cols-2 gap-2">
                <Button asChild variant="ghost" size="md">
                  <Link href={`/${locale}/iniciar-sesion`} onClick={() => setOpen(false)}>
                    {tCommon('signIn')}
                  </Link>
                </Button>
                <Button asChild size="md">
                  <Link href={`/${locale}/registro`} onClick={() => setOpen(false)}>
                    {tCommon('getStarted')}
                  </Link>
                </Button>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

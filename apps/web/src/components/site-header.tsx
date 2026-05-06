'use client';

import { Button, ThemeToggle, LanguageToggle } from '@migracionplus/ui';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from '@/i18n/routing';
import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/logo';

export function SiteHeader() {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: '/cursos', label: t('courses') },
    { href: '/libros', label: t('books') },
    { href: '/blog', label: t('blog') },
    { href: '/sobre-nosotros', label: t('about') },
    { href: '/contacto', label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-bg-elevated">
      <div className="container flex h-16 items-center gap-4 lg:h-20">
        <Link href={`/${locale}`} className="flex shrink-0 items-center" aria-label="Migración Plus — Inicio">
          <Logo variant="primary" width={280} priority />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <Link
                href={`/${locale}/cursos`}
                className="px-3 py-2 text-sm font-bold text-brand-700 hover:underline dark:text-brand-300"
              >
                {locale === 'es' ? 'Categorías' : 'Categories'}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Search */}
        <form
          role="search"
          className="relative hidden flex-1 lg:block"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
          <input
            type="search"
            placeholder={
              locale === 'es'
                ? 'Buscar cursos, temas, formularios…'
                : 'Search courses, topics, forms…'
            }
            aria-label={tCommon('search')}
            className="h-11 w-full rounded-full border border-[var(--border)] bg-bg pl-10 pr-4 text-sm text-fg placeholder:text-fg-muted focus-visible:border-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          />
        </form>

        <nav aria-label="Secundaria" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.slice(2).map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${locale}${item.href}`}
                  className="px-3 py-2 text-sm font-medium text-fg hover:text-brand-700 dark:hover:text-brand-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:gap-2">
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
          <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex">
            <Link href={`/${locale}/iniciar-sesion`}>{tCommon('signIn')}</Link>
          </Button>
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href={`/${locale}/registro`}>{tCommon('getStarted')}</Link>
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-fg lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[var(--border)] bg-bg-elevated lg:hidden">
          <div className="container py-3">
            <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
              <input
                type="search"
                placeholder={locale === 'es' ? 'Buscar…' : 'Search…'}
                aria-label={tCommon('search')}
                className="h-11 w-full rounded-full border border-[var(--border)] bg-bg pl-10 pr-4 text-sm text-fg"
              />
            </form>
          </div>
          <ul className="container flex flex-col gap-1 pb-4">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={`/${locale}${item.href}`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-fg hover:bg-brand-50 dark:hover:bg-brand-900/30"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="md">
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
        </div>
      ) : null}
    </header>
  );
}

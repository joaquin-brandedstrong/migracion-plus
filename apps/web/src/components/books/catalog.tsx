'use client';

import { Badge, Button, GlassCard } from '@migracionplus/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { books } from '@/data/seed';
import { formatPrice } from '@/lib/utils';

export function BooksCatalog() {
  const t = useTranslations('books');
  const locale = useLocale() as 'es' | 'en';

  return (
    <>
      <div>
        <h1 className="font-display text-display-lg font-semibold text-fg">{t('title')}</h1>
        <p className="mt-2 text-fg-muted">{t('subtitle')}</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => (
          <GlassCard key={book.slug} hoverable className="group flex flex-col overflow-hidden">
            <Link href={`/${locale}/libros/${book.slug}`} className="relative aspect-[3/4] overflow-hidden bg-ink-100">
              <Image
                src={book.cover}
                alt={book.title[locale]}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3">
                <Badge variant="muted" className="bg-white/90 text-ink-900">
                  {t(`format.${book.format}`)}
                </Badge>
              </div>
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-lg font-semibold leading-tight text-fg">
                <Link href={`/${locale}/libros/${book.slug}`} className="hover:underline">
                  {book.title[locale]}
                </Link>
              </h3>
              <p className="mt-1 text-xs text-fg-muted">{book.author}</p>
              <p className="mt-3 line-clamp-2 text-sm text-fg-muted">{book.description[locale]}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                {book.priceCents ? (
                  <span className="font-display text-lg font-semibold text-fg">
                    {formatPrice(book.priceCents, 'USD', locale)}
                  </span>
                ) : (
                  <span className="text-sm text-fg-muted">Amazon</span>
                )}
                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/${locale}/libros/${book.slug}`}>Detalles</Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}

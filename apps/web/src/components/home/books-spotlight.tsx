import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button, GlassCard, Badge } from '@migracionplus/ui';
import { ArrowRight, BookOpen } from 'lucide-react';
import { books } from '@/data/seed';
import { formatPrice } from '@/lib/utils';

export function BooksSpotlight() {
  const t = useTranslations('home.booksSpotlight');
  const tCommon = useTranslations('common');
  const tBooks = useTranslations('books');
  const locale = useLocale() as 'es' | 'en';

  const featured = books.slice(0, 3);

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge variant="muted" className="mb-4">
              <BookOpen className="h-3.5 w-3.5" />
              Migración Plus Press
            </Badge>
            <h2 className="font-display text-display-md font-semibold text-fg">{t('title')}</h2>
            <p className="mt-4 text-fg-muted">{t('subtitle')}</p>

            <blockquote className="mt-10 border-l-4 border-accent-400 pl-6">
              <p className="font-display text-2xl italic leading-snug text-fg lg:text-3xl">
                "Tener este manual a mano me dio la confianza para hacer el proceso por mi cuenta."
              </p>
              <footer className="mt-4 text-sm text-fg-muted">
                — Carolina M., lectora del manual de naturalización
              </footer>
            </blockquote>

            <div className="mt-8">
              <Button asChild>
                <Link href={`/${locale}/libros`}>
                  {tCommon('viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {featured.map((book) => (
              <GlassCard key={book.slug} hoverable className="flex gap-4 p-4">
                <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                  <Image
                    src={book.cover}
                    alt={book.title[locale]}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-tight text-fg">{book.title[locale]}</h3>
                    <p className="mt-1 text-xs text-fg-muted">{book.author}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{book.description[locale]}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {book.priceCents ? (
                      <Button size="sm" asChild>
                        <Link href={`/${locale}/libros/${book.slug}`}>
                          {tBooks('buyDigital')} · {formatPrice(book.priceCents, 'USD', locale)}
                        </Link>
                      </Button>
                    ) : null}
                    {book.amazonUrl ? (
                      <Button size="sm" variant="outline" asChild>
                        <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                          {tBooks('buyAmazon')}
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

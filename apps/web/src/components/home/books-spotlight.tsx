import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@migracionplus/ui';
import { BookOpen } from 'lucide-react';
import { books } from '@/data/seed';
import { formatPrice } from '@/lib/utils';

export function BooksSpotlight() {
  const t = useTranslations('home.booksSpotlight');
  const tCommon = useTranslations('common');
  const tBooks = useTranslations('books');
  const locale = useLocale() as 'es' | 'en';

  const featured = books.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-bg-elevated py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] bottom-[-20%] h-[380px] w-[380px] rounded-full bg-brand-100/60 blur-3xl dark:bg-brand-900/40"
      />
      <div className="container relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
              <BookOpen className="h-4 w-4" />
              Migración Plus Press
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-fg sm:text-3xl">{t('title')}</h2>
            <p className="mt-3 text-sm text-fg-muted sm:text-base">{t('subtitle')}</p>

            <blockquote className="mt-8 border-l-4 border-brand-700 pl-5 dark:border-brand-400">
              <p className="font-display text-xl italic leading-snug text-fg lg:text-2xl">
                &ldquo;Tener este manual a mano me dio la confianza para hacer el proceso por mi cuenta.&rdquo;
              </p>
              <footer className="mt-3 text-sm text-fg-muted">
                — Carolina M., {locale === 'es' ? 'lectora del manual de naturalización' : 'naturalization handbook reader'}
              </footer>
            </blockquote>

            <div className="mt-8">
              <Button asChild size="lg">
                <Link href={`/${locale}/libros`}>{tCommon('viewAll')} →</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {featured.map((book) => (
              <article
                key={book.slug}
                className="flex gap-4 rounded-2xl border border-[var(--border)] bg-bg p-4 transition-shadow hover:shadow-card-hover"
              >
                <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800">
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
                    <h3 className="text-base font-bold leading-tight text-fg">{book.title[locale]}</h3>
                    <p className="mt-0.5 text-xs text-fg-muted">{book.author}</p>
                    <p className="mt-1.5 line-clamp-2 text-sm text-fg-muted">{book.description[locale]}</p>
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
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

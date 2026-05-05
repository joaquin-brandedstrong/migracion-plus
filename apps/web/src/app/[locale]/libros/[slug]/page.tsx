import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge, Button, GlassCard } from '@migracionplus/ui';
import { books } from '@/data/seed';
import { formatPrice } from '@/lib/utils';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const book = books.find((b) => b.slug === slug);
  if (!book) return { title: 'Libro no encontrado' };
  const lang = locale as 'es' | 'en';
  return { title: book.title[lang], description: book.description[lang] };
}

export function generateStaticParams() {
  return books.flatMap((b) => [
    { locale: 'es', slug: b.slug },
    { locale: 'en', slug: b.slug },
  ]);
}

export default async function BookDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const book = books.find((b) => b.slug === slug);
  if (!book) notFound();
  const lang = locale as 'es' | 'en';
  const t = await getTranslations({ locale, namespace: 'books' });

  return (
    <div className="container py-16 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[400px,1fr] lg:gap-16">
        <GlassCard className="overflow-hidden">
          <div className="relative aspect-[3/4] bg-ink-100">
            <Image src={book.cover} alt={book.title[lang]} fill sizes="400px" className="object-cover" priority />
          </div>
        </GlassCard>

        <div>
          <Badge variant="muted">{t(`format.${book.format}`)}</Badge>
          <h1 className="mt-3 font-display text-display-lg font-semibold text-fg">{book.title[lang]}</h1>
          <p className="mt-2 text-fg-muted">{lang === 'es' ? 'Por' : 'By'} <strong className="text-fg">{book.author}</strong></p>

          <p className="mt-8 text-lg leading-relaxed text-fg-muted">{book.description[lang]}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {book.priceCents ? (
              <Button size="lg">
                {t('buyDigital')} · {formatPrice(book.priceCents, 'USD', lang)}
              </Button>
            ) : null}
            {book.amazonUrl ? (
              <Button asChild size="lg" variant="outline">
                <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer">
                  {t('buyAmazon')}
                </a>
              </Button>
            ) : null}
            {book.format === 'physical' || book.format === 'both' ? (
              <Button size="lg" variant="ghost">
                {t('buyPhysical')}
              </Button>
            ) : null}
          </div>

          <div className="mt-12">
            <Link href={`/${lang}/libros`} className="text-sm text-fg-muted hover:text-fg">
              ← {lang === 'es' ? 'Volver a la tienda' : 'Back to bookstore'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

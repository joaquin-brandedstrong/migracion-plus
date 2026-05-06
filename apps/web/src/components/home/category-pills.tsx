import Link from 'next/link';
import { useLocale } from 'next-intl';
import { categories } from '@/data/seed';

export function CategoryPills() {
  const locale = useLocale() as 'es' | 'en';

  return (
    <section className="border-b border-[var(--border)] bg-bg-elevated">
      <div className="container py-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-fg-muted">
          {locale === 'es' ? 'Explora por tema' : 'Browse by topic'}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${locale}/cursos?category=${c.slug}`}
              className="inline-flex items-center rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-100 dark:hover:bg-brand-900/60"
            >
              {c.label[locale]}
            </Link>
          ))}
          <Link
            href={`/${locale}/cursos`}
            className="inline-flex items-center rounded-full border border-brand-700 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:border-brand-400 dark:text-brand-300 dark:hover:bg-brand-900/30"
          >
            {locale === 'es' ? 'Ver todo el catálogo →' : 'See full catalog →'}
          </Link>
        </div>
      </div>
    </section>
  );
}

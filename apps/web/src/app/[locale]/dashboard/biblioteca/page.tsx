import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Badge, Button, GlassCard } from '@migracionplus/ui';
import { BookOpen, Download, Plus, ExternalLink } from 'lucide-react';
import { demoBookPurchases } from '@/data/dashboard-seed';
import { adminBookRows } from '@/data/admin-seed';
import { books } from '@/data/seed';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getDashboardViewer, isAdminRole } from '@/lib/dashboard';
import { formatPrice } from '@/lib/utils';

export default async function DashboardBiblioteca({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as 'es' | 'en';

  const viewer = await getDashboardViewer();
  if (isAdminRole(viewer.role)) {
    return <AdminLibrary locale={locale} lang={lang} />;
  }
  return <StudentLibrary locale={locale} lang={lang} />;
}

async function StudentLibrary({ locale, lang }: { locale: string; lang: 'es' | 'en' }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.library' });

  let purchases = demoBookPurchases;
  try {
    const supabase = await getSupabaseServerClient();
    const { data: userResult } = await supabase.auth.getUser();
    if (userResult.user) {
      const { data } = await supabase
        .from('book_purchases')
        .select('*, book:books(*)')
        .eq('user_id', userResult.user.id)
        .order('purchased_at', { ascending: false });
      if (data && data.length > 0) {
        purchases = data as unknown as typeof demoBookPurchases;
      }
    }
  } catch {
    // Keep demo data
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
      </header>

      {purchases.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map((p) => (
            <GlassCard key={p.book.slug} className="overflow-hidden">
              <div className="relative aspect-[3/4] bg-[var(--bg-elevated)]">
                {p.book.cover ? (
                  <Image src={p.book.cover} alt={p.book.title[lang]} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="h-12 w-12 text-fg-muted" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-fg">
                  {p.book.title[lang]}
                </h3>
                <p className="mt-1 text-sm text-fg-muted">
                  {p.book.author ? `By ${p.book.author}` : ''}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-fg-muted">
                    {t('downloaded', { count: p.downloadCount })}
                  </span>
                  <Button size="sm">
                    <Download className="h-4 w-4" />
                    {t('download')}
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-10 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-fg-muted" />
          <p className="mt-4 font-display text-xl font-semibold text-fg">
            {t('emptyTitle')}
          </p>
          <p className="mt-1 text-sm text-fg-muted">{t('emptySubtitle')}</p>
          <Button asChild className="mt-6">
            <Link href={`/${locale}/libros`}>
              <BookOpen className="h-4 w-4" />
              {t('browseBooks')}
            </Link>
          </Button>
        </GlassCard>
      )}
    </div>
  );
}

async function AdminLibrary({ locale, lang }: { locale: string; lang: 'es' | 'en' }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.admin.library' });
  const tBooks = await getTranslations({ locale, namespace: 'books' });

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          {t('newBook')}
        </Button>
      </header>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-elevated)] text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="px-5 py-3">{t('th.title')}</th>
                <th className="px-5 py-3">{t('th.format')}</th>
                <th className="px-5 py-3">{t('th.price')}</th>
                <th className="px-5 py-3">{t('th.amazon')}</th>
                <th className="px-5 py-3 text-right">{t('th.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {adminBookRows.map((b) => {
                const book = books.find((bb) => bb.slug === b.slug);
                return (
                  <tr key={b.slug}>
                    <td className="px-5 py-3 font-medium text-fg">
                      {lang === 'es' ? b.titleEs : b.titleEn}
                    </td>
                    <td className="px-5 py-3 text-fg-muted">
                      <Badge variant="muted">{tBooks(`format.${b.format}`)}</Badge>
                    </td>
                    <td className="px-5 py-3 text-fg-muted">
                      {b.priceCents > 0 ? formatPrice(b.priceCents, 'USD', lang) : '—'}
                    </td>
                    <td className="px-5 py-3">
                      {b.hasAmazon ? (
                        <span className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-300">
                          <ExternalLink className="h-3.5 w-3.5" />
                          {t('linked')}
                        </span>
                      ) : (
                        <span className="text-fg-muted">{t('missing')}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-2">
                        {book ? (
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/${locale}/libros/${book.slug}`}>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        ) : null}
                        <Button variant="outline" size="sm">
                          {t('edit')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Button, GlassCard } from '@migracionplus/ui';
import { BookOpen, Download } from 'lucide-react';
import { demoBookPurchases } from '@/data/dashboard-seed';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardBiblioteca({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'dashboard.library' });
  const lang = locale as 'es' | 'en';

  // Try live purchases, fall back to demo
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
                  <Image
                    src={p.book.cover}
                    alt={p.book.title[lang]}
                    fill
                    className="object-cover"
                  />
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

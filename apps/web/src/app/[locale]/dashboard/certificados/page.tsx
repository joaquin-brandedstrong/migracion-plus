import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button, GlassCard } from '@migracionplus/ui';
import { Award, BookOpen, Download, Share2 } from 'lucide-react';
import { demoCertificates } from '@/data/dashboard-seed';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardCertificados({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'dashboard.certificates' });
  const lang = locale as 'es' | 'en';

  // Try live certificates, fall back to demo
  let certificates = demoCertificates;
  try {
    const supabase = await getSupabaseServerClient();
    const { data: userResult } = await supabase.auth.getUser();
    if (userResult.user) {
      const { data } = await supabase
        .from('certificates')
        .select('*, course:courses(*)')
        .eq('user_id', userResult.user.id)
        .order('issued_at', { ascending: false });
      if (data && data.length > 0) {
        certificates = data as unknown as typeof demoCertificates;
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

      {certificates.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {certificates.map((cert) => (
            <GlassCard key={cert.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-100 to-accent-200 text-accent-800 dark:from-accent-900/40 dark:to-accent-800/40 dark:text-accent-200">
                  <Award className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-fg">
                    {cert.course.title[lang]}
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">
                    {t('issuedOn', {
                      date: new Date(cert.issuedAt).toLocaleDateString(lang),
                    })}
                  </p>
                  <p className="mt-1 text-xs font-mono text-fg-muted">
                    ID: {cert.credentialId}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <Button size="sm">
                  <Download className="h-4 w-4" />
                  {t('download')}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                  {t('share')}
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/dashboard/cursos`}>{t('viewCourse')}</Link>
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-10 text-center">
          <Award className="mx-auto h-10 w-10 text-fg-muted" />
          <p className="mt-4 font-display text-xl font-semibold text-fg">
            {t('emptyTitle')}
          </p>
          <p className="mt-1 text-sm text-fg-muted">{t('emptySubtitle')}</p>
          <Button asChild className="mt-6">
            <Link href={`/${locale}/cursos`}>
              <BookOpen className="h-4 w-4" />
              {t('browseCourses')}
            </Link>
          </Button>
        </GlassCard>
      )}
    </div>
  );
}

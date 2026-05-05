import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button, GlassCard } from '@migracionplus/ui';
import { BookOpen, TrendingUp, CheckCircle2 } from 'lucide-react';
import { demoEnrollments } from '@/data/dashboard-seed';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { ContinueCard } from '@/components/dashboard/continue-card';

export default async function DashboardCursos({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'dashboard.courses' });
  const lang = locale as 'es' | 'en';

  // Try live enrollments, fall back to demo
  let enrollments = demoEnrollments;
  try {
    const supabase = await getSupabaseServerClient();
    const { data: userResult } = await supabase.auth.getUser();
    if (userResult.user) {
      const { data } = await supabase
        .from('enrollments')
        .select('*, course:courses(*)')
        .eq('user_id', userResult.user.id)
        .order('last_activity_at', { ascending: false });
      if (data && data.length > 0) {
        enrollments = data as unknown as typeof demoEnrollments;
      }
    }
  } catch {
    // Keep demo data
  }

  const inProgress = enrollments.filter((e) => e.progressPercent < 100);
  const completed = enrollments.filter((e) => e.progressPercent === 100);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
      </header>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-500" />
            <h2 className="font-display text-xl font-semibold text-fg">
              {t('inProgress')}
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {inProgress.map((e) => (
              <ContinueCard key={e.course.slug} enrollment={e} locale={lang} />
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="font-display text-xl font-semibold text-fg">
              {t('completed')}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {completed.map((e) => (
              <GlassCard key={e.course.slug} className="p-5">
                <h3 className="font-display text-lg font-semibold text-fg">
                  {e.course.title[lang]}
                </h3>
                <p className="mt-1 text-sm text-fg-muted">
                  {t('completedOn', { date: new Date(e.lastActivityAt).toLocaleDateString(lang) })}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href={`/${locale}/dashboard/certificados`}>
                    {t('viewCertificate')}
                  </Link>
                </Button>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {enrollments.length === 0 && (
        <GlassCard className="p-10 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-fg-muted" />
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

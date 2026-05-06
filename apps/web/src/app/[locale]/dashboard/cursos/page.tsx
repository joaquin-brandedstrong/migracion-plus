import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Badge, Button, GlassCard } from '@migracionplus/ui';
import { BookOpen, Plus, TrendingUp, CheckCircle2 } from 'lucide-react';
import { demoEnrollments } from '@/data/dashboard-seed';
import { adminCourseRows } from '@/data/admin-seed';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getDashboardViewer, isAdminRole } from '@/lib/dashboard';
import { ContinueCard } from '@/components/dashboard/continue-card';

export default async function DashboardCursos({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as 'es' | 'en';

  const viewer = await getDashboardViewer();
  if (isAdminRole(viewer.role)) {
    return <AdminCourses locale={locale} lang={lang} />;
  }
  return <StudentCourses locale={locale} lang={lang} />;
}

async function StudentCourses({ locale, lang }: { locale: string; lang: 'es' | 'en' }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.courses' });

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

      {completed.length > 0 && (
        <section>
          <div className="mb-5 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-brand-500" />
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

async function AdminCourses({ locale, lang }: { locale: string; lang: 'es' | 'en' }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.admin.courses' });

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
          {t('newCourse')}
        </Button>
      </header>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-elevated)] text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="px-5 py-3">{t('th.title')}</th>
                <th className="px-5 py-3">{t('th.students')}</th>
                <th className="px-5 py-3">{t('th.rating')}</th>
                <th className="px-5 py-3">{t('th.status')}</th>
                <th className="px-5 py-3">{t('th.updated')}</th>
                <th className="px-5 py-3 text-right">{t('th.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {adminCourseRows.map((c) => (
                <tr key={c.slug}>
                  <td className="px-5 py-3 font-medium text-fg">
                    {lang === 'es' ? c.titleEs : c.titleEn}
                  </td>
                  <td className="px-5 py-3 text-fg-muted">{c.students}</td>
                  <td className="px-5 py-3 text-fg-muted">★ {c.rating.toFixed(1)}</td>
                  <td className="px-5 py-3">
                    <Badge variant={c.status === 'published' ? 'accent' : 'muted'}>
                      {t(`status.${c.status}`)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-fg-muted">
                    {new Date(c.updatedAt).toLocaleDateString(lang)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/${locale}/cursos/${c.slug}`}>{t('preview')}</Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        {t('edit')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

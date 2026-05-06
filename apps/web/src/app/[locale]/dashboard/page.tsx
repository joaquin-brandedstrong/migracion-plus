import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button, GlassCard, Badge } from '@migracionplus/ui';
import {
  Award,
  BookOpen,
  Clock,
  DollarSign,
  Flame,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  computeStats,
  demoActivity,
  demoCertificates,
  demoEnrollments,
} from '@/data/dashboard-seed';
import {
  adminKpis,
  adminLeads,
  adminCourseRows,
  adminRecentEnrollments,
} from '@/data/admin-seed';
import { courses } from '@/data/seed';
import { CourseCard } from '@/components/course-card';
import { ContinueCard } from '@/components/dashboard/continue-card';
import { ActivityRow } from '@/components/dashboard/activity-row';
import { getDashboardViewer, isAdminRole } from '@/lib/dashboard';
import { formatPrice } from '@/lib/utils';

export default async function DashboardHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as 'es' | 'en';

  const viewer = await getDashboardViewer();
  if (isAdminRole(viewer.role)) {
    return <AdminHome locale={locale} lang={lang} />;
  }
  return <StudentHome locale={locale} lang={lang} fullName={viewer.fullName} />;
}

async function StudentHome({
  locale,
  lang,
  fullName,
}: {
  locale: string;
  lang: 'es' | 'en';
  fullName: string;
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.home' });
  const firstName = fullName.split(' ')[0] ?? (lang === 'es' ? 'estudiante' : 'student');

  const stats = computeStats(demoEnrollments, demoCertificates);
  const inProgress = demoEnrollments.filter((e) => e.progressPercent < 100);
  const recommended = courses
    .filter((c) => !demoEnrollments.some((e) => e.course.slug === c.slug))
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
          {t('greeting', { name: firstName })} 👋
        </h1>
        <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
      </header>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Flame}
          label={t('stats.inProgress')}
          value={stats.inProgress.toString()}
          accent="brand"
        />
        <StatCard
          icon={TrendingUp}
          label={t('stats.completed')}
          value={stats.completed.toString()}
          accent="success"
        />
        <StatCard
          icon={Clock}
          label={t('stats.hoursStudied')}
          value={`${stats.hoursStudied} h`}
          accent="info"
        />
        <StatCard
          icon={Award}
          label={t('stats.certificates')}
          value={stats.certificates.toString()}
          accent="accent"
        />
      </section>

      {/* Continue learning */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-fg lg:text-2xl">
              {t('continueLearning')}
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/${locale}/dashboard/cursos`}>{t('viewAll')}</Link>
          </Button>
        </div>
        {inProgress.length === 0 ? (
          <EmptyContinue locale={locale} />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {inProgress.map((e) => (
              <ContinueCard key={e.course.slug} enrollment={e} locale={lang} />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
        {/* Recommended */}
        <section>
          <div className="mb-5">
            <h2 className="font-display text-xl font-semibold text-fg lg:text-2xl">
              {t('recommendedTitle')}
            </h2>
            <p className="mt-1 text-sm text-fg-muted">{t('recommendedSubtitle')}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {recommended.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </section>

        {/* Activity feed */}
        <section>
          <div className="mb-5">
            <h2 className="font-display text-xl font-semibold text-fg lg:text-2xl">
              {t('activityTitle')}
            </h2>
          </div>
          <GlassCard className="p-2">
            <ul className="divide-y divide-[var(--border)]">
              {demoActivity.map((a) => (
                <ActivityRow key={a.id} activity={a} locale={lang} />
              ))}
            </ul>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}

async function AdminHome({ locale, lang }: { locale: string; lang: 'es' | 'en' }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.admin.home' });
  const tStages = await getTranslations({ locale, namespace: 'dashboard.admin.leads.stages' });
  const tCourses = await getTranslations({ locale, namespace: 'dashboard.admin.courses' });

  const topCourses = [...adminCourseRows].sort((a, b) => b.students - a.students).slice(0, 4);
  const openLeads = adminLeads.filter((l) => l.status === 'new' || l.status === 'contacted');

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
          {t('greeting')}
        </h1>
        <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label={t('stats.students')}
          value={adminKpis.activeStudents.toLocaleString(lang)}
          accent="brand"
        />
        <StatCard
          icon={GraduationCap}
          label={t('stats.enrollments')}
          value={adminKpis.enrollmentsLast30d.toLocaleString(lang)}
          accent="info"
        />
        <StatCard
          icon={DollarSign}
          label={t('stats.revenue')}
          value={formatPrice(adminKpis.revenueLast30dCents, 'USD', lang)}
          accent="success"
        />
        <StatCard
          icon={Sparkles}
          label={t('stats.pendingLeads')}
          value={adminKpis.pendingLeads.toString()}
          accent="accent"
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr]">
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-fg lg:text-2xl">
              {t('topCourses')}
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/${locale}/dashboard/cursos`}>{t('viewAll')}</Link>
            </Button>
          </div>
          <GlassCard className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg-elevated)] text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
                <tr>
                  <th className="px-5 py-3">{tCourses('th.title')}</th>
                  <th className="px-5 py-3">{tCourses('th.students')}</th>
                  <th className="px-5 py-3">{tCourses('th.rating')}</th>
                  <th className="px-5 py-3">{tCourses('th.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {topCourses.map((c) => (
                  <tr key={c.slug}>
                    <td className="px-5 py-3 font-medium text-fg">
                      {lang === 'es' ? c.titleEs : c.titleEn}
                    </td>
                    <td className="px-5 py-3 text-fg-muted">{c.students}</td>
                    <td className="px-5 py-3 text-fg-muted">★ {c.rating.toFixed(1)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={c.status === 'published' ? 'accent' : 'muted'}>
                        {tCourses(`status.${c.status}`)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-fg lg:text-2xl">
              {t('openLeads')}
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/${locale}/dashboard/leads`}>{t('viewAll')}</Link>
            </Button>
          </div>
          <GlassCard className="p-2">
            <ul className="divide-y divide-[var(--border)]">
              {openLeads.map((lead) => (
                <li key={lead.id} className="flex items-start gap-3 px-3 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200">
                    <span className="text-xs font-semibold">
                      {lead.name
                        .split(' ')
                        .map((s) => s[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{lead.name}</p>
                    <p className="truncate text-xs text-fg-muted">
                      {lead.topic} · {lead.email}
                    </p>
                  </div>
                  <Badge variant="muted">{tStages(lead.status)}</Badge>
                </li>
              ))}
              {openLeads.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-fg-muted">
                  {lang === 'es' ? 'Sin leads abiertos' : 'No open leads'}
                </li>
              ) : null}
            </ul>
          </GlassCard>
        </section>
      </div>

      <section>
        <h2 className="mb-5 font-display text-xl font-semibold text-fg lg:text-2xl">
          {t('recentEnrollments')}
        </h2>
        <GlassCard className="p-2">
          <ul className="divide-y divide-[var(--border)]">
            {adminRecentEnrollments.map((e) => (
              <li key={`${e.studentName}-${e.enrolledAt}`} className="flex items-start gap-3 px-3 py-3">
                <GraduationCap className="mt-0.5 h-4 w-4 text-brand-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-fg">
                    {e.studentName}{' '}
                    <span className="font-normal text-fg-muted">
                      {lang === 'es' ? '· se inscribió en' : '· enrolled in'}
                    </span>{' '}
                    {lang === 'es' ? e.courseTitleEs : e.courseTitleEn}
                  </p>
                  <p className="mt-0.5 text-[11px] text-fg-muted">
                    {new Date(e.enrolledAt).toLocaleString(lang === 'es' ? 'es-US' : 'en-US')}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: 'brand' | 'success' | 'info' | 'accent';
}

function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  const colors = {
    brand: 'from-brand-100 to-brand-200 text-brand-800 dark:from-brand-900/40 dark:to-brand-800/40 dark:text-brand-200',
    success: 'from-emerald-100 to-emerald-200 text-emerald-800 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:text-emerald-200',
    info: 'from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/40 dark:to-blue-800/40 dark:text-blue-200',
    accent: 'from-accent-100 to-accent-200 text-accent-800 dark:from-accent-900/40 dark:to-accent-800/40 dark:text-accent-200',
  } as const;
  return (
    <GlassCard className="p-5">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-fg-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-fg">{value}</p>
    </GlassCard>
  );
}

function EmptyContinue({ locale }: { locale: string }) {
  return (
    <GlassCard className="p-10 text-center">
      <Sparkles className="mx-auto h-8 w-8 text-accent-500" />
      <p className="mt-4 font-display text-xl font-semibold text-fg">
        {locale === 'es' ? '¡Estás al día!' : 'You are all caught up!'}
      </p>
      <p className="mt-1 text-sm text-fg-muted">
        {locale === 'es'
          ? 'Has completado todos tus cursos en progreso. Explora algo nuevo.'
          : 'You finished all your in-progress courses. Explore something new.'}
      </p>
      <Button asChild className="mt-6">
        <Link href={`/${locale}/cursos`}>
          <BookOpen className="h-4 w-4" />
          {locale === 'es' ? 'Ver catálogo' : 'Browse catalog'}
        </Link>
      </Button>
    </GlassCard>
  );
}

import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button, GlassCard, Badge } from '@migracionplus/ui';
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Clock,
  DollarSign,
  Flame,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  computeStats,
  demoActivity,
  demoCertificates,
  demoEnrollments,
  studentKpiHistory,
} from '@/data/dashboard-seed';
import {
  adminKpiHistory,
  adminKpis,
  adminLeads,
  adminCourseRows,
  adminRecentEnrollments,
} from '@/data/admin-seed';
import { courses } from '@/data/seed';
import { CourseCard } from '@/components/course-card';
import { ContinueCard } from '@/components/dashboard/continue-card';
import { ActivityRow } from '@/components/dashboard/activity-row';
import {
  LibraryShelf,
  NextCertificateCard,
  PlusSuggestionBanner,
  StreakCard,
  StudyChartCard,
  WeeklyGoalCard,
} from '@/components/dashboard/widgets/student-widgets';
import {
  CategoryDistribution,
  ConversionFunnel,
  QuickActions,
  RecentReviews,
  RevenueSparkline,
  SystemHealth,
} from '@/components/dashboard/widgets/admin-widgets';
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
      <section
        data-tour="student-stats"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        <StatCard
          icon={Flame}
          label={t('stats.inProgress')}
          value={stats.inProgress.toString()}
          accent="brand"
          history={studentKpiHistory.inProgress}
        />
        <StatCard
          icon={TrendingUp}
          label={t('stats.completed')}
          value={stats.completed.toString()}
          accent="success"
          history={studentKpiHistory.completed}
        />
        <StatCard
          icon={Clock}
          label={t('stats.hoursStudied')}
          value={`${stats.hoursStudied} h`}
          accent="info"
          history={studentKpiHistory.hoursStudied}
        />
        <StatCard
          icon={Award}
          label={t('stats.certificates')}
          value={stats.certificates.toString()}
          accent="accent"
          history={studentKpiHistory.certificates}
        />
        <StatCard
          icon={PlayCircle}
          label={t('stats.lessonsCompleted')}
          value={stats.lessonsCompleted.toString()}
          accent="brand"
          history={studentKpiHistory.lessonsCompleted}
        />
      </section>

      {/* Engagement widgets */}
      <section data-tour="student-streak" className="grid gap-4 lg:grid-cols-3">
        <StreakCard locale={lang} />
        <WeeklyGoalCard locale={lang} />
        <StudyChartCard locale={lang} />
      </section>

      {/* Plus suggestion banner */}
      <div data-tour="student-plus">
        <PlusSuggestionBanner locale={lang} />
      </div>

      {/* Continue learning + Next certificate */}
      <section data-tour="student-continue">
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
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_320px]">
            {inProgress.slice(0, 2).map((e) => (
              <ContinueCard key={e.course.slug} enrollment={e} locale={lang} />
            ))}
            <NextCertificateCard locale={lang} enrollments={demoEnrollments} />
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

        {/* Right rail: activity feed + library shelf */}
        <div className="space-y-6">
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

          <LibraryShelf locale={lang} />
        </div>
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

      <section
        data-tour="admin-stats"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        <StatCard
          icon={Users}
          label={t('stats.students')}
          value={adminKpis.activeStudents.toLocaleString(lang)}
          accent="brand"
          history={adminKpiHistory.activeStudents}
        />
        <StatCard
          icon={GraduationCap}
          label={t('stats.enrollments')}
          value={adminKpis.enrollmentsLast30d.toLocaleString(lang)}
          accent="info"
          history={adminKpiHistory.enrollmentsLast30d}
        />
        <StatCard
          icon={DollarSign}
          label={t('stats.revenue')}
          value={formatPrice(adminKpis.revenueLast30dCents, 'USD', lang)}
          accent="success"
          history={adminKpiHistory.revenueLast30dCents}
        />
        <StatCard
          icon={Sparkles}
          label={t('stats.pendingLeads')}
          value={adminKpis.pendingLeads.toString()}
          accent="accent"
          history={adminKpiHistory.pendingLeads}
          invertSign
        />
        <StatCard
          icon={Star}
          label={t('stats.avgRating')}
          value={adminKpis.avgRating.toFixed(2)}
          accent="brand"
          history={adminKpiHistory.avgRating}
        />
      </section>

      {/* Insight widgets */}
      <section data-tour="admin-insights" className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
        <RevenueSparkline locale={lang} />
        <ConversionFunnel locale={lang} />
        <CategoryDistribution locale={lang} />
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.4fr,1fr]">
        <section data-tour="admin-courses">
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

      {/* Recent enrollments + recent reviews side-by-side */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
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

        <RecentReviews locale={lang} />
      </div>

      {/* Ops row: quick actions + system health */}
      <section data-tour="admin-ops" className="grid gap-4 lg:grid-cols-2">
        <QuickActions locale={lang} />
        <SystemHealth locale={lang} />
      </section>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: 'brand' | 'success' | 'info' | 'accent';
  /** Six-month history (oldest → newest, last value is the current period). */
  history: readonly number[];
  /** When true, an *increase* in the metric is bad (e.g., pending leads).
   * Flips the color of the delta chip and sparkline accordingly. */
  invertSign?: boolean;
}

function StatCard({ icon: Icon, label, value, accent, history, invertSign }: StatCardProps) {
  const colors = {
    brand: 'from-brand-100 to-brand-200 text-brand-800 dark:from-brand-900/40 dark:to-brand-800/40 dark:text-brand-200',
    success: 'from-brand-200 to-brand-300 text-brand-900 dark:from-brand-800/50 dark:to-brand-700/50 dark:text-brand-100',
    info: 'from-brand-50 to-brand-100 text-brand-700 dark:from-brand-900/30 dark:to-brand-800/30 dark:text-brand-300',
    accent: 'from-brand-300 to-brand-400 text-brand-950 dark:from-brand-700/60 dark:to-brand-600/60 dark:text-brand-50',
  } as const;

  // Delta from the last two periods.
  const last = history[history.length - 1] ?? 0;
  const prev = history[history.length - 2] ?? last;
  const rawDelta = prev === 0 ? (last === 0 ? 0 : 100) : ((last - prev) / prev) * 100;
  const deltaPct = Math.round(rawDelta);
  const isUp = deltaPct > 0;
  const isDown = deltaPct < 0;
  // For "lower is better" metrics the trend color flips.
  const isGood = invertSign ? isDown : isUp;
  const isBad = invertSign ? isUp : isDown;

  // Sparkline path across a 100×24 viewBox.
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = Math.max(0.0001, max - min);
  const pts = history.map((v, i) => ({
    x: (i / Math.max(1, history.length - 1)) * 100,
    y: 24 - ((v - min) / range) * 20 - 2,
  }));
  // Smooth path via Catmull-Rom → cubic bezier conversion (rounded curves).
  const linePath = smoothPath(pts);
  const lastPt = pts[pts.length - 1]!;
  const areaPath = `${linePath} L${lastPt.x.toFixed(2)},24 L0,24 Z`;
  const sparkColor = isBad
    ? 'text-red-600 dark:text-red-400'
    : 'text-brand-700 dark:text-brand-300';
  // Stable per-card defs ids — label is already unique within the page.
  const slug = label.replace(/\W+/g, '-').toLowerCase();
  const bloomId = `bloom-${slug}`;
  const fadeId = `fade-${slug}`;
  const maskId = `mask-${slug}`;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-bg-elevated p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover dark:hover:border-brand-700">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand-700 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-brand-400"
      />

      {/* Background sparkline — smooth curves, low base opacity, masked by a
          vertical gradient so the line fades upward behind the foreground
          content. In dark mode a blurred copy adds a bloom glow. */}
      <svg
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full ${sparkColor}`}
        aria-hidden
      >
        <defs>
          <filter id={bloomId} x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
          {/* Vertical fade — transparent at top → opaque at bottom, so the
              sparkline gracefully dissolves behind the value text. */}
          <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="55%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="24">
            <rect width="100" height="24" fill={`url(#${fadeId})`} />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          {/* Filled area — gentle wash beneath the curve. */}
          <path d={areaPath} fill="currentColor" fillOpacity="0.06" />
          {/* Bloom layer — invisible in light mode, glows softly in dark. */}
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            filter={`url(#${bloomId})`}
            className="opacity-0 dark:opacity-70"
          />
          {/* Crisp foreground curve — kept very low opacity so it reads as
              ambient texture rather than a chart. */}
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="opacity-15 dark:opacity-60"
          />
        </g>
      </svg>

      {/* Foreground content sits above the background sparkline. */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">{label}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <p className="font-display text-3xl font-semibold text-fg">{value}</p>
            {deltaPct !== 0 ? (
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none ${
                  isGood
                    ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'
                    : isBad
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                      : 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300'
                }`}
              >
                {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(deltaPct)}%
              </span>
            ) : null}
          </div>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colors[accent]} transition-transform duration-200 group-hover:scale-110`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/**
 * Catmull-Rom → cubic Bezier conversion. Produces a smooth SVG path string
 * passing through every input point. Used by the KPI sparkline so the line
 * curves between months instead of zig-zagging at each data point.
 */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M${pts[0]!.x.toFixed(2)},${pts[0]!.y.toFixed(2)}`;
  let d = `M${pts[0]!.x.toFixed(2)},${pts[0]!.y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return d;
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

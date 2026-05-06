import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Flame, Sparkles, Target, TrendingUp } from 'lucide-react';
import {
  demoBookPurchases,
  demoPlusSuggestions,
  demoStreak,
  demoWeeklyGoal,
  demoWeeklyMinutes,
  type DemoEnrollment,
} from '@/data/dashboard-seed';

interface BaseProps {
  locale: 'es' | 'en';
}

function WidgetShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-bg-elevated p-5 shadow-card transition-all duration-200 hover:border-brand-300 hover:shadow-card-hover dark:hover:border-brand-700 ${className}`}
    >
      {children}
    </div>
  );
}

function WidgetHeader({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-fg-muted">
      <Icon className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300" />
      {title}
    </div>
  );
}

/* ─── Streak ─────────────────────────────────────────────────────────── */

export function StreakCard({ locale }: BaseProps) {
  const dayLabels = locale === 'es' ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <WidgetShell>
      <WidgetHeader icon={Flame} title={locale === 'es' ? 'Racha de estudio' : 'Study streak'} />
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold text-fg">{demoStreak.currentDays}</span>
        <span className="text-sm text-fg-muted">{locale === 'es' ? 'días seguidos' : 'days in a row'}</span>
      </div>
      <p className="mt-1 text-xs text-fg-muted">
        {locale === 'es' ? `Tu mejor racha: ${demoStreak.bestDays} días` : `Best streak: ${demoStreak.bestDays} days`}
      </p>
      <div className="mt-4 flex items-end justify-between gap-1.5">
        {demoStreak.last7.map((studied, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              aria-hidden
              className={
                studied
                  ? 'h-7 w-full rounded-md bg-brand-700 dark:bg-brand-400'
                  : 'h-7 w-full rounded-md bg-ink-100 dark:bg-ink-800'
              }
            />
            <span className="text-[10px] font-bold text-fg-muted">{dayLabels[i]}</span>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}

/* ─── Weekly goal ring ───────────────────────────────────────────────── */

export function WeeklyGoalCard({ locale }: BaseProps) {
  const pct = Math.min(100, Math.round((demoWeeklyGoal.currentMinutes / demoWeeklyGoal.targetMinutes) * 100));
  const r = 38;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <WidgetShell>
      <WidgetHeader icon={Target} title={locale === 'es' ? 'Meta semanal' : 'Weekly goal'} />
      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="9" />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="9"
              strokeDasharray={`${dash} ${c - dash}`}
              className="text-brand-700 transition-[stroke-dasharray] duration-700 dark:text-brand-400"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-fg">
            {pct}%
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-2xl font-bold text-fg">
            {Math.floor(demoWeeklyGoal.currentMinutes / 60)}h {demoWeeklyGoal.currentMinutes % 60}m
          </p>
          <p className="mt-0.5 text-xs text-fg-muted">
            {locale === 'es' ? 'de' : 'of'} {Math.floor(demoWeeklyGoal.targetMinutes / 60)}h{' '}
            {locale === 'es' ? 'esta semana' : 'this week'}
          </p>
          <p className="mt-3 text-xs text-fg-muted">
            {pct >= 100
              ? locale === 'es'
                ? '¡Meta alcanzada! 🎉'
                : 'Goal reached! 🎉'
              : locale === 'es'
                ? `${Math.ceil((demoWeeklyGoal.targetMinutes - demoWeeklyGoal.currentMinutes) / 60)}h para completar`
                : `${Math.ceil((demoWeeklyGoal.targetMinutes - demoWeeklyGoal.currentMinutes) / 60)}h to go`}
          </p>
        </div>
      </div>
    </WidgetShell>
  );
}

/* ─── Weekly study chart ─────────────────────────────────────────────── */

export function StudyChartCard({ locale }: BaseProps) {
  const max = Math.max(...demoWeeklyMinutes, 60);
  const dayLabels = locale === 'es' ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const total = demoWeeklyMinutes.reduce((a, b) => a + b, 0);

  return (
    <WidgetShell>
      <WidgetHeader icon={TrendingUp} title={locale === 'es' ? 'Esta semana' : 'This week'} />
      <p className="font-display text-2xl font-bold text-fg">
        {Math.floor(total / 60)}h {total % 60}m
      </p>
      <p className="text-xs text-fg-muted">
        {locale === 'es' ? 'Total estudiado · últimos 7 días' : 'Total studied · last 7 days'}
      </p>
      <div className="mt-4 flex h-20 items-end justify-between gap-1.5">
        {demoWeeklyMinutes.map((mins, i) => {
          const h = Math.max(6, (mins / max) * 100);
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                style={{ height: `${h}%` }}
                className={
                  mins === 0
                    ? 'w-full rounded-md bg-ink-100 dark:bg-ink-800'
                    : 'w-full rounded-md bg-gradient-to-t from-brand-700 to-brand-400 dark:from-brand-500 dark:to-brand-300'
                }
                title={`${mins} min`}
              />
              <span className="text-[10px] font-bold text-fg-muted">{dayLabels[i]}</span>
            </div>
          );
        })}
      </div>
    </WidgetShell>
  );
}

/* ─── Next certificate ───────────────────────────────────────────────── */

export function NextCertificateCard({
  locale,
  enrollments,
}: BaseProps & { enrollments: DemoEnrollment[] }) {
  // Pick the in-progress enrollment closest to 100%.
  const next = enrollments
    .filter((e) => e.progressPercent < 100)
    .sort((a, b) => b.progressPercent - a.progressPercent)[0];

  if (!next) {
    return (
      <WidgetShell>
        <WidgetHeader icon={Sparkles} title={locale === 'es' ? 'Próximo certificado' : 'Next certificate'} />
        <p className="mt-2 text-sm text-fg-muted">
          {locale === 'es'
            ? 'Inscríbete a un curso para ver tu próximo certificado aquí.'
            : 'Enroll in a course to see your next certificate here.'}
        </p>
      </WidgetShell>
    );
  }

  const remainingLessons = next.totalLessons - next.completedLessons;

  return (
    <WidgetShell>
      <WidgetHeader icon={Sparkles} title={locale === 'es' ? 'Próximo certificado' : 'Next certificate'} />
      <h3 className="line-clamp-2 font-display text-lg font-bold leading-tight text-fg">
        {next.course.title[locale]}
      </h3>
      <p className="mt-1 text-xs text-fg-muted">
        {locale === 'es'
          ? `Te faltan ${remainingLessons} lecciones`
          : `${remainingLessons} lessons to go`}
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
        <div
          style={{ width: `${next.progressPercent}%` }}
          className="h-full rounded-full bg-brand-700 transition-[width] duration-500 dark:bg-brand-400"
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] text-fg-muted">
        <span className="font-bold">{next.progressPercent}%</span>
        <Link
          href={`/${locale}/dashboard/cursos`}
          className="font-bold text-brand-700 hover:underline dark:text-brand-300"
        >
          {locale === 'es' ? 'Continuar →' : 'Continue →'}
        </Link>
      </div>
    </WidgetShell>
  );
}

/* ─── Library shelf ──────────────────────────────────────────────────── */

export function LibraryShelf({ locale }: BaseProps) {
  if (demoBookPurchases.length === 0) return null;

  return (
    <WidgetShell>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-fg-muted">
          <BookOpen className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300" />
          {locale === 'es' ? 'Mi biblioteca' : 'My library'}
        </div>
        <Link
          href={`/${locale}/dashboard/biblioteca`}
          className="text-xs font-bold text-brand-700 hover:underline dark:text-brand-300"
        >
          {locale === 'es' ? 'Ver todo' : 'View all'}
        </Link>
      </div>
      <ul className="space-y-3">
        {demoBookPurchases.map((p) => (
          <li key={p.book.slug} className="flex items-center gap-3">
            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-ink-100 dark:bg-ink-800">
              <Image src={p.book.cover} alt="" fill sizes="40px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-bold text-fg">{p.book.title[locale]}</p>
              <p className="text-xs text-fg-muted">
                {p.downloadCount} {locale === 'es' ? 'descargas' : 'downloads'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </WidgetShell>
  );
}

/* ─── Plus suggestion banner ─────────────────────────────────────────── */

export function PlusSuggestionBanner({ locale }: BaseProps) {
  // Pick a deterministic suggestion based on day-of-year so it changes daily
  // but stays consistent within a render.
  const day = Math.floor(Date.now() / 86_400_000);
  const idx = day % demoPlusSuggestions.length;
  const prompt = demoPlusSuggestions[idx]!;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-brand-800 p-6 text-white shadow-card transition-shadow hover:shadow-card-hover dark:bg-brand-900">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots-teal opacity-25" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-300/20 blur-3xl"
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-200">
            <Sparkles className="h-3.5 w-3.5" />
            {locale === 'es' ? 'Sugerencia de Plus' : 'Plus suggestion'}
          </div>
          <p className="mt-2 font-display text-lg font-bold leading-snug">
            &ldquo;{locale === 'es' ? prompt.promptEs : prompt.promptEn}&rdquo;
          </p>
        </div>
        <Link
          href={`/${locale}/dashboard/asistente`}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand-900 transition hover:bg-brand-50"
        >
          {locale === 'es' ? 'Preguntar a Plus' : 'Ask Plus'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

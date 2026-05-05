import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button, GlassCard } from '@migracionplus/ui';
import {
  Award,
  BookOpen,
  Clock,
  Flame,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  computeStats,
  demoActivity,
  demoCertificates,
  demoEnrollments,
} from '@/data/dashboard-seed';
import { courses } from '@/data/seed';
import { CourseCard } from '@/components/course-card';
import { ContinueCard } from '@/components/dashboard/continue-card';
import { ActivityRow } from '@/components/dashboard/activity-row';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'dashboard.home' });
  const lang = locale as 'es' | 'en';

  // Profile name for greeting (best-effort)
  let firstName = lang === 'es' ? 'estudiante' : 'student';
  try {
    const supabase = await getSupabaseServerClient();
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      const { data: row } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', u.user.id)
        .maybeSingle();
      if (row?.full_name) firstName = row.full_name.split(' ')[0] ?? firstName;
    }
  } catch {
    firstName = 'Demo';
  }

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

import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge, GlassCard } from '@migracionplus/ui';
import { BarChart3, LineChart, PieChart, TrendingUp } from 'lucide-react';
import { getDashboardViewer, isAdminRole } from '@/lib/dashboard';
import { ExportCsvButton } from '@/components/dashboard/download-actions';

export default async function AdminReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as 'es' | 'en';

  const viewer = await getDashboardViewer();
  if (!isAdminRole(viewer.role)) redirect(`/${locale}/dashboard`);

  const t = await getTranslations({ locale, namespace: 'dashboard.admin.reports' });

  const reportRows: (string | number)[][] = [
    lang === 'es'
      ? ['Mes', 'Inscripciones', 'Ingresos (USD)', 'Certificados', 'Finalización']
      : ['Month', 'Enrollments', 'Revenue (USD)', 'Certificates', 'Completion'],
    ['2026-01', 128, 5320, 41, '38%'],
    ['2026-02', 156, 6480, 53, '41%'],
    ['2026-03', 203, 8210, 77, '44%'],
    ['2026-04', 241, 9870, 96, '47%'],
  ];

  const cards: {
    key: 'engagement' | 'completion' | 'revenue' | 'funnel';
    icon: typeof BarChart3;
  }[] = [
    { key: 'engagement', icon: TrendingUp },
    { key: 'completion', icon: BarChart3 },
    { key: 'revenue', icon: LineChart },
    { key: 'funnel', icon: PieChart },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
        </div>
        <ExportCsvButton
          rows={reportRows}
          fileName="reporte-migracion-plus.csv"
          label={t('exportCsv')}
        />
      </header>

      <GlassCard className="border-brand-300/60 bg-brand-50/60 p-4 dark:border-brand-500/30 dark:bg-brand-900/20">
        <p className="text-sm text-brand-900 dark:text-brand-200">{t('comingSoon')}</p>
      </GlassCard>

      <section className="grid gap-5 sm:grid-cols-2">
        {cards.map(({ key, icon: Icon }) => (
          <GlassCard key={key} className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-fg">
                {t(`cards.${key}`)}
              </h2>
              <Icon className="h-5 w-5 text-fg-muted" />
            </div>
            <div className="mt-6 flex h-40 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)]">
              <Badge variant="muted">{lang === 'es' ? 'Sin datos' : 'No data'}</Badge>
            </div>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}

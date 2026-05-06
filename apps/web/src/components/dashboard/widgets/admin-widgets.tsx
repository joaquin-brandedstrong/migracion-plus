import Link from 'next/link';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  Megaphone,
  PieChart,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import {
  adminCategoryDistribution,
  adminDailyRevenueCents,
  adminFunnel,
  adminRecentReviews,
  adminSystemStatus,
  type SystemStatus,
} from '@/data/admin-seed';
import { formatPrice } from '@/lib/utils';

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

function WidgetHeader({
  icon: Icon,
  title,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-fg-muted">
        <Icon className="h-3.5 w-3.5 text-brand-700 dark:text-brand-300" />
        {title}
      </div>
      {action}
    </div>
  );
}

/* ─── Revenue sparkline ──────────────────────────────────────────────── */

export function RevenueSparkline({ locale }: BaseProps) {
  const days = adminDailyRevenueCents.length;
  const total = adminDailyRevenueCents.reduce((a, b) => a + b, 0);
  const first7Avg = adminDailyRevenueCents.slice(0, 7).reduce((a, b) => a + b, 0) / 7;
  const last7Avg = adminDailyRevenueCents.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const deltaPct = Math.round(((last7Avg - first7Avg) / first7Avg) * 100);
  const max = Math.max(...adminDailyRevenueCents);
  const min = Math.min(...adminDailyRevenueCents);
  const range = Math.max(1, max - min);

  // Build SVG polyline points across 100 wide × 30 tall.
  const points = adminDailyRevenueCents
    .map((v, i) => {
      const x = (i / (days - 1)) * 100;
      const y = 30 - ((v - min) / range) * 30;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  const areaPath = `M0,30 L${points
    .split(' ')
    .join(' L')} L100,30 Z`;

  return (
    <WidgetShell>
      <WidgetHeader
        icon={TrendingUp}
        title={locale === 'es' ? 'Ingresos · 30 días' : 'Revenue · 30 days'}
      />
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-3xl font-bold text-fg">
          {formatPrice(total, 'USD', locale)}
        </p>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
            deltaPct >= 0
              ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
          }`}
        >
          {deltaPct >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(deltaPct)}%
        </span>
      </div>
      <p className="mt-0.5 text-xs text-fg-muted">
        {locale === 'es' ? 'vs. semana anterior' : 'vs. previous week'}
      </p>

      <svg
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        className="mt-4 h-20 w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#spark-fill)" className="text-brand-500" />
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-700 dark:text-brand-300"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </WidgetShell>
  );
}

/* ─── Conversion funnel ──────────────────────────────────────────────── */

export function ConversionFunnel({ locale }: BaseProps) {
  const top = adminFunnel[0]!.value;
  return (
    <WidgetShell>
      <WidgetHeader icon={Filter} title={locale === 'es' ? 'Embudo · 30 días' : 'Funnel · 30 days'} />
      <ul className="space-y-3">
        {adminFunnel.map((stage, i) => {
          const pct = (stage.value / top) * 100;
          const conv = i === 0 ? null : Math.round((stage.value / adminFunnel[i - 1]!.value) * 100);
          return (
            <li key={stage.keyEn}>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className="font-bold text-fg">
                  {locale === 'es' ? stage.keyEs : stage.keyEn}
                </span>
                <span className="text-fg-muted">
                  <span className="font-bold text-fg">{stage.value.toLocaleString(locale)}</span>
                  {conv !== null && <span className="ml-2 text-xs">· {conv}%</span>}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                <div
                  style={{ width: `${pct}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-400 transition-[width] duration-500 dark:from-brand-500 dark:to-brand-300"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </WidgetShell>
  );
}

/* ─── Category distribution ──────────────────────────────────────────── */

export function CategoryDistribution({ locale }: BaseProps) {
  return (
    <WidgetShell>
      <WidgetHeader
        icon={PieChart}
        title={locale === 'es' ? 'Inscripciones por categoría' : 'Enrollments by category'}
      />
      <ul className="space-y-3">
        {adminCategoryDistribution.map((c, i) => {
          const pct = Math.round(c.share * 100);
          // Tonal teal hierarchy — first category is darkest.
          const fill = ['bg-brand-700', 'bg-brand-500', 'bg-brand-300'][i] ?? 'bg-brand-200';
          const fillDark = ['dark:bg-brand-400', 'dark:bg-brand-500', 'dark:bg-brand-600'][i] ?? 'dark:bg-brand-700';
          return (
            <li key={c.slug}>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className="font-bold text-fg">{locale === 'es' ? c.labelEs : c.labelEn}</span>
                <span className="text-xs font-bold text-fg-muted">{pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                <div
                  style={{ width: `${pct}%` }}
                  className={`h-full rounded-full ${fill} ${fillDark} transition-[width] duration-500`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </WidgetShell>
  );
}

/* ─── Quick actions ──────────────────────────────────────────────────── */

export function QuickActions({ locale }: BaseProps) {
  const items = [
    {
      icon: Plus,
      labelEs: 'Nuevo curso',
      labelEn: 'New course',
      href: '/dashboard/cursos',
    },
    {
      icon: Megaphone,
      labelEs: 'Anuncio',
      labelEn: 'Announcement',
      href: '/dashboard/contenido',
    },
    {
      icon: Sparkles,
      labelEs: 'Generar contenido',
      labelEn: 'Generate content',
      href: '/dashboard/contenido',
    },
    {
      icon: Settings2,
      labelEs: 'Configuración',
      labelEn: 'Settings',
      href: '/dashboard/configuracion',
    },
  ];
  return (
    <WidgetShell>
      <WidgetHeader icon={Activity} title={locale === 'es' ? 'Acciones rápidas' : 'Quick actions'} />
      <div className="grid grid-cols-2 gap-2">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.labelEn}
              href={`/${locale}${it.href}`}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-bg px-3 py-3 text-sm font-bold text-fg transition-colors hover:border-brand-300 hover:bg-brand-50 dark:hover:border-brand-700 dark:hover:bg-brand-900/30"
            >
              <Icon className="h-4 w-4 text-brand-700 dark:text-brand-300" />
              {locale === 'es' ? it.labelEs : it.labelEn}
            </Link>
          );
        })}
      </div>
    </WidgetShell>
  );
}

/* ─── System health ──────────────────────────────────────────────────── */

const STATUS_DOT: Record<SystemStatus, string> = {
  ok: 'bg-brand-500',
  warn: 'bg-amber-500',
  down: 'bg-red-500',
};

export function SystemHealth({ locale }: BaseProps) {
  return (
    <WidgetShell>
      <WidgetHeader icon={ShieldCheck} title={locale === 'es' ? 'Estado del sistema' : 'System status'} />
      <ul className="divide-y divide-[var(--border)]">
        {adminSystemStatus.map((s) => (
          <li key={s.keyEn} className="flex items-center justify-between py-2.5 text-sm">
            <span className="flex items-center gap-2 text-fg">
              <span aria-hidden className={`h-2 w-2 rounded-full ${STATUS_DOT[s.status]}`} />
              {locale === 'es' ? s.keyEs : s.keyEn}
            </span>
            <span className="text-xs text-fg-muted">
              {locale === 'es' ? s.latencyEs : s.latencyEn}
            </span>
          </li>
        ))}
      </ul>
    </WidgetShell>
  );
}

/* ─── Recent reviews ─────────────────────────────────────────────────── */

export function RecentReviews({ locale }: BaseProps) {
  return (
    <WidgetShell>
      <WidgetHeader icon={Star} title={locale === 'es' ? 'Reseñas recientes' : 'Recent reviews'} />
      <ul className="space-y-4">
        {adminRecentReviews.map((r) => (
          <li key={`${r.student}-${r.at}`} className="border-b border-[var(--border)] pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-fg">{r.student}</p>
              <div className="flex items-center gap-0.5" aria-label={`${r.rating} / 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < r.rating
                        ? 'h-3 w-3 fill-brand-700 text-brand-700 dark:fill-brand-300 dark:text-brand-300'
                        : 'h-3 w-3 stroke-ink-300 text-transparent'
                    }
                  />
                ))}
              </div>
            </div>
            <p className="mt-0.5 text-xs text-fg-muted">{locale === 'es' ? r.courseEs : r.courseEn}</p>
            <p className="mt-1.5 text-sm text-fg">
              &ldquo;{locale === 'es' ? r.excerptEs : r.excerptEn}&rdquo;
            </p>
          </li>
        ))}
      </ul>
    </WidgetShell>
  );
}

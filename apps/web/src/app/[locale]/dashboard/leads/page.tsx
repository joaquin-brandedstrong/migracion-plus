import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge, Button, GlassCard } from '@migracionplus/ui';
import { Plus, Sparkles } from 'lucide-react';
import { adminLeads, type AdminLead } from '@/data/admin-seed';
import { getDashboardViewer, isAdminRole } from '@/lib/dashboard';
import type { LeadStatus } from '@migracionplus/db/types';

const STAGES: LeadStatus[] = ['new', 'contacted', 'qualified', 'enrolled', 'lost'];

export default async function AdminLeadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as 'es' | 'en';

  const viewer = await getDashboardViewer();
  if (!isAdminRole(viewer.role)) redirect(`/${locale}/dashboard`);

  const t = await getTranslations({ locale, namespace: 'dashboard.admin.leads' });

  const grouped: Record<LeadStatus, AdminLead[]> = {
    new: [],
    contacted: [],
    qualified: [],
    enrolled: [],
    lost: [],
  };
  for (const lead of adminLeads) grouped[lead.status].push(lead);

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
          {t('newLead')}
        </Button>
      </header>

      <GlassCard className="border-emerald-300/50 bg-emerald-50/50 p-4 dark:border-emerald-500/30 dark:bg-emerald-900/10">
        <p className="flex items-center gap-2 text-sm text-emerald-900 dark:text-emerald-200">
          <Sparkles className="h-4 w-4" />
          {t('automated')}
        </p>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {STAGES.map((stage) => (
          <section key={stage} className="flex min-h-[200px] flex-col">
            <header className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-fg-muted">
                {t(`stages.${stage}`)}
              </h2>
              <Badge variant="muted">{grouped[stage].length}</Badge>
            </header>
            <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-[var(--bg-elevated)] p-2">
              {grouped[stage].map((lead) => (
                <article
                  key={lead.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3"
                >
                  <p className="text-sm font-medium text-fg">{lead.name}</p>
                  <p className="mt-0.5 truncate text-xs text-fg-muted">{lead.email}</p>
                  <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-fg-muted">
                    <Badge variant="muted">{lead.topic}</Badge>
                    <span>
                      {new Date(lead.createdAt).toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US')}
                    </span>
                  </div>
                </article>
              ))}
              {grouped[stage].length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-fg-muted">—</p>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

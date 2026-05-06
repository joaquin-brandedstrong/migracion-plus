import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge, Button, GlassCard } from '@migracionplus/ui';
import { Mail, MessageSquare, Search } from 'lucide-react';
import { adminStudents } from '@/data/admin-seed';
import { getDashboardViewer, isAdminRole } from '@/lib/dashboard';

export default async function AdminStudentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as 'es' | 'en';

  const viewer = await getDashboardViewer();
  if (!isAdminRole(viewer.role)) redirect(`/${locale}/dashboard`);

  const t = await getTranslations({ locale, namespace: 'dashboard.admin.students' });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
        <input
          type="search"
          placeholder={t('search')}
          className="h-10 w-full rounded-full border border-[var(--border)] bg-[var(--bg)] pl-10 pr-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        />
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-elevated)] text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="px-5 py-3">{t('th.name')}</th>
                <th className="px-5 py-3">{t('th.email')}</th>
                <th className="px-5 py-3">{t('th.enrollments')}</th>
                <th className="px-5 py-3">{t('th.lastActive')}</th>
                <th className="px-5 py-3">{t('th.plan')}</th>
                <th className="px-5 py-3 text-right">{t('th.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {adminStudents.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-3 font-medium text-fg">{s.fullName}</td>
                  <td className="px-5 py-3 text-fg-muted">{s.email}</td>
                  <td className="px-5 py-3 text-fg-muted">{s.enrollments}</td>
                  <td className="px-5 py-3 text-fg-muted">
                    {new Date(s.lastActiveAt).toLocaleString(lang === 'es' ? 'es-US' : 'en-US')}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={s.plan === 'free' ? 'muted' : 'accent'}>{s.plan}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        {t('view')}
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

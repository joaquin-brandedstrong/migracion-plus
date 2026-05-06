import { redirect } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge, Button, GlassCard } from '@migracionplus/ui';
import { FileText, Languages, ListChecks, Sparkles, Wand2 } from 'lucide-react';
import { getDashboardViewer, isAdminRole } from '@/lib/dashboard';

export default async function AdminContentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as 'es' | 'en';

  const viewer = await getDashboardViewer();
  if (!isAdminRole(viewer.role)) redirect(`/${locale}/dashboard`);

  const t = await getTranslations({ locale, namespace: 'dashboard.admin.content' });

  const tools: {
    key: 'scripts' | 'quizzes' | 'summaries' | 'translation';
    icon: typeof Wand2;
  }[] = [
    { key: 'scripts', icon: Wand2 },
    { key: 'quizzes', icon: ListChecks },
    { key: 'summaries', icon: FileText },
    { key: 'translation', icon: Languages },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
      </header>

      <GlassCard className="border-amber-300/50 bg-amber-50/50 p-4 dark:border-amber-500/30 dark:bg-amber-900/10">
        <p className="flex items-center gap-2 text-sm text-amber-900 dark:text-amber-200">
          <Sparkles className="h-4 w-4" />
          {t('comingSoon')}
        </p>
      </GlassCard>

      <section className="grid gap-5 sm:grid-cols-2">
        {tools.map(({ key, icon: Icon }) => (
          <GlassCard key={key} className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800 dark:from-brand-900/40 dark:to-brand-800/40 dark:text-brand-200">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-fg">
              {t(`tools.${key}.title`)}
            </h2>
            <p className="mt-1 text-sm text-fg-muted">{t(`tools.${key}.body`)}</p>
            <div className="mt-5 flex items-center gap-2">
              <Button disabled size="sm">
                {t(`tools.${key}.cta`)}
              </Button>
              <Badge variant="muted">{lang === 'es' ? 'Próximamente' : 'Coming soon'}</Badge>
            </div>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}

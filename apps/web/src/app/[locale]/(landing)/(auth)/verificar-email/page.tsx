import { GlassCard } from '@migracionplus/ui';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { CheckCircle2 } from 'lucide-react';

export default async function VerifyEmailPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'auth.verify' });

  return (
    <GlassCard intensity="strong" className="p-8 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
      <h1 className="mt-4 font-display text-2xl font-semibold text-fg">{t('title')}</h1>
      <p className="mt-2 text-sm text-fg-muted">{t('subtitle')}</p>
    </GlassCard>
  );
}

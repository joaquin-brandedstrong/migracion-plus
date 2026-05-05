import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/contact-form';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <div className="container py-16 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr,360px] lg:gap-16">
        <div>
          <h1 className="font-display text-display-lg font-semibold text-fg">{t('title')}</h1>
          <p className="mt-2 text-fg-muted">{t('subtitle')}</p>

          <div className="mt-10">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-4">
          <ContactInfoItem icon={Mail} label={t('info.email')} value="hola@migracionplus.academy" />
          <ContactInfoItem icon={Phone} label={t('info.phone')} value="+1 (555) 123-4567" />
          <ContactInfoItem icon={Clock} label={t('info.hours')} value={locale === 'es' ? 'Lun-Vie · 9:00 - 18:00 ET' : 'Mon-Fri · 9:00 - 18:00 ET'} />
          <ContactInfoItem icon={MapPin} label={locale === 'es' ? 'Oficina' : 'Office'} value="Miami, FL · USA" />
        </aside>
      </div>
    </div>
  );
}

function ContactInfoItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-fg-muted">{label}</p>
        <p className="text-sm font-semibold text-fg">{value}</p>
      </div>
    </div>
  );
}

import { Briefcase, ShieldCheck, GraduationCap, HandshakeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ValueProps() {
  const t = useTranslations('home.valueProps');

  const items = [
    { icon: Briefcase, key: 'advisory' as const },
    { icon: GraduationCap, key: 'experience' as const },
    { icon: ShieldCheck, key: 'service' as const },
    { icon: HandshakeIcon, key: 'commitment' as const },
  ];

  return (
    <section className="relative overflow-hidden bg-bg-elevated py-16 lg:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots-teal" />
      <div className="container relative">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">{t('title')}</h2>
          <p className="mt-2 text-sm text-fg-muted sm:text-base">{t('subtitle')}</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, key }) => (
            <div key={key} className="border-l-2 border-brand-700 pl-5 dark:border-brand-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-fg">{t(`${key}.title`)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{t(`${key}.body`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

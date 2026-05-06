import { useTranslations } from 'next-intl';

export function HowItWorks() {
  const t = useTranslations('home.howItWorks');

  const steps = [
    { num: '01', key: 'step1' as const },
    { num: '02', key: 'step2' as const },
    { num: '03', key: 'step3' as const },
  ];

  return (
    <section className="relative overflow-hidden bg-bg py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-800/30"
      />
      <div className="container relative">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">{t('title')}</h2>
          <p className="mt-2 text-sm text-fg-muted sm:text-base">{t('subtitle')}</p>
        </div>

        <ol className="mt-10 grid gap-6 lg:grid-cols-3">
          {steps.map(({ num, key }) => (
            <li
              key={num}
              className="rounded-2xl border border-[var(--border)] bg-bg-elevated p-7"
            >
              <div className="font-display text-5xl font-bold text-brand-700 dark:text-brand-300">
                {num}
              </div>
              <h3 className="mt-4 text-lg font-bold text-fg">{t(`${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{t(`${key}.body`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

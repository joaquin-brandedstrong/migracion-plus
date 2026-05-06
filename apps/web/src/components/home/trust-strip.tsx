import { useLocale, useTranslations } from 'next-intl';

const stats = [
  { value: '15+', labelEs: 'años de experiencia', labelEn: 'years of experience' },
  { value: '12K', labelEs: 'estudiantes activos', labelEn: 'active students' },
  { value: '4.8', labelEs: 'rating promedio', labelEn: 'average rating' },
  { value: '24/7', labelEs: 'asistente IA', labelEn: 'AI assistant' },
];

export function TrustStrip() {
  const t = useTranslations('home');
  const locale = useLocale() as 'es' | 'en';

  return (
    <section className="border-y border-[var(--border)] bg-bg">
      <div className="container py-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-fg-muted">
          {t('trustStrip')}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <div className="text-3xl font-bold text-brand-700 dark:text-brand-300 lg:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs text-fg-muted lg:text-sm">{locale === 'es' ? s.labelEs : s.labelEn}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

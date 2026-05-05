import { useTranslations } from 'next-intl';

const stats = [
  { value: '15+', labelEs: 'años de experiencia', labelEn: 'years of experience' },
  { value: '12K', labelEs: 'estudiantes activos', labelEn: 'active students' },
  { value: '4.8', labelEs: 'rating promedio', labelEn: 'average rating' },
  { value: '24/7', labelEs: 'asistente IA', labelEn: 'AI assistant' },
];

export function TrustStrip() {
  const t = useTranslations('home');

  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)]/40 backdrop-blur">
      <div className="container py-10">
        <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-fg-muted">
          {t('trustStrip')}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <div className="font-display text-3xl font-semibold text-fg lg:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs text-fg-muted lg:text-sm">{s.labelEs}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

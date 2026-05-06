import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Button, GlassCard, Badge } from '@migracionplus/ui';
import { Bot, Lightbulb, MessageCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default async function DashboardAsistente({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'dashboard.assistant' });
  const lang = locale as 'es' | 'en';

  const suggestions: { es: string; en: string }[] = [
    {
      es: '¿Qué documentos necesito para la I-130?',
      en: 'Which documents do I need for the I-130?',
    },
    {
      es: 'Resúmeme la lección "Datos del beneficiario".',
      en: 'Summarize the "Beneficiary data" lesson for me.',
    },
    {
      es: 'Hazme un quiz de 5 preguntas sobre el examen de civismo.',
      en: 'Quiz me with 5 questions on the civics test.',
    },
    {
      es: '¿Cuáles son los tiempos de espera por categoría familiar?',
      en: 'What are the waiting times by family category?',
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-950 text-white">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
              {t('title')}
            </h1>
            <Badge variant="accent">Beta</Badge>
          </div>
          <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <GlassCard className="flex min-h-[420px] flex-col p-0">
          <div className="flex flex-1 flex-col gap-4 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-[var(--bg-elevated)] px-4 py-3 text-sm text-fg">
                {lang === 'es'
                  ? '¡Hola! Soy Plus, tu asistente de estudio. Puedo resolver dudas sobre tus cursos, resumir lecciones y generar quizzes de práctica. Recuerda que no doy asesoría legal.'
                  : "Hi! I'm Plus, your study assistant. I can answer course questions, summarize lessons, and generate practice quizzes. Note that I don't provide legal advice."}
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border)] p-4">
            <form className="flex items-center gap-2">
              <div className="flex-1">
                <label htmlFor="assistant-input" className="sr-only">
                  {lang === 'es' ? 'Escribe tu pregunta' : 'Type your question'}
                </label>
                <input
                  id="assistant-input"
                  type="text"
                  disabled
                  placeholder={
                    lang === 'es'
                      ? 'Escribe tu pregunta… (próximamente)'
                      : 'Type your question… (coming soon)'
                  }
                  className="h-11 w-full rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
              <Button type="submit" size="md" disabled>
                <MessageCircle className="h-4 w-4" />
                {lang === 'es' ? 'Enviar' : 'Send'}
              </Button>
            </form>
            <p className="mt-3 flex items-start gap-2 text-xs text-fg-muted">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {t('comingSoon')}
            </p>
          </div>
        </GlassCard>

        <aside className="space-y-4">
          <GlassCard className="p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
              <Lightbulb className="h-4 w-4 text-accent-500" />
              {lang === 'es' ? 'Prueba con…' : 'Try asking…'}
            </div>
            <ul className="space-y-2">
              {suggestions.map((s) => (
                <li key={s.es}>
                  <button
                    type="button"
                    disabled
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-left text-sm text-fg-muted transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-ink-800"
                  >
                    {s[lang]}
                  </button>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
              {lang === 'es' ? 'Aviso' : 'Notice'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {lang === 'es'
                ? 'Plus es una herramienta educativa. No reemplaza la consulta con un abogado o consultor migratorio acreditado.'
                : 'Plus is an educational tool. It does not replace consultation with a licensed attorney or accredited immigration consultant.'}
            </p>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}

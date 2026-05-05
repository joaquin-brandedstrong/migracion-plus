'use client';

import { Badge, Button, GlassCard } from '@migracionplus/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const exampleQuestionsEs = [
  '¿Qué documentos necesito para el I-130?',
  '¿Cuánto tarda la aprobación del N-400?',
  '¿Puedo trabajar con un EAD pendiente?',
  '¿Qué hago si recibo un RFE?',
];
const exampleQuestionsEn = [
  'What documents do I need for the I-130?',
  'How long does N-400 approval take?',
  'Can I work with a pending EAD?',
  'What do I do if I get an RFE?',
];

export function AiTeaser() {
  const t = useTranslations('home.aiTeaser');
  const locale = useLocale() as 'es' | 'en';
  const questions = locale === 'es' ? exampleQuestionsEs : exampleQuestionsEn;
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const current = questions[index] ?? '';
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTyped(current.slice(0, i));
      if (i >= current.length) {
        clearInterval(interval);
        setTimeout(() => {
          setTyped('');
          setIndex((v) => (v + 1) % questions.length);
        }, 2000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [index, questions]);

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <GlassCard intensity="strong" className="overflow-hidden p-8 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="accent">
                <Sparkles className="h-3.5 w-3.5" />
                {t('eyebrow')}
              </Badge>
              <h2 className="mt-4 font-display text-display-md font-semibold text-fg">{t('title')}</h2>
              <p className="mt-4 text-fg-muted">{t('body')}</p>
              <div className="mt-8">
                <Button size="lg">
                  <MessageCircle className="h-4 w-4" />
                  {t('cta')}
                </Button>
              </div>
            </div>

            <div className="relative">
              <GlassCard className="bg-[var(--bg-elevated)] p-6">
                <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-900 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-fg">Plus</div>
                    <div className="text-xs text-fg-muted">
                      {locale === 'es' ? 'Asistente IA · En línea' : 'AI Assistant · Online'}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-brand-700 px-4 py-2.5 text-sm text-white">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-block"
                      >
                        {typed}
                        <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-white" />
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-ink-100 px-4 py-2.5 text-sm text-fg dark:bg-ink-800">
                    {locale === 'es'
                      ? 'Para la petición I-130 necesitas el certificado de matrimonio o nacimiento, comprobante de ciudadanía y documentos de identidad…'
                      : 'For the I-130 petition you will need the marriage or birth certificate, proof of citizenship, and identity documents…'}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2">
                  <input
                    type="text"
                    placeholder={locale === 'es' ? 'Escribe tu pregunta…' : 'Type your question…'}
                    className="flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted"
                    aria-label={locale === 'es' ? 'Pregunta' : 'Question'}
                  />
                  <button
                    type="button"
                    aria-label={locale === 'es' ? 'Enviar' : 'Send'}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-white"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

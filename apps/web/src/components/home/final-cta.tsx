'use client';

import { Button, GlassCard, Input } from '@migracionplus/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export function FinalCta() {
  const t = useTranslations('home.finalCta');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <GlassCard intensity="strong" className="overflow-hidden">
          <div className="relative bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 p-10 lg:p-16">
            <div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  'radial-gradient(at 0% 100%, rgba(252, 211, 77, 0.4) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(96, 165, 250, 0.5) 0px, transparent 50%)',
              }}
            />
            <div className="relative mx-auto max-w-2xl text-center text-white">
              <h2 className="font-display text-display-md font-semibold">{t('title')}</h2>
              <p className="mt-4 text-white/85">{t('body')}</p>

              {submitted ? (
                <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent-300" />
                  ¡Listo! Revisa tu correo.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email && consent) setSubmitted(true);
                  }}
                  className="mx-auto mt-8 flex max-w-md flex-col gap-3"
                >
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('placeholder')}
                      className="bg-white/95 text-ink-900 placeholder:text-ink-500"
                      aria-label={t('placeholder')}
                    />
                    <Button type="submit" variant="accent" size="md" disabled={!email || !consent}>
                      {t('submit')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <label className="flex items-start gap-2 text-left text-xs text-white/85">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-white/40 bg-white/20 text-accent-500 focus:ring-accent-400 focus:ring-offset-0"
                    />
                    <span>{t('consent')}</span>
                  </label>
                </form>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

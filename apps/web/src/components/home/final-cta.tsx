'use client';

import { Button, Input } from '@migracionplus/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function FinalCta() {
  const t = useTranslations('home.finalCta');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-bg py-16 lg:py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-brand-800 p-10 text-white lg:p-14 dark:bg-brand-900">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots-teal opacity-30" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-brand-300/20 blur-3xl"
          />
          <div className="relative mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">{t('title')}</h2>
              <p className="mt-3 text-sm text-white/85 sm:text-base">{t('body')}</p>
            </div>

            {submitted ? (
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-5 py-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-brand-200" />
                ¡Listo! Revisa tu correo.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email && consent) setSubmitted(true);
                }}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('placeholder')}
                    className="bg-white text-ink-900 placeholder:text-ink-500"
                    aria-label={t('placeholder')}
                  />
                  <Button
                    type="submit"
                    size="md"
                    disabled={!email || !consent}
                    className="bg-white text-brand-900 hover:bg-brand-50 active:bg-brand-100"
                  >
                    {t('submit')} →
                  </Button>
                </div>
                <label className="flex items-start gap-2 text-xs text-white/85">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-sm border-white/40 bg-white/20 text-brand-700 focus:ring-brand-300 focus:ring-offset-0"
                  />
                  <span>{t('consent')}</span>
                </label>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

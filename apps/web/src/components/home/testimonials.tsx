'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';
import { testimonials } from '@/data/seed';

export function Testimonials() {
  const t = useTranslations('home.testimonials');
  const locale = useLocale() as 'es' | 'en';

  const reel = [...testimonials, ...testimonials];

  return (
    <section className="relative overflow-hidden bg-bg py-16 lg:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-glow-teal" />
      <div className="container relative">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">{t('title')}</h2>
          <p className="mt-2 text-sm text-fg-muted sm:text-base">{t('subtitle')}</p>
        </div>
      </div>

      <div className="relative mt-10 [mask-image:linear-gradient(to_right,transparent,black_80px,black_calc(100%-80px),transparent)]">
        <div className="flex w-max gap-5 animate-marquee hover:[animation-play-state:paused]">
          {reel.map((testimonial, i) => (
            <article
              key={`${testimonial.name}-${i}`}
              className="w-80 shrink-0 rounded-2xl border border-[var(--border)] bg-bg-elevated p-6 lg:w-96"
            >
              <Quote className="h-6 w-6 text-brand-700 dark:text-brand-300" />
              <p className="mt-3 text-base leading-relaxed text-fg">&ldquo;{testimonial.quote[locale]}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-ink-100">
                  <Image src={testimonial.avatar} alt={testimonial.name} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-bold text-fg">{testimonial.name}</div>
                  <div className="text-xs text-fg-muted">{testimonial.role[locale]}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

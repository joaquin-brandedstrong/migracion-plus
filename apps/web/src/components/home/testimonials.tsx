'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { GlassCard } from '@migracionplus/ui';
import { Quote } from 'lucide-react';
import { testimonials } from '@/data/seed';

export function Testimonials() {
  const t = useTranslations('home.testimonials');
  const locale = useLocale() as 'es' | 'en';

  // Duplicate the array for seamless infinite scroll
  const reel = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-display-md font-semibold text-fg">{t('title')}</h2>
          <p className="mt-4 text-fg-muted">{t('subtitle')}</p>
        </div>
      </div>

      <div className="relative mt-12 [mask-image:linear-gradient(to_right,transparent,black_80px,black_calc(100%-80px),transparent)]">
        <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused]">
          {reel.map((testimonial, i) => (
            <GlassCard key={`${testimonial.name}-${i}`} className="w-80 shrink-0 p-6 lg:w-96">
              <Quote className="h-6 w-6 text-accent-500" />
                <p className="mt-4 text-base leading-relaxed text-fg">&ldquo;{testimonial.quote[locale]}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-ink-100">
                  <Image src={testimonial.avatar} alt={testimonial.name} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-fg">{testimonial.name}</div>
                  <div className="text-xs text-fg-muted">{testimonial.role[locale]}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

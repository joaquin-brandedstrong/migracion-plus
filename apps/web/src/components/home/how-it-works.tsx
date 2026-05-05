'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { GlassCard } from '@migracionplus/ui';
import { fadeInUp, stagger } from '@migracionplus/ui/motion';

export function HowItWorks() {
  const t = useTranslations('home.howItWorks');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    { num: '01', key: 'step1' as const },
    { num: '02', key: 'step2' as const },
    { num: '03', key: 'step3' as const },
  ];

  return (
    <section className="py-20 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-display-md font-semibold text-fg">{t('title')}</h2>
          <p className="mt-4 text-fg-muted">{t('subtitle')}</p>
        </div>

        <motion.div
          ref={ref}
          initial="initial"
          animate={inView ? 'animate' : 'initial'}
          variants={stagger(0.1)}
          className="relative mt-16 grid gap-6 lg:grid-cols-3"
        >
          {/* Connecting line */}
          <div
            aria-hidden
            className="absolute left-1/2 top-12 hidden h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-300 to-transparent lg:block dark:via-brand-700"
          />
          {steps.map(({ num, key }) => (
            <motion.div key={num} variants={fadeInUp} className="relative">
              <GlassCard hoverable className="h-full p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-900 font-display text-2xl font-semibold text-white shadow-glow">
                  {num}
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-fg">{t(`${key}.title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{t(`${key}.body`)}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

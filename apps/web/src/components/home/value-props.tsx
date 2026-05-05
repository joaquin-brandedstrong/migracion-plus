'use client';

import { GlassCard } from '@migracionplus/ui';
import { motion, useInView } from 'framer-motion';
import { Briefcase, ShieldCheck, GraduationCap, HandshakeIcon } from 'lucide-react';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { fadeInUp, stagger } from '@migracionplus/ui/motion';

export function ValueProps() {
  const t = useTranslations('home.valueProps');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const items = [
    { icon: Briefcase, key: 'advisory' as const },
    { icon: GraduationCap, key: 'experience' as const },
    { icon: ShieldCheck, key: 'service' as const },
    { icon: HandshakeIcon, key: 'commitment' as const },
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
          variants={stagger(0.08)}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map(({ icon: Icon, key }) => (
            <motion.div key={key} variants={fadeInUp}>
              <GlassCard hoverable className="h-full p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 text-white shadow-glow">
                  <Icon className="h-5 w-5" />
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

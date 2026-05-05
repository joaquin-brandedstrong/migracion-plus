'use client';

import { Button, GlassCard, GradientMesh, Badge } from '@migracionplus/ui';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { fadeInUp, springSoft } from '@migracionplus/ui/motion';

export function Hero() {
  const t = useTranslations('home');
  const locale = useLocale();

  return (
    <section className="relative isolate overflow-hidden">
      <GradientMesh intensity="bold" className="-z-10" />

      <div className="container relative pt-16 pb-24 lg:pt-28 lg:pb-36">
        <motion.div
          initial="initial"
          animate="animate"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="accent" className="px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {t('heroEyebrow')}
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ ...springSoft, delay: 0.1 }}
            className="mt-6 font-display text-display-xl font-semibold tracking-tight text-fg"
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ ...springSoft, delay: 0.2 }}
            className="mt-6 text-balance text-lg text-fg-muted lg:text-xl"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            transition={{ ...springSoft, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="xl">
              <Link href={`/${locale}/cursos`}>
                {t('heroCtaPrimary')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="secondary">
              <Link href={`/${locale}/cursos`}>{t('heroCtaSecondary')}</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0, transition: { ...springSoft, delay: 0.4 } }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <GlassCard intensity="strong" className="p-2 lg:p-4">
            <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950">
              <div
                aria-hidden
                className="absolute inset-0 opacity-40"
                style={{
                  background:
                    'radial-gradient(at 0% 100%, rgba(252, 211, 77, 0.35) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(97, 208, 190, 0.45) 0px, transparent 50%)',
                }}
              />
              <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6">
                {/* Hero card has a navy bg in both themes, so always use the white+teal variant. */}
                <Image
                  src="/brand/logo-footer-dark.png"
                  alt="Migración Plus"
                  width={470}
                  height={235}
                  priority
                  className="h-auto w-[280px] object-contain lg:w-[420px]"
                />
                <p className="text-xs uppercase tracking-[0.3em] text-white/60 lg:text-sm">A C A D E M Y</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

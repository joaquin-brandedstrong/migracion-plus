'use client';

import { Badge, Button, GlassCard } from '@migracionplus/ui';
import * as Accordion from '@radix-ui/react-accordion';
import * as Tabs from '@radix-ui/react-tabs';
import { Check, ChevronDown, Clock, Layers, Play, ShieldCheck, Smartphone, Star, Trophy, Download } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { CourseSeed } from '@/data/seed';
import { courses } from '@/data/seed';
import { CourseCard } from '@/components/course-card';
import { formatDuration, formatPrice } from '@/lib/utils';

export function CourseDetail({ course }: { course: CourseSeed }) {
  const t = useTranslations('courseDetail');
  const locale = useLocale() as 'es' | 'en';

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const related = courses.filter((c) => c.slug !== course.slug && c.category.slug === course.category.slug).slice(0, 3);

  return (
    <article>
      {/* Hero */}
      <div className="relative isolate overflow-hidden bg-gradient-to-br from-brand-900 via-brand-950 to-ink-950 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(at 0% 0%, rgba(252, 211, 77, 0.4) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(96, 165, 250, 0.5) 0px, transparent 50%)',
          }}
        />
        <div className="container relative grid gap-12 py-16 lg:grid-cols-[1fr,400px] lg:gap-16 lg:py-20">
          <div>
            <Badge variant="accent">{course.category.label[locale]}</Badge>
            <h1 className="mt-4 font-display text-display-lg font-semibold tracking-tight">{course.title[locale]}</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/85">{course.subtitle[locale]}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
                <strong className="text-white">{course.rating}</strong>
                <span>({course.ratingCount})</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatDuration(course.durationMinutes, locale)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                {totalLessons} {locale === 'es' ? 'lecciones' : 'lessons'}
              </span>
              <span>·</span>
              <span>{course.language.map((l) => l.toUpperCase()).join(' / ')}</span>
            </div>

            <p className="mt-6 text-sm text-white/70">
              {locale === 'es' ? 'Instructor: ' : 'Instructor: '}
              <span className="font-semibold text-white">{course.instructor.name}</span>
            </p>
          </div>

          <div className="lg:row-span-2">
            <GlassCard intensity="strong" className="sticky top-24 bg-white/95 p-2 dark:bg-ink-900/95">
              <button
                type="button"
                aria-label={t('trailer')}
                className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-ink-900"
              >
                <Image src={course.thumbnail} alt={course.title[locale]} fill sizes="400px" className="object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-ink-950/80 to-transparent">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-glass-lg transition-transform group-hover:scale-105">
                    <Play className="ml-1 h-6 w-6 fill-ink-900 text-ink-900" />
                  </div>
                </div>
              </button>

              <div className="p-4 lg:p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-semibold text-ink-900 dark:text-white">
                    {formatPrice(course.priceCents, 'USD', locale)}
                  </span>
                  {course.compareAtCents ? (
                    <span className="text-base text-ink-500 line-through dark:text-ink-400">
                      {formatPrice(course.compareAtCents, 'USD', locale)}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Button size="lg">{t('buyNow')}</Button>
                  <Button size="lg" variant="outline" className="dark:text-white dark:hover:bg-white/10">
                    {t('subscribe')}
                  </Button>
                </div>

                <ul className="mt-6 space-y-2.5 text-sm text-ink-700 dark:text-ink-300">
                  <FeatureItem icon={Trophy}>{t('lifetimeAccess')}</FeatureItem>
                  <FeatureItem icon={ShieldCheck}>{t('certificate')}</FeatureItem>
                  <FeatureItem icon={Download}>{t('downloadable')}</FeatureItem>
                  <FeatureItem icon={Smartphone}>{t('mobile')}</FeatureItem>
                </ul>
              </div>
            </GlassCard>
          </div>

          <div>
            <Tabs.Root defaultValue="overview">
              <Tabs.List className="flex flex-wrap gap-1 border-b border-white/10">
                <TabTrigger value="overview">{t('tabs.overview')}</TabTrigger>
                <TabTrigger value="curriculum">{t('tabs.curriculum')}</TabTrigger>
                <TabTrigger value="instructor">{t('tabs.instructor')}</TabTrigger>
                <TabTrigger value="reviews">{t('tabs.reviews')}</TabTrigger>
              </Tabs.List>

              <Tabs.Content value="overview" className="mt-8 text-white/90">
                <p className="text-base leading-relaxed">{course.description[locale]}</p>

                <h2 className="mt-12 font-display text-2xl font-semibold text-white">{t('whatYouWillLearn')}</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.whatYouWillLearn.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                      <span>{bullet[locale]}</span>
                    </li>
                  ))}
                </ul>

                <h2 className="mt-12 font-display text-2xl font-semibold text-white">{t('requirements')}</h2>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm">
                  {course.requirements.map((req, i) => (
                    <li key={i}>{req[locale]}</li>
                  ))}
                </ul>

                <h2 className="mt-12 font-display text-2xl font-semibold text-white">{t('audience')}</h2>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm">
                  {course.audience.map((aud, i) => (
                    <li key={i}>{aud[locale]}</li>
                  ))}
                </ul>
              </Tabs.Content>

              <Tabs.Content value="curriculum" className="mt-8">
                <Accordion.Root
                  type="multiple"
                  className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
                >
                  {course.modules.map((mod, i) => (
                    <Accordion.Item key={i} value={`m-${i}`}>
                      <Accordion.Header>
                        <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-white">
                          <span className="font-semibold">
                            {locale === 'es' ? `Módulo ${i + 1}: ` : `Module ${i + 1}: `}
                            {mod.title[locale]}
                          </span>
                          <span className="flex items-center gap-3 text-sm text-white/70">
                            {mod.lessons.length} {locale === 'es' ? 'lecciones' : 'lessons'}
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                          </span>
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="overflow-hidden">
                        <ul className="divide-y divide-white/10 pb-2">
                          {mod.lessons.map((les, j) => (
                            <li key={j} className="flex items-center justify-between px-6 py-3 text-sm text-white/85">
                              <span className="inline-flex items-center gap-3">
                                <Play className="h-3.5 w-3.5" />
                                {les.title[locale]}
                                {les.preview ? <Badge variant="muted">{locale === 'es' ? 'Vista previa' : 'Preview'}</Badge> : null}
                              </span>
                              <span className="text-white/60">{les.duration} min</span>
                            </li>
                          ))}
                        </ul>
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </Tabs.Content>

              <Tabs.Content value="instructor" className="mt-8 text-white/90">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 shrink-0 rounded-full bg-white/15" aria-hidden />
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">{course.instructor.name}</h3>
                    <p className="mt-1 text-sm text-white/70">
                      {locale === 'es' ? 'Consultor especializado en procesos migratorios.' : 'Consultant specialized in immigration processes.'}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed">
                      {locale === 'es'
                        ? 'Más de 10 años acompañando familias en sus procesos migratorios. Pedagogía clara, experiencia práctica y un compromiso real con la educación.'
                        : 'Over 10 years guiding families through their immigration processes. Clear pedagogy, practical experience, and a real commitment to education.'}
                    </p>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="reviews" className="mt-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/80">
                  <Star className="mx-auto h-8 w-8 fill-accent-400 text-accent-400" />
                  <p className="mt-3 font-display text-3xl font-semibold text-white">
                    {course.rating} / 5
                  </p>
                  <p className="text-sm">
                    {locale === 'es' ? `${course.ratingCount} reseñas verificadas` : `${course.ratingCount} verified reviews`}
                  </p>
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="container py-20">
          <h2 className="font-display text-display-md font-semibold text-fg">{t('alsoLike')}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function FeatureItem({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <Icon className="h-4 w-4 text-brand-700 dark:text-brand-400" />
      {children}
    </li>
  );
}

function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Tabs.Trigger
      value={value}
      className="rounded-t-lg px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:text-white data-[state=active]:border-b-2 data-[state=active]:border-accent-400 data-[state=active]:text-white"
    >
      {children}
    </Tabs.Trigger>
  );
}

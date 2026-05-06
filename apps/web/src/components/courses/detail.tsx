'use client';

import { Badge, Button } from '@migracionplus/ui';
import * as Accordion from '@radix-ui/react-accordion';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Check,
  ChevronDown,
  Clock,
  Layers,
  Play,
  ShieldCheck,
  Smartphone,
  Star,
  Trophy,
  Download,
} from 'lucide-react';
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
  const related = courses
    .filter((c) => c.slug !== course.slug && c.category.slug === course.category.slug)
    .slice(0, 3);

  return (
    <article>
      {/* Hero band — dark teal */}
      <div className="relative overflow-hidden bg-brand-900 text-white dark:bg-ink-950">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-mesh-teal opacity-50" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots-teal opacity-25" />
        <div className="container relative grid gap-10 py-12 lg:grid-cols-[1fr_360px] lg:gap-16 lg:py-16">
          <div>
            <Badge variant="accent">{course.category.label[locale]}</Badge>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {course.title[locale]}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              {course.subtitle[locale]}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <span className="font-bold text-brand-200">{course.rating.toFixed(1)}</span>
                <Stars value={course.rating} />
                <span>({course.ratingCount.toLocaleString(locale)})</span>
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

            <p className="mt-5 text-sm text-white/70">
              {locale === 'es' ? 'Instructor: ' : 'Instructor: '}
              <span className="font-bold text-white underline-offset-2 hover:underline">
                {course.instructor.name}
              </span>
            </p>
          </div>

          {/* Sticky purchase card */}
          <aside className="lg:row-span-2">
            <div className="sticky top-20 overflow-hidden rounded-2xl border border-[var(--border)] bg-bg-elevated text-fg shadow-card-hover">
              <button
                type="button"
                aria-label={t('trailer')}
                className="group relative block aspect-video w-full overflow-hidden bg-ink-900"
              >
                <Image
                  src={course.thumbnail}
                  alt={course.title[locale]}
                  fill
                  sizes="360px"
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-ink-950/80 to-transparent">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-card-hover transition-transform group-hover:scale-105">
                    <Play className="ml-0.5 h-5 w-5 fill-ink-900 text-ink-900" />
                  </div>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-sm font-bold text-white">
                    {t('trailer')}
                  </span>
                </div>
              </button>

              <div className="p-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-fg">
                    {formatPrice(course.priceCents, 'USD', locale)}
                  </span>
                  {course.compareAtCents ? (
                    <span className="text-base text-fg-muted line-through">
                      {formatPrice(course.compareAtCents, 'USD', locale)}
                    </span>
                  ) : null}
                </div>
                {course.compareAtCents ? (
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-brand-700 dark:text-brand-300">
                    {Math.round(
                      (1 - course.priceCents / course.compareAtCents) * 100,
                    )}
                    % {locale === 'es' ? 'de descuento' : 'off'}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-col gap-2">
                  <Button size="lg" className="w-full">
                    {t('buyNow')}
                  </Button>
                  <Button size="lg" variant="outline" className="w-full">
                    {t('subscribe')}
                  </Button>
                </div>

                <ul className="mt-5 space-y-2.5 text-sm text-fg-muted">
                  <FeatureItem icon={Trophy}>{t('lifetimeAccess')}</FeatureItem>
                  <FeatureItem icon={ShieldCheck}>{t('certificate')}</FeatureItem>
                  <FeatureItem icon={Download}>{t('downloadable')}</FeatureItem>
                  <FeatureItem icon={Smartphone}>{t('mobile')}</FeatureItem>
                </ul>
              </div>
            </div>
          </aside>

          {/* Tabs (overview / curriculum / instructor / reviews) */}
          <div className="text-white">
            <Tabs.Root defaultValue="overview">
              <Tabs.List className="flex flex-wrap gap-1 border-b border-white/15">
                <TabTrigger value="overview">{t('tabs.overview')}</TabTrigger>
                <TabTrigger value="curriculum">{t('tabs.curriculum')}</TabTrigger>
                <TabTrigger value="instructor">{t('tabs.instructor')}</TabTrigger>
                <TabTrigger value="reviews">{t('tabs.reviews')}</TabTrigger>
              </Tabs.List>

              <Tabs.Content value="overview" className="mt-8 text-white/90">
                <p className="text-base leading-relaxed">{course.description[locale]}</p>

                <h2 className="mt-10 font-display text-xl font-bold text-white sm:text-2xl">
                  {t('whatYouWillLearn')}
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.whatYouWillLearn.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" />
                      <span>{bullet[locale]}</span>
                    </li>
                  ))}
                </ul>

                <h2 className="mt-10 font-display text-xl font-bold text-white sm:text-2xl">
                  {t('requirements')}
                </h2>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm">
                  {course.requirements.map((req, i) => (
                    <li key={i}>{req[locale]}</li>
                  ))}
                </ul>

                <h2 className="mt-10 font-display text-xl font-bold text-white sm:text-2xl">
                  {t('audience')}
                </h2>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm">
                  {course.audience.map((aud, i) => (
                    <li key={i}>{aud[locale]}</li>
                  ))}
                </ul>
              </Tabs.Content>

              <Tabs.Content value="curriculum" className="mt-8">
                <Accordion.Root
                  type="multiple"
                  className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/15 bg-white/5"
                >
                  {course.modules.map((mod, i) => (
                    <Accordion.Item key={i} value={`m-${i}`}>
                      <Accordion.Header>
                        <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-white">
                          <span className="font-bold">
                            {locale === 'es' ? `Módulo ${i + 1}: ` : `Module ${i + 1}: `}
                            {mod.title[locale]}
                          </span>
                          <span className="flex items-center gap-3 text-sm text-white/70">
                            {mod.lessons.length}{' '}
                            {locale === 'es' ? 'lecciones' : 'lessons'}
                            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                          </span>
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="overflow-hidden">
                        <ul className="divide-y divide-white/10 pb-2">
                          {mod.lessons.map((les, j) => (
                            <li
                              key={j}
                              className="flex items-center justify-between px-5 py-3 text-sm text-white/85"
                            >
                              <span className="inline-flex items-center gap-3">
                                <Play className="h-3.5 w-3.5" />
                                {les.title[locale]}
                                {les.preview ? (
                                  <Badge variant="muted">
                                    {locale === 'es' ? 'Vista previa' : 'Preview'}
                                  </Badge>
                                ) : null}
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
                  <div className="h-20 w-20 shrink-0 rounded-full bg-brand-700" aria-hidden />
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {course.instructor.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">
                      {locale === 'es'
                        ? 'Consultor especializado en procesos migratorios.'
                        : 'Consultant specialized in immigration processes.'}
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
                <div className="rounded-2xl border border-white/15 bg-white/5 p-8 text-center text-white/85">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-7 w-7 fill-brand-200 text-brand-200" />
                    <span className="font-display text-3xl font-bold text-white">
                      {course.rating.toFixed(1)} / 5
                    </span>
                  </div>
                  <p className="mt-2 text-sm">
                    {locale === 'es'
                      ? `${course.ratingCount} reseñas verificadas`
                      : `${course.ratingCount} verified reviews`}
                  </p>
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="container py-16 lg:py-20">
          <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">
            {t('alsoLike')}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function FeatureItem({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2.5">
      <Icon className="h-4 w-4 text-brand-700 dark:text-brand-300" />
      {children}
    </li>
  );
}

function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Tabs.Trigger
      value={value}
      className="px-4 py-3 text-sm font-bold text-white/65 transition-colors hover:text-white data-[state=active]:border-b-2 data-[state=active]:border-brand-200 data-[state=active]:text-white"
    >
      {children}
    </Tabs.Trigger>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex" aria-label={`${value.toFixed(1)} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = value >= i + 1;
        const half = !filled && value >= i + 0.5;
        return (
          <span key={i} className="relative inline-block h-3.5 w-3.5">
            <Star className="absolute inset-0 h-3.5 w-3.5 stroke-brand-200 text-transparent" />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : '50%' }}
              >
                <Star className="h-3.5 w-3.5 fill-brand-200 text-brand-200" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

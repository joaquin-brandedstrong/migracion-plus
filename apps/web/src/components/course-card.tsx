'use client';

import { Badge, GlassCard } from '@migracionplus/ui';
import { Star, Clock, Layers } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { CourseSeed } from '@/data/seed';
import { formatPrice, formatDuration } from '@/lib/utils';

export function CourseCard({ course }: { course: CourseSeed }) {
  const locale = useLocale() as 'es' | 'en';
  const t = useTranslations('courses.card');

  return (
    <Link href={`/${locale}/cursos/${course.slug}`} className="group block">
      <GlassCard hoverable className="h-full overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={course.thumbnail}
            alt={course.title[locale]}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {course.badge ? (
            <div className="absolute left-3 top-3">
              <Badge variant="accent" className="bg-accent-500 text-ink-950">
                {course.badge[locale]}
              </Badge>
            </div>
          ) : null}
          <div className="absolute right-3 top-3">
            <Badge variant="muted" className="bg-white/80 text-ink-900 backdrop-blur dark:bg-ink-900/80 dark:text-ink-50">
              {course.category.label[locale]}
            </Badge>
          </div>
        </div>

        <div className="p-5">
          <h3 className="line-clamp-2 font-display text-lg font-semibold leading-tight text-fg">
            {course.title[locale]}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{course.subtitle[locale]}</p>

          <div className="mt-4 flex items-center gap-3 text-xs text-fg-muted">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
              {course.rating} ({course.ratingCount})
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(course.durationMinutes, locale)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              {course.lessonCount} {t('lessons')}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold text-fg">
              {formatPrice(course.priceCents, 'USD', locale)}
            </span>
            {course.compareAtCents ? (
              <span className="text-sm text-fg-muted line-through">
                {formatPrice(course.compareAtCents, 'USD', locale)}
              </span>
            ) : null}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

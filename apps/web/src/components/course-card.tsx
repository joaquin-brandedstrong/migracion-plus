'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import type { CourseSeed } from '@/data/seed';
import { formatPrice, formatDuration } from '@/lib/utils';

const levelLabel: Record<CourseSeed['level'], { es: string; en: string }> = {
  beginner: { es: 'Principiante', en: 'Beginner' },
  intermediate: { es: 'Intermedio', en: 'Intermediate' },
  advanced: { es: 'Avanzado', en: 'Advanced' },
};

export function CourseCard({ course }: { course: CourseSeed }) {
  const locale = useLocale() as 'es' | 'en';

  return (
    <Link
      href={`/${locale}/cursos/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-bg-elevated transition-shadow duration-150 hover:shadow-card-hover"
    >
      <div className="relative aspect-video overflow-hidden bg-ink-100 dark:bg-ink-800">
        <Image
          src={course.thumbnail}
          alt={course.title[locale]}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-fg">
          {course.title[locale]}
        </h3>
        <p className="line-clamp-1 text-xs text-fg-muted">{course.instructor.name}</p>

        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-sm font-bold text-brand-800 dark:text-brand-300">
            {course.rating.toFixed(1)}
          </span>
          <RatingStars value={course.rating} />
          <span className="text-xs text-fg-muted">({course.ratingCount.toLocaleString(locale)})</span>
        </div>

        <p className="text-xs text-fg-muted">
          {formatDuration(course.durationMinutes, locale)} · {course.lessonCount}{' '}
          {locale === 'es' ? 'lecciones' : 'lessons'} · {levelLabel[course.level][locale]}
        </p>

        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-bold text-fg">
            {formatPrice(course.priceCents, 'USD', locale)}
          </span>
          {course.compareAtCents ? (
            <span className="text-xs text-fg-muted line-through">
              {formatPrice(course.compareAtCents, 'USD', locale)}
            </span>
          ) : null}
        </div>

        {course.badge ? (
          <span className="mt-1 inline-flex w-fit items-center rounded-md bg-brand-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-900 dark:bg-brand-800 dark:text-brand-100">
            {course.badge[locale]}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

function RatingStars({ value }: { value: number }) {
  return (
    <span className="inline-flex" aria-label={`${value.toFixed(1)} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = value >= i + 1;
        const half = !filled && value >= i + 0.5;
        return (
          <span key={i} className="relative inline-block h-3.5 w-3.5">
            <Star className="absolute inset-0 h-3.5 w-3.5 stroke-brand-700 text-transparent dark:stroke-brand-400" />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : '50%' }}
              >
                <Star className="h-3.5 w-3.5 fill-brand-700 text-brand-700 dark:fill-brand-400 dark:text-brand-400" />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

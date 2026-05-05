import Image from 'next/image';
import Link from 'next/link';
import { Button, Badge } from '@migracionplus/ui';
import { Play } from 'lucide-react';
import type { DemoEnrollment } from '@/data/dashboard-seed';

interface Props {
  enrollment: DemoEnrollment;
  locale: 'es' | 'en';
}

export function ContinueCard({ enrollment, locale }: Props) {
  const { course, progressPercent, completedLessons, totalLessons, resumeLessonSlug, resumeLessonTitle, resumeTimestamp } = enrollment;
  const minutes = Math.floor(resumeTimestamp / 60);
  const seconds = String(resumeTimestamp % 60).padStart(2, '0');

  const resumeHref = `/${locale}/aprender/${course.slug}/${resumeLessonSlug}`;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="grid gap-0 sm:grid-cols-[160px,1fr]">
        <Link href={resumeHref} className="relative aspect-[16/10] overflow-hidden sm:aspect-auto">
          <Image
            src={course.thumbnail}
            alt={course.title[locale]}
            fill
            sizes="(min-width: 640px) 160px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-ink-950/70 via-ink-950/20 to-transparent">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-glass">
              <Play className="ml-0.5 h-5 w-5 fill-ink-900 text-ink-900" />
            </div>
          </div>
        </Link>

        <div className="flex flex-col p-5">
          <Badge variant="muted" className="mb-2 self-start">
            {course.category.label[locale]}
          </Badge>
          <h3 className="font-display text-base font-semibold leading-tight text-fg line-clamp-2">
            <Link href={resumeHref} className="hover:underline">
              {course.title[locale]}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-fg-muted">
            {locale === 'es' ? 'Siguiente: ' : 'Up next: '}
            <span className="text-fg">{resumeLessonTitle[locale]}</span>
            {resumeTimestamp > 0 ? <> · {minutes}:{seconds}</> : null}
          </p>

          <div className="mt-auto pt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-fg-muted">
                {completedLessons} / {totalLessons} {locale === 'es' ? 'lecciones' : 'lessons'}
              </span>
              <span className="font-semibold text-fg">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <Button asChild size="sm" className="mt-4 w-full sm:w-auto">
              <Link href={resumeHref}>
                {locale === 'es' ? 'Reanudar' : 'Resume'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

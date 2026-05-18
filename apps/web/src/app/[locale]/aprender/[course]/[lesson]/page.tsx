import { notFound } from 'next/navigation';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge, Button, GlassCard } from '@migracionplus/ui';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lock,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { courses } from '@/data/seed';
import { lessonRegistry, slugify } from '@/data/dashboard-seed';

interface Props {
  params: Promise<{ locale: string; course: string; lesson: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { locale, course: courseSlug, lesson: lessonSlug } = await params;
  setRequestLocale(locale);
  const lang = locale as 'es' | 'en';
  const t = await getTranslations({ locale, namespace: 'dashboard.lesson' });

  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) notFound();

  const ref = lessonRegistry[`${course.slug}/${lessonSlug}`];
  if (!ref) notFound();

  const currentModule = course.modules[ref.moduleIndex];
  const currentLesson = currentModule?.lessons[ref.lessonIndex];
  if (!currentModule || !currentLesson) notFound();

  // Build a flat ordered list of every lesson in the course so we can compute prev/next.
  const flat = course.modules.flatMap((mod, mi) =>
    mod.lessons.map((les, li) => ({
      moduleIndex: mi,
      lessonIndex: li,
      title: les.title,
      duration: les.duration,
      preview: les.preview,
      slug: slugify(les.title.es),
    })),
  );
  const flatIndex = flat.findIndex(
    (l) => l.moduleIndex === ref.moduleIndex && l.lessonIndex === ref.lessonIndex,
  );
  const prev = flatIndex > 0 ? flat[flatIndex - 1] : null;
  const next = flatIndex < flat.length - 1 ? flat[flatIndex + 1] : null;

  const lessonHref = (slug: string) => `/${locale}/aprender/${course.slug}/${slug}`;

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 lg:px-8">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/${locale}/dashboard/cursos`}>
            <ArrowLeft className="h-4 w-4" />
            {lang === 'es' ? 'Salir' : 'Exit'}
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-fg-muted">{course.title[lang]}</p>
          <p className="truncate text-sm font-medium text-fg">{currentLesson.title[lang]}</p>
        </div>
        <Button size="sm">
          <CheckCircle2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t('markComplete')}</span>
        </Button>
      </header>

      <div className="grid gap-0 lg:grid-cols-[1fr,360px]">
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          {/* Video */}
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-ink-950 shadow-glass">
            <div className="relative aspect-video">
              {ref.videoEmbedUrl ? (
                <iframe
                  src={ref.videoEmbedUrl}
                  title={currentLesson.title[lang]}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink-950 to-brand-950 px-6 text-center">
                  <PlayCircle className="h-12 w-12 text-white/70" />
                  <p className="text-sm font-medium text-white/80">
                    {t('videoComingSoon')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title block */}
          <div className="mt-6">
            <Badge variant="muted">
              {lang === 'es' ? 'Módulo' : 'Module'} {ref.moduleIndex + 1} ·{' '}
              {currentModule.title[lang]}
            </Badge>
            <h1 className="mt-3 font-display text-2xl font-semibold text-fg lg:text-3xl">
              {currentLesson.title[lang]}
            </h1>
            <p className="mt-2 text-sm text-fg-muted">
              {currentLesson.duration} {t('tabs.description').toLowerCase() === 'description' ? 'min' : 'min'}
            </p>
          </div>

          {/* Tabs (static, no JS) */}
          <div className="mt-8 border-b border-[var(--border)]">
            <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Tabs">
              {([
                ['description', true],
                ['resources', false],
                ['questions', false],
                ['notes', false],
                ['transcript', false],
              ] as const).map(([key, active]) => (
                <span
                  key={key}
                  className={
                    active
                      ? 'whitespace-nowrap border-b-2 border-brand-600 px-1 py-3 text-sm font-medium text-fg'
                      : 'whitespace-nowrap border-b-2 border-transparent px-1 py-3 text-sm font-medium text-fg-muted'
                  }
                >
                  {t(`tabs.${key}`)}
                </span>
              ))}
            </nav>
          </div>

          <article className="prose prose-sm mt-6 max-w-none text-fg-muted dark:prose-invert">
            <p>
              {lang === 'es'
                ? `En esta lección revisamos "${currentLesson.title.es}" como parte del módulo "${currentModule.title.es}". El reproductor con video, recursos, preguntas y notas se completará en una próxima iteración.`
                : `In this lesson we cover "${currentLesson.title.en}" as part of the "${currentModule.title.en}" module. The video player with resources, Q&A, and notes will be completed in a future iteration.`}
            </p>
            <p className="text-xs italic">{t('transcriptUnavailable')}</p>
          </article>

          {/* Prev / next */}
          <div className="mt-10 flex items-center justify-between gap-3">
            {prev ? (
              <Button asChild variant="outline" size="sm">
                <Link href={lessonHref(prev.slug)}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('previousLesson')}</span>
                </Link>
              </Button>
            ) : (
              <span />
            )}
            {next ? (
              <Button asChild size="sm">
                <Link href={lessonHref(next.slug)}>
                  <span className="hidden sm:inline">{t('nextLesson')}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </main>

        {/* Curriculum sidebar */}
        <aside className="border-l border-[var(--border)] bg-[var(--bg-elevated)] lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:overflow-y-auto">
          <div className="p-4 lg:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
              {lang === 'es' ? 'Contenido del curso' : 'Course content'}
            </p>
            <h2 className="mt-1 font-display text-base font-semibold text-fg">
              {course.title[lang]}
            </h2>
          </div>
          <ol className="space-y-1 px-2 pb-6">
            {course.modules.map((mod, mi) => (
              <li key={`${mi}-${mod.title.es}`} className="space-y-0.5">
                <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  {lang === 'es' ? `Módulo ${mi + 1}` : `Module ${mi + 1}`} · {mod.title[lang]}
                </p>
                {mod.lessons.map((les, li) => {
                  const slug = slugify(les.title.es);
                  const isCurrent = mi === ref.moduleIndex && li === ref.lessonIndex;
                  return (
                    <Link
                      key={slug}
                      href={lessonHref(slug)}
                      className={
                        isCurrent
                          ? 'flex items-start gap-3 rounded-xl bg-brand-100 px-3 py-2 text-sm text-brand-900 dark:bg-brand-900/40 dark:text-brand-200'
                          : 'flex items-start gap-3 rounded-xl px-3 py-2 text-sm text-fg-muted hover:bg-ink-100 hover:text-fg dark:hover:bg-ink-800'
                      }
                    >
                      <span className="mt-0.5 shrink-0">
                        {isCurrent ? (
                          <PlayCircle className="h-4 w-4" />
                        ) : les.preview ? (
                          <PlayCircle className="h-4 w-4 opacity-60" />
                        ) : (
                          <Lock className="h-4 w-4 opacity-50" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{les.title[lang]}</span>
                        <span className="text-[11px] text-fg-muted">{les.duration} min</span>
                      </span>
                    </Link>
                  );
                })}
              </li>
            ))}
          </ol>

          <div className="border-t border-[var(--border)] p-4 lg:p-6">
            <GlassCard className="bg-gradient-to-br from-brand-700 to-brand-950 p-5 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-300">
                <Sparkles className="h-3.5 w-3.5" />
                {t('askPlus')}
              </div>
              <p className="mt-2 text-sm leading-snug">
                {lang === 'es'
                  ? '¿Tienes dudas sobre esta lección? Plus puede ayudarte.'
                  : 'Stuck on this lesson? Plus can help.'}
              </p>
              <Button asChild size="sm" variant="accent" className="mt-3 w-full">
                <Link href={`/${locale}/dashboard/asistente`}>
                  {lang === 'es' ? 'Abrir asistente' : 'Open assistant'}
                </Link>
              </Button>
            </GlassCard>
          </div>
        </aside>
      </div>
    </div>
  );
}

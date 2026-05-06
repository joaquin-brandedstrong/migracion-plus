import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { courses } from '@/data/seed';
import { CourseCarousel } from '@/components/course-carousel';

export function FeaturedCourses() {
  const t = useTranslations('home.featuredCourses');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'es' | 'en';

  // First rail: most popular overall.
  const popular = [...courses].sort((a, b) => b.ratingCount - a.ratingCount);
  // Second rail: top-rated.
  const topRated = [...courses].sort((a, b) => b.rating - a.rating);

  return (
    <section className="relative overflow-hidden bg-bg py-16 lg:py-20">
      <div aria-hidden className="absolute inset-0 bg-glow-teal" />
      <div className="container relative">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">{t('title')}</h2>
            <p className="mt-1 text-sm text-fg-muted">{t('subtitle')}</p>
          </div>
          <Link
            href={`/${locale}/cursos`}
            className="hidden text-sm font-semibold text-brand-700 hover:underline sm:inline-block dark:text-brand-300"
          >
            {tCommon('viewAll')} →
          </Link>
        </div>

        <div className="mt-8">
          <CourseCarousel courses={popular} />
        </div>

        <div className="mt-14 flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">
              {locale === 'es' ? 'Mejor valorados' : 'Top rated'}
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              {locale === 'es'
                ? 'Los cursos con las reseñas más altas de nuestros estudiantes.'
                : 'Courses with the highest ratings from our students.'}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <CourseCarousel courses={topRated} />
        </div>
      </div>
    </section>
  );
}

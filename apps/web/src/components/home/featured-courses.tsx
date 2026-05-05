import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@migracionplus/ui';
import { ArrowRight } from 'lucide-react';
import { courses } from '@/data/seed';
import { CourseCard } from '@/components/course-card';

export function FeaturedCourses() {
  const t = useTranslations('home.featuredCourses');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const featured = courses.slice(0, 6);

  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-display-md font-semibold text-fg">{t('title')}</h2>
            <p className="mt-2 text-fg-muted">{t('subtitle')}</p>
          </div>
          <Button asChild variant="ghost">
            <Link href={`/${locale}/cursos`}>
              {tCommon('viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}

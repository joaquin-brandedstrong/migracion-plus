import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { courses } from '@/data/seed';
import { CourseDetail } from '@/components/courses/detail';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return { title: 'Curso no encontrado' };
  const lang = locale as 'es' | 'en';
  return {
    title: course.title[lang],
    description: course.subtitle[lang],
    openGraph: { title: course.title[lang], description: course.subtitle[lang], images: [course.thumbnail] },
  };
}

export function generateStaticParams() {
  return courses.flatMap((c) => [
    { locale: 'es', slug: c.slug },
    { locale: 'en', slug: c.slug },
  ]);
}

export default async function CourseDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();
  return <CourseDetail course={course} />;
}

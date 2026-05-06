import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Hero } from '@/components/home/hero';
import { TrustStrip } from '@/components/home/trust-strip';
import { Programs } from '@/components/home/programs';
import { ValueProps } from '@/components/home/value-props';
import { FeaturedCourses } from '@/components/home/featured-courses';
import { HowItWorks } from '@/components/home/how-it-works';
import { BooksSpotlight } from '@/components/home/books-spotlight';
import { Testimonials } from '@/components/home/testimonials';
import { AiTeaser } from '@/components/home/ai-teaser';
import { Faq } from '@/components/home/faq';
import { FinalCta } from '@/components/home/final-cta';

export const metadata: Metadata = {
  title: 'Inicio',
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustStrip />
      <Programs />
      <FeaturedCourses />
      <ValueProps />
      <HowItWorks />
      <BooksSpotlight />
      <Testimonials />
      <AiTeaser />
      <Faq />
      <FinalCta />
    </>
  );
}

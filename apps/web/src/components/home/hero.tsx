'use client';

import { Button } from '@migracionplus/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Slide {
  eyebrowEs: string;
  eyebrowEn: string;
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
  ctaEs: string;
  ctaEn: string;
  href: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    eyebrowEs: 'Plataforma educativa bilingüe',
    eyebrowEn: 'Bilingual learning platform',
    titleEs: 'Aprende a llenar formularios migratorios con confianza',
    titleEn: 'Learn to file immigration forms with confidence',
    bodyEs:
      'Cursos, libros y un asistente IA disponible 24/7 para guiarte en cada paso del proceso migratorio en EE.UU.',
    bodyEn:
      'Courses, books, and a 24/7 AI assistant to guide you through every step of the U.S. immigration process.',
    ctaEs: 'Ver cursos',
    ctaEn: 'Browse courses',
    href: '/cursos',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrowEs: 'Naturalización N-400',
    eyebrowEn: 'N-400 Naturalization',
    titleEs: 'De residente a ciudadano: pasa tu entrevista a la primera',
    titleEn: 'From resident to citizen: pass your interview the first time',
    bodyEs:
      'Practica las 100 preguntas de civismo, llena el N-400 paso a paso y simula la entrevista con feedback.',
    bodyEn:
      'Practice the 100 civics questions, fill out the N-400 step by step, and rehearse the interview with feedback.',
    ctaEs: 'Empezar gratis',
    ctaEn: 'Start for free',
    href: '/cursos/naturalizacion-n-400',
    image:
      'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrowEs: 'Asistente IA · 24/7',
    eyebrowEn: 'AI assistant · 24/7',
    titleEs: 'Tu duda no espera. Plus tampoco.',
    titleEn: "Your question doesn't wait. Plus doesn't either.",
    bodyEs:
      'Plus conoce el contenido de cada curso y responde en español o inglés cuando lo necesites.',
    bodyEn:
      'Plus knows every course inside out and answers in Spanish or English whenever you need it.',
    ctaEs: 'Probar asistente IA',
    ctaEn: 'Try the AI assistant',
    href: '/dashboard/asistente',
    image:
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1600&q=80',
  },
  {
    eyebrowEs: 'Petición familiar I-130',
    eyebrowEn: 'I-130 family petition',
    titleEs: 'Reúne a tu familia, ahorra miles en honorarios',
    titleEn: 'Reunite your family, save thousands in legal fees',
    bodyEs:
      'Plantillas, listas de verificación y ejemplos reales para llenar el I-130 sin contratar abogado.',
    bodyEn:
      'Templates, checklists, and real examples to file the I-130 without hiring an attorney.',
    ctaEs: 'Ver el curso',
    ctaEn: 'See the course',
    href: '/cursos/i-130-peticion-familiar',
    image:
      'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=1600&q=80',
  },
];

const AUTOPLAY_MS = 7000;

export function Hero() {
  const t = useTranslations('home');
  const locale = useLocale() as 'es' | 'en';
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = useMemo(
    () =>
      SLIDES.map((s) => ({
        eyebrow: locale === 'es' ? s.eyebrowEs : s.eyebrowEn,
        title: locale === 'es' ? s.titleEs : s.titleEn,
        body: locale === 'es' ? s.bodyEs : s.bodyEn,
        cta: locale === 'es' ? s.ctaEs : s.ctaEn,
        href: s.href,
        image: s.image,
      })),
    [locale],
  );

  const scrollTo = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const target = (el.scrollWidth / SLIDES.length) * i;
    el.scrollTo({ left: target, behavior: 'smooth' });
  }, []);

  const updateActive = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const slideWidth = el.scrollWidth / SLIDES.length;
    const next = Math.round(el.scrollLeft / slideWidth);
    setActive(Math.max(0, Math.min(SLIDES.length - 1, next)));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateActive, { passive: true });
    return () => el.removeEventListener('scroll', updateActive);
  }, [updateActive]);

  // Autoplay
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((cur) => {
        const next = (cur + 1) % SLIDES.length;
        scrollTo(next);
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, scrollTo]);

  const page = (dir: -1 | 1) => {
    const next = (active + dir + SLIDES.length) % SLIDES.length;
    scrollTo(next);
    setActive(next);
  };

  return (
    <section className="relative overflow-hidden bg-bg-elevated">
      <div aria-hidden className="absolute inset-0 bg-mesh-teal" />
      <div aria-hidden className="absolute inset-0 bg-grid-teal" />

      <div
        className="container relative py-8 lg:py-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="relative">
          {/* Track */}
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-roledescription="carousel"
            aria-label={locale === 'es' ? 'Destacados' : 'Highlights'}
          >
            {slides.map((slide, i) => (
              <article
                key={i}
                className="w-full shrink-0 snap-start"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${slides.length}`}
              >
                <div className="grid items-center gap-10 rounded-2xl bg-bg-elevated/30 p-6 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:p-10">
                  <div className="max-w-xl">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
                      {slide.eyebrow}
                    </p>
                    <h1 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight text-fg sm:text-4xl lg:text-5xl xl:text-6xl">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
                      {slide.body}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                      <Button asChild size="lg">
                        <Link href={`/${locale}${slide.href}`}>{slide.cta}</Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href={`/${locale}/cursos`}>{t('heroCtaSecondary')}</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-100 dark:bg-ink-800 lg:aspect-square">
                      <Image
                        src={slide.image}
                        alt=""
                        fill
                        priority={i === 0}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-5 -left-5 hidden rounded-xl bg-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-900 shadow-card sm:block dark:bg-brand-800 dark:text-brand-100">
                      12.000+ {locale === 'es' ? 'estudiantes' : 'students'}
                    </div>
                    <div className="absolute -right-3 top-6 hidden rounded-xl bg-bg-elevated px-4 py-2.5 text-sm shadow-card sm:block">
                      <div className="text-[10px] uppercase tracking-wider text-fg-muted">
                        Rating
                      </div>
                      <div className="mt-0.5 flex items-baseline gap-1">
                        <span className="text-xl font-bold text-brand-700 dark:text-brand-300">
                          4.8
                        </span>
                        <span className="text-xs text-fg-muted">/ 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Arrows */}
          <button
            type="button"
            onClick={() => page(-1)}
            aria-label={locale === 'es' ? 'Anterior' : 'Previous'}
            className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-bg-elevated/95 text-fg shadow-card-hover backdrop-blur transition hover:bg-bg-elevated lg:inline-flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            aria-label={locale === 'es' ? 'Siguiente' : 'Next'}
            className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-bg-elevated/95 text-fg shadow-card-hover backdrop-blur transition hover:bg-bg-elevated lg:inline-flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                scrollTo(i);
                setActive(i);
              }}
              aria-label={`${locale === 'es' ? 'Ir al destacado' : 'Go to slide'} ${i + 1}`}
              aria-current={i === active}
              className={
                i === active
                  ? 'h-2 w-8 rounded-full bg-brand-700 transition-all dark:bg-brand-300'
                  : 'h-2 w-2 rounded-full bg-ink-300 transition-all hover:bg-ink-400 dark:bg-ink-700 dark:hover:bg-ink-600'
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

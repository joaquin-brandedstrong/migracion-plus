'use client';

import { ArrowRight, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Program {
  pill1Es: string;
  pill1En: string;
  pill2Es: string;
  pill2En: string;
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
  href: string;
  image: string;
  /** Tailwind class set for the upper colored block. First program is the
   * bright "hero" tile; the rest use the light teal surface. */
  tone: 'pop' | 'soft';
}

const PROGRAMS: Program[] = [
  {
    pill1Es: 'Familias',
    pill1En: 'Families',
    pill2Es: 'I-130 · I-485',
    pill2En: 'I-130 · I-485',
    titleEs: 'Programas de Familia',
    titleEn: 'Family Programs',
    bodyEs: 'Para reunir a tu familia. Petición, ajuste y documentos paso a paso.',
    bodyEn: 'To reunite your family. Petition, adjustment, and documents step by step.',
    href: '/cursos?category=familia',
    image:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80',
    tone: 'pop',
  },
  {
    pill1Es: 'Residentes',
    pill1En: 'Residents',
    pill2Es: 'N-400',
    pill2En: 'N-400',
    titleEs: 'Programas de Ciudadanía',
    titleEn: 'Citizenship Programs',
    bodyEs: 'De residente a ciudadano. Examen de civismo y simulacros de entrevista.',
    bodyEn: 'From resident to citizen. Civics test and mock interview drills.',
    href: '/cursos?category=ciudadania',
    image:
      'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=900&q=80',
    tone: 'soft',
  },
  {
    pill1Es: 'Profesionales',
    pill1En: 'Professionals',
    pill2Es: 'H-1B · I-765',
    pill2En: 'H-1B · I-765',
    titleEs: 'Programas de Trabajo',
    titleEn: 'Work Programs',
    bodyEs: 'Visas y permisos. Lotería H-1B, EAD y transferencia de patrocinador.',
    bodyEn: 'Visas and permits. H-1B lottery, EAD, and sponsor transfers.',
    href: '/cursos?category=visas',
    image:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80',
    tone: 'soft',
  },
  {
    pill1Es: '24/7',
    pill1En: '24/7',
    pill2Es: 'Asistente IA',
    pill2En: 'AI Assistant',
    titleEs: 'Plus, tu copiloto',
    titleEn: 'Plus, your copilot',
    bodyEs: 'Resuelve tus dudas al instante en español o inglés, cuando lo necesites.',
    bodyEn: 'Get instant answers in Spanish or English, whenever you need them.',
    href: '/dashboard/asistente',
    image:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80',
    tone: 'soft',
  },
  {
    pill1Es: 'Lectura',
    pill1En: 'Reading',
    pill2Es: 'Libros · Guías',
    pill2En: 'Books · Guides',
    titleEs: 'Manuales y Guías',
    titleEn: 'Handbooks & Guides',
    bodyEs: 'Plantillas, listas de verificación y casos de estudio en formato físico o digital.',
    bodyEn: 'Templates, checklists, and case studies in print or digital format.',
    href: '/libros',
    image:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=900&q=80',
    tone: 'soft',
  },
];

export function Programs() {
  const locale = useLocale() as 'es' | 'en';
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const items = useMemo(
    () =>
      PROGRAMS.map((p) => ({
        pill1: locale === 'es' ? p.pill1Es : p.pill1En,
        pill2: locale === 'es' ? p.pill2Es : p.pill2En,
        title: locale === 'es' ? p.titleEs : p.titleEn,
        body: locale === 'es' ? p.bodyEs : p.bodyEn,
        href: p.href,
        image: p.image,
        tone: p.tone,
      })),
    [locale],
  );

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      ro.disconnect();
    };
  }, [updateEdges]);

  const page = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.9 * dir, behavior: 'smooth' });
  };

  return (
    <section className="bg-bg py-16 lg:py-24">
      <div className="container">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-fg-muted">
              {locale === 'es' ? 'Eleva tu proceso' : 'Elevate your process'}
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
              {locale === 'es'
                ? 'Educación migratoria para cada etapa'
                : 'Immigration education for every stage'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={!canPrev}
              aria-label={locale === 'es' ? 'Anterior' : 'Previous'}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-ink-300 disabled:text-ink-500 dark:bg-bg-elevated dark:text-fg dark:hover:bg-ink-800 dark:disabled:bg-ink-800/40 dark:disabled:text-ink-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={!canNext}
              aria-label={locale === 'es' ? 'Siguiente' : 'Next'}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-ink-300 disabled:text-ink-500 dark:bg-bg-elevated dark:text-fg dark:hover:bg-ink-800 dark:disabled:bg-ink-800/40 dark:disabled:text-ink-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative mt-10 -mx-4 sm:mx-0">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label={locale === 'es' ? 'Programas' : 'Programs'}
          >
            {items.map((p, i) => (
              <ProgramCard key={i} program={p} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ProgramItem {
  pill1: string;
  pill2: string;
  title: string;
  body: string;
  href: string;
  image: string;
  tone: 'pop' | 'soft';
}

function ProgramCard({
  program,
  locale,
}: {
  program: ProgramItem;
  locale: 'es' | 'en';
}) {
  const isPop = program.tone === 'pop';
  const upperBg = isPop
    ? 'bg-brand-300 dark:bg-brand-400'
    : 'bg-brand-50 dark:bg-brand-900/40';
  const titleColor = isPop
    ? 'text-brand-950'
    : 'text-fg';
  const bodyColor = isPop
    ? 'text-brand-900/80'
    : 'text-fg-muted';
  const iconBg = isPop
    ? 'bg-brand-950 text-brand-200'
    : 'bg-bg-elevated text-fg border border-[var(--border)]';

  return (
    <Link
      href={`/${locale}${program.href}`}
      className="group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-bg-elevated shadow-card transition-shadow hover:shadow-card-hover sm:w-[320px] lg:w-[340px]"
    >
      {/* Upper colored block */}
      <div className={`${upperBg} relative px-5 pb-6 pt-5`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-bg-elevated/95 px-2.5 py-1 text-[11px] font-bold text-fg dark:bg-bg/95">
              {program.pill1}
            </span>
            <span className="rounded-full bg-bg-elevated/95 px-2.5 py-1 text-[11px] font-bold text-fg dark:bg-bg/95">
              {program.pill2}
            </span>
          </div>
          <span
            className={`${iconBg} flex h-9 w-9 shrink-0 items-center justify-center rounded-full`}
            aria-hidden
          >
            <GraduationCap className="h-4 w-4" />
          </span>
        </div>

        <h3 className={`${titleColor} mt-6 font-display text-3xl font-bold leading-[1.05] tracking-tight`}>
          {program.title}
        </h3>
        <p className={`${bodyColor} mt-3 text-sm leading-relaxed`}>{program.body}</p>
      </div>

      {/* Photo */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-100 dark:bg-ink-800">
        <Image
          src={program.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 340px, (min-width: 640px) 320px, 280px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-bg-elevated/95 px-3.5 py-2 text-xs font-bold text-fg shadow-card transition group-hover:gap-3">
          {locale === 'es' ? 'Ver más' : 'Read More'}
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fg text-bg-elevated">
            <ArrowRight className="h-3 w-3" />
          </span>
        </span>
      </div>
    </Link>
  );
}


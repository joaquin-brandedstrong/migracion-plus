'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CourseSeed } from '@/data/seed';
import { CourseCard } from '@/components/course-card';

interface Props {
  courses: CourseSeed[];
}

/**
 * Udemy-style horizontal rail: CSS scroll-snap on each card with arrow
 * buttons that page by ~viewport width. Arrows hide at scroll edges.
 */
export function CourseCarousel({ courses }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

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
    const delta = el.clientWidth * 0.9 * dir;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="relative -mx-4 sm:mx-0">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Cursos"
      >
        {courses.map((course) => (
          <div
            key={course.slug}
            className="w-[260px] shrink-0 snap-start sm:w-[280px] lg:w-[300px]"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {/* Arrow controls — hidden on touch where native scroll is preferred */}
      <button
        type="button"
        onClick={() => page(-1)}
        disabled={!canPrev}
        aria-label="Anterior"
        className="absolute left-0 top-[35%] hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-bg-elevated text-fg shadow-card-hover transition disabled:pointer-events-none disabled:opacity-0 lg:inline-flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => page(1)}
        disabled={!canNext}
        aria-label="Siguiente"
        className="absolute right-0 top-[35%] hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-bg-elevated text-fg shadow-card-hover transition disabled:pointer-events-none disabled:opacity-0 lg:inline-flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

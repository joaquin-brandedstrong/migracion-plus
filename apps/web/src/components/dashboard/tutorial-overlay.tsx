'use client';

import { ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import type { ProfileRole } from '@migracionplus/db/types';
import { Button } from '@migracionplus/ui';
import { isAdminRole } from '@/lib/role';

interface Props {
  role: ProfileRole;
  locale: 'es' | 'en' | string;
}

interface TourStep {
  /** CSS selector for the element to spotlight. If null, renders a centered
   * intro card with no target. */
  target: string | null;
  emoji: string;
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
  /** Force the popover side. Otherwise it auto-picks based on viewport space. */
  prefer?: 'top' | 'bottom' | 'right' | 'left';
}

const STUDENT_STEPS: TourStep[] = [
  {
    target: null,
    emoji: '👋',
    titleEs: 'Bienvenido a tu panel',
    titleEn: 'Welcome to your dashboard',
    bodyEs:
      'Sigue este tour rápido para conocer las partes más útiles de la interfaz.',
    bodyEn: 'Take this quick tour to learn the most useful parts of the interface.',
  },
  {
    target: '[data-tour="sidebar"]',
    prefer: 'right',
    emoji: '🧭',
    titleEs: 'Tu navegación está aquí',
    titleEn: 'Your navigation lives here',
    bodyEs:
      'Mis cursos, biblioteca, certificados y el asistente IA — todo a un clic en el menú lateral.',
    bodyEn:
      'My courses, library, certificates, and the AI assistant — all one click away in the side menu.',
  },
  {
    target: '[data-tour="student-stats"]',
    prefer: 'bottom',
    emoji: '📊',
    titleEs: 'Tus métricas en un vistazo',
    titleEn: 'Your stats at a glance',
    bodyEs:
      'Cada tarjeta KPI muestra tu valor actual, el cambio % vs. el mes anterior y una mini gráfica de los últimos 6 meses.',
    bodyEn:
      'Each KPI card shows the current value, % change vs. last month, and a mini 6-month trend curve.',
  },
  {
    target: '[data-tour="student-streak"]',
    prefer: 'bottom',
    emoji: '🔥',
    titleEs: 'Mantén tu racha',
    titleEn: 'Keep your streak',
    bodyEs:
      'Estudia un poco cada día para mantener tu racha y completar tu meta semanal.',
    bodyEn: 'Study a little every day to keep your streak and hit your weekly goal.',
  },
  {
    target: '[data-tour="student-continue"]',
    prefer: 'top',
    emoji: '▶️',
    titleEs: 'Continúa donde lo dejaste',
    titleEn: 'Pick up where you left off',
    bodyEs:
      'Reanuda la última lección o termina el curso más cercano a tu próximo certificado.',
    bodyEn: 'Resume the last lesson or finish the course closest to your next certificate.',
  },
  {
    target: '[data-tour="student-plus"]',
    prefer: 'top',
    emoji: '✨',
    titleEs: 'Pregúntale a Plus',
    titleEn: 'Ask Plus',
    bodyEs:
      'Plus, tu asistente IA, conoce el contenido de cada curso y te responde 24/7 en español o inglés.',
    bodyEn: "Plus, your AI assistant, knows every course and answers 24/7 in Spanish or English.",
  },
  {
    target: '[data-tour="help-button"]',
    prefer: 'bottom',
    emoji: '❓',
    titleEs: '¿Quieres repetir el tour?',
    titleEn: 'Want to replay this?',
    bodyEs: 'Pulsa este botón en la barra superior para volver a ver el tutorial cuando quieras.',
    bodyEn: 'Hit this button in the topbar to replay the tutorial whenever you want.',
  },
];

const ADMIN_STEPS: TourStep[] = [
  {
    target: null,
    emoji: '🛠️',
    titleEs: 'Panel de administración',
    titleEn: 'Admin overview',
    bodyEs:
      'Te enseñamos en 7 pasos las áreas más importantes para operar la plataforma.',
    bodyEn: 'A 7-step quick tour of the areas you will use most to run the platform.',
  },
  {
    target: '[data-tour="sidebar"]',
    prefer: 'right',
    emoji: '🧭',
    titleEs: 'Navegación administrativa',
    titleEn: 'Admin navigation',
    bodyEs:
      'Cursos, libros, estudiantes, leads, contenido IA, reportes y certificados — todo desde el menú lateral.',
    bodyEn:
      'Courses, books, students, leads, AI content, reports, and certificates — all from the side menu.',
  },
  {
    target: '[data-tour="admin-stats"]',
    prefer: 'bottom',
    emoji: '📈',
    titleEs: 'KPIs con tendencia',
    titleEn: 'KPIs with trends',
    bodyEs:
      'Estudiantes activos, ingresos, leads y rating — cada tarjeta muestra el cambio porcentual y la curva de los últimos 6 meses.',
    bodyEn:
      'Active students, revenue, leads, rating — each card shows the % change and a 6-month trend curve.',
  },
  {
    target: '[data-tour="admin-insights"]',
    prefer: 'bottom',
    emoji: '🔭',
    titleEs: 'Insights ejecutivos',
    titleEn: 'Executive insights',
    bodyEs:
      'Sparkline de ingresos, embudo de conversión y distribución por categoría: diagnostica dónde optimizar el crecimiento.',
    bodyEn:
      'Revenue sparkline, conversion funnel, and category split — diagnose where to optimize growth.',
  },
  {
    target: '[data-tour="admin-courses"]',
    prefer: 'top',
    emoji: '🎓',
    titleEs: 'Cursos con más actividad',
    titleEn: 'Most active courses',
    bodyEs:
      'Tabla con los cursos que generan más inscripciones y reseñas para priorizar mejoras.',
    bodyEn:
      'Table of the courses generating the most enrollments and reviews so you can prioritize improvements.',
  },
  {
    target: '[data-tour="admin-ops"]',
    prefer: 'top',
    emoji: '⚙️',
    titleEs: 'Acciones rápidas y salud',
    titleEn: 'Quick actions & health',
    bodyEs:
      'Lanza tareas comunes con un clic y vigila el estado de los servicios externos en tiempo real.',
    bodyEn:
      'Trigger common tasks in one click and watch external service health in real time.',
  },
  {
    target: '[data-tour="help-button"]',
    prefer: 'bottom',
    emoji: '❓',
    titleEs: '¿Quieres repetir el tour?',
    titleEn: 'Want to replay this?',
    bodyEs: 'Pulsa este botón en la barra superior para volver a ver el tutorial cuando quieras.',
    bodyEn: 'Hit this button in the topbar to replay the tutorial whenever you want.',
  },
];

const SESSION_KEY = 'mp-tutorial-seen';
const DISABLED_KEY = 'mp-tutorial-disabled';

const SPOTLIGHT_PADDING = 8;
const POPOVER_GAP = 16;
const POPOVER_WIDTH = 360;
const POPOVER_VIEWPORT_PAD = 16;

interface TargetGeometry {
  rect: DOMRect;
  side: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * First-use tutorial overlay — spotlight tour with arrows pointing to real
 * dashboard elements. Auto-opens once per browser session unless permanently
 * dismissed. Re-launchable via `launchTutorial()`.
 */
export function TutorialOverlay({ role, locale }: Props) {
  const isAdmin = isAdminRole(role);
  const steps = isAdmin ? ADMIN_STEPS : STUDENT_STEPS;
  const lang: 'es' | 'en' = locale === 'en' ? 'en' : 'es';

  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [neverShow, setNeverShow] = useState(false);
  const [geom, setGeom] = useState<TargetGeometry | null>(null);

  // Auto-open on first session render unless permanently disabled.
  useEffect(() => {
    try {
      const disabled = window.localStorage.getItem(DISABLED_KEY) === '1';
      const seen = window.sessionStorage.getItem(SESSION_KEY) === '1';
      if (!disabled && !seen) setOpen(true);
    } catch {
      // SSR-safe no-op.
    }
    const onLaunch = () => {
      setStepIndex(0);
      setOpen(true);
    };
    window.addEventListener('mp:launch-tutorial', onLaunch);
    return () => window.removeEventListener('mp:launch-tutorial', onLaunch);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setGeom(null);
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
      if (neverShow) window.localStorage.setItem(DISABLED_KEY, '1');
    } catch {
      // ignore
    }
  }, [neverShow]);

  const step = steps[stepIndex] ?? steps[0]!;

  // Locate the target element + compute the best popover side. Re-runs on
  // step change, scroll, and resize so the spotlight tracks the element.
  useLayoutEffect(() => {
    if (!open) return;
    if (!step.target) {
      setGeom(null);
      return;
    }

    const measure = () => {
      const el = document.querySelector(step.target!);
      if (!(el instanceof HTMLElement)) {
        setGeom(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const spaceBelow = vh - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = vw - rect.right;
      const spaceLeft = rect.left;
      const ESTIMATED_POPOVER_HEIGHT = 220;

      let side: TargetGeometry['side'] = 'bottom';
      if (step.prefer === 'right' && spaceRight >= POPOVER_WIDTH + POPOVER_GAP * 2) side = 'right';
      else if (step.prefer === 'left' && spaceLeft >= POPOVER_WIDTH + POPOVER_GAP * 2) side = 'left';
      else if (step.prefer === 'top' && spaceAbove >= ESTIMATED_POPOVER_HEIGHT + POPOVER_GAP) side = 'top';
      else if (step.prefer === 'bottom' && spaceBelow >= ESTIMATED_POPOVER_HEIGHT + POPOVER_GAP) side = 'bottom';
      else if (spaceBelow >= ESTIMATED_POPOVER_HEIGHT + POPOVER_GAP) side = 'bottom';
      else if (spaceAbove >= ESTIMATED_POPOVER_HEIGHT + POPOVER_GAP) side = 'top';
      else if (spaceRight >= POPOVER_WIDTH + POPOVER_GAP * 2) side = 'right';
      else side = 'left';

      setGeom({ rect, side });
    };

    // Scroll target into view, then measure once it settles.
    const el = document.querySelector(step.target);
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
    const t = window.setTimeout(measure, 380);
    measure(); // also place immediately so we don't flash blank
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open, step.target, step.prefer, stepIndex]);

  // ESC closes; arrow keys navigate.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setStepIndex((i) => Math.min(steps.length - 1, i + 1));
      if (e.key === 'ArrowLeft') setStepIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, steps.length, close]);

  if (!open) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const hasTarget = step.target !== null && geom !== null;

  // Compute popover + arrow positioning when there's a target.
  let popoverStyle: React.CSSProperties | null = null;
  let arrowStyle: React.CSSProperties | null = null;
  let spotlightStyle: React.CSSProperties | null = null;

  if (hasTarget && geom) {
    const r = geom.rect;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    spotlightStyle = {
      position: 'fixed',
      top: r.top - SPOTLIGHT_PADDING,
      left: r.left - SPOTLIGHT_PADDING,
      width: r.width + SPOTLIGHT_PADDING * 2,
      height: r.height + SPOTLIGHT_PADDING * 2,
      borderRadius: 18,
      boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.62), 0 0 0 3px rgba(20, 184, 166, 0.7)',
      transition: 'top 200ms ease, left 200ms ease, width 200ms ease, height 200ms ease',
      pointerEvents: 'none',
    };

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    if (geom.side === 'bottom') {
      const left = clamp(
        r.left + r.width / 2 - POPOVER_WIDTH / 2,
        POPOVER_VIEWPORT_PAD,
        vw - POPOVER_WIDTH - POPOVER_VIEWPORT_PAD,
      );
      popoverStyle = {
        position: 'fixed',
        top: r.bottom + POPOVER_GAP + SPOTLIGHT_PADDING,
        left,
        width: POPOVER_WIDTH,
      };
      arrowStyle = {
        position: 'absolute',
        top: -8,
        left: clamp(r.left + r.width / 2 - left - 8, 18, POPOVER_WIDTH - 26),
      };
    } else if (geom.side === 'top') {
      const left = clamp(
        r.left + r.width / 2 - POPOVER_WIDTH / 2,
        POPOVER_VIEWPORT_PAD,
        vw - POPOVER_WIDTH - POPOVER_VIEWPORT_PAD,
      );
      popoverStyle = {
        position: 'fixed',
        bottom: vh - r.top + POPOVER_GAP + SPOTLIGHT_PADDING,
        left,
        width: POPOVER_WIDTH,
      };
      arrowStyle = {
        position: 'absolute',
        bottom: -8,
        left: clamp(r.left + r.width / 2 - left - 8, 18, POPOVER_WIDTH - 26),
      };
    } else if (geom.side === 'right') {
      popoverStyle = {
        position: 'fixed',
        top: clamp(
          r.top + r.height / 2 - 110,
          POPOVER_VIEWPORT_PAD,
          vh - 220 - POPOVER_VIEWPORT_PAD,
        ),
        left: r.right + POPOVER_GAP + SPOTLIGHT_PADDING,
        width: POPOVER_WIDTH,
      };
      arrowStyle = {
        position: 'absolute',
        left: -8,
        top: 96,
      };
    } else {
      popoverStyle = {
        position: 'fixed',
        top: clamp(
          r.top + r.height / 2 - 110,
          POPOVER_VIEWPORT_PAD,
          vh - 220 - POPOVER_VIEWPORT_PAD,
        ),
        right: vw - r.left + POPOVER_GAP + SPOTLIGHT_PADDING,
        width: POPOVER_WIDTH,
      };
      arrowStyle = {
        position: 'absolute',
        right: -8,
        top: 96,
      };
    }
  }

  // Arrow rotation per side — rotates the diamond so the corner points at the
  // target. We render a small square rotated 45°.
  const arrowRotateClass =
    geom?.side === 'top' || geom?.side === 'bottom' ? 'rotate-45' : 'rotate-45';

  const cardInner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
          <Sparkles className="h-3.5 w-3.5" />
          {lang === 'es' ? 'Tour rápido' : 'Quick tour'} · {stepIndex + 1}/{steps.length}
        </div>
        <button
          type="button"
          onClick={close}
          aria-label={lang === 'es' ? 'Cerrar tutorial' : 'Close tutorial'}
          className="-mr-1 -mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-ink-100 hover:text-fg dark:hover:bg-ink-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 text-3xl" aria-hidden>
        {step.emoji}
      </div>

      <h2 className="mt-1 font-display text-xl font-bold leading-tight text-fg sm:text-2xl">
        {lang === 'es' ? step.titleEs : step.titleEn}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        {lang === 'es' ? step.bodyEs : step.bodyEn}
      </p>

      <div className="mt-5 flex items-center gap-2">
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStepIndex(i)}
            aria-label={`${lang === 'es' ? 'Ir al paso' : 'Go to step'} ${i + 1}`}
            aria-current={i === stepIndex}
            className={
              i === stepIndex
                ? 'h-1.5 w-6 rounded-full bg-brand-700 transition-all dark:bg-brand-300'
                : 'h-1.5 w-1.5 rounded-full bg-ink-300 transition-all hover:bg-ink-400 dark:bg-ink-700 dark:hover:bg-ink-600'
            }
          />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-[11px] text-fg-muted">
          <input
            type="checkbox"
            checked={neverShow}
            onChange={(e) => setNeverShow(e.target.checked)}
            className="h-3.5 w-3.5 rounded-sm border-[var(--border)] text-brand-700 focus:ring-brand-500"
          />
          {lang === 'es' ? 'No volver a mostrar' : "Don't show again"}
        </label>

        <div className="flex items-center gap-2">
          {!isFirst ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              {lang === 'es' ? 'Atrás' : 'Back'}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={close}>
              {lang === 'es' ? 'Saltar' : 'Skip'}
            </Button>
          )}
          {!isLast ? (
            <Button
              size="sm"
              onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
            >
              {lang === 'es' ? 'Siguiente' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={close}>
              {lang === 'es' ? '¡Empezar!' : "Let's go!"}
            </Button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
      className="fixed inset-0 z-[100]"
    >
      {hasTarget ? (
        <>
          {/* Spotlight cutout — uses an enormous box-shadow to dim everything
              outside the target rect. The teal ring around the target makes
              it pop. */}
          <div style={spotlightStyle!} />
          {/* Click-outside catcher — covers entire viewport but sits below the
              spotlight ring; keeps clicks on the spotlighted element working
              would require pointer-events:none on the spotlight (already set). */}
          <button
            type="button"
            onClick={close}
            aria-label={lang === 'es' ? 'Cerrar tutorial' : 'Close tutorial'}
            className="absolute inset-0 -z-10 cursor-default"
          />
          {/* Popover with arrow */}
          <div
            style={popoverStyle!}
            className="rounded-2xl border border-[var(--border)] bg-bg-elevated p-5 shadow-card-hover"
          >
            {/* Arrow diamond pointing at target */}
            <div
              aria-hidden
              style={arrowStyle!}
              className={`h-4 w-4 ${arrowRotateClass} border border-[var(--border)] bg-bg-elevated`}
            />
            <div className="relative">{cardInner}</div>
          </div>
        </>
      ) : (
        // Centered intro / no-target fallback.
        <div className="absolute inset-0 flex items-end justify-center bg-ink-950/55 p-4 backdrop-blur-sm sm:items-center">
          <button
            type="button"
            onClick={close}
            aria-label={lang === 'es' ? 'Cerrar tutorial' : 'Close tutorial'}
            className="absolute inset-0 cursor-default"
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border)] bg-bg-elevated p-6 shadow-card-hover sm:p-8">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-mesh-teal opacity-40" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots-teal opacity-15" />
            <div className="relative">{cardInner}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Programmatically open the tutorial. Decoupled via a window event so the
 * trigger can live anywhere without prop drilling.
 */
export function launchTutorial() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('mp:launch-tutorial'));
}

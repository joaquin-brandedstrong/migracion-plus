/**
 * Demo data shown to the demo user on the dashboard pages. Replace with live
 * Supabase queries once the user has real enrollments / progress / certs.
 *
 * Used by:
 *   /dashboard            (home stats + carousels)
 *   /dashboard/cursos     (enrolled list with progress)
 *   /dashboard/biblioteca (purchased books)
 *   /dashboard/certificados (issued certificates)
 *   /aprender/[c]/[l]     (lesson player progress)
 */

import { courses, books, type CourseSeed, type BookSeed } from './seed';

export interface DemoEnrollment {
  course: CourseSeed;
  enrolledAt: string;
  lastActivityAt: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  resumeLessonSlug: string;
  resumeLessonTitle: { es: string; en: string };
  resumeTimestamp: number;
}

export interface DemoCertificate {
  id: string;
  course: CourseSeed;
  issuedAt: string;
  credentialId: string;
}

export interface DemoBookPurchase {
  book: BookSeed;
  purchasedAt: string;
  downloadCount: number;
}

export interface DemoActivity {
  id: string;
  kind: 'lesson_completed' | 'quiz_passed' | 'certificate_issued' | 'enrollment';
  at: string;
  title: { es: string; en: string };
  detail?: { es: string; en: string };
  href?: string;
}

const get = (slug: string) => courses.find((c) => c.slug === slug)!;
const getBook = (slug: string) => books.find((b) => b.slug === slug)!;

export const demoEnrollments: DemoEnrollment[] = [
  {
    course: get('i-130-peticion-familiar'),
    enrolledAt: '2026-04-10',
    lastActivityAt: '2026-05-04',
    progressPercent: 64,
    completedLessons: 11,
    totalLessons: 18,
    resumeLessonSlug: 'datos-del-beneficiario',
    resumeLessonTitle: {
      es: 'Datos del beneficiario',
      en: 'Beneficiary data',
    },
    resumeTimestamp: 487,
  },
  {
    course: get('naturalizacion-n-400'),
    enrolledAt: '2026-03-22',
    lastActivityAt: '2026-04-28',
    progressPercent: 32,
    completedLessons: 6,
    totalLessons: 20,
    resumeLessonSlug: 'tu-green-card-e-identificacion',
    resumeLessonTitle: {
      es: 'Tu Green Card e identificación',
      en: 'Your Green Card and identification',
    },
    resumeTimestamp: 220,
  },
  {
    course: get('examen-de-civismo-en-espanol'),
    enrolledAt: '2026-02-15',
    lastActivityAt: '2026-04-30',
    progressPercent: 100,
    completedLessons: 16,
    totalLessons: 16,
    resumeLessonSlug: 'preguntas-1-25',
    resumeLessonTitle: { es: 'Preguntas 1-25', en: 'Questions 1-25' },
    resumeTimestamp: 0,
  },
];

export const demoCertificates: DemoCertificate[] = [
  {
    id: 'cert-civismo-2026-03',
    course: get('examen-de-civismo-en-espanol'),
    issuedAt: '2026-04-30',
    credentialId: 'MP-CIV-2026-04A8F2',
  },
];

export const demoBookPurchases: DemoBookPurchase[] = [
  {
    book: getBook('manual-de-naturalizacion'),
    purchasedAt: '2026-03-15',
    downloadCount: 3,
  },
  {
    book: getBook('guia-h-1b'),
    purchasedAt: '2026-04-05',
    downloadCount: 1,
  },
];

export const demoActivity: DemoActivity[] = [
  {
    id: 'a1',
    kind: 'lesson_completed',
    at: '2026-05-04T18:22:00Z',
    title: {
      es: 'Lección completada · Categorías y tiempos de espera',
      en: 'Lesson completed · Categories and waiting times',
    },
    detail: { es: 'I-130 Petición Familiar', en: 'I-130 Family Petition' },
    href: '/dashboard/cursos',
  },
  {
    id: 'a2',
    kind: 'quiz_passed',
    at: '2026-05-04T17:55:00Z',
    title: { es: 'Quiz aprobado · 9/10', en: 'Quiz passed · 9/10' },
    detail: { es: 'Módulo 2 — I-130', en: 'Module 2 — I-130' },
  },
  {
    id: 'a3',
    kind: 'certificate_issued',
    at: '2026-04-30T14:00:00Z',
    title: { es: 'Certificado emitido', en: 'Certificate issued' },
    detail: { es: 'Examen de civismo en español', en: 'Civics test in Spanish' },
    href: '/dashboard/certificados',
  },
  {
    id: 'a4',
    kind: 'enrollment',
    at: '2026-04-10T10:14:00Z',
    title: { es: 'Curso inscrito', en: 'Enrolled in course' },
    detail: { es: 'I-130 Petición Familiar', en: 'I-130 Family Petition' },
  },
];

/**
 * Daily study minutes for the last 7 days (oldest → newest). Used by the
 * weekly study chart widget. Index 6 = today, index 0 = 6 days ago.
 */
export const demoWeeklyMinutes: number[] = [22, 0, 45, 38, 12, 60, 28];

/**
 * Six-month history per student KPI (oldest → newest, last value = current).
 * Drives the delta chip + sparkline rendered inside each StatCard.
 */
export const studentKpiHistory = {
  inProgress: [3, 3, 4, 3, 2, 2],
  completed: [0, 0, 0, 1, 1, 1],
  hoursStudied: [4, 7, 10, 14, 16, 18],
  certificates: [0, 0, 0, 1, 1, 1],
  lessonsCompleted: [5, 12, 18, 24, 30, 33],
  libraryBooks: [0, 1, 1, 2, 2, 2],
} as const;

/**
 * Pre-computed streak / weekly goal numbers. In production these come from
 * a Postgres view aggregating the lesson_progress table.
 */
export const demoStreak = {
  currentDays: 12,
  bestDays: 21,
  /** Last 7 days flagged true if the student studied at all that day. */
  last7: [true, false, true, true, true, true, true] as const,
};

export const demoWeeklyGoal = {
  /** Target minutes per ISO week. */
  targetMinutes: 300,
  /** Sum of demoWeeklyMinutes; recomputed at module init for consistency. */
  get currentMinutes() {
    return demoWeeklyMinutes.reduce((a, b) => a + b, 0);
  },
};

/**
 * Suggestions the AI assistant would surface based on the student's
 * current courses and gaps. Static for the demo viewer.
 */
export const demoPlusSuggestions = [
  {
    promptEs: '¿Qué documentos necesito para responder un RFE en mi I-130?',
    promptEn: 'What documents do I need to respond to an RFE on my I-130?',
  },
  {
    promptEs: 'Resúmeme el módulo de elegibilidad del N-400 en 5 puntos.',
    promptEn: 'Summarize the N-400 eligibility module in 5 bullets.',
  },
  {
    promptEs: 'Hazme 10 preguntas de práctica del examen de civismo.',
    promptEn: 'Quiz me with 10 practice questions from the civics test.',
  },
];

export interface DashboardStats {
  inProgress: number;
  completed: number;
  hoursStudied: number;
  certificates: number;
  lessonsCompleted: number;
  libraryBooks: number;
}

export function computeStats(
  enrollments: DemoEnrollment[],
  certs: DemoCertificate[],
  books: DemoBookPurchase[] = demoBookPurchases,
): DashboardStats {
  const inProgress = enrollments.filter((e) => e.progressPercent < 100).length;
  const completed = enrollments.filter((e) => e.progressPercent === 100).length;
  const lessonsCompleted = enrollments.reduce((sum, e) => sum + e.completedLessons, 0);
  // Approximate: minutes of completed lessons converted to hours.
  const hoursStudied = Math.round(
    enrollments.reduce((sum, e) => {
      const lessonAvg = e.course.durationMinutes / Math.max(1, e.totalLessons);
      return sum + (lessonAvg * e.completedLessons) / 60;
    }, 0),
  );
  return {
    inProgress,
    completed,
    hoursStudied,
    certificates: certs.length,
    lessonsCompleted,
    libraryBooks: books.length,
  };
}

export interface LessonRef {
  courseSlug: string;
  moduleIndex: number;
  lessonIndex: number;
  slug: string;
  durationSeconds: number;
  videoEmbedUrl?: string;
}

/**
 * Synthetic lesson registry — used by the lesson player to look up a lesson
 * by `(courseSlug, lessonSlug)`. Once Supabase is wired this comes from
 * `migracionplus.lessons`.
 */
export const lessonRegistry: Record<string, LessonRef> = (() => {
  const reg: Record<string, LessonRef> = {};
  for (const course of courses) {
    course.modules.forEach((mod, mi) => {
      mod.lessons.forEach((les, li) => {
        const slug = slugify(les.title.es);
        reg[`${course.slug}/${slug}`] = {
          courseSlug: course.slug,
          moduleIndex: mi,
          lessonIndex: li,
          slug,
          durationSeconds: les.duration * 60,
          // No placeholder video: lessons show a branded "video coming soon"
          // poster until real course footage is produced and uploaded.
          videoEmbedUrl: undefined,
        };
      });
    });
  }
  return reg;
})();

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

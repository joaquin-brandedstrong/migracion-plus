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
    resumeLessonSlug: 'documentos-que-necesitas',
    resumeLessonTitle: {
      es: 'Documentos que necesitas',
      en: 'Documents you need',
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

export interface DashboardStats {
  inProgress: number;
  completed: number;
  hoursStudied: number;
  certificates: number;
}

export function computeStats(enrollments: DemoEnrollment[], certs: DemoCertificate[]): DashboardStats {
  const inProgress = enrollments.filter((e) => e.progressPercent < 100).length;
  const completed = enrollments.filter((e) => e.progressPercent === 100).length;
  // Approximate: minutes of completed lessons converted to hours.
  const hoursStudied = Math.round(
    enrollments.reduce((sum, e) => {
      const lessonAvg = e.course.durationMinutes / Math.max(1, e.totalLessons);
      return sum + (lessonAvg * e.completedLessons) / 60;
    }, 0),
  );
  return { inProgress, completed, hoursStudied, certificates: certs.length };
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
          // Public domain "Big Buck Bunny" trailer as a placeholder.
          videoEmbedUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0&modestbranding=1',
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

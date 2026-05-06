/**
 * Demo data shown to admin users on the dashboard pages. Replace with live
 * Supabase queries (server-side, RLS-checked via migracionplus.is_admin())
 * once the admin flows are wired.
 *
 * Used by:
 *   /dashboard            (admin overview KPIs + tables)
 *   /dashboard/cursos     (course management table)
 *   /dashboard/biblioteca (book catalog management)
 *   /dashboard/estudiantes (students table)
 *   /dashboard/leads      (leads kanban)
 *   /dashboard/reportes   (KPI cards)
 *   /dashboard/certificados (issued credentials audit)
 */

import { courses, books } from './seed';
import type { LeadStatus } from '@migracionplus/db/types';

export interface AdminStudent {
  id: string;
  fullName: string;
  email: string;
  enrollments: number;
  lastActiveAt: string;
  plan: 'free' | 'monthly' | 'annual' | 'lifetime';
}

export interface AdminLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  topic: string;
  createdAt: string;
}

export interface AdminEnrollment {
  studentName: string;
  courseTitleEs: string;
  courseTitleEn: string;
  enrolledAt: string;
}

export interface AdminCourseRow {
  slug: string;
  titleEs: string;
  titleEn: string;
  students: number;
  rating: number;
  status: 'published' | 'draft' | 'archived';
  updatedAt: string;
}

export interface AdminCertificateRow {
  credentialId: string;
  studentName: string;
  courseTitleEs: string;
  courseTitleEn: string;
  issuedAt: string;
}

export const adminKpis = {
  activeStudents: 1284,
  enrollmentsLast30d: 312,
  revenueLast30dCents: 18_420_00,
  pendingLeads: 47,
  /** Mean rating across all published courses, weighted by review count. */
  avgRating: 4.78,
  /** Currently-paying subscribers (monthly + annual + lifetime). */
  activeSubscriptions: 562,
};

/**
 * Six-month history per admin KPI (oldest → newest, last value = current).
 * Drives the delta chip + sparkline rendered inside each StatCard.
 */
export const adminKpiHistory = {
  activeStudents: [820, 940, 1010, 1110, 1190, 1284],
  enrollmentsLast30d: [180, 215, 240, 265, 290, 312],
  revenueLast30dCents: [9_800_00, 11_200_00, 12_400_00, 14_600_00, 16_800_00, 18_420_00],
  pendingLeads: [25, 31, 38, 50, 53, 47],
  avgRating: [4.5, 4.6, 4.65, 4.7, 4.75, 4.78],
  activeSubscriptions: [320, 380, 430, 470, 520, 562],
} as const;

/**
 * Daily revenue in cents for the last 30 days (oldest → newest). Used by the
 * sparkline widget. Numbers are tuned to total ≈ adminKpis.revenueLast30dCents.
 */
export const adminDailyRevenueCents: number[] = [
  41_00, 52_00, 38_00, 67_00, 89_00, 71_00, 55_00,
  62_00, 48_00, 73_00, 95_00, 110_00, 87_00, 64_00,
  58_00, 79_00, 104_00, 92_00, 71_00, 66_00, 81_00,
  98_00, 122_00, 134_00, 110_00, 97_00, 89_00, 105_00,
  118_00, 142_00,
];

/**
 * Conversion funnel for the last 30 days. Each stage's count is the number
 * of unique users that passed it.
 */
export const adminFunnel = [
  { keyEs: 'Visitantes', keyEn: 'Visitors', value: 18_420 },
  { keyEs: 'Leads', keyEn: 'Leads', value: 1_842 },
  { keyEs: 'Inscripciones', keyEn: 'Enrollments', value: 312 },
  { keyEs: 'Compras', keyEn: 'Purchases', value: 198 },
];

/**
 * Course-category share of new enrollments for the last 30 days.
 */
export const adminCategoryDistribution = [
  { slug: 'familia', labelEs: 'Familia', labelEn: 'Family', share: 0.42 },
  { slug: 'ciudadania', labelEs: 'Ciudadanía', labelEn: 'Citizenship', share: 0.31 },
  { slug: 'visas', labelEs: 'Trabajo y Visas', labelEn: 'Work & Visas', share: 0.27 },
];

/**
 * Mini system status pulse — green/yellow/red signals for ops teams to
 * notice at a glance. Replace with real probes (Sentry, Stripe, Twilio).
 */
export const adminSystemStatus = [
  { keyEs: 'Asistente IA', keyEn: 'AI Assistant', status: 'ok' as const, latencyEs: '230 ms', latencyEn: '230 ms' },
  { keyEs: 'Pagos Stripe', keyEn: 'Stripe Payments', status: 'ok' as const, latencyEs: 'sin incidencias', latencyEn: 'no incidents' },
  { keyEs: 'SMS Twilio', keyEn: 'Twilio SMS', status: 'warn' as const, latencyEs: '3 reintentos', latencyEn: '3 retries' },
  { keyEs: 'CDN imágenes', keyEn: 'Image CDN', status: 'ok' as const, latencyEs: 'p95 110 ms', latencyEn: 'p95 110 ms' },
];

export type SystemStatus = 'ok' | 'warn' | 'down';

/**
 * Latest verified reviews left by students. Recent activity widget.
 */
export const adminRecentReviews = [
  {
    student: 'Ana López',
    courseEs: 'Examen de civismo en español',
    courseEn: 'Civics test in Spanish',
    rating: 5,
    excerptEs: 'El simulacro me dio la confianza que necesitaba.',
    excerptEn: 'The mock test gave me the confidence I needed.',
    at: '2026-05-05T18:24:00Z',
  },
  {
    student: 'Carlos Mendoza',
    courseEs: 'Petición Familiar I-130 paso a paso',
    courseEn: 'I-130 Family Petition Step by Step',
    rating: 5,
    excerptEs: 'Las plantillas me ahorraron días de trabajo.',
    excerptEn: 'The templates saved me days of work.',
    at: '2026-05-04T11:02:00Z',
  },
  {
    student: 'Laura Pérez',
    courseEs: 'Naturalización N-400',
    courseEn: 'Naturalization N-400',
    rating: 4,
    excerptEs: 'Excelente; faltaron más ejemplos en español.',
    excerptEn: 'Great course; needed more Spanish examples.',
    at: '2026-05-03T15:48:00Z',
  },
];

export const adminCourseRows: AdminCourseRow[] = courses.map((c, i) => ({
  slug: c.slug,
  titleEs: c.title.es,
  titleEn: c.title.en,
  students: 240 - i * 31,
  rating: c.rating,
  status: i < 5 ? 'published' : i === 5 ? 'draft' : 'archived',
  updatedAt: ['2026-05-04', '2026-04-28', '2026-04-15', '2026-03-30', '2026-03-12', '2026-02-22', '2026-01-10'][
    i % 7
  ]!,
}));

export const adminBookRows = books.map((b) => ({
  slug: b.slug,
  titleEs: b.title.es,
  titleEn: b.title.en,
  format: b.format,
  priceCents: b.priceCents ?? 0,
  hasAmazon: !!b.amazonUrl,
}));

export const adminStudents: AdminStudent[] = [
  {
    id: 'st_1001',
    fullName: 'María Hernández',
    email: 'maria.h@example.com',
    enrollments: 3,
    lastActiveAt: '2026-05-05T14:22:00Z',
    plan: 'annual',
  },
  {
    id: 'st_1002',
    fullName: 'José Ramírez',
    email: 'jose.r@example.com',
    enrollments: 1,
    lastActiveAt: '2026-05-04T09:10:00Z',
    plan: 'monthly',
  },
  {
    id: 'st_1003',
    fullName: 'Ana López',
    email: 'ana.lopez@example.com',
    enrollments: 5,
    lastActiveAt: '2026-05-06T18:40:00Z',
    plan: 'lifetime',
  },
  {
    id: 'st_1004',
    fullName: 'Carlos Mendoza',
    email: 'carlos.m@example.com',
    enrollments: 2,
    lastActiveAt: '2026-04-29T11:05:00Z',
    plan: 'free',
  },
  {
    id: 'st_1005',
    fullName: 'Laura Pérez',
    email: 'laura.p@example.com',
    enrollments: 4,
    lastActiveAt: '2026-05-03T20:18:00Z',
    plan: 'annual',
  },
  {
    id: 'st_1006',
    fullName: 'Diego Torres',
    email: 'diego.t@example.com',
    enrollments: 1,
    lastActiveAt: '2026-05-01T08:55:00Z',
    plan: 'monthly',
  },
];

export const adminLeads: AdminLead[] = [
  {
    id: 'ld_1',
    name: 'Patricia Gómez',
    email: 'patricia.g@example.com',
    phone: '+1 555 010 0001',
    status: 'new',
    topic: 'I-130',
    createdAt: '2026-05-06T10:00:00Z',
  },
  {
    id: 'ld_2',
    name: 'Roberto Salinas',
    email: 'roberto.s@example.com',
    status: 'new',
    topic: 'N-400',
    createdAt: '2026-05-05T19:32:00Z',
  },
  {
    id: 'ld_3',
    name: 'Yolanda Fuentes',
    email: 'yolanda.f@example.com',
    phone: '+1 555 010 0099',
    status: 'contacted',
    topic: 'Asilo',
    createdAt: '2026-05-03T14:11:00Z',
  },
  {
    id: 'ld_4',
    name: 'Andrés Ortiz',
    email: 'andres.o@example.com',
    status: 'qualified',
    topic: 'I-485',
    createdAt: '2026-05-02T09:08:00Z',
  },
  {
    id: 'ld_5',
    name: 'Beatriz Sánchez',
    email: 'beatriz.s@example.com',
    status: 'enrolled',
    topic: 'N-400',
    createdAt: '2026-04-28T15:42:00Z',
  },
  {
    id: 'ld_6',
    name: 'Tomás Vega',
    email: 'tomas.v@example.com',
    status: 'lost',
    topic: 'I-130',
    createdAt: '2026-04-22T11:00:00Z',
  },
];

export const adminRecentEnrollments: AdminEnrollment[] = [
  {
    studentName: 'Ana López',
    courseTitleEs: 'Petición Familiar I-130 paso a paso',
    courseTitleEn: 'I-130 Family Petition Step by Step',
    enrolledAt: '2026-05-06T13:11:00Z',
  },
  {
    studentName: 'Diego Torres',
    courseTitleEs: 'Naturalización N-400',
    courseTitleEn: 'Naturalization N-400',
    enrolledAt: '2026-05-05T08:42:00Z',
  },
  {
    studentName: 'María Hernández',
    courseTitleEs: 'Examen de civismo en español',
    courseTitleEn: 'Civics test in Spanish',
    enrolledAt: '2026-05-04T20:01:00Z',
  },
  {
    studentName: 'Laura Pérez',
    courseTitleEs: 'Asilo afirmativo',
    courseTitleEn: 'Affirmative Asylum',
    enrolledAt: '2026-05-04T11:25:00Z',
  },
];

export const adminIssuedCertificates: AdminCertificateRow[] = [
  {
    credentialId: 'MP-CIV-2026-04A8F2',
    studentName: 'Ana López',
    courseTitleEs: 'Examen de civismo en español',
    courseTitleEn: 'Civics test in Spanish',
    issuedAt: '2026-04-30T14:00:00Z',
  },
  {
    credentialId: 'MP-N400-2026-04C1D9',
    studentName: 'Beatriz Sánchez',
    courseTitleEs: 'Naturalización N-400',
    courseTitleEn: 'Naturalization N-400',
    issuedAt: '2026-04-22T10:18:00Z',
  },
  {
    credentialId: 'MP-I130-2026-04E0AA',
    studentName: 'Carlos Mendoza',
    courseTitleEs: 'Petición Familiar I-130 paso a paso',
    courseTitleEn: 'I-130 Family Petition Step by Step',
    issuedAt: '2026-04-12T09:50:00Z',
  },
];

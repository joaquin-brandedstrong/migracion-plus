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
};

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

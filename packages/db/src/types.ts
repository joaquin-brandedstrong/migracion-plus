/**
 * Database row types — keep in sync with migrations/0001_schema.sql.
 * Once the Supabase project is provisioned, regenerate this file with:
 *   supabase gen types typescript --project-id <ref> > src/types.gen.ts
 * and re-export the relevant types.
 */

export type Locale = 'es' | 'en';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProfileRole = 'student' | 'instructor' | 'admin';
export type PaymentProvider = 'stripe' | 'paypal';
export type BookFormat = 'physical' | 'digital' | 'both';
export type SubscriptionPlan = 'monthly' | 'annual' | 'lifetime';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'enrolled' | 'lost';
export type SmsTriggerType = 'manual' | 'enrollment' | 'completion' | 'abandonment' | 'renewal_reminder';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  preferred_locale: Locale;
  phone: string | null;
  phone_verified: boolean;
  role: ProfileRole;
  bio: string | null;
  marketing_opt_in: boolean;
  sms_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  icon: string | null;
  sort_order: number;
}

export interface Course {
  id: string;
  slug: string;
  slug_en: string | null;
  category_id: string | null;
  instructor_id: string | null;
  title_es: string;
  title_en: string;
  subtitle_es: string | null;
  subtitle_en: string | null;
  description_es: string | null;
  description_en: string | null;
  thumbnail_url: string | null;
  trailer_video_url: string | null;
  level: CourseLevel | null;
  duration_minutes: number | null;
  language: Locale[];
  price_cents: number;
  compare_at_price_cents: number | null;
  currency: string;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title_es: string;
  title_en: string;
  sort_order: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title_es: string;
  title_en: string;
  description_es: string | null;
  description_en: string | null;
  video_url: string | null;
  video_provider: 'mux' | 'cloudflare' | 'youtube' | 'vimeo' | null;
  video_duration_seconds: number | null;
  transcript_es: string | null;
  transcript_en: string | null;
  is_preview: boolean;
  sort_order: number;
  resources: Array<{ name: string; url: string; type: string }>;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  source: 'purchase' | 'subscription' | 'gift' | 'admin_grant' | null;
  enrolled_at: string;
  completed_at: string | null;
  certificate_issued_at: string | null;
}

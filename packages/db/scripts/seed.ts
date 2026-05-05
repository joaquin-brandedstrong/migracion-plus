/**
 * Seed script — populates a fresh Supabase project with demo data.
 * Run with: npm run db:seed
 *
 * Required env (load from .env at the repo root or .env.local):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   SEED_ADMIN_EMAIL=admin@migracionplus.com
 *   SEED_ADMIN_PASSWORD=<strong password>
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
  db: { schema: 'migracionplus' },
});

async function main() {
  console.log('→ Seeding categories…');
  const categories = [
    { slug: 'familia', name_es: 'Inmigración Familiar', name_en: 'Family Immigration', sort_order: 1 },
    { slug: 'ciudadania', name_es: 'Ciudadanía y Naturalización', name_en: 'Citizenship & Naturalization', sort_order: 2 },
    { slug: 'visas', name_es: 'Visas y Permisos de Trabajo', name_en: 'Visas & Work Permits', sort_order: 3 },
  ];
  await supabase.from('categories').upsert(categories, { onConflict: 'slug' });

  console.log('→ Creating admin user…');
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@migracionplus.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn('  Skipping admin creation (no SEED_ADMIN_PASSWORD set).');
  } else {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: 'Migración Plus Admin', preferred_locale: 'es' },
    });
    if (error && !error.message.includes('already registered')) throw error;
    if (created?.user) {
      await supabase.from('profiles').update({ role: 'admin' }).eq('id', created.user.id);
    }
  }

  console.log('→ Creating instructor user…');
  const instructorEmail = 'instructor@migracionplus.com';
  const instructorPassword = process.env.SEED_INSTRUCTOR_PASSWORD ?? 'changeme-instructor-' + Math.random().toString(36).slice(2);
  const { data: instructor, error: instErr } = await supabase.auth.admin.createUser({
    email: instructorEmail,
    password: instructorPassword,
    email_confirm: true,
    user_metadata: { full_name: 'Lic. Daniela Restrepo', preferred_locale: 'es' },
  });
  if (instErr && !instErr.message.includes('already registered')) throw instErr;
  if (instructor?.user) {
    await supabase.from('profiles').update({ role: 'instructor' }).eq('id', instructor.user.id);
  }

  console.log('→ Creating demo student user…');
  // These match the defaults in apps/web/src/components/auth/sign-in-form.tsx so
  // the "Use demo credentials" button works out of the box. Override via env.
  const demoEmail = process.env.SEED_DEMO_EMAIL ?? 'demo@migracionplus.academy';
  const demoPassword = process.env.SEED_DEMO_PASSWORD ?? 'Demo2026!';
  const { data: demo, error: demoErr } = await supabase.auth.admin.createUser({
    email: demoEmail,
    password: demoPassword,
    email_confirm: true,
    user_metadata: { full_name: 'Demo Student', preferred_locale: 'es' },
  });
  if (demoErr && !demoErr.message.includes('already registered')) throw demoErr;
  console.log(`  demo: ${demoEmail}  /  ${demoPassword}`);

  console.log('  Seeding courses, modules, lessons, books, leads is left as a follow-up.');
  console.log('  See packages/db/scripts/seed.full.ts (TODO).');
  console.log('✔ Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

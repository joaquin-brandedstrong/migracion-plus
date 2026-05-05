/**
 * Create the demo student account that the "Use demo credentials" button
 * fills on /iniciar-sesion. Uses the Auth admin API only — does not require
 * the migracionplus schema to be exposed via PostgREST. The schema-level
 * trigger `on_auth_user_created_migracionplus` automatically populates the
 * profile row on insert into auth.users.
 *
 * Run with: npx tsx packages/db/scripts/seed-demo-user.ts
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const email = process.env.SEED_DEMO_EMAIL ?? process.env.NEXT_PUBLIC_DEMO_EMAIL ?? 'demo@migracionplus.academy';
const password =
  process.env.SEED_DEMO_PASSWORD ?? process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'Demo2026!';

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { full_name: 'Demo Student', preferred_locale: 'es' },
});

if (error) {
  if (error.message.includes('already registered') || error.message.includes('already been registered')) {
    console.log(`✓ User ${email} already exists — leaving as is.`);
    process.exit(0);
  }
  console.error('Failed:', error.message);
  process.exit(1);
}

console.log(`✓ Demo user created: ${email}`);
console.log(`  password: ${password}`);
console.log(`  id:       ${data.user?.id}`);
console.log('');
console.log('The on_auth_user_created_migracionplus trigger should have populated');
console.log('migracionplus.profiles automatically. Verify in the SQL editor:');
console.log(`  select id, full_name, role from migracionplus.profiles where id = '${data.user?.id}';`);

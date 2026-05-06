/**
 * Create the two demo accounts that the buttons on /iniciar-sesion sign into:
 *
 *   - demo.student@migracionplus.academy   (role: student)
 *   - demo.admin@migracionplus.academy     (role: admin)
 *
 * Uses the Auth admin API to create the auth.users row; the schema-level
 * trigger `on_auth_user_created_migracionplus` populates migracionplus.profiles
 * with role='student' by default. After creation we promote the admin account
 * via the service-role client (bypasses RLS).
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

const auth = createClient(url, serviceKey, { auth: { persistSession: false } });
const dbAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
  db: { schema: 'migracionplus' },
});

const password =
  process.env.SEED_DEMO_PASSWORD ?? process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'Demo2026!';

const studentEmail =
  process.env.SEED_DEMO_STUDENT_EMAIL ??
  process.env.NEXT_PUBLIC_DEMO_STUDENT_EMAIL ??
  'demo.student@migracionplus.academy';
const adminEmail =
  process.env.SEED_DEMO_ADMIN_EMAIL ??
  process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ??
  'demo.admin@migracionplus.academy';

interface SeedAccount {
  email: string;
  fullName: string;
  role: 'student' | 'admin';
}

const accounts: SeedAccount[] = [
  { email: studentEmail, fullName: 'Demo Student', role: 'student' },
  { email: adminEmail, fullName: 'Demo Admin', role: 'admin' },
];

async function ensureUser(account: SeedAccount): Promise<string | null> {
  const { data, error } = await auth.auth.admin.createUser({
    email: account.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: account.fullName, preferred_locale: 'es' },
  });

  if (!error) {
    console.log(`✓ Created ${account.email} (id: ${data.user?.id})`);
    return data.user?.id ?? null;
  }

  if (
    error.message.includes('already registered') ||
    error.message.includes('already been registered')
  ) {
    console.log(`· ${account.email} already exists — looking up id`);
    const { data: list, error: listErr } = await auth.auth.admin.listUsers();
    if (listErr) {
      console.error(`  failed to list users:`, listErr.message);
      return null;
    }
    const existing = list.users.find((u) => u.email === account.email);
    return existing?.id ?? null;
  }

  console.error(`✗ ${account.email} failed:`, error.message);
  return null;
}

async function ensureRole(userId: string, role: 'student' | 'admin'): Promise<void> {
  const { error } = await dbAdmin.from('profiles').update({ role }).eq('id', userId);
  if (error) throw error;
}

for (const account of accounts) {
  const id = await ensureUser(account);
  if (!id) continue;
  try {
    await ensureRole(id, account.role);
    console.log(`  → role set to ${account.role}`);
  } catch (err) {
    console.error(`  ✗ could not set role for ${account.email}:`, (err as Error).message);
  }
}

console.log('');
console.log('Done. Sign in via the two demo buttons on /iniciar-sesion.');
console.log(`  password: ${password}`);

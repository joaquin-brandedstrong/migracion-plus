import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SCHEMA = 'migracionplus';

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Supabase env not set.');
  }

  return createServerClient(url, anonKey, {
    db: { schema: SCHEMA },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components can't set cookies; this is a no-op there.
        }
      },
    },
  });
}

/**
 * Service-role client for use in webhooks, cron jobs, and seed scripts only.
 * Bypasses RLS — never expose to the browser.
 */
export async function getSupabaseServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not set. Required for server-side admin operations.');
  }
  // Use dynamic import to avoid bundling @supabase/supabase-js in client builds.
  // This function is only used in server contexts (webhooks, cron, seed scripts).
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, serviceKey, {
    db: { schema: SCHEMA },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

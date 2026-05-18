import { cookies } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { ProfileRole } from '@migracionplus/db/types';
import { DEMO_ROLE_COOKIE, isDemoRole } from './demo-session';

export { isAdminRole } from './role';

export interface DashboardViewer {
  role: ProfileRole;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
}

const DEMO_VIEWER: DashboardViewer = {
  role: 'student',
  fullName: 'Demo Student',
  email: 'demo@migracionplus.academy',
  avatarUrl: null,
};

const DEMO_ADMIN_VIEWER: DashboardViewer = {
  role: 'admin',
  fullName: 'Demo Admin',
  email: 'demo.admin@migracionplus.academy',
  avatarUrl: null,
};

/**
 * Load the authenticated viewer's profile + role from `migracionplus.profiles`.
 *
 * Order of precedence:
 *  1. Demo cookie (set by the one-click demo buttons) — pure mock data, no
 *     Supabase call. This is the path used while there's no DB wired.
 *  2. Real Supabase session → profile row.
 *  3. Demo student fallback when there's no session or Supabase env/DB.
 */
export async function getDashboardViewer(): Promise<DashboardViewer> {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get(DEMO_ROLE_COOKIE)?.value;
  if (isDemoRole(demoRole)) {
    return demoRole === 'admin' ? DEMO_ADMIN_VIEWER : DEMO_VIEWER;
  }

  try {
    const supabase = await getSupabaseServerClient();
    const { data: userResult } = await supabase.auth.getUser();
    if (!userResult.user) return DEMO_VIEWER;
    const { data: row } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, role')
      .eq('id', userResult.user.id)
      .maybeSingle();
    return {
      role: (row?.role as ProfileRole | undefined) ?? 'student',
      fullName: row?.full_name ?? userResult.user.email?.split('@')[0] ?? 'Estudiante',
      email: userResult.user.email ?? null,
      avatarUrl: row?.avatar_url ?? null,
    };
  } catch {
    return DEMO_VIEWER;
  }
}


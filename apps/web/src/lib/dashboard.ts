import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { ProfileRole } from '@migracionplus/db/types';

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

/**
 * Load the authenticated viewer's profile + role from `migracionplus.profiles`.
 * Falls back to a demo student viewer when there's no session or Supabase env
 * isn't configured — keeps the dashboard renderable in local dev.
 */
export async function getDashboardViewer(): Promise<DashboardViewer> {
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


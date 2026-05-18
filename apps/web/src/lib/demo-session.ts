/**
 * Demo-mode escape hatch — used while there is no Supabase database wired.
 *
 * The one-click "Student" / "Admin" buttons on `/iniciar-sesion` set this
 * cookie instead of authenticating against Supabase. The auth-gate middleware
 * treats its presence as a valid session for protected routes, and
 * `getDashboardViewer()` derives the viewer (name + role) from its value so
 * the whole dashboard runs on mock data.
 *
 * This is intentionally side-by-side with the real Supabase auth path: a
 * genuine `sb-*-auth-token` session still takes precedence everywhere it
 * matters, so nothing here needs to be removed once the DB is live.
 *
 * Keep this module free of server-only / Supabase imports — it is imported by
 * the edge middleware and by client components.
 */
export const DEMO_ROLE_COOKIE = 'mp_demo_role';

export type DemoRole = 'student' | 'admin';

export function isDemoRole(value: string | undefined | null): value is DemoRole {
  return value === 'student' || value === 'admin';
}

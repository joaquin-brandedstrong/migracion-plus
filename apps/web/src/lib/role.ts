import type { ProfileRole } from '@migracionplus/db/types';

/**
 * Pure role helper. Lives in its own module (no server-only imports) so
 * client components can use it without dragging `next/headers` into the
 * client bundle.
 */
export function isAdminRole(role: ProfileRole): boolean {
  return role === 'admin' || role === 'instructor';
}

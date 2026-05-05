import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/dashboard/shell';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Best-effort load profile. Middleware already gates the route by cookie
  // presence, so if we land here without a real session we render with a
  // synthetic demo profile rather than crashing the whole branch — this keeps
  // the dashboard usable in local dev without going through OAuth.
  let profile: { full_name: string; avatar_url: string | null; email: string | null } = {
    full_name: 'Demo Student',
    avatar_url: null,
    email: 'demo@migracionplus.academy',
  };

  try {
    const supabase = await getSupabaseServerClient();
    const { data: userResult } = await supabase.auth.getUser();
    if (userResult.user) {
      const { data: row } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userResult.user.id)
        .maybeSingle();
      profile = {
        full_name: row?.full_name ?? userResult.user.email?.split('@')[0] ?? 'Estudiante',
        avatar_url: row?.avatar_url ?? null,
        email: userResult.user.email ?? null,
      };
    }
  } catch {
    // Supabase env not configured or query failed — keep the demo profile.
  }

  return (
    <DashboardShell locale={locale} profile={profile}>
      {children}
    </DashboardShell>
  );
}

import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/dashboard/shell';
import { getDashboardViewer } from '@/lib/dashboard';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const viewer = await getDashboardViewer();

  return (
    <DashboardShell
      locale={locale}
      profile={{ full_name: viewer.fullName, avatar_url: viewer.avatarUrl, email: viewer.email }}
      role={viewer.role}
    >
      {children}
    </DashboardShell>
  );
}

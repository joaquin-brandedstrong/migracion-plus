import { setRequestLocale } from 'next-intl/server';
import { GradientMesh } from '@migracionplus/ui';
import type { ReactNode } from 'react';

export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="relative isolate flex min-h-[calc(100dvh-5rem)] items-center justify-center px-4 py-16">
      <GradientMesh intensity="soft" className="-z-10" />
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

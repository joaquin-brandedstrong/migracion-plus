import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

export default async function LegalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="container py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <article className="prose prose-lg dark:prose-invert">{children}</article>
      </div>
    </div>
  );
}

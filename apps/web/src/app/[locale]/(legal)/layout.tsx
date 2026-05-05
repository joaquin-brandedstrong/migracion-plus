import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Badge } from '@migracionplus/ui';
import { AlertTriangle } from 'lucide-react';

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
        <Badge variant="accent" className="mb-6">
          <AlertTriangle className="h-3.5 w-3.5" />
          {locale === 'es' ? 'Pendiente de revisión legal del cliente' : 'Pending client legal review'}
        </Badge>
        <article className="prose prose-lg dark:prose-invert">{children}</article>
      </div>
    </div>
  );
}

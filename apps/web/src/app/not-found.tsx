import Link from 'next/link';
import { Button } from '@migracionplus/ui';

export default function NotFound() {
  return (
    <html lang="es">
      <body className="flex min-h-dvh items-center justify-center bg-ink-50 p-6 text-center font-sans text-ink-900">
        <div>
          <p className="font-display text-9xl font-bold text-brand-700">404</p>
          <h1 className="mt-4 font-display text-3xl font-semibold">Página no encontrada</h1>
          <p className="mt-2 text-ink-600">La página que buscas no existe o fue movida.</p>
          <Button asChild className="mt-8">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </body>
    </html>
  );
}

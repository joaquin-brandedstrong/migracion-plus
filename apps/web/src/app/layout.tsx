import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://migracionplus.academy'),
  title: {
    default: 'Migración Plus Academy',
    template: '%s · Migración Plus Academy',
  },
  description:
    'Plataforma educativa bilingüe para aprender a llenar formularios migratorios con confianza. Cursos, libros y asistente IA 24/7.',
  applicationName: 'Migración Plus Academy',
  formatDetection: { telephone: false, address: false, email: false },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Migración Plus Academy',
    images: ['/brand/og-image.png'],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}

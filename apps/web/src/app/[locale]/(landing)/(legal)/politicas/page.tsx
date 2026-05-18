import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  return { title: t('policies') };
}

type PolicyLink = { href: string; title: string; summary: string };

export default async function PoliciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEs = locale === 'es';

  const links: PolicyLink[] = isEs
    ? [
        {
          href: 'terminos',
          title: 'Términos y condiciones',
          summary: 'El acuerdo que rige el uso del sitio, las licencias de curso y los pagos.',
        },
        {
          href: 'privacidad',
          title: 'Política de privacidad',
          summary:
            'Qué datos recopilamos, cómo los usamos y tus derechos bajo la CCPA / CPRA de California.',
        },
        {
          href: 'reembolsos',
          title: 'Política de reembolso',
          summary: 'Todas las ventas son finales; excepciones discrecionales y disputas de pago.',
        },
        {
          href: 'uso-de-contenido',
          title: 'Uso de contenido y antipiratería',
          summary:
            'Licencia personal, prohibición de redistribución y aplicación de derechos de autor.',
        },
        {
          href: 'aviso-legal',
          title: 'Aviso legal y descargo de responsabilidad',
          summary:
            'Contenido educativo, no asesoría legal. Limitación de responsabilidad y afiliados.',
        },
      ]
    : [
        {
          href: 'terminos',
          title: 'Terms and conditions',
          summary: 'The agreement governing site use, course licenses, and payments.',
        },
        {
          href: 'privacidad',
          title: 'Privacy policy',
          summary:
            'What data we collect, how we use it, and your rights under California CCPA / CPRA.',
        },
        {
          href: 'reembolsos',
          title: 'Refund policy',
          summary: 'All sales are final; discretionary exceptions and payment disputes.',
        },
        {
          href: 'uso-de-contenido',
          title: 'Content use & anti-piracy',
          summary: 'Personal license, no-redistribution, and copyright enforcement.',
        },
        {
          href: 'aviso-legal',
          title: 'Legal notice & disclaimer',
          summary: 'Educational content, not legal advice. Limitation of liability and affiliates.',
        },
      ];

  return (
    <>
      <h1>{isEs ? 'Políticas' : 'Policies'}</h1>
      <p>
        {isEs
          ? 'Todas las políticas que rigen el uso de Migración Plus Academy. Léelas antes de comprar o usar el contenido.'
          : 'All policies governing the use of Migración Plus Academy. Please read them before purchasing or using the content.'}
      </p>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={`/${locale}/${link.href}`}>{link.title}</Link> — {link.summary}
          </li>
        ))}
      </ul>
    </>
  );
}

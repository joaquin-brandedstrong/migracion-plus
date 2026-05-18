import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge, GlassCard } from '@migracionplus/ui';
import { ShieldAlert } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title') };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });
  const isEs = locale === 'es';

  return (
    <div className="container py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <Badge variant="muted">{t('title')}</Badge>
        <h1 className="mt-3 font-display text-display-lg font-semibold text-fg">
          {isEs ? 'Educación migratoria con propósito' : 'Migration education with purpose'}
        </h1>

        <div className="prose prose-lg dark:prose-invert mt-8">
          <p>
            {isEs
              ? 'Migración Plus tiene un enfoque educativo e institucional más que legal: existe para brindar información clara, accesible y confiable a las personas inmigrantes, con un tono cercano, práctico y fácil de entender.'
              : 'Migración Plus takes an educational and institutional approach rather than a legal one: it exists to give immigrants clear, accessible, and reliable information, in a warm, practical, and easy-to-understand tone.'}
          </p>

          <h2>{t('mission')}</h2>
          <p>
            {isEs
              ? 'Proveer una plataforma confiable y de gran alcance donde los inmigrantes encuentren información clara, organizada y útil. Queremos que cualquier persona pueda navegar sus procesos migratorios sin confusión, reduciendo la desinformación.'
              : 'Provide a reliable, far-reaching platform where immigrants find clear, organized, and useful information. We want anyone to navigate their immigration processes without confusion, reducing misinformation.'}
          </p>

          <h2>{t('vision')}</h2>
          <ul>
            <li>
              {isEs
                ? 'Información centralizada en un solo lugar.'
                : 'Centralized information in one place.'}
            </li>
            <li>
              {isEs
                ? 'Contenido basado en experiencia real.'
                : 'Content based on real experience.'}
            </li>
            <li>
              {isEs
                ? 'Enfoque práctico y fácil de consumir.'
                : 'A practical, easy-to-consume approach.'}
            </li>
            <li>
              {isEs
                ? 'Orientación para quienes no entienden el sistema legal.'
                : 'Guidance for those who don’t understand the legal system.'}
            </li>
          </ul>

          <h2>{t('history')}</h2>
          <p>
            {isEs
              ? 'Migración Plus nace de la experiencia directa en procesos migratorios en Estados Unidos: conocimiento práctico construido trabajando con clientes reales. Su fundadora continúa formándose en el ámbito legal —actualmente estudia para ser admitida al colegio de abogados (Admitted to the Bar)— manteniendo siempre un enfoque educativo, no de asesoría legal.'
              : 'Migración Plus is built on direct experience with U.S. immigration processes: practical knowledge gained working with real clients. Its founder continues her legal training —currently studying to be Admitted to the Bar— while always keeping an educational focus, not legal advice.'}
          </p>
        </div>

        <GlassCard className="mt-12 border-l-4 border-accent-500 p-8">
          <div className="flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 shrink-0 text-accent-600" />
            <div>
              <h3 className="font-display text-lg font-semibold text-fg">
                {isEs ? 'Aviso legal importante' : 'Important legal notice'}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{t('disclaimer')}</p>
            </div>
          </div>
        </GlassCard>

        <h2 className="mt-16 font-display text-display-md font-semibold text-fg">{t('team')}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {[
            { name: 'Lic. Daniela Restrepo', role: isEs ? 'Directora académica' : 'Academic director' },
            { name: 'Lic. Mauricio Pinilla', role: isEs ? 'Instructor senior' : 'Senior instructor' },
          ].map((m) => (
            <GlassCard key={m.name} hoverable className="p-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-300 to-brand-500" aria-hidden />
              <h3 className="mt-4 font-display text-lg font-semibold text-fg">{m.name}</h3>
              <p className="text-sm text-fg-muted">{m.role}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

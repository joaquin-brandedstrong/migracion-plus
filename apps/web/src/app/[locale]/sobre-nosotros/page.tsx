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
          <h2>{t('mission')}</h2>
          <p>
            {isEs
              ? 'Hacer que la información sobre los procesos migratorios sea clara, accesible y disponible en el idioma de cada familia. Creemos que entender el sistema es el primer paso para navegarlo con confianza.'
              : 'Make information about immigration processes clear, accessible, and available in the language of each family. We believe that understanding the system is the first step to navigating it with confidence.'}
          </p>

          <h2>{t('vision')}</h2>
          <p>
            {isEs
              ? 'Ser la primera plataforma educativa en español que combina cursos prácticos, libros de referencia y un asistente IA disponible 24/7 para acompañar a quien lo necesite.'
              : 'Be the first Spanish-language educational platform that combines practical courses, reference books, and a 24/7 AI assistant for anyone who needs it.'}
          </p>

          <h2>{t('history')}</h2>
          <p>
            {isEs
              ? 'Migración Plus comenzó como un consultorio de ayuda con formularios. Después de 15 años atendiendo a miles de familias, decidimos llevar todo ese conocimiento a una academia digital donde cualquiera puede aprender a su ritmo.'
              : 'Migración Plus started as a forms-help office. After 15 years serving thousands of families, we decided to bring all that knowledge to a digital academy where anyone can learn at their own pace.'}
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

import { setRequestLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button, GlassCard } from '@migracionplus/ui';
import { Award, BookOpen } from 'lucide-react';
import { demoCertificates } from '@/data/dashboard-seed';
import { adminIssuedCertificates } from '@/data/admin-seed';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getDashboardViewer, isAdminRole } from '@/lib/dashboard';
import { CertificateActions } from '@/components/dashboard/download-actions';

export default async function DashboardCertificados({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as 'es' | 'en';

  const viewer = await getDashboardViewer();
  if (isAdminRole(viewer.role)) {
    return <AdminCertificates locale={locale} lang={lang} />;
  }
  return (
    <StudentCertificates locale={locale} lang={lang} studentName={viewer.fullName} />
  );
}

async function StudentCertificates({
  locale,
  lang,
  studentName,
}: {
  locale: string;
  lang: 'es' | 'en';
  studentName: string;
}) {
  const t = await getTranslations({ locale, namespace: 'dashboard.certificates' });

  let certificates = demoCertificates;
  try {
    const supabase = await getSupabaseServerClient();
    const { data: userResult } = await supabase.auth.getUser();
    if (userResult.user) {
      const { data } = await supabase
        .from('certificates')
        .select('*, course:courses(*)')
        .eq('user_id', userResult.user.id)
        .order('issued_at', { ascending: false });
      if (data && data.length > 0) {
        certificates = data as unknown as typeof demoCertificates;
      }
    }
  } catch {
    // Keep demo data
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
      </header>

      {certificates.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {certificates.map((cert) => (
            <GlassCard key={cert.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-100 to-accent-200 text-accent-800 dark:from-accent-900/40 dark:to-accent-800/40 dark:text-accent-200">
                  <Award className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-fg">
                    {cert.course.title[lang]}
                  </h3>
                  <p className="mt-1 text-sm text-fg-muted">
                    {t('issuedOn', {
                      date: new Date(cert.issuedAt).toLocaleDateString(lang),
                    })}
                  </p>
                  <p className="mt-1 text-xs font-mono text-fg-muted">
                    ID: {cert.credentialId}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <CertificateActions
                  studentName={studentName}
                  courseTitle={cert.course.title[lang]}
                  credentialId={cert.credentialId}
                  issuedDate={t('issuedOn', {
                    date: new Date(cert.issuedAt).toLocaleDateString(lang),
                  })}
                  certTitle={
                    lang === 'es'
                      ? 'Certificado de finalización'
                      : 'Certificate of completion'
                  }
                  downloadLabel={t('download')}
                  shareLabel={t('share')}
                  copiedLabel={lang === 'es' ? 'Copiado' : 'Copied'}
                />
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/dashboard/cursos`}>{t('viewCourse')}</Link>
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-10 text-center">
          <Award className="mx-auto h-10 w-10 text-fg-muted" />
          <p className="mt-4 font-display text-xl font-semibold text-fg">
            {t('emptyTitle')}
          </p>
          <p className="mt-1 text-sm text-fg-muted">{t('emptySubtitle')}</p>
          <Button asChild className="mt-6">
            <Link href={`/${locale}/cursos`}>
              <BookOpen className="h-4 w-4" />
              {t('browseCourses')}
            </Link>
          </Button>
        </GlassCard>
      )}
    </div>
  );
}

async function AdminCertificates({ locale, lang }: { locale: string; lang: 'es' | 'en' }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.admin.certificates' });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
      </header>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-elevated)] text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">
              <tr>
                <th className="px-5 py-3">{t('th.credential')}</th>
                <th className="px-5 py-3">{t('th.student')}</th>
                <th className="px-5 py-3">{t('th.course')}</th>
                <th className="px-5 py-3">{t('th.issued')}</th>
                <th className="px-5 py-3 text-right">{t('th.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {adminIssuedCertificates.map((c) => (
                <tr key={c.credentialId}>
                  <td className="px-5 py-3 font-mono text-xs text-fg">{c.credentialId}</td>
                  <td className="px-5 py-3 font-medium text-fg">{c.studentName}</td>
                  <td className="px-5 py-3 text-fg-muted">
                    {lang === 'es' ? c.courseTitleEs : c.courseTitleEn}
                  </td>
                  <td className="px-5 py-3 text-fg-muted">
                    {new Date(c.issuedAt).toLocaleDateString(lang)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400">
                      {t('revoke')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

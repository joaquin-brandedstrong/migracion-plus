import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge, Button, GlassCard } from '@migracionplus/ui';
import {
  Bell,
  Bot,
  CreditCard,
  FileText,
  Globe,
  Lock,
  MessageSquare,
  Palette,
  Shield,
  User,
} from 'lucide-react';
import { getDashboardViewer, isAdminRole } from '@/lib/dashboard';

export default async function DashboardConfiguracion({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as 'es' | 'en';

  const viewer = await getDashboardViewer();
  if (isAdminRole(viewer.role)) {
    return <AdminSettings locale={locale} lang={lang} />;
  }
  return <StudentSettings locale={locale} lang={lang} />;
}

async function StudentSettings({ locale, lang }: { locale: string; lang: 'es' | 'en' }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.settings' });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
      </header>

      <GlassCard className="border-amber-300/50 bg-amber-50/50 p-5 dark:border-amber-500/30 dark:bg-amber-900/10">
        <p className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
          <Shield className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {lang === 'es'
              ? 'Esta sección está en desarrollo. La estructura de campos es definitiva, pero los formularios aún no guardan cambios.'
              : 'This section is under construction. The field layout is final but forms do not save changes yet.'}
          </span>
        </p>
      </GlassCard>

      <section className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            <User className="h-4 w-4" />
            {t('tabs.profile')}
          </div>
          <div className="space-y-4">
            <Field label={t('profile.fullName')} placeholder="María Pérez" />
            <Field label={t('profile.phone')} placeholder="+1 555 555 5555" />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">{t('profile.bio')}</label>
              <textarea
                disabled
                rows={3}
                placeholder={lang === 'es' ? 'Cuéntanos sobre ti…' : 'Tell us about you…'}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <Button disabled size="sm">
              {t('profile.save')}
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            <Lock className="h-4 w-4" />
            {t('tabs.account')}
          </div>
          <div className="space-y-4">
            <Field label={t('account.email')} placeholder="demo@migracionplus.academy" />
            <Button disabled size="sm" variant="outline">
              {t('account.changePassword')}
            </Button>
            <div className="border-t border-[var(--border)] pt-4">
              <p className="text-xs text-fg-muted">{t('account.deleteWarning')}</p>
              <Button disabled size="sm" variant="ghost" className="mt-2 text-red-600 dark:text-red-400">
                {t('account.deleteAccount')}
              </Button>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            <Bell className="h-4 w-4" />
            {t('tabs.notifications')}
          </div>
          <div className="space-y-4">
            <Toggle label={t('notifications.emailUpdates')} body={t('notifications.emailUpdatesBody')} />
            <Toggle label={t('notifications.smsReminders')} body={t('notifications.smsRemindersBody')} />
            <Toggle label={t('notifications.courseProgress')} body={t('notifications.courseProgressBody')} />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            <Globe className="h-4 w-4" />
            {t('tabs.language')} · {t('tabs.privacy')}
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-fg">
                {t('language.preferred')}
              </label>
              <select
                disabled
                defaultValue={lang}
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
              <p className="mt-1 text-xs text-fg-muted">{t('language.preferredBody')}</p>
            </div>
            <Toggle label={t('privacy.publicProfile')} body={t('privacy.publicProfileBody')} />
            <Toggle label={t('privacy.marketingOptIn')} body={t('privacy.marketingOptInBody')} />
          </div>
        </GlassCard>
      </section>

      <GlassCard className="p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
          <Badge variant="muted">{t('tabs.billing')}</Badge>
        </div>
        <p className="text-sm text-fg-muted">{t('billing.noHistory')}</p>
      </GlassCard>
    </div>
  );
}

async function AdminSettings({ locale, lang }: { locale: string; lang: 'es' | 'en' }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.admin.settings' });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-fg lg:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-1 text-fg-muted">{t('subtitle')}</p>
      </header>

      <GlassCard className="border-amber-300/50 bg-amber-50/50 p-5 dark:border-amber-500/30 dark:bg-amber-900/10">
        <p className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
          <Shield className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {lang === 'es'
              ? 'Configuración de la plataforma. Los formularios se conectarán a la base de datos en una próxima iteración.'
              : 'Platform configuration. Forms will connect to the database in a future iteration.'}
          </span>
        </p>
      </GlassCard>

      <section className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            <CreditCard className="h-4 w-4" />
            {t('groups.store')}
          </div>
          <div className="space-y-4">
            <Field
              label={lang === 'es' ? 'Stripe — clave pública' : 'Stripe — publishable key'}
              placeholder="pk_live_…"
            />
            <Field
              label={lang === 'es' ? 'Stripe — webhook secret' : 'Stripe — webhook secret'}
              placeholder="whsec_…"
            />
            <Field
              label={lang === 'es' ? 'PayPal — Client ID' : 'PayPal — Client ID'}
              placeholder="A21AAxxxx"
            />
            <Toggle
              label={lang === 'es' ? 'Habilitar suscripciones' : 'Enable subscriptions'}
              body={
                lang === 'es'
                  ? 'Permite suscripción mensual / anual / lifetime.'
                  : 'Allow monthly / annual / lifetime subscriptions.'
              }
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            <Bot className="h-4 w-4" />
            {t('groups.ai')}
          </div>
          <div className="space-y-4">
            <Field
              label={lang === 'es' ? 'OpenAI — API key' : 'OpenAI — API key'}
              placeholder="sk-…"
            />
            <Field
              label={lang === 'es' ? 'Modelo predeterminado' : 'Default model'}
              placeholder="gpt-4o-mini"
            />
            <Toggle
              label={lang === 'es' ? 'Habilitar asistente para estudiantes' : 'Enable assistant for students'}
              body={
                lang === 'es'
                  ? 'Activa "Plus" en el panel del estudiante.'
                  : 'Turn on "Plus" inside the student dashboard.'
              }
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            <MessageSquare className="h-4 w-4" />
            {t('groups.sms')}
          </div>
          <div className="space-y-4">
            <Field
              label={lang === 'es' ? 'Twilio — Account SID' : 'Twilio — Account SID'}
              placeholder="ACxxxx"
            />
            <Field
              label={lang === 'es' ? 'Twilio — Auth token' : 'Twilio — Auth token'}
              placeholder="••••••••"
            />
            <Field
              label={lang === 'es' ? 'Número remitente' : 'Sender number'}
              placeholder="+1 555 …"
            />
            <Toggle
              label={lang === 'es' ? 'Recordatorios automáticos' : 'Automated reminders'}
              body={
                lang === 'es'
                  ? 'Envía SMS de inscripción, renovación y reactivación.'
                  : 'Send enrollment, renewal and re-engagement SMS.'
              }
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            <Palette className="h-4 w-4" />
            {t('groups.branding')}
          </div>
          <div className="space-y-4">
            <Field
              label={lang === 'es' ? 'Nombre comercial' : 'Brand name'}
              placeholder="Migración Plus"
            />
            <Field
              label={lang === 'es' ? 'Color primario' : 'Primary color'}
              placeholder="#0F2A4A"
            />
            <Toggle
              label={lang === 'es' ? 'Mostrar logo en certificados' : 'Show logo on certificates'}
              body={
                lang === 'es'
                  ? 'Imprime el logo en los PDFs emitidos.'
                  : 'Print the logo on issued PDFs.'
              }
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-fg-muted">
            <FileText className="h-4 w-4" />
            {t('groups.legal')}
          </div>
          <p className="text-sm text-fg-muted">
            {lang === 'es'
              ? 'Los textos legales (términos, privacidad, políticas, aviso) viven en /terminos, /privacidad, /politicas y /aviso-legal. Edítalos en el repo hasta que el cliente entregue su revisión.'
              : 'Legal copy (terms, privacy, policies, notice) lives at /terminos, /privacidad, /politicas and /aviso-legal. Edit in the repo until the client delivers their review.'}
          </p>
        </GlassCard>
      </section>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-fg">{label}</label>
      <input
        type="text"
        disabled
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

function Toggle({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-fg">{label}</p>
        <p className="mt-0.5 text-xs text-fg-muted">{body}</p>
      </div>
      <button
        type="button"
        disabled
        aria-checked="false"
        role="switch"
        className="relative mt-1 inline-flex h-6 w-11 shrink-0 cursor-not-allowed items-center rounded-full bg-ink-200 opacity-70 transition-colors dark:bg-ink-700"
      >
        <span className="inline-block h-5 w-5 translate-x-0.5 transform rounded-full bg-white shadow transition-transform" />
      </button>
    </div>
  );
}

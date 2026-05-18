'use client';

import { Badge, Button, GlassCard, Input, Label } from '@migracionplus/ui';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { DEMO_ROLE_COOKIE } from '@/lib/demo-session';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const t = useTranslations('auth.signIn');
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [demoLoading, setDemoLoading] = useState<'student' | 'admin' | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      router.push(`/${locale}/dashboard`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  };

  // Demo sign-in runs entirely on mock data — no Supabase, no DB required.
  // It sets a cookie the auth-gate middleware and getDashboardViewer() both
  // honor, then routes into the dashboard. A real sb-* session still takes
  // precedence once the database is wired.
  const signInDemo = (kind: 'student' | 'admin') => {
    if (demoLoading) return;
    setError(null);
    setDemoLoading(kind);
    document.cookie = `${DEMO_ROLE_COOKIE}=${kind}; path=/; max-age=86400; samesite=lax`;
    router.push(`/${locale}/dashboard`);
  };

  return (
    <GlassCard intensity="strong" className="p-8">
      <h1 className="font-display text-3xl font-semibold text-fg">{t('title')}</h1>
      <p className="mt-2 text-sm text-fg-muted">{t('subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} invalid={!!errors.email} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('password')}</Label>
            <Link href={`/${locale}/recuperar`} className="text-xs text-brand-700 hover:underline dark:text-brand-400">
              {t('forgot')}
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...register('password')} invalid={!!errors.password} />
        </div>

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? '…' : t('submit')}
        </Button>
      </form>

      {/* Demo sign-in — one-click into pre-seeded student or admin accounts.
          Run `npx tsx packages/db/scripts/seed-demo-user.ts` to create them. */}
      <div className="mt-4">
        <p className="mb-2 flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
          <span>{locale === 'es' ? 'Acceso de demostración' : 'Demo access'}</span>
          <Badge variant="accent" className="text-[10px] uppercase">
            Demo
          </Badge>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => signInDemo('student')}
            disabled={!!demoLoading || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-dashed border-accent-400 bg-accent-50/60 px-3 py-2.5 text-sm font-medium text-accent-800 transition-colors hover:bg-accent-100 disabled:cursor-wait disabled:opacity-60 dark:border-accent-500/60 dark:bg-accent-900/20 dark:text-accent-300 dark:hover:bg-accent-900/40"
            aria-label={locale === 'es' ? 'Iniciar sesión como estudiante de demo' : 'Sign in as demo student'}
          >
            <GraduationCap className="h-4 w-4" />
            {demoLoading === 'student'
              ? '…'
              : locale === 'es'
                ? 'Estudiante'
                : 'Student'}
          </button>
          <button
            type="button"
            onClick={() => signInDemo('admin')}
            disabled={!!demoLoading || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-dashed border-brand-500 bg-brand-50/60 px-3 py-2.5 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-100 disabled:cursor-wait disabled:opacity-60 dark:border-brand-400/60 dark:bg-brand-900/20 dark:text-brand-200 dark:hover:bg-brand-900/40"
            aria-label={locale === 'es' ? 'Iniciar sesión como administrador de demo' : 'Sign in as demo admin'}
          >
            <ShieldCheck className="h-4 w-4" />
            {demoLoading === 'admin'
              ? '…'
              : locale === 'es'
                ? 'Administrador'
                : 'Admin'}
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-fg-muted">
        {t('noAccount')}{' '}
        <Link href={`/${locale}/registro`} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
          {t('createOne')}
        </Link>
      </p>
    </GlassCard>
  );
}

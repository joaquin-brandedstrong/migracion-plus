'use client';

import { Badge, Button, GlassCard, Input, Label } from '@migracionplus/ui';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? 'demo@migracionplus.academy';
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'Demo2026!';

export function SignInForm() {
  const t = useTranslations('auth.signIn');
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
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

  const onGoogle = async () => {
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/${locale}/dashboard` },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  };

  const fillDemo = () => {
    setValue('email', DEMO_EMAIL, { shouldValidate: true, shouldDirty: true });
    setValue('password', DEMO_PASSWORD, { shouldValidate: true, shouldDirty: true });
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

      {/* Demo autofill — fills the form with seeded demo credentials so reviewers
          can sign in without creating an account. */}
      <button
        type="button"
        onClick={fillDemo}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-accent-400 bg-accent-50/60 px-4 py-2.5 text-sm font-medium text-accent-800 transition-colors hover:bg-accent-100 dark:border-accent-500/60 dark:bg-accent-900/20 dark:text-accent-300 dark:hover:bg-accent-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        aria-label={locale === 'es' ? 'Rellenar credenciales de demo' : 'Fill demo credentials'}
      >
        <Sparkles className="h-4 w-4" />
        <span>{locale === 'es' ? 'Usar credenciales de demo' : 'Use demo credentials'}</span>
        <Badge variant="accent" className="ml-1 text-[10px] uppercase">
          Demo
        </Badge>
      </button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-fg-muted">
        <hr className="flex-1 border-[var(--border)]" />o<hr className="flex-1 border-[var(--border)]" />
      </div>

      <Button variant="secondary" size="lg" className="w-full" onClick={onGoogle}>
        {t('google')}
      </Button>

      <p className="mt-8 text-center text-sm text-fg-muted">
        {t('noAccount')}{' '}
        <Link href={`/${locale}/registro`} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
          {t('createOne')}
        </Link>
      </p>
    </GlassCard>
  );
}

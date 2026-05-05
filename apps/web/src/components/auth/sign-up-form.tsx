'use client';

import { Button, GlassCard, Input, Label } from '@migracionplus/ui';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const schema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    terms: z.boolean().refine((v) => v === true, { message: 'Debes aceptar los términos' }),
    marketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const t = useTranslations('auth.signUp');
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { terms: false, marketing: false } });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.fullName, preferred_locale: locale, marketing_opt_in: !!values.marketing },
          emailRedirectTo: `${window.location.origin}/${locale}/verificar-email`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  };

  if (done) {
    return (
      <GlassCard intensity="strong" className="p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-fg">
          {locale === 'es' ? '¡Revisa tu correo!' : 'Check your email!'}
        </h1>
        <p className="mt-3 text-sm text-fg-muted">
          {locale === 'es'
            ? 'Te enviamos un enlace para verificar tu cuenta.'
            : 'We sent you a link to verify your account.'}
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard intensity="strong" className="p-8">
      <h1 className="font-display text-3xl font-semibold text-fg">{t('title')}</h1>
      <p className="mt-2 text-sm text-fg-muted">{t('subtitle')}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="fullName">{t('fullName')}</Label>
          <Input id="fullName" autoComplete="name" {...register('fullName')} invalid={!!errors.fullName} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} invalid={!!errors.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t('password')}</Label>
          <Input id="password" type="password" autoComplete="new-password" {...register('password')} invalid={!!errors.password} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} invalid={!!errors.confirmPassword} />
          {errors.confirmPassword ? <p className="text-xs text-danger">{errors.confirmPassword.message}</p> : null}
        </div>

        <label className="flex items-start gap-2 text-sm text-fg-muted">
          <input type="checkbox" {...register('terms')} className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-brand-700 focus:ring-brand-500" />
          <span>{t('terms')}</span>
        </label>
        {errors.terms ? <p className="text-xs text-danger">{errors.terms.message}</p> : null}

        <label className="flex items-start gap-2 text-sm text-fg-muted">
          <input type="checkbox" {...register('marketing')} className="mt-0.5 h-4 w-4 rounded border-[var(--border)] text-brand-700 focus:ring-brand-500" />
          <span>{t('marketing')}</span>
        </label>

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? '…' : t('submit')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-fg-muted">
        {t('hasAccount')}{' '}
        <Link href={`/${locale}/iniciar-sesion`} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
          {t('signIn')}
        </Link>
      </p>
    </GlassCard>
  );
}

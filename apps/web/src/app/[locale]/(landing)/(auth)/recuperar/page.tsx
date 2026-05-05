'use client';

import { Button, GlassCard, Input, Label } from '@migracionplus/ui';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof schema>;

export default function RecoverPage() {
  const t = useTranslations('auth.recover');
  const locale = useLocale();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/${locale}/iniciar-sesion`,
      });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  };

  return (
    <GlassCard intensity="strong" className="p-8">
      <h1 className="font-display text-3xl font-semibold text-fg">{t('title')}</h1>
      <p className="mt-2 text-sm text-fg-muted">{t('subtitle')}</p>

      {done ? (
        <p className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm text-fg">{t('success')}</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} invalid={!!errors.email} />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? '…' : t('submit')}
          </Button>
        </form>
      )}

      <p className="mt-8 text-center text-sm">
        <Link href={`/${locale}/iniciar-sesion`} className="text-brand-700 hover:underline dark:text-brand-400">
          ← {t('back')}
        </Link>
      </p>
    </GlassCard>
  );
}

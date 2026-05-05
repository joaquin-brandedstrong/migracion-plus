'use client';

import { Button, GlassCard, Input, Label, Textarea } from '@migracionplus/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

const buildSchema = (t: (k: string) => string) =>
  z.object({
    name: z.string().min(2, t('errors.required')),
    email: z.string().email(t('errors.email')),
    phone: z.string().optional(),
    topic: z.string().min(1, t('errors.required')),
    message: z.string().min(10, t('errors.minLength')),
  });

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

export function ContactForm() {
  const t = useTranslations('contact.form');
  const tErr = useTranslations();
  const [submitted, setSubmitted] = useState(false);
  const schema = buildSchema((k) => tErr(k));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (_values: FormValues) => {
    // POST /api/contact — wire up after Supabase + Resend env vars are set.
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <GlassCard className="p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
        <p className="mt-4 font-display text-xl font-semibold text-fg">{t('success')}</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t('name')} error={errors.name?.message}>
            <Input {...register('name')} invalid={!!errors.name} autoComplete="name" />
          </Field>
          <Field label={t('email')} error={errors.email?.message}>
            <Input type="email" {...register('email')} invalid={!!errors.email} autoComplete="email" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t('phone')} error={errors.phone?.message}>
            <Input type="tel" {...register('phone')} autoComplete="tel" />
          </Field>
          <Field label={t('topic')} error={errors.topic?.message}>
            <select
              {...register('topic')}
              aria-invalid={!!errors.topic || undefined}
              className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <option value="">—</option>
              <option value="courses">{t('topics.courses')}</option>
              <option value="books">{t('topics.books')}</option>
              <option value="support">{t('topics.support')}</option>
              <option value="partnership">{t('topics.partnership')}</option>
              <option value="other">{t('topics.other')}</option>
            </select>
          </Field>
        </div>

        <Field label={t('message')} error={errors.message?.message}>
          <Textarea rows={6} {...register('message')} invalid={!!errors.message} />
        </Field>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? '…' : t('submit')}
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </GlassCard>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}

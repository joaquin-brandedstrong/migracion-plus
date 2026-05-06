'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { faqs } from '@/data/seed';

export function Faq() {
  const t = useTranslations('home.faq');
  const locale = useLocale() as 'es' | 'en';

  return (
    <section className="relative overflow-hidden bg-bg py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-8%] top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-brand-100/50 blur-3xl dark:bg-brand-900/30"
      />
      <div className="container relative">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-fg sm:text-3xl">{t('title')}</h2>
          <p className="mt-2 text-sm text-fg-muted sm:text-base">{t('subtitle')}</p>
        </div>

        <Accordion.Root
          type="single"
          collapsible
          className="mx-auto mt-10 max-w-3xl divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-bg-elevated"
        >
          {faqs.map((faq, i) => (
            <Accordion.Item key={i} value={`item-${i}`} className="overflow-hidden">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-bold text-fg transition-colors hover:bg-brand-50/40 dark:hover:bg-brand-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset">
                  <span>{faq.q[locale]}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-brand-700 transition-transform duration-200 group-data-[state=open]:rotate-180 dark:text-brand-300" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-sm text-fg-muted data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <div className="px-6 pb-5">{faq.a[locale]}</div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}

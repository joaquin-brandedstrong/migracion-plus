'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { faqs } from '@/data/seed';

export function Faq() {
  const t = useTranslations('home.faq');
  const locale = useLocale() as 'es' | 'en';

  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-display-md font-semibold text-fg">{t('title')}</h2>
          <p className="mt-4 text-fg-muted">{t('subtitle')}</p>
        </div>

        <Accordion.Root
          type="single"
          collapsible
          className="mx-auto mt-12 max-w-3xl divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/60 backdrop-blur"
        >
          {faqs.map((faq, i) => (
            <Accordion.Item key={i} value={`item-${i}`} className="overflow-hidden">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-fg transition-colors hover:bg-ink-50/40 dark:hover:bg-ink-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset">
                  <span>{faq.q[locale]}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-fg-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
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

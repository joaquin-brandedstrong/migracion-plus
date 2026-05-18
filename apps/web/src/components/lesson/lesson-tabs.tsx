'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@migracionplus/ui';
import { ExternalLink, FileText, Sparkles } from 'lucide-react';

type TabKey = 'description' | 'resources' | 'questions' | 'notes' | 'transcript';

const TAB_ORDER: TabKey[] = [
  'description',
  'resources',
  'questions',
  'notes',
  'transcript',
];

export interface LessonTabsProps {
  lang: 'es' | 'en';
  description: string;
  objectivesTitle: string;
  objectives: string[];
  resources: { label: string; href: string }[];
  qa: { q: string; a: string }[];
  assistantHref: string;
}

export function LessonTabs({
  lang,
  description,
  objectivesTitle,
  objectives,
  resources,
  qa,
  assistantHref,
}: LessonTabsProps) {
  const t = useTranslations('dashboard.lesson');
  const [active, setActive] = useState<TabKey>('description');
  const [notes, setNotes] = useState('');
  const baseId = useId();

  return (
    <div className="mt-8">
      <div className="border-b border-[var(--border)]">
        <div
          className="-mb-px flex gap-6 overflow-x-auto"
          aria-label="Tabs"
          role="tablist"
        >
          {TAB_ORDER.map((key) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                id={`${baseId}-tab-${key}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${key}`}
                onClick={() => setActive(key)}
                className={
                  isActive
                    ? 'whitespace-nowrap border-b-2 border-brand-600 px-1 py-3 text-sm font-medium text-fg'
                    : 'whitespace-nowrap border-b-2 border-transparent px-1 py-3 text-sm font-medium text-fg-muted transition-colors hover:text-fg'
                }
              >
                {t(`tabs.${key}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      {active === 'description' && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-description`}
          aria-labelledby={`${baseId}-tab-description`}
          className="mt-6 space-y-5"
        >
          <p className="text-sm leading-relaxed text-fg-muted">{description}</p>
          <div>
            <h3 className="font-display text-sm font-semibold text-fg">
              {objectivesTitle}
            </h3>
            <ul className="mt-3 space-y-2">
              {objectives.map((o) => (
                <li
                  key={o}
                  className="flex gap-2 text-sm text-fg-muted"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Resources */}
      {active === 'resources' && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-resources`}
          aria-labelledby={`${baseId}-tab-resources`}
          className="mt-6"
        >
          {resources.length === 0 ? (
            <p className="text-sm text-fg-muted">{t('resourcesEmpty')}</p>
          ) : (
            <ul className="space-y-2">
              {resources.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-fg transition-colors hover:bg-ink-100 dark:hover:bg-ink-800"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300" />
                    <span className="min-w-0 flex-1 truncate">{r.label}</span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-fg-muted" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Questions / Q&A */}
      {active === 'questions' && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-questions`}
          aria-labelledby={`${baseId}-tab-questions`}
          className="mt-6 space-y-4"
        >
          <ul className="space-y-4">
            {qa.map((item) => (
              <li
                key={item.q}
                className="rounded-xl border border-[var(--border)] p-4"
              >
                <p className="text-sm font-medium text-fg">{item.q}</p>
                <p className="mt-1.5 text-sm text-fg-muted">{item.a}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[var(--bg-elevated)] px-4 py-3">
            <span className="flex items-center gap-2 text-sm text-fg-muted">
              <Sparkles className="h-4 w-4 text-brand-500" />
              {lang === 'es'
                ? '¿No ves tu pregunta? Pregúntale a Plus.'
                : "Don't see your question? Ask Plus."}
            </span>
            <Button asChild size="sm" variant="outline">
              <Link href={assistantHref}>{t('askPlus')}</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Notes */}
      {active === 'notes' && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-notes`}
          aria-labelledby={`${baseId}-tab-notes`}
          className="mt-6"
        >
          <label
            htmlFor={`${baseId}-notes-field`}
            className="text-sm font-medium text-fg"
          >
            {t('yourNotes')}
          </label>
          <textarea
            id={`${baseId}-notes-field`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('notesPlaceholder')}
            rows={6}
            className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-fg outline-none focus:border-brand-500"
          />
          {notes.trim().length > 0 && (
            <p className="mt-2 text-xs text-fg-muted">{t('notesAutosaved')}</p>
          )}
        </div>
      )}

      {/* Transcript */}
      {active === 'transcript' && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-transcript`}
          aria-labelledby={`${baseId}-tab-transcript`}
          className="mt-6"
        >
          <p className="text-sm italic text-fg-muted">
            {t('transcriptUnavailable')}
          </p>
        </div>
      )}
    </div>
  );
}

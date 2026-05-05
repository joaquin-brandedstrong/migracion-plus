'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface LanguageToggleProps {
  currentLocale: string;
  locales: { code: string; label: string }[];
  onSelect: (code: string) => void;
  className?: string;
}

export function LanguageToggle({ currentLocale, locales, onSelect, className }: LanguageToggleProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Cambiar idioma"
          className={cn(
            'inline-flex h-10 items-center gap-2 rounded-full border border-[var(--glass-border)] px-4',
            'bg-[var(--glass-bg)] backdrop-blur-md text-sm text-fg transition-colors',
            'hover:bg-white/80 dark:hover:bg-ink-800/80',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            className,
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium uppercase tracking-wide">{currentLocale}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="min-w-32 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-elevated)] p-1 shadow-glass-lg"
        >
          {locales.map((loc) => (
            <DropdownMenu.Item
              key={loc.code}
              onSelect={() => onSelect(loc.code)}
              className={cn(
                'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm outline-none',
                'data-[highlighted]:bg-ink-100 dark:data-[highlighted]:bg-ink-800',
                loc.code === currentLocale && 'font-semibold text-brand-700 dark:text-brand-400',
              )}
            >
              {loc.label}
              {loc.code === currentLocale ? <span aria-hidden>•</span> : null}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { GlassCard, Badge, Button } from '@migracionplus/ui';
import { Filter, X } from 'lucide-react';
import { CourseCard } from '@/components/course-card';
import { courses, categories } from '@/data/seed';

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export function CourseCatalog() {
  const t = useTranslations('courses');
  const locale = useLocale() as 'es' | 'en';
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<'popular' | 'newest' | 'rating' | 'priceAsc' | 'priceDesc'>('popular');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = courses.filter((c) => {
      if (selectedCategories.size && !selectedCategories.has(c.category.slug)) return false;
      if (selectedLevels.size && !selectedLevels.has(c.level)) return false;
      if (selectedLanguages.size && !c.language.some((l) => selectedLanguages.has(l))) return false;
      return true;
    });
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'priceAsc') list = [...list].sort((a, b) => a.priceCents - b.priceCents);
    if (sort === 'priceDesc') list = [...list].sort((a, b) => b.priceCents - a.priceCents);
    return list;
  }, [selectedCategories, selectedLevels, selectedLanguages, sort]);

  const toggle = (set: Set<string>, value: string, setFn: (s: Set<string>) => void) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setFn(next);
  };

  const filterCount = selectedCategories.size + selectedLevels.size + selectedLanguages.size;

  const clearAll = () => {
    setSelectedCategories(new Set());
    setSelectedLevels(new Set());
    setSelectedLanguages(new Set());
  };

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-display-lg font-semibold text-fg">{t('title')}</h1>
          <p className="mt-2 text-fg-muted">{t('subtitle')}</p>
        </div>
        <Button variant="secondary" size="md" className="lg:hidden" onClick={() => setOpen(true)}>
          <Filter className="h-4 w-4" />
          {t('filters.category')}
          {filterCount ? <Badge variant="accent" className="ml-1">{filterCount}</Badge> : null}
        </Button>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[280px,1fr]">
        <aside
          className={`${open ? 'fixed inset-0 z-50 overflow-y-auto bg-[var(--bg)] p-6 lg:relative lg:inset-auto lg:bg-transparent lg:p-0' : 'hidden lg:block'} lg:sticky lg:top-24 lg:self-start`}
        >
          <div className="lg:hidden flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">Filtros</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar filtros">
              <X className="h-5 w-5" />
            </button>
          </div>

          <GlassCard className="p-6">
            <FilterGroup label={t('filters.category')}>
              {categories.map((cat) => (
                <FilterCheckbox
                  key={cat.slug}
                  label={cat.label[locale]}
                  checked={selectedCategories.has(cat.slug)}
                  onChange={() => toggle(selectedCategories, cat.slug, setSelectedCategories)}
                />
              ))}
            </FilterGroup>

            <FilterGroup label={t('filters.level')}>
              {LEVELS.map((lvl) => (
                <FilterCheckbox
                  key={lvl}
                  label={t(`level.${lvl}`)}
                  checked={selectedLevels.has(lvl)}
                  onChange={() => toggle(selectedLevels, lvl, setSelectedLevels)}
                />
              ))}
            </FilterGroup>

            <FilterGroup label={t('filters.language')}>
              {['es', 'en'].map((lng) => (
                <FilterCheckbox
                  key={lng}
                  label={lng === 'es' ? 'Español' : 'English'}
                  checked={selectedLanguages.has(lng)}
                  onChange={() => toggle(selectedLanguages, lng, setSelectedLanguages)}
                />
              ))}
            </FilterGroup>

            {filterCount ? (
              <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={clearAll}>
                {t('filters.clear')}
              </Button>
            ) : null}
          </GlassCard>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-fg-muted">{filtered.length} resultados</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-10 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label={t('filters.sort')}
            >
              <option value="popular">{t('sort.popular')}</option>
              <option value="newest">{t('sort.newest')}</option>
              <option value="rating">{t('sort.rating')}</option>
              <option value="priceAsc">{t('sort.priceAsc')}</option>
              <option value="priceDesc">{t('sort.priceDesc')}</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <h3 className="font-display text-2xl font-semibold text-fg">{t('empty.title')}</h3>
              <p className="mt-2 text-fg-muted">{t('empty.body')}</p>
            </GlassCard>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[var(--border)] py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-sm font-semibold text-fg">{label}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-fg-muted hover:text-fg">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[var(--border)] text-brand-700 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}

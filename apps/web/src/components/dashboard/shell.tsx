'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  BookMarked,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutGrid,
  LineChart,
  Menu,
  MessageCircle,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button, Badge, ThemeToggle } from '@migracionplus/ui';
import type { ProfileRole } from '@migracionplus/db/types';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { isAdminRole } from '@/lib/role';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { TutorialOverlay, launchTutorial } from '@/components/dashboard/tutorial-overlay';
import { NotificationsDropdown } from '@/components/dashboard/notifications-dropdown';

interface ShellProps {
  locale: string;
  profile: { full_name: string; avatar_url: string | null; email: string | null };
  role: ProfileRole;
  children: ReactNode;
}

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  exact?: boolean;
}

export function DashboardShell({ locale, profile, role, children }: ShellProps) {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = isAdminRole(role);

  const studentNav: NavItem[] = [
    { href: `/${locale}/dashboard`, icon: Home, label: t('nav.home'), exact: true },
    { href: `/${locale}/dashboard/cursos`, icon: GraduationCap, label: t('nav.courses') },
    { href: `/${locale}/dashboard/biblioteca`, icon: BookMarked, label: t('nav.library') },
    { href: `/${locale}/dashboard/certificados`, icon: Award, label: t('nav.certificates') },
    { href: `/${locale}/dashboard/asistente`, icon: MessageCircle, label: t('nav.assistant') },
    { href: `/${locale}/dashboard/configuracion`, icon: Settings, label: t('nav.settings') },
  ];

  const adminNav: NavItem[] = [
    { href: `/${locale}/dashboard`, icon: LayoutGrid, label: t('adminNav.home'), exact: true },
    { href: `/${locale}/dashboard/cursos`, icon: GraduationCap, label: t('adminNav.courses') },
    { href: `/${locale}/dashboard/biblioteca`, icon: BookMarked, label: t('adminNav.library') },
    { href: `/${locale}/dashboard/estudiantes`, icon: Users, label: t('adminNav.students') },
    { href: `/${locale}/dashboard/leads`, icon: TrendingUp, label: t('adminNav.leads') },
    { href: `/${locale}/dashboard/contenido`, icon: Sparkles, label: t('adminNav.content') },
    { href: `/${locale}/dashboard/reportes`, icon: LineChart, label: t('adminNav.reports') },
    { href: `/${locale}/dashboard/certificados`, icon: Award, label: t('adminNav.certificates') },
    { href: `/${locale}/dashboard/configuracion`, icon: Settings, label: t('adminNav.settings') },
  ];

  const nav = isAdmin ? adminNav : studentNav;

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const initials = profile.full_name
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const onSignOut = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } finally {
      window.location.href = `/${locale}`;
    }
  };

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside
          data-tour="sidebar"
          className="sticky top-0 hidden h-dvh w-[304px] shrink-0 overflow-hidden border-r border-[var(--border)] bg-[var(--bg-elevated)] lg:block"
        >
          <SidebarContent nav={nav} role={role} isActive={isActive} locale={locale} isAdmin={isAdmin} />
        </aside>

        {/* Sidebar (mobile drawer) */}
        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
                <button
                  type="button"
                  className="absolute inset-0 bg-ink-950/40"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Cerrar menú"
                />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                className="absolute inset-0 left-0 w-72 bg-[var(--bg-elevated)] shadow-glass-lg"
              >
                <div className="flex items-center justify-end p-4">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg-muted hover:bg-ink-100 dark:hover:bg-ink-800"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Cerrar menú"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <SidebarContent
                  nav={nav}
                  role={role}
                  isActive={isActive}
                  locale={locale}
                  isAdmin={isAdmin}
                  onNavigate={() => setMobileOpen(false)}
                />
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Main column */}
        <div className="flex-1 min-w-0">
           {/* Topbar */}
           <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 lg:px-8">
             <button
               type="button"
               className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg-muted hover:bg-ink-100 dark:hover:bg-ink-800 lg:hidden"
               onClick={() => setMobileOpen(true)}
               aria-label="Abrir menú"
             >
               <Menu className="h-5 w-5" />
             </button>

             <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
               <input
                 type="search"
                 placeholder={
                   isAdmin
                     ? locale === 'es'
                       ? 'Buscar en la plataforma…'
                       : 'Search the platform…'
                     : locale === 'es'
                       ? 'Buscar cursos…'
                       : 'Search courses…'
                 }
                 className="h-9 w-full rounded-full border border-[var(--border)] bg-[var(--bg)] pl-9 pr-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
               />
             </div>

             <div className="flex items-center gap-3 ml-auto">
               <button
                 type="button"
                 data-tour="help-button"
                 onClick={launchTutorial}
                 aria-label={locale === 'es' ? 'Tutorial' : 'Tutorial'}
                 title={locale === 'es' ? 'Volver a ver el tutorial' : 'Replay the tutorial'}
                 className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg-muted hover:bg-ink-100 hover:text-fg dark:hover:bg-ink-800"
               >
                 <HelpCircle className="h-5 w-5" />
               </button>
               <NotificationsDropdown role={role} locale={locale} />
               <ThemeToggle />

               <div className="flex items-center gap-3">
                 <div className="hidden text-right sm:block">
                   <p className="text-xs font-medium text-fg leading-tight">{profile.full_name}</p>
                   <p className="text-[11px] text-fg-muted">{profile.email}</p>
                 </div>
                 <button
                   type="button"
                   onClick={onSignOut}
                   className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-brand-900 text-sm font-semibold text-white"
                   title={initials}
                   aria-label="Cerrar sesión"
                 >
                   <span aria-hidden>{initials}</span>
                 </button>
               </div>
             </div>
           </header>

          {/* Content */}
          <div className="px-4 py-8 lg:px-8 lg:py-10">{children}</div>

          {/* First-use tutorial — auto-opens once per session, re-launchable
              from the topbar help button. */}
          <TutorialOverlay role={role} locale={locale} />
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  nav,
  role,
  isActive,
  locale,
  isAdmin,
  onNavigate,
}: {
  nav: NavItem[];
  role: ProfileRole;
  isActive: (n: NavItem) => boolean;
  locale: string;
  isAdmin: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations('dashboard');
  return (
    <nav className="flex h-full flex-col p-4" aria-label="Dashboard">
      <Link
        href={`/${locale}`}
        onClick={onNavigate}
        className="-mx-4 mb-2 flex items-center py-2"
        aria-label="Migración Plus — Inicio"
      >
        <Logo variant="primary" width={320} />
      </Link>
      <div className="-mx-4 mb-4 flex items-center gap-2 px-4 pb-2">
        <Badge variant={isAdmin ? 'accent' : 'muted'}>
          {t(`roleBadge.${role}`)}
        </Badge>
      </div>
      <ul className="flex-1 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-100 text-brand-900 dark:bg-brand-900/40 dark:text-brand-200'
                    : 'text-fg-muted hover:bg-ink-100 hover:text-fg dark:hover:bg-ink-800',
                )}
              >
                <Icon className={cn('h-4 w-4', active && 'text-brand-700 dark:text-brand-300')} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {!isAdmin ? (
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-950 p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-300">
            {locale === 'es' ? 'Nuevo' : 'New'}
          </p>
          <p className="mt-2 text-sm font-display font-semibold leading-tight">
            {locale === 'es' ? 'Asistente IA disponible 24/7' : 'AI assistant available 24/7'}
          </p>
          <Button asChild size="sm" variant="accent" className="mt-3 w-full">
            <Link href={`/${locale}/dashboard/asistente`}>
              {locale === 'es' ? 'Probar' : 'Try it'}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
          <p className="text-xs text-fg-muted">
            {locale === 'es'
              ? 'Estás viendo el panel administrativo. Cambia el rol del usuario en la base de datos para alternar vistas.'
              : "You're viewing the admin panel. Change the user's role in the database to switch views."}
          </p>
        </div>
      )}
    </nav>
  );
}

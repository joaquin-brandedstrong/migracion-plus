'use client';

import {
  AlertTriangle,
  Award,
  BellRing,
  CheckCheck,
  CreditCard,
  GraduationCap,
  Inbox,
  PlayCircle,
  Sparkles,
  Star,
  TrendingUp,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ProfileRole } from '@migracionplus/db/types';
import { isAdminRole } from '@/lib/role';

interface NotificationItem {
  id: string;
  kind:
    | 'lesson'
    | 'review'
    | 'cert'
    | 'plus'
    | 'lead'
    | 'payment'
    | 'warning'
    | 'system';
  titleEs: string;
  titleEn: string;
  bodyEs?: string;
  bodyEn?: string;
  /** ISO timestamp. */
  at: string;
  href?: string;
  read?: boolean;
}

const STUDENT_NOTIFS: NotificationItem[] = [
  {
    id: 'sn1',
    kind: 'lesson',
    titleEs: 'Nueva lección en I-130',
    titleEn: 'New lesson in I-130',
    bodyEs: 'Se publicó "Cómo preparar el affidávit de matrimonio".',
    bodyEn: 'New lesson published: "How to prepare the marriage affidavit".',
    at: '2026-05-06T15:42:00Z',
    href: '/dashboard/cursos',
  },
  {
    id: 'sn2',
    kind: 'plus',
    titleEs: 'Plus respondió tu pregunta',
    titleEn: 'Plus answered your question',
    bodyEs: 'Sobre los documentos para responder un RFE.',
    bodyEn: 'About the documents needed to respond to an RFE.',
    at: '2026-05-06T11:10:00Z',
    href: '/dashboard/asistente',
  },
  {
    id: 'sn3',
    kind: 'cert',
    titleEs: 'Tu certificado está listo',
    titleEn: 'Your certificate is ready',
    bodyEs: 'Examen de civismo en español — descárgalo cuando quieras.',
    bodyEn: 'Civics test in Spanish — download it whenever you like.',
    at: '2026-05-04T19:05:00Z',
    href: '/dashboard/certificados',
    read: true,
  },
  {
    id: 'sn4',
    kind: 'system',
    titleEs: 'Recordatorio · meta semanal',
    titleEn: 'Reminder · weekly goal',
    bodyEs: 'Te quedan 1h 30m para alcanzar tu meta de la semana.',
    bodyEn: '1h 30m left to hit this week’s goal.',
    at: '2026-05-04T08:00:00Z',
    read: true,
  },
];

const ADMIN_NOTIFS: NotificationItem[] = [
  {
    id: 'an1',
    kind: 'lead',
    titleEs: '5 leads nuevos esta mañana',
    titleEn: '5 new leads this morning',
    bodyEs: 'Provienen de la campaña "I-130 abril".',
    bodyEn: 'Coming from the "April I-130" campaign.',
    at: '2026-05-06T13:25:00Z',
    href: '/dashboard/leads',
  },
  {
    id: 'an2',
    kind: 'review',
    titleEs: 'Reseña de 5 estrellas',
    titleEn: '5-star review',
    bodyEs: 'Ana López calificó el curso de civismo.',
    bodyEn: 'Ana López rated the civics course.',
    at: '2026-05-06T08:14:00Z',
    href: '/dashboard',
  },
  {
    id: 'an3',
    kind: 'payment',
    titleEs: 'Pago Stripe requiere revisión',
    titleEn: 'Stripe payment needs review',
    bodyEs: 'Reembolso solicitado por Carlos Mendoza ($149).',
    bodyEn: 'Refund requested by Carlos Mendoza ($149).',
    at: '2026-05-05T22:01:00Z',
    href: '/dashboard/configuracion',
  },
  {
    id: 'an4',
    kind: 'warning',
    titleEs: 'Twilio SMS al 80% de cuota',
    titleEn: 'Twilio SMS at 80% quota',
    bodyEs: 'Considera aumentar el plan antes del fin de mes.',
    bodyEn: 'Consider upgrading before month-end.',
    at: '2026-05-05T17:32:00Z',
    read: true,
  },
];

const ICON_MAP: Record<NotificationItem['kind'], React.ComponentType<{ className?: string }>> = {
  lesson: PlayCircle,
  review: Star,
  cert: Award,
  plus: Sparkles,
  lead: TrendingUp,
  payment: CreditCard,
  warning: AlertTriangle,
  system: GraduationCap,
};

function formatRelative(iso: string, locale: 'es' | 'en'): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const min = Math.floor(diff / 60_000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (min < 60) {
    return locale === 'es' ? `hace ${Math.max(1, min)} min` : `${Math.max(1, min)} min ago`;
  }
  if (hr < 24) {
    return locale === 'es' ? `hace ${hr} h` : `${hr}h ago`;
  }
  if (day < 7) {
    return locale === 'es' ? `hace ${day} d` : `${day}d ago`;
  }
  return new Date(iso).toLocaleDateString(locale === 'es' ? 'es-US' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function NotificationsDropdown({
  role,
  locale,
}: {
  role: ProfileRole;
  locale: string;
}) {
  const isAdmin = isAdminRole(role);
  const lang: 'es' | 'en' = locale === 'en' ? 'en' : 'es';
  const seed = useMemo(() => (isAdmin ? ADMIN_NOTIFS : STUDENT_NOTIFS), [isAdmin]);
  const [items, setItems] = useState<NotificationItem[]>(seed);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const unreadCount = items.filter((n) => !n.read).length;

  // Click outside + ESC to close.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const markAllRead = () => setItems((list) => list.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) =>
    setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={lang === 'es' ? 'Notificaciones' : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-ink-100 hover:text-fg dark:hover:bg-ink-800"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span
            aria-label={
              lang === 'es'
                ? `${unreadCount} sin leer`
                : `${unreadCount} unread`
            }
            className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white dark:bg-brand-400 dark:text-brand-950"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={lang === 'es' ? 'Notificaciones' : 'Notifications'}
          className="absolute right-0 top-full z-50 mt-2 w-[360px] origin-top-right overflow-hidden rounded-2xl border border-[var(--border)] bg-bg-elevated shadow-card-hover sm:w-[400px]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
            <div className="flex items-center gap-2">
              <BellRing className="h-4 w-4 text-brand-700 dark:text-brand-300" />
              <h3 className="text-sm font-bold text-fg">
                {lang === 'es' ? 'Notificaciones' : 'Notifications'}
              </h3>
              {unreadCount > 0 ? (
                <span className="inline-flex items-center rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-800 dark:bg-brand-900/40 dark:text-brand-200">
                  {unreadCount}
                </span>
              ) : null}
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 hover:underline dark:text-brand-300"
              >
                <CheckCheck className="h-3 w-3" />
                {lang === 'es' ? 'Marcar todas' : 'Mark all read'}
              </button>
            ) : null}
          </header>

          {items.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Inbox className="mx-auto h-7 w-7 text-fg-muted" />
              <p className="mt-3 text-sm font-bold text-fg">
                {lang === 'es' ? 'Sin notificaciones' : 'No notifications'}
              </p>
              <p className="mt-1 text-xs text-fg-muted">
                {lang === 'es' ? 'Estás al día.' : "You're all caught up."}
              </p>
            </div>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto divide-y divide-[var(--border)]">
              {items.map((n) => {
                const Icon = ICON_MAP[n.kind];
                const content = (
                  <div
                    className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-brand-50/60 dark:hover:bg-brand-900/20 ${
                      n.read ? '' : 'bg-brand-50/40 dark:bg-brand-900/10'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        n.read
                          ? 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300'
                          : 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm leading-snug ${
                          n.read ? 'font-medium text-fg' : 'font-bold text-fg'
                        }`}
                      >
                        {lang === 'es' ? n.titleEs : n.titleEn}
                      </p>
                      {(lang === 'es' ? n.bodyEs : n.bodyEn) ? (
                        <p className="mt-0.5 line-clamp-2 text-xs text-fg-muted">
                          {lang === 'es' ? n.bodyEs : n.bodyEn}
                        </p>
                      ) : null}
                      <p className="mt-1 text-[10px] uppercase tracking-wide text-fg-muted">
                        {formatRelative(n.at, lang)}
                      </p>
                    </div>
                    {!n.read ? (
                      <span
                        aria-hidden
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-700 dark:bg-brand-400"
                      />
                    ) : null}
                  </div>
                );
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <Link
                        href={`/${locale}${n.href}`}
                        onClick={() => {
                          markRead(n.id);
                          setOpen(false);
                        }}
                        className="block"
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        className="w-full text-left"
                      >
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <footer className="border-t border-[var(--border)] px-4 py-2.5 text-center">
            <Link
              href={`/${locale}/dashboard/configuracion`}
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-brand-700 hover:underline dark:text-brand-300"
            >
              {lang === 'es' ? 'Ajustes de notificaciones' : 'Notification settings'}
            </Link>
          </footer>
        </div>
      ) : null}
    </div>
  );
}

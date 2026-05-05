import Link from 'next/link';
import { Award, CheckCircle2, GraduationCap, Sparkles } from 'lucide-react';
import type { DemoActivity } from '@/data/dashboard-seed';

const ICONS = {
  lesson_completed: CheckCircle2,
  quiz_passed: Sparkles,
  certificate_issued: Award,
  enrollment: GraduationCap,
} as const;

const COLORS = {
  lesson_completed: 'text-emerald-500',
  quiz_passed: 'text-accent-500',
  certificate_issued: 'text-brand-600 dark:text-brand-300',
  enrollment: 'text-blue-500',
} as const;

interface Props {
  activity: DemoActivity;
  locale: 'es' | 'en';
}

export function ActivityRow({ activity, locale }: Props) {
  const Icon = ICONS[activity.kind];
  const color = COLORS[activity.kind];
  const date = new Date(activity.at);
  const formatted = new Intl.DateTimeFormat(locale === 'es' ? 'es-US' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);

  const content = (
    <div className="flex items-start gap-3 px-3 py-3">
      <div className={`mt-0.5 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-fg">{activity.title[locale]}</p>
        {activity.detail ? (
          <p className="line-clamp-1 text-xs text-fg-muted">{activity.detail[locale]}</p>
        ) : null}
        <p className="mt-1 text-[11px] text-fg-muted">{formatted}</p>
      </div>
    </div>
  );

  if (activity.href) {
    return (
      <li>
        <Link href={`/${locale}${activity.href}`} className="block transition-colors hover:bg-ink-100/50 dark:hover:bg-ink-800/50">
          {content}
        </Link>
      </li>
    );
  }
  return <li>{content}</li>;
}

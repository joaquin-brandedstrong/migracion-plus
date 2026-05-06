import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export function SiteFooter() {
  const t = useTranslations('home.footer');
  const tNav = useTranslations('nav');
  const tAbout = useTranslations('about');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-ink-900 text-white dark:bg-ink-950">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="inline-block" aria-label="Migración Plus — Inicio">
              <Logo variant="footer" width={420} />
            </Link>
            <p className="mt-5 max-w-sm text-sm text-white/70">{t('tagline')}</p>
          </div>

          <FooterColumn
            title={t('courses')}
            links={[
              { href: '/cursos', label: tNav('courses') },
              { href: '/libros', label: tNav('books') },
              { href: '/blog', label: tNav('blog') },
            ]}
            locale={locale}
          />

          <FooterColumn
            title={t('company')}
            links={[
              { href: '/sobre-nosotros', label: tNav('about') },
              { href: '/contacto', label: tNav('contact') },
            ]}
            locale={locale}
          />

          <FooterColumn
            title={t('legal')}
            links={[
              { href: '/terminos', label: 'Términos' },
              { href: '/privacidad', label: 'Privacidad' },
              { href: '/politicas', label: 'Políticas' },
              { href: '/aviso-legal', label: 'Aviso legal' },
            ]}
            locale={locale}
          />
        </div>

        <div className="mt-10 border-t border-white/15 pt-6">
          <p className="text-xs leading-relaxed text-white/60">{tAbout('disclaimer')}</p>
          <p className="mt-3 text-xs text-white/60">
            © {year} Migración Plus Academy. {t('rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  locale,
}: {
  title: string;
  links: { href: string; label: string }[];
  locale: string;
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-200">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={`/${locale}${link.href}`}
              className="text-sm text-white/80 transition-colors hover:text-brand-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

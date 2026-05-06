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
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--bg-elevated)]/60 backdrop-blur">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="inline-block" aria-label="Migración Plus — Inicio">
              <Logo variant="footer" width={440} />
            </Link>
            <p className="mt-6 max-w-sm text-sm text-fg-muted">{t('tagline')}</p>
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

        <div className="mt-12 border-t border-[var(--border)] pt-8">
          <p className="text-xs leading-relaxed text-fg-muted">{tAbout('disclaimer')}</p>
          <p className="mt-4 text-xs text-fg-muted">
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
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-fg">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={`/${locale}${link.href}`}
              className="text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge, GlassCard } from '@migracionplus/ui';
import { blogPosts } from '@/data/seed';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  const lang = locale as 'es' | 'en';

  const [featured, ...rest] = blogPosts;
  if (!featured) return null;

  return (
    <div className="container py-16 lg:py-20">
      <h1 className="font-display text-display-lg font-semibold text-fg">{t('title')}</h1>
      <p className="mt-2 text-fg-muted">{t('subtitle')}</p>

      <Link href={`/${locale}/blog/${featured.slug}`} className="mt-12 block">
        <GlassCard hoverable className="overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="relative aspect-[16/10] lg:aspect-auto">
              <Image src={featured.cover} alt={featured.title[lang]} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <Badge variant="accent" className="self-start">{featured.category[lang]}</Badge>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-fg lg:text-4xl">{featured.title[lang]}</h2>
              <p className="mt-4 text-fg-muted">{featured.excerpt[lang]}</p>
              <p className="mt-6 text-xs text-fg-muted">
                {t('by')} {featured.author} · {t('readTime', { minutes: featured.readMinutes })}
              </p>
            </div>
          </div>
        </GlassCard>
      </Link>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group">
            <GlassCard hoverable className="h-full overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={post.cover} alt={post.title[lang]} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <Badge variant="muted">{post.category[lang]}</Badge>
                <h3 className="mt-3 font-display text-lg font-semibold leading-tight text-fg">{post.title[lang]}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{post.excerpt[lang]}</p>
                <p className="mt-4 text-xs text-fg-muted">{post.author} · {t('readTime', { minutes: post.readMinutes })}</p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}

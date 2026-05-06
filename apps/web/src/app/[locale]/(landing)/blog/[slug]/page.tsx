import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Badge, GlassCard } from '@migracionplus/ui';
import { blogPosts } from '@/data/seed';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Artículo no encontrado' };
  const lang = locale as 'es' | 'en';
  return { title: post.title[lang], description: post.excerpt[lang] };
}

export function generateStaticParams() {
  return blogPosts.flatMap((p) => [
    { locale: 'es', slug: p.slug },
    { locale: 'en', slug: p.slug },
  ]);
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  const lang = locale as 'es' | 'en';
  const t = await getTranslations({ locale, namespace: 'blog' });

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="container py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/${locale}/blog`}
          className="text-sm text-fg-muted hover:text-fg"
        >
          ← {lang === 'es' ? 'Volver al blog' : 'Back to blog'}
        </Link>

        <header className="mt-6">
          <Badge variant="accent">{post.category[lang]}</Badge>
          <h1 className="mt-4 font-display text-display-lg font-semibold leading-tight text-fg">
            {post.title[lang]}
          </h1>
          <p className="mt-4 text-fg-muted">{post.excerpt[lang]}</p>
          <p className="mt-6 text-xs text-fg-muted">
            {t('by')} <span className="text-fg">{post.author}</span> ·{' '}
            {new Date(post.publishedAt).toLocaleDateString(lang)} ·{' '}
            {t('readTime', { minutes: post.readMinutes })}
          </p>
        </header>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={post.cover}
            alt={post.title[lang]}
            fill
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-lg mt-12 max-w-none text-fg dark:prose-invert">
          <p>
            {lang === 'es'
              ? 'Este artículo se publicará completo cuando el equipo editorial finalice la revisión. Mientras tanto, te dejamos un resumen rápido y los puntos clave que cubriremos.'
              : 'This article will publish in full once the editorial team finalizes the review. In the meantime, here is a quick summary and the key points we will cover.'}
          </p>
          <p>{post.excerpt[lang]}</p>
          <ul>
            <li>
              {lang === 'es'
                ? 'Contexto y por qué este tema importa hoy.'
                : 'Context and why this topic matters today.'}
            </li>
            <li>
              {lang === 'es'
                ? 'Pasos prácticos que puedes aplicar de inmediato.'
                : 'Practical steps you can apply right away.'}
            </li>
            <li>
              {lang === 'es'
                ? 'Errores comunes y cómo evitarlos.'
                : 'Common mistakes and how to avoid them.'}
            </li>
            <li>
              {lang === 'es'
                ? 'Recursos adicionales y próximos pasos.'
                : 'Additional resources and next steps.'}
            </li>
          </ul>
          <p className="text-sm italic text-fg-muted">
            {lang === 'es'
              ? 'Nota: Este contenido es educativo y no constituye asesoría legal.'
              : 'Note: This content is educational and does not constitute legal advice.'}
          </p>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold text-fg">
            {t('relatedPosts')}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/${locale}/blog/${p.slug}`} className="group">
                <GlassCard hoverable className="h-full overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.cover}
                      alt={p.title[lang]}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <Badge variant="muted">{p.category[lang]}</Badge>
                    <h3 className="mt-3 font-display text-lg font-semibold leading-tight text-fg">
                      {p.title[lang]}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-fg-muted">
                      {p.excerpt[lang]}
                    </p>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

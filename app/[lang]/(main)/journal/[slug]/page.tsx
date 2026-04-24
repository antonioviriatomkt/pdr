import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getArticleBySlug, getAllArticles, getLatestArticles, getDevelopmentsByLocation } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'
import DevelopmentCard from '@/components/DevelopmentCard'
import { JsonLd } from '@/components/JsonLd'
import PortableTextRenderer from '@/components/PortableTextRenderer'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return (articles as any[]).map((a: any) => ({ slug: a.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const [article, dict] = await Promise.all([
    getArticleBySlug(slug, locale),
    getDictionary(locale),
  ])
  if (!article) return {}
  const ogImageSource = article.seoImage ?? article.heroImage
  const ogImage = ogImageSource
    ? urlFor(ogImageSource).width(1200).height(630).fit('crop').auto('format').url()
    : undefined
  const description = article.excerpt || `${article.title} ${dict.seo.journal.articleDescriptionSuffix}`
  return {
    title: article.title,
    description,
    alternates: getAlternates(`/journal/${slug}`, lang),
    robots: article.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      ...getOgLocale(lang),
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

function formatDate(date: string, lang: string) {
  return new Date(date).toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function ArticlePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()

  const [article, dict] = await Promise.all([
    getArticleBySlug(slug, lang),
    getDictionary(lang),
  ])
  if (!article) notFound()

  const j = dict.journal
  const categories = j.categories
  const devCardUi = { priceOnRequest: dict.common.priceOnRequest, featured: dict.common.featured, viewArrow: dict.common.viewArrow, statusLabels: dict.developments.statusLabels, typeLabels: dict.developments.typeLabels, priceLabels: dict.developments.priceLabels, lifestyleTagLabels: dict.developments.lifestyleTagLabels }

  const label = categories[article.category as keyof typeof categories] ?? article.category

  const [linkedDevs, allArticles] = await Promise.all([
    article.linkedLocation
      ? getDevelopmentsByLocation(article.linkedLocation.slug.current, lang)
      : Promise.resolve([]),
    getLatestArticles(20, lang),
  ])

  const relatedArticles = (allArticles as any[])
    .filter((a: any) => a._id !== article._id && a.category === article.category)
    .slice(0, 3)

  const linkedDevsSlice = (linkedDevs as any[]).slice(0, 2)

  const ogImageSource = article.seoImage ?? article.heroImage
  const ogImage = ogImageSource
    ? urlFor(ogImageSource).width(1200).height(630).fit('crop').auto('format').url()
    : undefined

  const articleUrl = `${BASE_URL}/${lang}/journal/${slug}`
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || `${article.title} — Portugal Developments Review Journal`,
    datePublished: article.publishedAt,
    dateModified: article._updatedAt ?? article.publishedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    url: articleUrl,
    ...(ogImage && { image: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 } }),
    author: {
      '@type': 'Organization',
      name: 'Portugal Developments Review',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Portugal Developments Review by Viriato',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    ...(article.linkedLocation && {
      about: {
        '@type': 'Place',
        name: article.linkedLocation.name,
        url: `${BASE_URL}/${lang}/locations/${article.linkedLocation.slug.current}`,
      },
    }),
    ...(article.isPillar && { articleSection: 'Pillar Guide' }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.home, item: `${BASE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: j.heading, item: `${BASE_URL}/${lang}/journal` },
      { '@type': 'ListItem', position: 3, name: label, item: `${BASE_URL}/${lang}/journal/category/${article.category}` },
      { '@type': 'ListItem', position: 4, name: article.title, item: articleUrl },
    ],
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <Link href={`/${lang}/journal`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{j.heading}</Link>
            <span>›</span>
            <Link href={`/${lang}/journal/category/${article.category}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{label}</Link>
          </nav>

          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 12px' }}>
            {label}
            {article.linkedLocation && ` · ${article.linkedLocation.name}`}
          </p>

          <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2, maxWidth: '720px' }}>
            {article.title}
          </h1>

          <p style={{ fontSize: '12px', color: 'var(--muted)' }}>
            {formatDate(article.publishedAt, lang)}
          </p>
        </div>
      </section>

      {article.heroImage ? (
        <div style={{ aspectRatio: '16/7', background: 'var(--surface)', maxHeight: '420px', overflow: 'hidden', position: 'relative' }}>
          <Image
            src={urlFor(article.heroImage).width(1600).height(700).auto('format').url()}
            alt={article.title}
            fill
            priority
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
        </div>
      ) : (
        <div style={{ aspectRatio: '16/7', background: 'var(--surface)', maxHeight: '420px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {label}
          </span>
        </div>
      )}

      <div className="container-editorial">
        <div className="article-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '60px', padding: '48px 0' }}>
          <article>
            {article.excerpt && (
              <p style={{ fontSize: '20px', lineHeight: 1.6, color: 'var(--foreground)', margin: '0 0 32px', fontStyle: 'italic' }}>
                {article.excerpt}
              </p>
            )}

            {article.body && (
              <div>
                <PortableTextRenderer value={article.body} />
              </div>
            )}

            {article.linkedLocation && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '32px' }}>
                <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 8px' }}>
                  {j.article.relatedLocation}
                </p>
                <Link
                  href={`/${lang}/locations/${article.linkedLocation.slug.current}`}
                  style={{ fontSize: '16px', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}
                >
                  {dict.locations.headingPrefix} {article.linkedLocation.name} {dict.locations.exploreArrow}
                </Link>
              </div>
            )}
          </article>

          <aside className="article-aside">
            {linkedDevsSlice.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  {j.article.relatedDevelopments}
                </div>
                {linkedDevsSlice.map((dev: any) => (
                  <DevelopmentCard key={dev._id} development={dev} lang={lang} ui={devCardUi} variant="compact" />
                ))}
              </div>
            )}

            {relatedArticles.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  {label}
                </div>
                {relatedArticles.map((a: any) => (
                  <Link key={a._id} href={`/${lang}/journal/${a.slug.current}`} style={{ display: 'block', textDecoration: 'none', borderTop: '1px solid var(--border)', paddingTop: '12px', paddingBottom: '12px' }}>
                    <p style={{ fontSize: '14px', color: 'var(--foreground)', margin: '0 0 4px', lineHeight: 1.4 }}>{a.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>{formatDate(a.publishedAt, lang)}</p>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .article-grid { grid-template-columns: 1fr !important; gap: 40px !important; padding: 32px 0 !important; }
          .article-aside { border-top: 1px solid var(--border); padding-top: 32px; }
        }
      `}</style>
    </>
  )
}

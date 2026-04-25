import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDevelopmentsByLifestyle, getLifestyle, getActiveLifestyleTags } from '@/lib/queries'
import { LIFESTYLE_TAG_SLUGS, LIFESTYLE_TAG_FROM_SLUG } from '@/lib/lifestyle-tags'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'
import { JsonLd } from '@/components/JsonLd'
import DevelopmentCard from '@/components/DevelopmentCard'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const activeTags = await getActiveLifestyleTags()
  const locales = ['en', 'pt']
  return locales.flatMap(lang =>
    activeTags
      .filter(tag => LIFESTYLE_TAG_SLUGS[tag])
      .map(tag => ({ lang, tag: LIFESTYLE_TAG_SLUGS[tag] }))
  )
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; tag: string }> }): Promise<Metadata> {
  const { lang, tag } = await params
  const tagLabel = LIFESTYLE_TAG_FROM_SLUG[tag]
  if (!tagLabel) return {}
  const locale = hasLocale(lang) ? lang : 'en'
  const lifestyleDoc = await getLifestyle(tag, locale)
  const title = lifestyleDoc?.seoTitle || (
    lang === 'pt'
      ? `Imóveis ${tagLabel} em Portugal — Portugal Developments Review`
      : `${tagLabel} Property in Portugal — Portugal Developments Review`
  )
  const description = lifestyleDoc?.seoDescription || (
    lang === 'pt'
      ? `Projetos residenciais curados com perfil ${tagLabel} em Portugal.`
      : `Curated residential developments with a ${tagLabel.toLowerCase()} profile across Portugal.`
  )
  return {
    title,
    description,
    alternates: getAlternates(`/lifestyle/${tag}`, lang),
    openGraph: { type: 'website', ...getOgLocale(lang) },
  }
}

export default async function LifestyleTagPage({ params }: { params: Promise<{ lang: string; tag: string }> }) {
  const { lang, tag } = await params
  if (!hasLocale(lang)) notFound()

  const tagLabel = LIFESTYLE_TAG_FROM_SLUG[tag]
  if (!tagLabel) notFound()

  const [developments, lifestyleDoc, dict, activeTags] = await Promise.all([
    getDevelopmentsByLifestyle(tagLabel, lang),
    getLifestyle(tag, lang),
    getDictionary(lang),
    getActiveLifestyleTags(),
  ])

  if ((developments as any[]).length === 0) notFound()

  const l = dict.lifestyle
  const devCardUi = {
    priceOnRequest: dict.common.priceOnRequest,
    featured: dict.common.featured,
    viewArrow: dict.common.viewArrow,
    statusLabels: dict.developments.statusLabels,
    typeLabels: dict.developments.typeLabels,
    priceLabels: dict.developments.priceLabels,
    lifestyleTagLabels: dict.developments.lifestyleTagLabels,
  }

  const pageUrl = `${BASE_URL}/${lang}/lifestyle/${tag}`

  const otherTags = (activeTags as string[])
    .filter(t => t !== tagLabel && LIFESTYLE_TAG_SLUGS[t])

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${tagLabel} Property in Portugal`,
    url: pageUrl,
    numberOfItems: (developments as any[]).length,
    itemListElement: (developments as any[]).map((dev: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: dev.name,
      url: `${BASE_URL}/${lang}/developments/${dev.slug.current}`,
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.home, item: `${BASE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: l.breadcrumbLifestyle, item: `${BASE_URL}/${lang}/lifestyle` },
      { '@type': 'ListItem', position: 3, name: dict.developments.lifestyleTagLabels[tagLabel as keyof typeof dict.developments.lifestyleTagLabels] ?? tagLabel, item: pageUrl },
    ],
  }

  return (
    <>
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <Link href={`/${lang}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{dict.common.home}</Link>
            <span>›</span>
            <span>{l.breadcrumbLifestyle}</span>
            <span>›</span>
            <span>{dict.developments.lifestyleTagLabels[tagLabel as keyof typeof dict.developments.lifestyleTagLabels] ?? tagLabel}</span>
          </nav>
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            {l.eyebrow}
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {dict.developments.lifestyleTagLabels[tagLabel as keyof typeof dict.developments.lifestyleTagLabels] ?? tagLabel}
          </h1>
          {lifestyleDoc?.intro && (
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '680px', margin: 0 }}>
              {lifestyleDoc.intro}
            </p>
          )}
        </div>
      </section>

      {/* Developments grid */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 32px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            {l.developmentsHeading}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px 40px' }}>
            {(developments as any[]).map((dev: any) => (
              <DevelopmentCard key={dev._id} development={dev} lang={lang} ui={devCardUi} />
            ))}
          </div>
        </div>
      </section>

      {/* Related lifestyles */}
      {otherTags.length > 0 && (
        <section style={{ padding: '48px 0' }}>
          <div className="container-editorial">
            <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              {l.relatedLifestyles}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {otherTags.map(t => (
                <Link
                  key={t}
                  href={`/${lang}/lifestyle/${LIFESTYLE_TAG_SLUGS[t]}`}
                  style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', border: '1px solid var(--border)', padding: '6px 14px', textDecoration: 'none' }}
                >
                  {dict.developments.lifestyleTagLabels[t as keyof typeof dict.developments.lifestyleTagLabels] ?? t}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDeveloperBySlug, getDevelopmentsByDeveloper, getAllDevelopers } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import DevelopmentCard from '@/components/DevelopmentCard'
import PortableTextRenderer from '@/components/PortableTextRenderer'
import { JsonLd } from '@/components/JsonLd'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portugaldevelopmentsreview.com').replace(/\/$/, '')

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  const developers = await getAllDevelopers()
  return (developers as any[]).map((d: any) => ({ slug: d.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const [dev, dict] = await Promise.all([
    getDeveloperBySlug(slug, locale),
    getDictionary(locale),
  ])
  if (!dev) return {}

  const title = dev.seoTitle || dict.seo.developers.profileTitle.replace('{name}', dev.name)
  const description = dev.seoDescription || dict.seo.developers.description
  const ogImageSource = dev.seoImage ?? dev.logo
  const ogImage = ogImageSource
    ? urlFor(ogImageSource).width(1200).height(630).fit('crop').auto('format').url()
    : undefined

  return {
    title,
    description,
    alternates: getAlternates(`/developers/${slug}`, lang),
    robots: dev.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: 'website',
      ...getOgLocale(lang),
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: dev.name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

export default async function DeveloperPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()

  const locale = lang
  const [dev, developments, dict] = await Promise.all([
    getDeveloperBySlug(slug, locale),
    getDevelopmentsByDeveloper(slug, locale),
    getDictionary(locale),
  ])

  if (!dev || dev.noindex === true) notFound()

  const d = dict.developers
  const devCardUi = {
    priceOnRequest: dict.common.priceOnRequest,
    featured: dict.common.featured,
    viewArrow: dict.common.viewArrow,
    statusLabels: dict.developments.statusLabels,
    typeLabels: dict.developments.typeLabels,
    priceLabels: dict.developments.priceLabels,
    lifestyleTagLabels: dict.developments.lifestyleTagLabels,
  }

  const pageUrl = `${BASE_URL}/${lang}/developers/${slug}`

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: dev.name,
    url: pageUrl,
    ...(dev.website && { sameAs: [dev.website] }),
    ...(dev.logo && { logo: urlFor(dev.logo).width(400).auto('format').url() }),
    ...(dev.foundedYear && { foundingDate: String(dev.foundedYear) }),
    ...(dev.headquartersCity && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: dev.headquartersCity,
        addressCountry: 'PT',
      },
    }),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.common.home, item: `${BASE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: d.breadcrumbDevelopers, item: `${BASE_URL}/${lang}/developers` },
      { '@type': 'ListItem', position: 3, name: dev.name, item: pageUrl },
    ],
  }

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={breadcrumbSchema} />

      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container-editorial">
          <nav aria-label="Breadcrumb">
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--muted)' }}>
              <li><Link href={`/${lang}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{dict.common.home}</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href={`/${lang}/developers`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{d.breadcrumbDevelopers}</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page" style={{ color: 'var(--foreground)' }}>{dev.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="container-editorial">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '60px', padding: '48px 0', alignItems: 'start' }}>
          <article>
            {/* Hero */}
            <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 12px' }}>
              {d.eyebrow}
            </p>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {dev.name}
            </h1>
            {dev.shortDescription && (
              <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'var(--muted)', margin: '0 0 40px' }}>
                {dev.shortDescription}
              </p>
            )}

            {/* Key facts */}
            {(dev.foundedYear || dev.headquartersCity || dev.website) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', border: '1px solid var(--border)', background: 'var(--border)', marginBottom: '40px' }}>
                {dev.foundedYear && (
                  <div style={{ background: 'var(--background)', padding: '16px' }}>
                    <dt style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>{d.foundedLabel}</dt>
                    <dd style={{ fontSize: '16px', fontWeight: 400, margin: 0 }}>{dev.foundedYear}</dd>
                  </div>
                )}
                {dev.headquartersCity && (
                  <div style={{ background: 'var(--background)', padding: '16px' }}>
                    <dt style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>{d.hqLabel}</dt>
                    <dd style={{ fontSize: '16px', fontWeight: 400, margin: 0 }}>{dev.headquartersCity}</dd>
                  </div>
                )}
                {dev.website && (
                  <div style={{ background: 'var(--background)', padding: '16px' }}>
                    <dt style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>{d.websiteLabel}</dt>
                    <dd style={{ margin: 0 }}>
                      <a
                        href={dev.website}
                        target="_blank"
                        rel="nofollow noopener"
                        style={{ fontSize: '15px', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
                      >
                        {new URL(dev.website).hostname.replace(/^www\./, '')}
                      </a>
                    </dd>
                  </div>
                )}
              </div>
            )}

            {/* Bio */}
            {dev.bio && dev.bio.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <PortableTextRenderer value={dev.bio} />
              </div>
            )}

            {/* Viriato badge */}
            {dev.isViriatoClient && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '40px' }}>
                <span style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {dict.developments.detail.viriatoClient}
                </span>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '80px' }}>
            <div style={{ border: '1px solid var(--border)', padding: '24px' }}>
              <Link
                href={`/${lang}/contact`}
                style={{ display: 'block', background: 'var(--foreground)', color: 'var(--background)', padding: '14px 24px', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center', marginBottom: '16px' }}
              >
                {d.contactCta}
              </Link>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
                {d.isYourCompany}
              </p>
              <Link
                href={`/${lang}/contact`}
                style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
              >
                {d.contactCta}
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Developments by this developer */}
      <section style={{ borderTop: '1px solid var(--border)', padding: '48px 0' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 32px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            {d.developmentsByHeading.replace('{name}', dev.name)}
          </p>
          {(developments as any[]).length === 0 ? (
            <p style={{ fontSize: '15px', color: 'var(--muted)' }}>{d.noDevelopmentsByDeveloper}</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
              {(developments as any[]).map((dev: any) => (
                <DevelopmentCard key={dev._id} development={dev} lang={lang} ui={devCardUi} />
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .developer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

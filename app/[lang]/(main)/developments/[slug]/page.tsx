import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getDevelopmentBySlug, getAllDevelopments } from '@/lib/queries'
import { urlFor } from '@/lib/sanity.image'
import DevelopmentCard from '@/components/DevelopmentCard'
import InquiryPanel from './InquiryPanel'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates } from '@/lib/i18n/metadata'

export const revalidate = 60
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params
  const dev = await getDevelopmentBySlug(slug, hasLocale(lang) ? lang : 'en')
  if (!dev) return {}
  return {
    title: `${dev.name} — ${dev.location.name}`,
    description: dev.editorialThesis || `Discover ${dev.name}, a curated new development in ${dev.location.name}, Portugal.`,
    alternates: getAlternates(`/developments/${slug}`),
  }
}

export async function generateStaticParams() {
  const developments = await getAllDevelopments()
  return developments.map((d: any) => ({ slug: d.slug.current }))
}

export default async function DevelopmentPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()

  const [dev, dict] = await Promise.all([
    getDevelopmentBySlug(slug, lang),
    getDictionary(lang),
  ])
  if (!dev) notFound()

  const d = dict.developments.detail
  const labels = dict.developments
  const devCardUi = { priceOnRequest: dict.common.priceOnRequest, featured: dict.common.featured, viewArrow: dict.common.viewArrow, statusLabels: labels.statusLabels, typeLabels: labels.typeLabels, priceLabels: labels.priceLabels, lifestyleTagLabels: labels.lifestyleTagLabels }
  const related = (dev.relatedDevelopments ?? []).slice(0, 3)

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
        <div className="container-editorial">
          <nav style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
            <Link href={`/${lang}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{dict.common.home}</Link>
            <span>›</span>
            <Link href={`/${lang}/developments`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{d.breadcrumbDevelopments}</Link>
            <span>›</span>
            <Link href={`/${lang}/locations/${dev.location.slug.current}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{dev.location.name}</Link>
            <span>›</span>
            <span style={{ color: 'var(--foreground)' }}>{dev.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{ aspectRatio: '16/7', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
          {dev.heroImage ? (
            <Image src={urlFor(dev.heroImage).width(1600).height(700).auto('format').url()} alt={dev.name} fill priority style={{ objectFit: 'cover' }} sizes="100vw" />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {dev.name} — {dev.location.name}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <div className="container-editorial">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '60px', padding: '48px 0', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
              {dev.location.name} · {(labels.statusLabels as Record<string, string>)[dev.status] ?? dev.status}{dev.type ? ` · ${(labels.typeLabels as Record<string, string>)[dev.type] ?? dev.type}` : ''}
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {dev.name}
            </h1>
            {dev.priceDisplay && (
              <p style={{ fontSize: '18px', fontFamily: 'sans-serif', color: 'var(--muted)', margin: '0 0 32px' }}>{(labels.priceLabels as Record<string, string>)[dev.priceDisplay] ?? dev.priceDisplay}</p>
            )}

            {dev.editorialThesis && (
              <div style={{ borderLeft: '2px solid var(--foreground)', paddingLeft: '24px', marginBottom: '40px' }}>
                <p style={{ fontSize: '18px', lineHeight: 1.6, margin: 0, color: 'var(--foreground)' }}>{dev.editorialThesis}</p>
              </div>
            )}

            {dev.keyFacts && dev.keyFacts.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 16px' }}>
                  {d.keyFacts}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1px', border: '1px solid var(--border)', background: 'var(--border)' }}>
                  {dev.keyFacts.map((fact: { label: string; value: string }, i: number) => (
                    <div key={i} style={{ background: 'var(--background)', padding: '16px' }}>
                      <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>{fact.label}</div>
                      <div style={{ fontSize: '16px', fontWeight: 400 }}>{fact.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dev.typologyNote && (
              <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                  {d.availability}
                </h2>
                <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{dev.typologyNote}</p>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginBottom: '40px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
                {d.developerLabel}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  {dev.developer.website ? (
                    <a href={dev.developer.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '16px', fontWeight: 400, color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                      {dev.developer.name}
                    </a>
                  ) : (
                    <div style={{ fontSize: '16px', fontWeight: 400 }}>{dev.developer.name}</div>
                  )}
                  {dev.developer.isViriatoClient && (
                    <div style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', marginTop: '4px' }}>{d.viriatoClient}</div>
                  )}
                </div>
                {dev.developer.logo && (
                  <Image src={urlFor(dev.developer.logo).height(48).auto('format').url()} alt={dev.developer.name} width={96} height={48} style={{ objectFit: 'contain', objectPosition: 'right' }} />
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                {d.locationContext}
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 12px' }}>
                {d.locationContextBody.replace('{name}', dev.name).replace('{location}', dev.location.name)}
              </p>
              <Link href={`/${lang}/locations/${dev.location.slug.current}`} style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}>
                {d.exploreLocation.replace('{location}', dev.location.name)}
              </Link>
            </div>

            {dev.lifestyleTags && dev.lifestyleTags.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
                  {d.lifestyle}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {dev.lifestyleTags.map((tag: string) => (
                    <span key={tag} style={{ fontSize: '12px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', border: '1px solid var(--border)', padding: '5px 12px' }}>
                      {(labels.lifestyleTagLabels as Record<string, string>)[tag] ?? tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'sticky', top: '80px' }}>
            <InquiryPanel development={dev} dict={dict.inquiry} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px 0' }}>
          <div className="container-editorial">
            <h2 style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 32px', letterSpacing: '-0.01em' }}>
              {d.relatedHeading.replace('{location}', dev.location.name)}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
              {related.map((r: any) => <DevelopmentCard key={r._id} development={r} lang={lang} ui={devCardUi} />)}
            </div>
          </div>
        </section>
      )}

      {dev.gallery && dev.gallery.length > 0 && (
        <section style={{ padding: '48px 0' }}>
          <div className="container-editorial">
            <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 24px' }}>
              {d.gallery}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1px', background: 'var(--border)' }}>
              {dev.gallery.filter((img: any) => img?.asset).map((img: any, i: number) => (
                <div key={img._key || i} style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', background: 'var(--surface)' }}>
                  <Image src={urlFor(img).width(800).height(600).auto('format').url()} alt={`${dev.name} — ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

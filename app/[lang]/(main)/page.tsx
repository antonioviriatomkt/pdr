import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DevelopmentCard from '@/components/DevelopmentCard'
import ArticleCard from '@/components/ArticleCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getFeaturedDevelopments, getAllLocations, getLatestArticles } from '@/lib/queries'
import { getDictionary, hasLocale } from '@/lib/i18n'
import { getAlternates, getOgLocale } from '@/lib/i18n/metadata'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(hasLocale(lang) ? lang : 'en')
  return {
    title: dict.seo.home.title,
    description: dict.seo.home.description,
    alternates: getAlternates('', lang),
    openGraph: { type: 'website', ...getOgLocale(lang) },
  }
}

export const revalidate = 60

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const [featured, locations, latestArticles, dict] = await Promise.all([
    getFeaturedDevelopments(lang),
    getAllLocations(lang),
    getLatestArticles(3, lang),
    getDictionary(lang),
  ])

  const t = dict.home
  const devCardUi = { priceOnRequest: dict.common.priceOnRequest, featured: dict.common.featured, viewArrow: dict.common.viewArrow, statusLabels: dict.developments.statusLabels, typeLabels: dict.developments.typeLabels, priceLabels: dict.developments.priceLabels, lifestyleTagLabels: dict.developments.lifestyleTagLabels }
  const categories = dict.journal.categories

  return (
    <>
      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '88px 0 80px' }}>
        <div className="container-editorial">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '80px', alignItems: 'end' }} className="hero-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', margin: 0, flexShrink: 0 }}>
                  {t.hero.eyebrow}
                </p>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>
              <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, margin: '0 0 40px', letterSpacing: '-0.02em' }}>
                {t.hero.headline}
              </h1>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href={`/${lang}/developments`} style={{ display: 'inline-block', background: 'var(--foreground)', color: 'var(--background)', padding: '14px 28px', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
                  {t.hero.exploreBtn}
                </Link>
                <Link href={`/${lang}/developments`} style={{ display: 'inline-block', border: '1px solid var(--border)', color: 'var(--foreground)', padding: '14px 28px', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
                  {t.hero.browseBtn}
                </Link>
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '48px', paddingBottom: '4px' }} className="hero-aside">
              <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.75, margin: '0 0 32px' }}>
                {t.hero.aside}
              </p>
              <Link href={`/${lang}/methodology`} style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                {dict.common.readMethodology}
              </Link>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
            .hero-aside { border-left: none !important; padding-left: 0 !important; border-top: 1px solid var(--border); padding-top: 28px !important; }
          }
        `}</style>
      </section>

      {/* Locations */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
        <div className="container-editorial">
          <div className="locations-bar" style={{ display: 'flex', alignItems: 'baseline', gap: '36px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', flexShrink: 0 }}>
              {dict.common.locations}
            </span>
            {locations.map((loc: any) => (
              <Link key={loc._id} href={`/${lang}/locations/${loc.slug.current}`} style={{ fontSize: '15px', color: 'var(--foreground)', textDecoration: 'none', flexShrink: 0 }}>
                {loc.name}
              </Link>
            ))}
            <Link href={`/${lang}/locations`} className="locations-bar-all" style={{ marginLeft: 'auto', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              {dict.common.viewAll}
            </Link>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .locations-bar { gap: 20px; } .locations-bar-all { margin-left: 0 !important; } }`}</style>
      </section>

      {/* Featured Developments */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-editorial">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 6px' }}>
                {t.featured.eyebrow}
              </p>
              <h2 style={{ fontSize: '28px', fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>
                {t.featured.heading}
              </h2>
            </div>
            <Link href={`/${lang}/developments`} style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
              {dict.common.viewAll}
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {featured.map((dev: any) => (
              <DevelopmentCard key={dev._id} development={dev} lang={lang} ui={devCardUi} />
            ))}
          </div>
        </div>
      </section>


      {/* Shortlist / Newsletter */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-editorial">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '60px', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 16px' }}>
                {t.shortlist.eyebrow}
              </p>
              <h2 style={{ fontSize: '28px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                {t.shortlist.heading}
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                {t.shortlist.body}
              </p>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '60px' }} className="newsletter-form-col">
              <NewsletterSignup dict={dict.newsletter} />
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { .newsletter-form-col { border-left: none !important; padding-left: 0 !important; } }`}</style>
      </section>

      {/* Our Approach */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-editorial">
          <div className="approach-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 16px' }}>
                {t.approach.eyebrow}
              </p>
              <h2 style={{ fontSize: '28px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                {t.approach.heading}
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 20px' }}>
                {t.approach.body1}
              </p>
              <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 28px' }}>
                {t.approach.body2}
              </p>
              <Link href={`/${lang}/methodology`} style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}>
                {dict.common.readMethodology}
              </Link>
            </div>
            <div className="approach-aside" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '60px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                {t.approach.criteriaHeading}
              </div>
              {t.approach.criteria.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'start' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>—</span>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journal */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-editorial">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 6px' }}>
                {t.journal.eyebrow}
              </p>
              <h2 style={{ fontSize: '28px', fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>
                {t.journal.heading}
              </h2>
            </div>
            <Link href={`/${lang}/journal`} style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
              {dict.common.allArticles}
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {latestArticles.map((article: any) => (
              <div key={article._id}>
                {article.category === 'market-intelligence' && (
                  <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px' }}>
                    {dict.journal.marketNoteEyebrow}
                  </p>
                )}
                <ArticleCard article={article} lang={lang} categories={categories} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Developers */}
      <section style={{ padding: '64px 0', background: 'var(--surface)' }}>
        <div className="container-editorial">
          <div style={{ maxWidth: '540px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 16px' }}>
              {t.forDevelopers.eyebrow}
            </p>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
              {t.forDevelopers.heading}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 24px' }}>
              {t.forDevelopers.body}
            </p>
            <Link href={`/${lang}/for-developers`} style={{ fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}>
              {dict.common.learnMore}
            </Link>
          </div>
        </div>
      </section>
      <style>{`
        @media (max-width: 768px) {
          .approach-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .approach-aside { border-left: none !important; padding-left: 0 !important; border-top: 1px solid var(--border); padding-top: 28px !important; }
        }
      `}</style>
    </>
  )
}

import Link from 'next/link'
import DevelopmentCard from '@/components/DevelopmentCard'
import ArticleCard from '@/components/ArticleCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getFeaturedDevelopments, getAllLocations, getLatestArticles } from '@/lib/queries'

export const revalidate = 60

export default async function HomePage() {
  const [featured, locations, latestArticles] = await Promise.all([
    getFeaturedDevelopments(),
    getAllLocations(),
    getLatestArticles(3),
  ])

  return (
    <>
      {/* Hero */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '80px 0 72px' }}>
        <div className="container-editorial">
          <div style={{ maxWidth: '640px' }}>
            <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '24px', margin: '0 0 24px' }}>
              Portugal Developments Review
            </p>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.15, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
              Curated new developments across Portugal.
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 36px', maxWidth: '520px' }}>
              An editorial platform for exceptional new residential projects — curated through independent selection, location intelligence, and premium presentation.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link
                href="/developments"
                style={{
                  display: 'inline-block',
                  background: 'var(--foreground)',
                  color: 'var(--background)',
                  padding: '14px 28px',
                  fontSize: '13px',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Explore Developments
              </Link>
              <Link
                href="/developments"
                style={{
                  display: 'inline-block',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  padding: '14px 28px',
                  fontSize: '13px',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Browse by Location
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Location quick nav */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '20px 0', background: 'var(--surface)' }}>
        <div className="container-editorial">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontFamily: 'sans-serif', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Browse:
            </span>
            {[
              { href: '/locations/lisbon', label: 'Lisbon' },
              { href: '/locations/porto', label: 'Porto' },
              { href: '/locations/cascais', label: 'Cascais' },
              { href: '/locations/algarve', label: 'Algarve' },
              { href: '/locations/comporta', label: 'Comporta' },
              { href: '/locations/gaia', label: 'Gaia' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: '12px',
                  fontFamily: 'sans-serif',
                  letterSpacing: '0.04em',
                  border: '1px solid var(--border)',
                  padding: '6px 14px',
                  color: 'var(--foreground)',
                  textDecoration: 'none',
                  background: 'var(--background)',
                }}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/developments"
              style={{
                marginLeft: 'auto',
                fontSize: '12px',
                fontFamily: 'sans-serif',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border)',
              }}
            >
              All Developments →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Developments */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-editorial">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 6px' }}>
                Featured
              </p>
              <h2 style={{ fontSize: '28px', fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>
                Selected Developments
              </h2>
            </div>
            <Link
              href="/developments"
              style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
            >
              View All →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {featured.map((dev: any) => (
              <DevelopmentCard key={dev._id} development={dev} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Location */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="container-editorial">
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 6px' }}>
              Location Intelligence
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>
              Browse by Location
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1px', border: '1px solid var(--border)', background: 'var(--border)' }}>
            {locations.map((loc: any) => (
              <Link key={loc._id} href={`/locations/${loc.slug.current}`} style={{ textDecoration: 'none', display: 'block', background: 'var(--background)', padding: '28px 24px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
                  {loc.region}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '8px' }}>
                  {loc.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {loc.intro?.slice(0, 80)}...
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Shortlist signup */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-editorial">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '60px', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 16px' }}>
                The Shortlist
              </p>
              <h2 style={{ fontSize: '28px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                Be first to see what matters.
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                Receive PDR&rsquo;s private monthly shortlist of exceptional new developments in Lisbon, Porto, Cascais, Algarve, Comporta, and beyond.
              </p>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '60px' }} className="newsletter-form-col">
              <NewsletterSignup />
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .newsletter-form-col {
              border-left: none !important;
              padding-left: 0 !important;
            }
          }
        `}</style>
      </section>

      {/* Editorial Spotlight / Methodology teaser */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container-editorial">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 16px' }}>
                Our Approach
              </p>
              <h2 style={{ fontSize: '28px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                How we select the developments on this platform.
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 20px' }}>
                Portugal Developments Review does not operate as a listings portal. Each development that appears on this platform has been considered through our curation methodology — assessed against criteria that include architectural quality, developer track record, location fundamentals, and the coherence of the project proposition.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 28px' }}>
                We are not a brokerage. We are a discovery platform with an editorial point of view.
              </p>
              <Link
                href="/methodology"
                style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}
              >
                Read Our Methodology →
              </Link>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '60px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                Selection Criteria
              </div>
              {[
                'Architectural quality and design coherence',
                'Developer track record and credibility',
                'Location fundamentals and demand drivers',
                'Specification and delivery integrity',
                'Authenticity of project proposition',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'start' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'sans-serif', color: 'var(--muted)', marginTop: '3px' }}>—</span>
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
              <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 6px' }}>
                Insights
              </p>
              <h2 style={{ fontSize: '28px', fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>
                Journal
              </h2>
            </div>
            <Link
              href="/journal"
              style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
            >
              All Articles →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {latestArticles.map((article: any) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Developer invitation */}
      <section style={{ padding: '64px 0', background: 'var(--surface)' }}>
        <div className="container-editorial">
          <div style={{ maxWidth: '540px' }}>
            <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 16px' }}>
              For Developers
            </p>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
              Is your development exceptional enough to be considered?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 24px' }}>
              We work with a small number of developers who meet our curation criteria. Viriato clients receive editorial placement as part of their service package. Selected non-clients may be considered through a separate route.
            </p>
            <Link
              href="/for-developers"
              style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}
            >
              Learn More →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

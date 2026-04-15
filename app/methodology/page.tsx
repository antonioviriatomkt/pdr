import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Methodology — How We Curate New Developments',
  description: 'Our editorial curation process for selecting new developments in Portugal. Why curation matters, selection criteria, and how developers can be considered.',
}

export default function MethodologyPage() {
  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            Our Process
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Methodology
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '560px', margin: 0 }}>
            Why curation matters — and how we decide what appears on this platform.
          </p>
        </div>
      </section>

      <div className="container-editorial">
        <div style={{ maxWidth: '680px', padding: '56px 0' }}>

          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              Why curation matters
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              Portugal&apos;s new development market has expanded significantly over the past decade. The pipeline of projects has grown faster than the market&apos;s capacity for consistent quality. Not all developments that present themselves as premium are premium in any meaningful sense.
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              For a serious buyer — whether purchasing a primary residence, a second home, or an investment asset — navigating this landscape without guidance is time-consuming and risky. Branded photography and polished brochures are not a reliable proxy for quality.
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              Portugal Developments Review exists to perform an independent editorial function: to review the market, apply consistent criteria, and present only those developments that meet our threshold. The result is a smaller, more considered selection — one that a serious buyer can trust.
            </p>
          </section>

          <hr style={{ margin: '0 0 56px' }} />

          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              Selection criteria
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 24px' }}>
              We assess each development against five principal dimensions:
            </p>

            {[
              {
                title: 'Architectural quality and design coherence',
                body: 'We look for projects where design is purposeful — where form, materials, and spatial organisation are consistent with the project\'s stated proposition. Facade-level architecture does not qualify. We are looking for coherence from the brief to the detail.',
              },
              {
                title: 'Developer track record and credibility',
                body: 'The developer behind a project matters as much as the project itself. We examine previous deliveries, the organisation\'s financial standing, and the integrity with which it has handled past buyers. Off-plan promises must be evaluated against a history of delivery.',
              },
              {
                title: 'Location fundamentals and demand drivers',
                body: 'Location is not simply a postcode. We assess the specific site, the immediate context, transport and infrastructure access, and the medium-term factors that will sustain or erode demand. A well-designed development in a structurally weak location is still a risk.',
              },
              {
                title: 'Specification and delivery integrity',
                body: 'Specification claims — smart home systems, sustainable materials, premium appliances — must be credible and proportionate to the price point. We look for specifications that are genuinely deliverable at the stated price, not aspirational.',
              },
              {
                title: 'Authenticity of project proposition',
                body: 'Every development tells a story about itself. We assess whether that story is coherent, honest, and supported by evidence. Projects that make aspirational claims without substance are excluded regardless of their other qualities.',
              },
            ].map((item, i) => (
              <div key={i} style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', paddingBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 400, margin: '0 0 12px' }}>{item.title}</h3>
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </section>

          <hr style={{ margin: '0 0 56px' }} />

          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              What may limit inclusion
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              A development may be excluded or deferred for reasons that are not about quality:
            </p>
            <ul style={{ margin: '0 0 16px', paddingLeft: '0', listStyle: 'none' }}>
              {[
                'Insufficient information available to make a responsible assessment',
                'Active legal or regulatory disputes involving the project',
                'Lack of cooperation from the developer in the review process',
                'Project is too early-stage for meaningful editorial assessment',
                'The project conflicts with developments already featured in the same location at the same price point',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'start' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>—</span>
                  <span style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <hr style={{ margin: '0 0 56px' }} />

          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              Review and update process
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              The real estate development process is dynamic. Projects change. Developers encounter difficulties. Market conditions shift. Our editorial team monitors listed developments on an ongoing basis and will update, qualify, or remove a project if material information changes.
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: 0 }}>
              This is not a set-and-forget directory. It is a living editorial platform.
            </p>
          </section>

          <hr style={{ margin: '0 0 56px' }} />

          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              How developers can be considered
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 16px' }}>
              Viriato clients are assessed for inclusion as part of their existing service relationship. This is not automatic — the editorial standards apply equally to client and non-client projects — but the review process is initiated as part of the client engagement.
            </p>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 24px' }}>
              Non-client developers may submit their projects for consideration. There is no fee for this initial assessment. If a project meets our threshold, it may be included in the platform. We will also consider formal arrangements for featured placement with developers whose projects are included.
            </p>
            <Link
              href="/for-developers"
              style={{ fontSize: '13px', fontFamily: 'sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--foreground)' }}
            >
              Information for Developers →
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}

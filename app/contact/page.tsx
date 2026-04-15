import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact — Register Interest',
  description: 'Get in touch with Portugal Developments Review. Register interest in a development, request a brochure, or make a general enquiry.',
}

export default function ContactPage() {
  return (
    <>
      <section style={{ borderBottom: '1px solid var(--border)', padding: '56px 0 48px' }}>
        <div className="container-editorial">
          <p style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 10px' }}>
            Enquiries
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Contact
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '480px', margin: 0 }}>
            Register interest in a development, ask a question, or tell us what you are looking for. We respond within one business day.
          </p>
        </div>
      </section>

      <div className="container-editorial">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', padding: '56px 0', alignItems: 'start' }}>
          <div>
            <ContactForm />
          </div>

          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '80px' }}>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
                What happens next
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--muted)' }}>
                Your enquiry reaches our team first. We qualify the request and connect you with the relevant development team or advisor. We do not pass your details to third parties without your knowledge.
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '12px' }}>
                Response time
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--muted)' }}>
                Within one business day. Enquiries received outside business hours are acknowledged the following morning.
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>
                Other ways to reach us
              </div>
              <div style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 2 }}>
                <div>Email: contact@pdr.pt</div>
                <div>For developers: <a href="/for-developers" style={{ color: 'var(--foreground)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>Developer information →</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

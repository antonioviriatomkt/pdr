import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data.email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const lines = [
      `New shortlist signup — Portugal Developments Review`,
      ``,
      `Email: ${data.email}`,
      ``,
      `Submitted: ${new Date().toISOString()}`,
    ].join('\n')

    const resendApiKey = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL || 'antonioviriatomkt@gmail.com'

    if (resendApiKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendApiKey)

      await resend.emails.send({
        from: 'Portugal Developments Review <noreply@pdr.pt>',
        to: contactEmail,
        subject: `PDR Shortlist Signup — ${data.email}`,
        text: lines,
      })
    } else {
      console.log('[PDR Newsletter Signup]')
      console.log(lines)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Newsletter signup error]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

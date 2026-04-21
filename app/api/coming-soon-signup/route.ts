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

    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendApiKey)

      const audienceId = process.env.RESEND_AUDIENCE_ID
      if (audienceId) {
        await resend.contacts.create({
          email: data.email,
          audienceId,
          unsubscribed: false,
        })
      }

      const contactEmail = process.env.CONTACT_EMAIL || 'antonioviriatomkt@gmail.com'
      await resend.emails.send({
        from: 'Portugal Developments Review <noreply@pdr.pt>',
        to: contactEmail,
        subject: `PDR Launch Alert Signup — ${data.email}`,
        text: [
          `New launch alert signup — Portugal Developments Review`,
          ``,
          `Email: ${data.email}`,
          ``,
          `Submitted: ${new Date().toISOString()}`,
        ].join('\n'),
      })
    } else {
      console.log(`[PDR Coming Soon Signup] ${data.email}`)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Coming soon signup error]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Basic validation
    if (!data.name || !data.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Build email content
    const lines = [
      `New enquiry from Portugal Developments Review`,
      ``,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      data.type ? `Enquiry type: ${data.type}` : null,
      data.enquiryType ? `Enquiry type: ${data.enquiryType}` : null,
      data.development ? `Development: ${data.development}` : null,
      data.location ? `Location: ${data.location}` : null,
      data.message ? `\nMessage:\n${data.message}` : null,
      ``,
      `Submitted: ${new Date().toISOString()}`,
    ].filter(Boolean).join('\n')

    // If Resend is configured, send email
    const resendApiKey = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL || 'antonioviriatomkt@gmail.com'

    if (resendApiKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendApiKey)

      await resend.emails.send({
        from: 'Portugal Developments Review <noreply@pdr.pt>',
        to: contactEmail,
        replyTo: data.email,
        subject: `PDR Enquiry — ${data.type || data.enquiryType || 'General'} — ${data.name}`,
        text: lines,
      })
    } else {
      // Log to console in development
      console.log('[PDR Contact Form Submission]')
      console.log(lines)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Contact form error]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getDevelopmentBySlug } from '@/lib/queries'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const dev = await getDevelopmentBySlug(slug)

  if (!dev?.brochureUrl) {
    return new NextResponse('Not found', { status: 404 })
  }

  const upstream = await fetch(dev.brochureUrl, { next: { revalidate: 86400 } })
  if (!upstream.ok) {
    return new NextResponse('Could not fetch brochure', { status: 502 })
  }

  const contentType = upstream.headers.get('content-type') ?? 'application/pdf'
  const body = await upstream.arrayBuffer()

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

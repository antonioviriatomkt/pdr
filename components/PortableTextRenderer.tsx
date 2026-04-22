import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.image'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p style={{ margin: '0 0 1.5em', fontSize: '16px', lineHeight: 1.8, color: 'var(--foreground)' }}>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 400, letterSpacing: '-0.02em', margin: '2em 0 0.75em', lineHeight: 1.3 }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 400, letterSpacing: '-0.01em', margin: '1.75em 0 0.5em', lineHeight: 1.4 }}>
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{ borderLeft: '2px solid var(--border)', margin: '2em 0', paddingLeft: '24px', fontStyle: 'italic', color: 'var(--muted)' }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ margin: '0 0 1.5em', paddingLeft: '1.25em', lineHeight: 1.8, fontSize: '16px' }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol style={{ margin: '0 0 1.5em', paddingLeft: '1.25em', lineHeight: 1.8, fontSize: '16px' }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li style={{ marginBottom: '0.5em' }}>{children}</li>,
    number: ({ children }) => <li style={{ marginBottom: '0.5em' }}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const isExternal = value?.href && !value.href.startsWith('/')
      return (
        <a
          href={value?.href}
          style={{ color: 'var(--foreground)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      const src = urlFor(value).width(900).auto('format').url()
      return (
        <figure style={{ margin: '2em 0' }}>
          <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--surface)' }}>
            <Image
              src={src}
              alt={value.alt || ''}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
          {value.caption && (
            <figcaption style={{ fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.5 }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortableTextRenderer({ value }: { value: any[] }) {
  if (!value?.length) return null
  return <PortableText value={value} components={components} />
}

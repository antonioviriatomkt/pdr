'use client'
import { useState } from 'react'

interface ShareBarDict {
  share: string
  copyLink: string
  copied: string
}

export default function ShareBar({ url, title, dict }: { url: string; title: string; dict: ShareBarDict }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  const linkStyle: React.CSSProperties = {
    fontSize: '13px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--foreground)',
    textDecoration: 'none',
    borderBottom: '1px solid var(--border)',
    background: 'none',
    border: 'none',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--border)',
    padding: 0,
    cursor: 'pointer',
    fontFamily: 'inherit',
  }

  return (
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '32px' }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 14px' }}>
        {dict.share}
      </p>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <button onClick={handleCopy} style={linkStyle}>
          {copied ? dict.copied : dict.copyLink}
        </button>
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          X (Twitter)
        </a>
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          LinkedIn
        </a>
      </div>
    </div>
  )
}

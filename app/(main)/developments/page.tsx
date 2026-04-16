import type { Metadata } from 'next'
import DevelopmentsIndex from './DevelopmentsIndex'

export const metadata: Metadata = {
  title: 'New Developments in Portugal',
  description: 'Browse curated new residential developments across Portugal — Lisbon, Porto, Cascais, Algarve, Comporta, and Gaia. Filtered by location, type, and status.',
}

export default function DevelopmentsPage() {
  return <DevelopmentsIndex />
}

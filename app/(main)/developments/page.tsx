import type { Metadata } from 'next'
import DevelopmentsIndex from './DevelopmentsIndex'
import { getAllDevelopments, getAllLocations } from '@/lib/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'New Developments in Portugal',
  description: 'Browse curated new residential developments across Portugal — Lisbon, Porto, Cascais, Algarve, Comporta, and Gaia. Filtered by location, type, and status.',
}

export default async function DevelopmentsPage() {
  const [developments, locations] = await Promise.all([
    getAllDevelopments(),
    getAllLocations(),
  ])
  return <DevelopmentsIndex developments={developments} locations={locations} />
}

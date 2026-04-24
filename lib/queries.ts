import { client } from './sanity.client'
import {
  demoLocations,
  demoDevelopers,
  demoDevelopments,
  demoArticles,
  demoJournalCategories,
  demoLifestyles,
} from './demo-data'

async function safeFetch<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher()
  } catch {
    return fallback
  }
}

// Developments
export async function getFeaturedDevelopments(lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "development" && isFeatured == true] | order(publishedAt desc) [0...6] {
        _id, name, slug, status, type, priceDisplay, isFeatured,
        lifestyleTags, heroImage,
        "editorialThesis": coalesce(editorialThesis[$lang], editorialThesis.en),
        primaryCta,
        location->{ name, slug },
        developer->{ name, slug }
      }
    `, { lang }, { next: { revalidate: 300 } }),
    demoDevelopments.filter(d => d.isFeatured) as any[]
  )
}

export async function getAllDevelopments(lang = 'en', filters?: {
  location?: string
  type?: string
  status?: string
  sort?: string
}) {
  let filter = '*[_type == "development"]'
  const conditions: string[] = []

  if (filters?.location) conditions.push(`location->slug.current == "${filters.location}"`)
  if (filters?.type) conditions.push(`type == "${filters.type}"`)
  if (filters?.status) conditions.push(`status == "${filters.status}"`)

  if (conditions.length) filter += ` && (${conditions.join(' && ')})`

  const sort = filters?.sort === 'newest' ? 'publishedAt desc' : 'isFeatured desc, publishedAt desc'

  const fallback = demoDevelopments.filter(d => {
    if (filters?.location && d.location.slug.current !== filters.location) return false
    if (filters?.type && d.type !== filters.type) return false
    if (filters?.status && d.status !== filters.status) return false
    return true
  })

  return safeFetch(
    () => client.fetch(`
      ${filter} | order(${sort}) {
        _id, name, slug, status, type, priceDisplay, isFeatured,
        lifestyleTags, heroImage, publishedAt,
        "editorialThesis": coalesce(editorialThesis[$lang], editorialThesis.en),
        primaryCta,
        location->{ name, slug },
        developer->{ name, slug }
      }
    `, { lang }, { next: { revalidate: 300 } }),
    fallback as any[]
  )
}

export async function getDevelopmentBySlug(slug: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "development" && slug.current == $slug][0] {
        _id, name, slug, status, type, priceDisplay, isFeatured,
        lifestyleTags, heroImage,
        "gallery": gallery[defined(image.asset._ref)] { _key, "asset": image.asset, "hotspot": image.hotspot, "crop": image.crop, alt },
        "editorialThesis": coalesce(editorialThesis[$lang], editorialThesis.en),
        "typologyNote": coalesce(typologyNote[$lang], typologyNote.en),
        "whyStandsOut": coalesce(whyStandsOut[$lang], whyStandsOut.en),
        "areaGuide": coalesce(areaGuide[$lang], areaGuide.en),
        keyFacts, primaryCta,
        publishedAt,
        location->{ name, slug, "intro": coalesce(intro[$lang], intro.en), region },
        developer->{ name, slug, logo, description, website, isViriatoClient },
        relatedDevelopments[]->{ name, slug, heroImage, status, type, priceDisplay, location->{ name } },
        relatedArticles[]->{ "title": coalesce(title[$lang], title.en), slug, heroImage, category, "excerpt": coalesce(excerpt[$lang], excerpt.en), publishedAt },
        seoTitle, seoDescription, seoImage, noindex,
        "brochureUrl": brochure.asset->url
      }
    `, { slug, lang }, { next: { revalidate: 3600 } }),
    (demoDevelopments.find(d => d.slug.current === slug) ?? null) as any
  )
}

// Locations
export async function getAllLocations(lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "location"] | order(name asc) {
        _id, name, slug, region, heroImage, locationType,
        "intro": coalesce(intro[$lang], intro.en),
        parentLocation->{ name, slug }
      }
    `, { lang }, { next: { revalidate: 3600 } }),
    demoLocations as any[]
  )
}

export async function getLocationBySlug(slug: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "location" && slug.current == $slug][0] {
        _id, name, slug, region, heroImage, seoImage, locationType,
        "intro": coalesce(intro[$lang], intro.en),
        "marketFraming": coalesce(marketFraming[$lang], marketFraming.en),
        parentLocation->{ name, slug, parentLocation->{ name, slug } },
        nearbyLocations[]->{ name, slug, heroImage },
        latitude, longitude, noindex,
        seoTitle, seoDescription
      }
    `, { slug, lang }, { next: { revalidate: 3600 } }),
    (demoLocations.find(l => l.slug.current === slug) ?? null) as any
  )
}

export async function getLocationChildren(parentSlug: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "location" && parentLocation->slug.current == $parentSlug] | order(name asc) {
        _id, name, slug, region, heroImage, locationType,
        "intro": coalesce(intro[$lang], intro.en)
      }
    `, { parentSlug, lang }, { next: { revalidate: 3600 } }),
    demoLocations.filter(l => (l as any).parentLocation?.slug?.current === parentSlug) as any[]
  )
}

export async function getLocationBreadcrumbs(slug: string, lang = 'en'): Promise<any[]> {
  const chain: any[] = []
  let currentSlug: string | undefined = slug
  const visited = new Set<string>()
  while (currentSlug && !visited.has(currentSlug)) {
    visited.add(currentSlug)
    const loc = await getLocationBySlug(currentSlug, lang)
    if (!loc) break
    chain.unshift({ name: loc.name, slug: loc.slug })
    currentSlug = loc.parentLocation?.slug?.current
  }
  return chain
}

export async function getDevelopmentsByLocation(locationSlug: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "development" && location->slug.current == $locationSlug] | order(isFeatured desc, publishedAt desc) {
        _id, name, slug, status, type, priceDisplay, isFeatured,
        heroImage,
        "editorialThesis": coalesce(editorialThesis[$lang], editorialThesis.en),
        primaryCta,
        location->{ name, slug }
      }
    `, { locationSlug, lang }, { next: { revalidate: 300 } }),
    demoDevelopments.filter(d => d.location.slug.current === locationSlug) as any[]
  )
}

// Journal
export async function getLatestArticles(limit = 6, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "journalArticle"] | order(publishedAt desc) [0...$limit] {
        _id,
        "title": coalesce(title[$lang], title.en),
        slug, category, heroImage,
        "excerpt": coalesce(excerpt[$lang], excerpt.en),
        publishedAt,
        linkedLocation->{ name, slug },
        linkedDevelopment->{ name, slug }
      }
    `, { limit, lang }, { next: { revalidate: 300 } }),
    demoArticles.slice(0, limit) as any[]
  )
}

export async function getArticlesByCategory(category: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "journalArticle" && category == $category] | order(publishedAt desc) {
        _id,
        "title": coalesce(title[$lang], title.en),
        slug, category, heroImage,
        "excerpt": coalesce(excerpt[$lang], excerpt.en),
        publishedAt,
        linkedLocation->{ name, slug }
      }
    `, { category, lang }, { next: { revalidate: 300 } }),
    demoArticles.filter(a => a.category === category) as any[]
  )
}

export async function getArticleBySlug(slug: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "journalArticle" && slug.current == $slug][0] {
        _id,
        "title": coalesce(title[$lang], title.en),
        slug, category, heroImage, seoImage,
        "excerpt": coalesce(excerpt[$lang], excerpt.en),
        "body": coalesce(body[$lang], body.en),
        publishedAt, _updatedAt, noindex, isPillar,
        linkedLocation->{ name, slug, "intro": coalesce(intro[$lang], intro.en) },
        linkedDevelopment->{ name, slug, heroImage, status, priceDisplay },
        seoTitle, seoDescription
      }
    `, { slug, lang }, { next: { revalidate: 3600 } }),
    (demoArticles.find(a => a.slug.current === slug) ?? null) as any
  )
}

export async function getAllArticles(lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "journalArticle"] | order(publishedAt desc) {
        _id,
        "title": coalesce(title[$lang], title.en),
        slug, category, publishedAt
      }
    `, { lang }, { next: { revalidate: 3600 } }),
    demoArticles as any[]
  )
}

export async function getPillarArticles(lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "journalArticle" && isPillar == true && !(_id in path("drafts.**")) && noindex != true] | order(publishedAt desc) {
        _id,
        "title": coalesce(title[$lang], title.en),
        slug, category, heroImage,
        "excerpt": coalesce(excerpt[$lang], excerpt.en),
        publishedAt
      }
    `, { lang }, { next: { revalidate: 3600 } }),
    demoArticles.filter(a => (a as any).isPillar) as any[]
  )
}

export async function getActiveLifestyleTags(): Promise<string[]> {
  return safeFetch(
    () => client.fetch(`
      array::unique(*[_type == "development" && defined(lifestyleTags) && noindex != true].lifestyleTags[])
    `, {}, { next: { revalidate: 3600 } }),
    [...new Set(demoDevelopments.flatMap(d => d.lifestyleTags ?? []))]
  )
}

export async function getDevelopmentsByLifestyle(tag: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "development" && $lifestyleTag in lifestyleTags && noindex != true] | order(isFeatured desc, publishedAt desc) {
        _id, name, slug, status, type, priceDisplay, isFeatured,
        lifestyleTags, heroImage,
        "editorialThesis": coalesce(editorialThesis[$lang], editorialThesis.en),
        primaryCta,
        location->{ name, slug },
        developer->{ name, slug }
      }
    `, { lifestyleTag: tag, lang }, { next: { revalidate: 300 } }),
    demoDevelopments.filter(d => d.lifestyleTags?.includes(tag)) as any[]
  )
}

export async function getLifestyle(slug: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "lifestyle" && slug.current == $slug && noindex != true][0] {
        tag, slug,
        "intro": coalesce(intro[$lang], intro.en),
        heroImage, seoTitle, seoDescription, noindex
      }
    `, { slug, lang }, { next: { revalidate: 3600 } }),
    (demoLifestyles.find(l => l.slug.current === slug) ?? null) as any
  )
}

export async function getCategoriesWithArticles(): Promise<string[]> {
  return safeFetch(
    () => client.fetch(`
      array::unique(*[_type == "journalArticle" && !(_id in path("drafts.**")) && noindex != true].category)
    `, {}, { next: { revalidate: 3600 } }),
    [...new Set(demoArticles.map(a => a.category))]
  )
}

export async function getJournalCategory(slug: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "journalCategory" && slug == $slug][0] {
        slug,
        "title": coalesce(title[$lang], title.en),
        "intro": coalesce(intro[$lang], intro.en),
        seoTitle, seoDescription
      }
    `, { slug, lang }, { next: { revalidate: 3600 } }),
    (demoJournalCategories.find(c => c.slug === slug) ?? null) as any
  )
}

export async function getArticlesByLocation(locationSlug: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "journalArticle" && (linkedLocation->slug.current == $locationSlug || $locationSlug in compareLocations[]->slug.current)] | order(publishedAt desc) [0...6] {
        _id,
        "title": coalesce(title[$lang], title.en),
        slug, category, heroImage,
        "excerpt": coalesce(excerpt[$lang], excerpt.en),
        publishedAt,
        "isComparison": $locationSlug in compareLocations[]->slug.current && linkedLocation->slug.current != $locationSlug
      }
    `, { locationSlug, lang }, { next: { revalidate: 300 } }),
    demoArticles
      .filter(a => (a as any).linkedLocation?.slug?.current === locationSlug || ((a as any).compareLocations ?? []).some((l: any) => l.slug?.current === locationSlug))
      .slice(0, 6)
      .map(a => ({
        ...a,
        isComparison: (a as any).linkedLocation?.slug?.current !== locationSlug && ((a as any).compareLocations ?? []).some((l: any) => l.slug?.current === locationSlug),
      })) as any[]
  )
}

// Developers
export async function getAllDevelopers(lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "developer" && noindex != true] | order(name asc) {
        _id, name, slug, website, isViriatoClient, foundedYear, headquartersCity,
        logo,
        "shortDescription": coalesce(shortDescription[$lang], shortDescription.en),
        "developmentCount": count(*[_type == "development" && references(^._id) && noindex != true])
      }
    `, { lang }, { next: { revalidate: 3600 } }),
    demoDevelopers.map(dev => ({
      ...dev,
      shortDescription: dev.shortDescription,
      developmentCount: demoDevelopments.filter(d => d.developer._id === dev._id).length,
    })) as any[]
  )
}

export async function getDeveloperBySlug(slug: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "developer" && slug.current == $slug][0] {
        _id, name, slug, website, isViriatoClient, foundedYear, headquartersCity,
        logo,
        "shortDescription": coalesce(shortDescription[$lang], shortDescription.en),
        "bio": coalesce(bio[$lang], bio.en),
        seoTitle, seoDescription, seoImage, noindex
      }
    `, { slug, lang }, { next: { revalidate: 3600 } }),
    (demoDevelopers.find(d => d.slug.current === slug) ?? null) as any
  )
}

export async function getDevelopmentsByDeveloper(developerSlug: string, lang = 'en') {
  return safeFetch(
    () => client.fetch(`
      *[_type == "development" && developer->slug.current == $developerSlug && noindex != true] | order(isFeatured desc, publishedAt desc) {
        _id, name, slug, status, type, priceDisplay, isFeatured,
        lifestyleTags, heroImage,
        "editorialThesis": coalesce(editorialThesis[$lang], editorialThesis.en),
        primaryCta,
        location->{ name, slug },
        developer->{ name, slug }
      }
    `, { developerSlug, lang }, { next: { revalidate: 300 } }),
    demoDevelopments.filter(d => d.developer.slug.current === developerSlug) as any[]
  )
}

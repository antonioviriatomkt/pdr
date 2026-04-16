import { client } from './sanity.client'

// Developments
export async function getFeaturedDevelopments() {
  return client.fetch(`
    *[_type == "development" && isFeatured == true] | order(publishedAt desc) [0...6] {
      _id, name, slug, status, type, priceDisplay, isFeatured,
      lifestyleTags, heroImage, editorialThesis, primaryCta,
      location->{ name, slug },
      developer->{ name }
    }
  `)
}

export async function getAllDevelopments(filters?: {
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

  return client.fetch(`
    ${filter} | order(${sort}) {
      _id, name, slug, status, type, priceDisplay, isFeatured,
      lifestyleTags, heroImage, editorialThesis, primaryCta,
      location->{ name, slug },
      developer->{ name }
    }
  `)
}

export async function getDevelopmentBySlug(slug: string) {
  return client.fetch(`
    *[_type == "development" && slug.current == $slug][0] {
      _id, name, slug, status, type, priceDisplay, isFeatured,
      lifestyleTags, heroImage,
      "gallery": gallery[] { _key, _type, asset, hotspot, crop },
      editorialThesis,
      whyStandsOut, keyFacts, areaGuide, typologyNote, primaryCta,
      publishedAt,
      location->{ name, slug, intro, region },
      developer->{ name, logo, description, website, isViriatoClient },
      relatedDevelopments[]->{ name, slug, heroImage, status, type, priceDisplay, location->{ name } },
      relatedArticles[]->{ title, slug, heroImage, category, excerpt, publishedAt },
      seoTitle, seoDescription
    }
  `, { slug })
}

// Locations
export async function getAllLocations() {
  return client.fetch(`
    *[_type == "location"] | order(name asc) {
      _id, name, slug, region, heroImage, intro
    }
  `)
}

export async function getLocationBySlug(slug: string) {
  return client.fetch(`
    *[_type == "location" && slug.current == $slug][0] {
      _id, name, slug, region, heroImage, intro, marketFraming,
      nearbyLocations[]->{ name, slug, heroImage },
      seoTitle, seoDescription
    }
  `, { slug })
}

export async function getDevelopmentsByLocation(locationSlug: string) {
  return client.fetch(`
    *[_type == "development" && location->slug.current == $locationSlug] | order(isFeatured desc, publishedAt desc) {
      _id, name, slug, status, type, priceDisplay, isFeatured,
      heroImage, editorialThesis, primaryCta,
      location->{ name, slug }
    }
  `, { locationSlug })
}

// Journal
export async function getLatestArticles(limit = 6) {
  return client.fetch(`
    *[_type == "journalArticle"] | order(publishedAt desc) [0...$limit] {
      _id, title, slug, category, heroImage, excerpt, publishedAt,
      linkedLocation->{ name, slug },
      linkedDevelopment->{ name, slug }
    }
  `, { limit })
}

export async function getArticlesByCategory(category: string) {
  return client.fetch(`
    *[_type == "journalArticle" && category == $category] | order(publishedAt desc) {
      _id, title, slug, category, heroImage, excerpt, publishedAt,
      linkedLocation->{ name, slug }
    }
  `, { category })
}

export async function getArticleBySlug(slug: string) {
  return client.fetch(`
    *[_type == "journalArticle" && slug.current == $slug][0] {
      _id, title, slug, category, heroImage, excerpt, body, publishedAt,
      linkedLocation->{ name, slug, intro },
      linkedDevelopment->{ name, slug, heroImage, status, priceDisplay },
      seoTitle, seoDescription
    }
  `, { slug })
}

export async function getArticlesByLocation(locationSlug: string) {
  return client.fetch(`
    *[_type == "journalArticle" && linkedLocation->slug.current == $locationSlug] | order(publishedAt desc) [0...4] {
      _id, title, slug, category, heroImage, excerpt, publishedAt
    }
  `, { locationSlug })
}

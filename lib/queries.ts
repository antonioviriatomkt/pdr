import { client } from './sanity.client'

// Developments
export async function getFeaturedDevelopments(lang = 'en') {
  return client.fetch(`
    *[_type == "development" && isFeatured == true] | order(publishedAt desc) [0...6] {
      _id, name, slug, status, type, priceDisplay, isFeatured,
      lifestyleTags, heroImage,
      "editorialThesis": coalesce(editorialThesis[$lang], editorialThesis.en),
      primaryCta,
      location->{ name, slug },
      developer->{ name }
    }
  `, { lang })
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

  return client.fetch(`
    ${filter} | order(${sort}) {
      _id, name, slug, status, type, priceDisplay, isFeatured,
      lifestyleTags, heroImage, publishedAt,
      "editorialThesis": coalesce(editorialThesis[$lang], editorialThesis.en),
      primaryCta,
      location->{ name, slug },
      developer->{ name }
    }
  `, { lang })
}

export async function getDevelopmentBySlug(slug: string, lang = 'en') {
  return client.fetch(`
    *[_type == "development" && slug.current == $slug][0] {
      _id, name, slug, status, type, priceDisplay, isFeatured,
      lifestyleTags, heroImage,
      "gallery": gallery[defined(asset._ref)] { _key, asset, hotspot, crop },
      "editorialThesis": coalesce(editorialThesis[$lang], editorialThesis.en),
      "typologyNote": coalesce(typologyNote[$lang], typologyNote.en),
      "whyStandsOut": coalesce(whyStandsOut[$lang], whyStandsOut.en),
      "areaGuide": coalesce(areaGuide[$lang], areaGuide.en),
      keyFacts, primaryCta,
      publishedAt,
      location->{ name, slug, "intro": coalesce(intro[$lang], intro.en), region },
      developer->{ name, logo, description, website, isViriatoClient },
      relatedDevelopments[]->{ name, slug, heroImage, status, type, priceDisplay, location->{ name } },
      relatedArticles[]->{ "title": coalesce(title[$lang], title.en), slug, heroImage, category, "excerpt": coalesce(excerpt[$lang], excerpt.en), publishedAt },
      seoTitle, seoDescription, noindex
    }
  `, { slug, lang })
}

// Locations
export async function getAllLocations(lang = 'en') {
  return client.fetch(`
    *[_type == "location"] | order(name asc) {
      _id, name, slug, region, heroImage,
      "intro": coalesce(intro[$lang], intro.en)
    }
  `, { lang })
}

export async function getLocationBySlug(slug: string, lang = 'en') {
  return client.fetch(`
    *[_type == "location" && slug.current == $slug][0] {
      _id, name, slug, region, heroImage,
      "intro": coalesce(intro[$lang], intro.en),
      "marketFraming": coalesce(marketFraming[$lang], marketFraming.en),
      nearbyLocations[]->{ name, slug, heroImage },
      seoTitle, seoDescription
    }
  `, { slug, lang })
}

export async function getDevelopmentsByLocation(locationSlug: string, lang = 'en') {
  return client.fetch(`
    *[_type == "development" && location->slug.current == $locationSlug] | order(isFeatured desc, publishedAt desc) {
      _id, name, slug, status, type, priceDisplay, isFeatured,
      heroImage,
      "editorialThesis": coalesce(editorialThesis[$lang], editorialThesis.en),
      primaryCta,
      location->{ name, slug }
    }
  `, { locationSlug, lang })
}

// Journal
export async function getLatestArticles(limit = 6, lang = 'en') {
  return client.fetch(`
    *[_type == "journalArticle"] | order(publishedAt desc) [0...$limit] {
      _id,
      "title": coalesce(title[$lang], title.en),
      slug, category, heroImage,
      "excerpt": coalesce(excerpt[$lang], excerpt.en),
      publishedAt,
      linkedLocation->{ name, slug },
      linkedDevelopment->{ name, slug }
    }
  `, { limit, lang })
}

export async function getArticlesByCategory(category: string, lang = 'en') {
  return client.fetch(`
    *[_type == "journalArticle" && category == $category] | order(publishedAt desc) {
      _id,
      "title": coalesce(title[$lang], title.en),
      slug, category, heroImage,
      "excerpt": coalesce(excerpt[$lang], excerpt.en),
      publishedAt,
      linkedLocation->{ name, slug }
    }
  `, { category, lang })
}

export async function getArticleBySlug(slug: string, lang = 'en') {
  return client.fetch(`
    *[_type == "journalArticle" && slug.current == $slug][0] {
      _id,
      "title": coalesce(title[$lang], title.en),
      slug, category, heroImage,
      "excerpt": coalesce(excerpt[$lang], excerpt.en),
      "body": coalesce(body[$lang], body.en),
      publishedAt,
      linkedLocation->{ name, slug, "intro": coalesce(intro[$lang], intro.en) },
      linkedDevelopment->{ name, slug, heroImage, status, priceDisplay },
      seoTitle, seoDescription
    }
  `, { slug, lang })
}

export async function getAllArticles(lang = 'en') {
  return client.fetch(`
    *[_type == "journalArticle"] | order(publishedAt desc) {
      _id,
      "title": coalesce(title[$lang], title.en),
      slug, category, publishedAt
    }
  `, { lang })
}

export async function getArticlesByLocation(locationSlug: string, lang = 'en') {
  return client.fetch(`
    *[_type == "journalArticle" && linkedLocation->slug.current == $locationSlug] | order(publishedAt desc) [0...4] {
      _id,
      "title": coalesce(title[$lang], title.en),
      slug, category, heroImage,
      "excerpt": coalesce(excerpt[$lang], excerpt.en),
      publishedAt
    }
  `, { locationSlug, lang })
}

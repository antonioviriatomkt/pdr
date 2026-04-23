export const LIFESTYLE_TAG_SLUGS: Record<string, string> = {
  'Golf': 'golf',
  'Beachfront': 'beachfront',
  'Marina': 'marina',
  'City Centre': 'city-centre',
  'Countryside': 'countryside',
  'Mountain': 'mountain',
  'Historic Quarter': 'historic-quarter',
  'Spa & Wellness': 'spa-wellness',
  'Investment-grade': 'investment-grade',
}

export const LIFESTYLE_TAG_FROM_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(LIFESTYLE_TAG_SLUGS).map(([k, v]) => [v, k])
)

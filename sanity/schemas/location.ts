import { defineField, defineType } from 'sanity'

export const location = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
    defineField({ name: 'region', title: 'Region', type: 'string', options: { list: ['Lisbon', 'Porto', 'Gaia', 'Cascais', 'Algarve', 'Comporta', 'Silver Coast', 'Madeira', 'Other'] } }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'intro',
      title: 'Editorial Intro',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 4 }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'text', rows: 4 }),
      ],
    }),
    defineField({
      name: 'marketFraming',
      title: 'Market & Lifestyle Framing',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'array', of: [{ type: 'block' }] }),
      ],
    }),
    defineField({ name: 'nearbyLocations', title: 'Nearby / Comparable Locations', type: 'array', of: [{ type: 'reference', to: [{ type: 'location' }] }] }),
    defineField({ name: 'latitude', title: 'Latitude', type: 'number', description: 'Decimal degrees, e.g. 38.7169' }),
    defineField({ name: 'longitude', title: 'Longitude', type: 'number', description: 'Decimal degrees, e.g. -9.1399' }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 }),
    defineField({ name: 'seoImage', title: 'SEO / OG Image', type: 'image', options: { hotspot: true }, description: 'Custom Open Graph image (1200×630). Falls back to hero image if not set.' }),
    defineField({
      name: 'noindex',
      title: 'Hide from Search Engines (noindex)',
      type: 'boolean',
      description: 'Enable while content is placeholder/draft. Disables Google indexing for this page.',
      initialValue: false,
    }),
  ],
})

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
    defineField({ name: 'intro', title: 'Editorial Intro', type: 'text', rows: 4 }),
    defineField({ name: 'marketFraming', title: 'Market & Lifestyle Framing', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'nearbyLocations', title: 'Nearby / Comparable Locations', type: 'array', of: [{ type: 'reference', to: [{ type: 'location' }] }] }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 }),
  ],
})

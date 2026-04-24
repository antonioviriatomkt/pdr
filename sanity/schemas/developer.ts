import { defineField, defineType } from 'sanity'

export const developer = defineType({
  name: 'developer',
  title: 'Developer',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Company Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'object',
      description: 'One-line summary for developer listings and cards.',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string' }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'string' }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Editorial Bio',
      type: 'object',
      description: 'Full editorial biography rendered on the developer profile page.',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'array', of: [{ type: 'block' }] }),
      ],
    }),
    defineField({ name: 'foundedYear', title: 'Founded Year', type: 'number', description: 'Year the company was founded.' }),
    defineField({ name: 'headquartersCity', title: 'Headquarters City', type: 'string', description: 'Primary city of operation or HQ.' }),
    defineField({ name: 'website', title: 'Website URL', type: 'url' }),
    defineField({ name: 'isViriatoClient', title: 'Viriato Client', type: 'boolean', initialValue: false }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', description: 'Overrides the default page title in search engines.' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, description: 'Overrides the default meta description.' }),
    defineField({ name: 'seoImage', title: 'SEO Image', type: 'image', options: { hotspot: true }, description: 'OG image for social sharing.' }),
    defineField({
      name: 'noindex',
      title: 'Hide from Search Engines (noindex)',
      type: 'boolean',
      description: 'Enable while content is placeholder/draft. Disables Google indexing for this page.',
      initialValue: false,
    }),
  ],
})

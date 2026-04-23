import { defineField, defineType } from 'sanity'

export const lifestyle = defineType({
  name: 'lifestyle',
  title: 'Lifestyle',
  type: 'document',
  fields: [
    defineField({
      name: 'tag',
      title: 'Lifestyle Tag',
      type: 'string',
      options: {
        list: [
          'Golf', 'Beachfront', 'Marina', 'City Centre', 'Countryside',
          'Mountain', 'Historic Quarter', 'Spa & Wellness', 'Investment-grade',
        ],
      },
      validation: r => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'tag' },
      validation: r => r.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Editorial Intro',
      type: 'object',
      description: 'Editorial context shown as the hero introduction on the lifestyle landing page (100–150 words).',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 4 }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'text', rows: 4 }),
      ],
    }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 }),
    defineField({
      name: 'noindex',
      title: 'Hide from Search Engines (noindex)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'tag', media: 'heroImage' },
  },
})

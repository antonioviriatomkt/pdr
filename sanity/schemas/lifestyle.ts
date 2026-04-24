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
      description: 'Must match exactly one of the lifestyleTag values used on development records.',
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
      description: 'URL-safe identifier auto-generated from the tag. Used in the /lifestyle/{slug} route.',
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
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', description: 'Optional hero image for the lifestyle landing page. Displayed at 16:7 aspect ratio.', options: { hotspot: true } }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', description: 'Overrides the default page title in search engines. Leave blank to use the auto-generated title.' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, description: 'Overrides the default meta description for this lifestyle page.' }),
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

import { defineField, defineType } from 'sanity'

export const journalCategory = defineType({
  name: 'journalCategory',
  title: 'Journal Category',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
      description: 'Must match the category value used in journal articles (e.g. "area-guides", "market-intelligence").',
      validation: r => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      description: 'Display name for this category. Shown in the category nav strip and page headings.',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string' }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'string' }),
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Editorial Intro',
      type: 'object',
      description: 'Short editorial description (50–150 words) shown above the article grid on the category page.',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'text', rows: 3 }),
      ],
    }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string', description: 'Overrides the default category page title in search engines.' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, description: 'Overrides the default meta description for this category page.' }),
  ],
  preview: {
    select: { title: 'slug' },
  },
})

import { defineField, defineType } from 'sanity'

export const journalArticle = defineType({
  name: 'journalArticle',
  title: 'Journal Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      validation: r => r.required(),
      fields: [
        defineField({ name: 'en', title: 'English', type: 'string', validation: r => r.required() }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'string' }),
      ],
    }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.en' }, validation: r => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Architecture', value: 'architecture' },
          { title: 'Area Guides', value: 'area-guides' },
          { title: 'Branded Residences', value: 'branded-residences' },
          { title: 'Market Intelligence', value: 'market-intelligence' },
          { title: 'Second-Home Narratives', value: 'second-home' },
          { title: 'Investment Explainers', value: 'investment' },
          { title: 'Buyer Guides', value: 'buyer-guides' },
        ],
      },
      validation: r => r.required(),
    }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
      ],
    }),
    defineField({ name: 'linkedLocation', title: 'Linked Location', type: 'reference', to: [{ type: 'location' }] }),
    defineField({ name: 'linkedDevelopment', title: 'Linked Development', type: 'reference', to: [{ type: 'development' }] }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 }),
    defineField({ name: 'seoImage', title: 'SEO / OG Image', type: 'image', options: { hotspot: true }, description: 'Custom Open Graph image (1200×630). Falls back to hero image if not set.' }),
    defineField({
      name: 'isPillar',
      title: 'Pillar Content',
      type: 'boolean',
      description: 'Cornerstone evergreen content. Displayed prominently on the journal index and linked from development detail pages.',
      initialValue: false,
    }),
    defineField({
      name: 'noindex',
      title: 'Hide from Search Engines (noindex)',
      type: 'boolean',
      description: 'Enable while content is placeholder/draft. Disables Google indexing for this page.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'category', media: 'heroImage' },
  },
})

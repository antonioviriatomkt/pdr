import { defineField, defineType } from 'sanity'

export const journalArticle = defineType({
  name: 'journalArticle',
  title: 'Journal Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Architecture', value: 'architecture' },
          { title: 'Area Guides', value: 'area-guides' },
          { title: 'Branded Residences', value: 'branded-residences' },
          { title: 'New Developments', value: 'new-developments' },
          { title: 'Second-Home Narratives', value: 'second-home' },
          { title: 'Investment Explainers', value: 'investment' },
        ],
      },
      validation: r => r.required(),
    }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'body', title: 'Body', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'linkedLocation', title: 'Linked Location', type: 'reference', to: [{ type: 'location' }] }),
    defineField({ name: 'linkedDevelopment', title: 'Linked Development', type: 'reference', to: [{ type: 'development' }] }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', validation: r => r.required() }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'heroImage' },
  },
})

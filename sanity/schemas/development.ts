import { defineField, defineType } from 'sanity'

export const development = defineType({
  name: 'development',
  title: 'Development',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Project Name', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: r => r.required() }),
    defineField({ name: 'location', title: 'Location', type: 'reference', to: [{ type: 'location' }], validation: r => r.required() }),
    defineField({ name: 'developer', title: 'Developer', type: 'reference', to: [{ type: 'developer' }], validation: r => r.required() }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['Off-plan', 'Under Construction', 'Completed', 'Selling Now'], layout: 'radio' },
      validation: r => r.required(),
    }),
    defineField({
      name: 'type',
      title: 'Development Type',
      type: 'string',
      options: { list: ['Apartments', 'Villas', 'Townhouses', 'Penthouse', 'Mixed-use', 'Branded Residences'] },
    }),
    defineField({
      name: 'priceDisplay',
      title: 'Price Display',
      type: 'string',
      options: { list: ['Price on Request', 'From €500k', 'From €750k', 'From €1M', 'From €2M', 'From €3M+'] },
    }),
    defineField({ name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({
      name: 'lifestyleTags',
      title: 'Lifestyle Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['Golf', 'Beachfront', 'Marina', 'City Centre', 'Countryside', 'Mountain', 'Historic Quarter', 'Spa & Wellness', 'Investment-grade'] },
    }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', options: { hotspot: true }, validation: r => r.required() }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          { name: 'alt', title: 'Alt Text', type: 'string', description: 'Describe the image for accessibility and SEO' },
        ],
        preview: { select: { media: 'image', title: 'alt' } },
      }],
    }),
    defineField({
      name: 'editorialThesis',
      title: 'Editorial Thesis',
      type: 'object',
      description: 'The editorial paragraph that frames why this project matters.',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 4 }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'text', rows: 4 }),
      ],
    }),
    defineField({
      name: 'whyStandsOut',
      title: 'Why This Project Stands Out',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'array', of: [{ type: 'block' }] }),
      ],
    }),
    defineField({ name: 'keyFacts', title: 'Key Facts', type: 'array', of: [{ type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'value', type: 'string' }] }] }),
    defineField({
      name: 'areaGuide',
      title: 'Area Guide / Location Context',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'array', of: [{ type: 'block' }] }),
      ],
    }),
    defineField({
      name: 'typologyNote',
      title: 'Availability / Typology Summary',
      type: 'object',
      fields: [
        defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
        defineField({ name: 'pt', title: 'Portuguese', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'string',
      options: { list: ['Request Brochure', 'Register Interest', 'Download Investment Pack', 'Schedule Consultation', 'Speak with an Advisor'] },
      initialValue: 'Register Interest',
    }),
    defineField({
      name: 'brochure',
      title: 'Brochure (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
      description: 'Upload the project brochure as a PDF. It will be embedded on the development page.',
    }),
    defineField({ name: 'relatedDevelopments', title: 'Related Developments', type: 'array', of: [{ type: 'reference', to: [{ type: 'development' }] }] }),
    defineField({ name: 'relatedArticles', title: 'Related Journal Stories', type: 'array', of: [{ type: 'reference', to: [{ type: 'journalArticle' }] }] }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
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
  preview: {
    select: { title: 'name', subtitle: 'status', media: 'heroImage' },
  },
})

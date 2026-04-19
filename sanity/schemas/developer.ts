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
    defineField({ name: 'website', title: 'Website URL', type: 'url' }),
    defineField({ name: 'isViriatoClient', title: 'Viriato Client', type: 'boolean', initialValue: false }),
  ],
})

import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateFaqGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'
import { FAQ_METADATA_DESCRIPTION, FAQ_METADATA_TITLE, faqPageDefaults } from '@/lib/faq/defaults'

const itemDefaults = faqPageDefaults.items.map(({ question, answer, category }) => ({
  question,
  answer,
  category,
}))

export const Faq: GlobalConfig = {
  slug: 'faq',
  label: 'FAQ',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable Q&A content for the public FAQ page.',
    group: 'Pages',
    preview: pagePreview('/faq'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateFaqGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Page title',
              defaultValue: faqPageDefaults.title,
            },
            {
              name: 'intro',
              type: 'textarea',
              label: 'Intro text',
              defaultValue: faqPageDefaults.intro,
            },
            {
              name: 'items',
              type: 'array',
              label: 'Questions',
              labels: { singular: 'Question', plural: 'Questions' },
              admin: {
                description:
                  'Flat searchable accordion on /faq. Category is optional metadata (not shown as tabs).',
              },
              defaultValue: itemDefaults,
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  label: 'Question',
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                  label: 'Answer',
                },
                {
                  name: 'category',
                  type: 'select',
                  label: 'Category',
                  defaultValue: 'general',
                  options: [
                    { label: 'General', value: 'general' },
                    { label: 'Studio', value: 'studio' },
                    { label: 'Interiors', value: 'interiors' },
                    { label: 'Models', value: 'models' },
                    { label: 'Prestige', value: 'prestige' },
                    { label: 'Projects', value: 'projects' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            seoFields({
              titleDefault: FAQ_METADATA_TITLE,
              descriptionDefault: FAQ_METADATA_DESCRIPTION,
            }),
          ],
        },
      ],
    },
  ],
}

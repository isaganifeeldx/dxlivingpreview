import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateTermsOfServiceGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const TermsOfService: GlobalConfig = {
  slug: 'terms-of-service',
  label: 'Terms of Service',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public Terms of Service page.',
    group: 'Pages',
    preview: pagePreview('/terms-of-service'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateTermsOfServiceGlobal],
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
              defaultValue: 'TERMS OF SERVICE',
            },
            {
              name: 'body',
              type: 'richText',
              label: 'Body content',
              admin: {
                description:
                  'Use headings (H2/H3), bold, lists, and links to match the public Terms layout. Leave empty to keep the built-in Terms copy on the site.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            seoFields({
              titleDefault: 'Terms of Service | DX LIVING',
              descriptionDefault:
                'Read the DX Living terms of service outlining the rules, conditions and responsibilities when using our website and services.',
            }),
          ],
        },
      ],
    },
  ],
}

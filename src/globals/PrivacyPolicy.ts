import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidatePrivacyPolicyGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  label: 'Privacy Policy',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public Privacy Policy page.',
    group: 'Pages',
    preview: pagePreview('/privacy-policy'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidatePrivacyPolicyGlobal],
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
              defaultValue: 'PRIVACY POLICY',
            },
            {
              name: 'body',
              type: 'richText',
              label: 'Body content',
              admin: {
                description:
                  'Use headings (H2/H3), bold, lists, and links to match the public Privacy Policy layout. Leave empty to keep the built-in Privacy Policy copy on the site.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            seoFields({
              titleDefault: 'Privacy Policy | DX LIVING',
              descriptionDefault:
                'Read the DX Living privacy policy to understand how we collect, use and protect your personal information across our website and services.',
            }),
          ],
        },
      ],
    },
  ],
}

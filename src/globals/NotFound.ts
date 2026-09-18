import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateNotFoundGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'
import {
  NOT_FOUND_METADATA_DESCRIPTION,
  NOT_FOUND_METADATA_TITLE,
  notFoundPageDefaults,
} from '@/lib/not-found/defaults'

const d = notFoundPageDefaults

export const NotFound: GlobalConfig = {
  slug: 'not-found',
  label: '404 Not Found',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable copy and SEO for the public 404 page. Always noindexed by default.',
    group: 'Pages',
    // Any missing path renders not-found.tsx — use a dedicated preview miss.
    preview: pagePreview('/__cms-preview-not-found'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateNotFoundGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Large heading',
              defaultValue: d.heading,
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: d.title,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              defaultValue: d.description,
            },
            {
              name: 'hint',
              type: 'textarea',
              label: 'Hint text',
              defaultValue: d.hint,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaLabel',
                  type: 'text',
                  label: 'Button label',
                  defaultValue: d.ctaLabel,
                  admin: { width: '50%' },
                },
                {
                  name: 'ctaHref',
                  type: 'text',
                  label: 'Button URL',
                  defaultValue: d.ctaHref,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            seoFields({
              titleDefault: NOT_FOUND_METADATA_TITLE,
              descriptionDefault: NOT_FOUND_METADATA_DESCRIPTION,
            }),
          ],
        },
      ],
    },
  ],
}

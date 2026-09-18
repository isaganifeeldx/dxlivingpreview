import type { GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { pagePreview } from '@/lib/cms/previewUrl'

type SeoOnlyPageGlobalOptions = {
  slug: string
  label: string
  description: string
  previewPath: string
  titleDefault: string
  descriptionDefault: string
  afterChange: GlobalAfterChangeHook
}

/** Shared shape for UI-static pages that only expose SEO in the CMS. */
export function seoOnlyPageGlobal({
  slug,
  label,
  description,
  previewPath,
  titleDefault,
  descriptionDefault,
  afterChange,
}: SeoOnlyPageGlobalOptions): GlobalConfig {
  return {
    slug,
    label,
    access: publicReadAuthenticatedUpdate,
    admin: {
      description,
      group: 'Pages',
      preview: pagePreview(previewPath),
      components: {
        views: {
          edit: adminOnlyApiView,
        },
      },
    },
    hooks: {
      afterChange: [afterChange],
    },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'SEO',
            fields: [
              seoFields({
                titleDefault,
                descriptionDefault,
              }),
            ],
          },
        ],
      },
    ],
  }
}

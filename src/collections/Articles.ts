import type { CollectionBeforeChangeHook, CollectionConfig, Where } from 'payload'
import { APIError, slugField } from 'payload'
import { adminOnlyApiView } from '@/access'
import { seoFields } from '@/fields/seo'
import {
  revalidateArticleAfterChange,
  revalidateArticleAfterDelete,
} from '@/hooks/revalidateCms'
import { articlePreview } from '@/lib/cms/previewUrl'
import { deleteArticles } from '@/lib/cms/wipeArticles'

/** When publishing, fill Publish date if the editor left it blank. */
const setPublishedAtOnPublish: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data) return data

  const nextStatus = (data._status ?? originalDoc?._status) as string | undefined
  if (nextStatus !== 'published') return data

  if (!data.publishedAt) {
    data.publishedAt = (originalDoc?.publishedAt as string | undefined) ?? new Date().toISOString()
  }

  return data
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  // Built-in REST bulk-delete is unreliable with drafts (ghost “ID null” rows).
  // Selection-based delete is handled by BulkDeleteArticlesButton + /bulk-delete.
  disableBulkDelete: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedAt', 'updatedAt'],
    description: 'Journal articles for the public Articles listing and detail pages.',
    preview: articlePreview,
    components: {
      beforeListTable: ['/components/payload/BulkDeleteArticlesButton'],
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  versions: {
    drafts: {
      schedulePublish: true,
      validate: false,
    },
  },
  endpoints: [
    {
      path: '/bulk-delete',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('Unauthorized', 401)
        }

        const body = (await req.json?.()) as {
          ids?: Array<number | string>
          allMatching?: boolean
          where?: Where
        } | null

        const ids = Array.isArray(body?.ids) ? body.ids : []
        const allMatching = Boolean(body?.allMatching)

        if (!allMatching && ids.length === 0) {
          throw new APIError('Select at least one article to delete.', 400)
        }

        const result = await deleteArticles({
          payload: req.payload,
          req,
          overrideAccess: false,
          ids,
          allMatching,
          where: body?.where,
        })

        if (result.deleted === 0 && result.failed > 0) {
          return Response.json(
            {
              ...result,
              error: `Failed to delete ${result.failed} article(s).`,
            },
            { status: 500 },
          )
        }

        return Response.json({
          ...result,
          message: `Deleted ${result.deleted} article(s).`,
        })
      },
    },
  ],
  hooks: {
    beforeChange: [setPublishedAtOnPublish],
    afterChange: [revalidateArticleAfterChange],
    afterDelete: [revalidateArticleAfterDelete],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        or: [
          { _status: { equals: 'published' } },
          { _status: { exists: false } },
        ],
      }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'article-categories',
      required: true,
      admin: {
        description:
          'Pick a category from Article Categories. Add or remove categories in that collection.',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured image',
      admin: {
        description:
          'Optional. When empty, the page uses the built-in image from the article fallback library.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Article body',
      admin: {
        description:
          'Full article content. Leave empty to use the built-in article body from the static library.',
      },
    },
    {
      name: 'readTime',
      type: 'text',
      defaultValue: '5 mins',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publish date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyyy',
        },
      },
    },
    seoFields({
      titleDefault: '',
      descriptionDefault: '',
    }),
  ],
}

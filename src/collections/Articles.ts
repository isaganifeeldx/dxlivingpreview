import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { adminOnlyApiView } from '@/access'
import { seoFields } from '@/fields/seo'
import {
  revalidateArticleAfterChange,
  revalidateArticleAfterDelete,
} from '@/hooks/revalidateCms'
import { articlePreview } from '@/lib/cms/previewUrl'

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
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedAt', 'updatedAt'],
    description: 'Journal articles for the public Articles listing and detail pages.',
    preview: articlePreview,
    components: {
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

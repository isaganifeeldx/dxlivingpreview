import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { adminOnlyApiView } from '@/access'
import { seoFields } from '@/fields/seo'
import {
  revalidateProjectAfterChange,
  revalidateProjectAfterDelete,
} from '@/hooks/revalidateCms'
import { projectPreview } from '@/lib/cms/previewUrl'

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

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'location', 'publishedAt', 'updatedAt'],
    description: 'Portfolio projects for the public Projects listing and detail pages.',
    preview: projectPreview,
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
    afterChange: [revalidateProjectAfterChange],
    afterDelete: [revalidateProjectAfterDelete],
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
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      useAsSlug: 'title',
    }),
    {
      name: 'description',
      type: 'textarea',
      label: 'Description (HTML allowed)',
      required: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'timeframe', type: 'text', required: true },
        { name: 'location', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'technologies', type: 'text', required: true },
        { name: 'status', type: 'text', defaultValue: 'Completed' },
        { name: 'type', type: 'text', defaultValue: 'Residential' },
      ],
    },
    {
      name: 'featuredTitle',
      type: 'text',
      label: 'Featured / Vimeo title',
      admin: {
        description: 'Used as accessible video titles when set.',
      },
    },
    {
      name: 'listingVideo',
      type: 'text',
      label: 'Listing card Vimeo ID',
      required: true,
    },
    {
      name: 'videos',
      type: 'group',
      label: 'Detail page Vimeo IDs',
      fields: [
        { name: 'hero', type: 'text', label: 'Banner / hero', required: true },
        { name: 'primary', type: 'text', label: 'Primary', required: true },
        { name: 'galleryLeft', type: 'text', label: 'Gallery left', required: true },
        { name: 'galleryRight', type: 'text', label: 'Gallery right', required: true },
        { name: 'fullWidth', type: 'text', label: 'Full width', required: true },
        {
          name: 'carousel',
          type: 'array',
          labels: { singular: 'Carousel video', plural: 'Carousel videos' },
          minRows: 3,
          maxRows: 3,
          fields: [
            {
              name: 'vimeoId',
              type: 'text',
              label: 'Vimeo ID',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'centerHeroOnMobile',
          type: 'checkbox',
          label: 'Center hero title on mobile',
          defaultValue: false,
        },
        {
          name: 'alignTechnologiesEnd',
          type: 'checkbox',
          label: 'Right-align technologies in meta',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort order',
      admin: {
        description: 'Lower numbers appear first on the listing page.',
        position: 'sidebar',
      },
      defaultValue: 0,
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publish date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'd MMM yyyy h:mm a',
        },
      },
    },
    seoFields({
      titleDefault: '',
      descriptionDefault: '',
    }),
  ],
}

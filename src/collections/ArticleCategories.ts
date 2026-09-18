import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { adminOnlyApiView, authenticated } from '@/access'
import {
  revalidateArticleCategoriesAfterChange,
  revalidateArticleCategoriesAfterDelete,
} from '@/hooks/revalidateCms'

export const ArticleCategories: CollectionConfig = {
  slug: 'article-categories',
  labels: {
    singular: 'Article Category',
    plural: 'Article Categories',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder', 'updatedAt'],
    description:
      'Categories for Articles listing tabs and filters. Add or delete categories here, then assign them on each article.',
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateArticleCategoriesAfterChange],
    afterDelete: [revalidateArticleCategoriesAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Label',
      admin: {
        description: 'Shown on the Articles listing tabs and article cards.',
      },
    },
    slugField({ useAsSlug: 'name' }),
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first in the category tabs.',
        position: 'sidebar',
      },
    },
  ],
}

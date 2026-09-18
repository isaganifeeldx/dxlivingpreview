import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateArticlesPageGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const ArticlesPage: GlobalConfig = {
  slug: 'articles-page',
  label: 'Articles Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description:
      'Editable listing shell for the public DX Living articles page (banner, intro, CTA, SEO). Article posts live in the Articles collection.',
    group: 'Pages',
    preview: pagePreview('/articles'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateArticlesPageGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Banner',
          fields: [
            {
              name: 'banner',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', defaultValue: 'Articles' },
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1118950459',
                },
              ],
            },
          ],
        },
        {
          label: 'Anchor Menu',
          fields: [
            {
              name: 'anchorMenu',
              type: 'array',
              labels: { singular: 'Section link', plural: 'Section links' },
              maxRows: 5,
              admin: {
                description:
                  'Left floating jump-link labels, in page order: Introduction → Latest Articles → All Articles → LinkedIn Stories → Contact Us. Section targets are fixed in the page template.',
              },
              fields: [
                { name: 'label', type: 'text', label: 'Menu label', required: true },
              ],
              defaultValue: [
                { label: 'Introduction' },
                { label: 'Latest Articles' },
                { label: 'All Articles' },
                { label: 'LinkedIn Stories' },
                { label: 'Contact Us' },
              ],
            },
          ],
        },
        {
          label: 'Introduction',
          fields: [
            {
              name: 'introduction',
              type: 'textarea',
              label: 'Introduction (HTML allowed)',
              defaultValue:
                'Explore the evolution of modern luxury through curated design trends, intelligent living innovations, and expert perspectives for refined living and investment.',
            },
          ],
        },
        {
          label: 'CTA',
          fields: [
            {
              name: 'cta',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue:
                    "Shaping your build starts with the right solution, let's make it happen",
                },
                { name: 'content', type: 'textarea', label: 'Content (HTML allowed)' },
                { name: 'button', type: 'text', defaultValue: 'Contact us today' },
                { name: 'buttonLink', type: 'text', defaultValue: '/contact' },
                {
                  name: 'videoBackground',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1117308030',
                },
              ],
            },
          ],
        },
        {
          label: 'Detail page',
          fields: [
            {
              name: 'detailBanner',
              type: 'group',
              label: 'Shared detail banner',
              fields: [
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1118934520',
                },
              ],
            },
            {
              name: 'detailCta',
              type: 'group',
              label: 'Shared detail CTA',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue:
                    "Shaping your build starts with the right solution, let's make it happen.",
                },
                { name: 'button', type: 'text', defaultValue: 'Contact us today' },
                { name: 'buttonLink', type: 'text', defaultValue: '/contact' },
                {
                  name: 'videoBackground',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1117308030',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            seoFields({
              titleDefault: 'Articles Modern Architecture Insights | DX Living',
              descriptionDefault:
                'Explore modern architecture insights from DX Living. Expert articles on luxury design, sustainability, and contemporary homes for Australian families',
            }),
          ],
        },
      ],
    },
  ],
}

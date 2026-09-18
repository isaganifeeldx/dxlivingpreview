import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateProjectsPageGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const ProjectsPage: GlobalConfig = {
  slug: 'projects-page',
  label: 'Projects Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable listing shell for the public DX Living projects page (banner, intro, CTA, SEO).',
    group: 'Pages',
    preview: pagePreview('/projects'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateProjectsPageGlobal],
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
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'PROJECTS',
                },
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1117308063',
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
              maxRows: 4,
              admin: {
                description:
                  'Left floating jump-link labels, in page order: Introduction → Our Projects → LinkedIn Stories → Contact Us. Section targets are fixed in the page template.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Menu label',
                  required: true,
                },
              ],
              defaultValue: [
                { label: 'Introduction' },
                { label: 'Our Projects' },
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
                'Immerse yourself in our collection of beautifully crafted projects brought to life by <strong>DX</strong> LIVING.',
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
                  defaultValue: 'BRING YOUR DREAM HOME TO LIFE WITH OUR EXPERT TEAM TODAY',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Content (HTML allowed)',
                  defaultValue:
                    "Collaborate with our specialists to design, visualise, and experience your project before it's built.",
                },
                {
                  name: 'button',
                  type: 'text',
                  defaultValue: 'CONNECT WITH DX LIVING',
                },
                {
                  name: 'buttonLink',
                  type: 'text',
                  defaultValue: '/contact',
                },
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
              titleDefault: 'Home Construction Projects Australia | DX Living Projects',
              descriptionDefault:
                'Explore home construction projects in Australia by DX Living. Discover luxury residential builds designed with precision, innovation and architectural clarity.',
            }),
          ],
        },
      ],
    },
  ],
}

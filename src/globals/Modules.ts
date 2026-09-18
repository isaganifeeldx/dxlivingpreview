import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateModulesGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const Modules: GlobalConfig = {
  slug: 'modules',
  label: 'Modules Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public DX Living modules page.',
    group: 'Pages',
    preview: pagePreview('/modules'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateModulesGlobal],
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
                  defaultValue: 'Our Modules',
                },
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1118936146',
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
              maxRows: 3,
              admin: {
                description:
                  'Left floating jump-link labels, in page order: Introduction → Modules → Book a Call. Section targets are fixed in the page template.',
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
                { label: 'Modules' },
                { label: 'Book a Call' },
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
                'Our modular suite of premium services adapts seamlessly to your vision, delivering sophisticated solutions with remarkable speed.',
            },
          ],
        },
        {
          label: 'Module Cards',
          fields: [
            {
              name: 'moduleCards',
              type: 'array',
              labels: { singular: 'Module card', plural: 'Module cards' },
              maxRows: 4,
              admin: {
                description: 'Display order: Studio → Interiors → Model → Prestige.',
              },
              fields: [
                { name: 'title', type: 'text', required: true },
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Content (HTML allowed)',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'link',
                  type: 'text',
                  required: true,
                },
              ],
              defaultValue: [
                {
                  title: 'DX Studio',
                  content:
                    'Construction project management and visualisation services, using 3D/4D modeling, renders, and interactive tools.<br /><br />For Architects, Custom Builders & Developers',
                  link: '/studio',
                },
                {
                  title: 'DX Interiors',
                  content:
                    'Choose colors, textures, and materials to decorate realistic 3D rooms in real-time.<br /><br />For Homeowners, Suppliers & Custom Builders',
                  link: '/interiors',
                },
                {
                  title: 'DX Model',
                  content:
                    'Interactive, 4D property walkthroughs that lets you freely explore spaces with VR compatibility and easy-to-use navigation.<br /><br />For Homeowners, Suppliers, Architects & Custom Builders',
                  link: '/model',
                },
                {
                  title: 'DX Prestige',
                  content:
                    'VIP service that combines advanced project visualisation, bespoke interactive design experiences, and immersive virtual tours all together.<br /><br />For High-End Homeowners, Custom Builders, Architects & Developers',
                  link: '/prestige',
                },
              ],
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
                  defaultValue: 'Wondering which module fits your needs best?',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  defaultValue: "Let's discuss your goals and craft the ideal solution.",
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'button',
                      type: 'text',
                      label: 'Button label',
                      defaultValue: 'Book a Discovery Call',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'buttonLink',
                      type: 'text',
                      label: 'Button link',
                      defaultValue: '/contact',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'videoBackground',
                  type: 'text',
                  label: 'Background Vimeo ID (optional / reserved)',
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
              titleDefault: 'DX LIVING Luxury Homes Australia | Custom Modular Design',
              descriptionDefault:
                "Experience custom modular design excellence. DX Living offers premium architectural solutions for luxury homes across Australia's leading families.",
            }),
          ],
        },
      ],
    },
  ],
}

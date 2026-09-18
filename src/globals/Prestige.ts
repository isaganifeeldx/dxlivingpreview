import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidatePrestigeGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const Prestige: GlobalConfig = {
  slug: 'prestige',
  label: 'Prestige Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public DX Living prestige page.',
    group: 'Pages',
    preview: pagePreview('/prestige'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidatePrestigeGlobal],
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
                  defaultValue: 'DX Prestige',
                },
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1118934620',
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
              maxRows: 6,
              admin: {
                description:
                  'Left floating jump-link labels, in page order: Introduction → Video → Features → Other Modules → Book a Call → Contact Us. Section targets are fixed in the page template.',
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
                { label: 'Video' },
                { label: 'Features' },
                { label: 'Other Modules' },
                { label: 'Book a Call' },
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
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'textarea',
                  label: 'Introduction',
                  defaultValue:
                    'Experience the full power of DX Studio, DX Interiors, and DX Model seamlessly integrated in DX Prestige.',
                },
                {
                  name: 'introVideo',
                  type: 'group',
                  label: 'Intro video',
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      defaultValue: 'DX Prestige: The Pinnacle of VIP Luxury Home Creation',
                    },
                    {
                      name: 'content',
                      type: 'textarea',
                      label: 'Content (HTML allowed)',
                      defaultValue:
                        '<strong>DX</strong> Prestige combines the artistry of <strong>DX</strong> Studio, the refinement of <strong>DX</strong> Interiors, and the innovation of <strong>DX</strong> Model to deliver an unparalleled luxury home experience.',
                    },
                    {
                      name: 'vimeoVideo',
                      type: 'text',
                      label: 'Vimeo ID',
                      defaultValue: '1117005489',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Features',
          fields: [
            {
              name: 'features',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'ELEVATE LUXURY HOMES BEYOND IMAGINATION WITH DX PRESTIGE',
                },
                {
                  name: 'list',
                  type: 'array',
                  labels: { singular: 'Feature', plural: 'Features' },
                  maxRows: 7,
                  fields: [
                    { name: 'heading', type: 'text', required: true },
                    { name: 'content', type: 'textarea', required: true },
                  ],
                  defaultValue: [
                    {
                      heading: 'Unified Platform Access',
                      content:
                        '<strong>DX</strong> Prestige is a VIP platform that brings together every <strong>DX</strong> LIVING services, combining cutting-edge visualisation, personalized interactive design, and immersive virtual tours for a complete luxury home experience.',
                    },
                    {
                      heading: 'Immersive VIP Visualization',
                      content:
                        'Step inside your future space with lifelike 4D tours, VR integration, and true-to-material visualisations.',
                    },
                    {
                      heading: 'White-Glove Collaboration',
                      content:
                        'Our platform empowers high-end teams to collaborate, share real-time updates, and monitor progress, with immediate access to supplier materials and all <strong>DX</strong> LIVING services.',
                    },
                    {
                      heading: 'Curated Real-World Integration',
                      content:
                        'Elevate your project with curated premium materials from premier suppliers, integrated into your design model for unmatched realism.',
                    },
                    {
                      heading: 'Project Management & Insight',
                      content:
                        'Compare before/after versions of designs instantly and generate summaries of design trends, material usage, and supplier performance.',
                    },
                    {
                      heading: 'Exclusive VIP Perks',
                      content:
                        'Personal <strong>DX</strong> LIVING curator for guidance from concept to completion & faster turnaround for 4D and cinematic outputs.',
                    },
                    {
                      heading: 'VIP VR Ready',
                      content: 'Experience your design in VR via available portable VR kits.',
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'button',
                      type: 'text',
                      label: 'Button label (desktop)',
                      defaultValue: 'Step into your future home today',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'buttonMobile',
                      type: 'text',
                      label: 'Button label (mobile)',
                      defaultValue: "Let's get started",
                      admin: { width: '33%' },
                    },
                    {
                      name: 'buttonLink',
                      type: 'text',
                      label: 'Button link',
                      defaultValue: '/contact',
                      admin: { width: '34%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Other Modules',
          fields: [
            {
              name: 'otherModulesHeading',
              type: 'text',
              label: 'Heading',
              defaultValue: 'Other Modules',
              admin: {
                description:
                  'Cards are pulled from the Modules page (excluding Prestige). Edit cards there.',
              },
            },
          ],
        },
        {
          label: 'Book',
          fields: [
            {
              name: 'book',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Not sure which module fits your needs best?',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  defaultValue: "Let's talk. Book a call and we'll help you find the perfect fit.",
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'button',
                      type: 'text',
                      label: 'Button label',
                      defaultValue: 'Book a discovery call',
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
                  defaultValue: 'FINDING THE MODULE THAT FITS YOUR AMBITION',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  defaultValue:
                    "We'll help you map your goals, uncover priorities, and choose the right DX LIVING solution for your project.",
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'button',
                      type: 'text',
                      label: 'Button label',
                      defaultValue: 'Book a discovery call',
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
              titleDefault: 'Luxury Home Design Service Australia | DX Living Prestige',
              descriptionDefault:
                'DX Prestige offers luxury home design service in Australia. Bespoke, sustainable architecture tailored to your vision and prestige standards.',
            }),
          ],
        },
      ],
    },
  ],
}

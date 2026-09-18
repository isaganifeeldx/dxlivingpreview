import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateModelGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const Model: GlobalConfig = {
  slug: 'model',
  label: 'Model Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public DX Living model page.',
    group: 'Pages',
    preview: pagePreview('/model'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateModelGlobal],
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
                  defaultValue: 'DX Model',
                },
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1118934596',
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
                    'Step inside your design with interactive 4D walkthroughs and explore every detail in immersive, VR-ready realism.',
                },
                {
                  name: 'introVideo',
                  type: 'group',
                  label: 'Intro video',
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      defaultValue: 'Experience Your Space in Motion',
                    },
                    {
                      name: 'content',
                      type: 'textarea',
                      label: 'Content (HTML allowed)',
                      defaultValue:
                        '<strong>DX</strong> Model delivers an immersive 4D design experience allowing you to freely swap materials, adjust lighting, and visualize authentic supplier products in real time.',
                    },
                    {
                      name: 'vimeoVideo',
                      type: 'text',
                      label: 'Vimeo ID',
                      defaultValue: '1124715847',
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
                  defaultValue:
                    'TRANSFORM HOW CLIENTS EXPERIENCE THEIR FUTURE HOMES WITH DX MODEL',
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
                      heading: 'Immersive Visualisation',
                      content:
                        'Experience the full depth of your future home with vibrant, photorealistic 4D walkthroughs that combine realistic visuals with time-based construction sequencing.',
                    },
                    {
                      heading: 'Real Product Integration',
                      content:
                        'Discover and integrate premium, authentic materials and furnishings from esteemed suppliers, with expert guidance to bring your design vision to life.',
                    },
                    {
                      heading: 'Collaborative Ecosystem',
                      content:
                        'Unifying homeowners, designers, architects, and builders on a single platform that supports collaborative planning and efficient coordinated project management.',
                    },
                    {
                      heading: 'Informed Decision-Making',
                      content:
                        'Make confident decisions by virtually touring your project and refining the design before final approval.',
                    },
                    {
                      heading: 'Dynamic Lighting Simulation',
                      content:
                        'Observe how lighting transforms your design at any time of day with realism.',
                    },
                    {
                      heading: 'Ultra-High Definition Rendering',
                      content:
                        'Visualise your project in breathtaking high definition quality and details.',
                    },
                    {
                      heading: 'Immersive Virtual Reality',
                      content:
                        'Experience your project through immersive, life-size VR walkthroughs.',
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
              defaultValue: 'Check out our other modules',
              admin: {
                description:
                  'Cards are pulled from the Modules page (excluding Model). Edit cards there.',
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
              titleDefault: 'DX Model Australia | Modern Home Models',
              descriptionDefault:
                'Modern home models reimagined by DX Model. Contemporary architectural designs combining sustainability, luxury, and personalization for Australian families.',
            }),
          ],
        },
      ],
    },
  ],
}

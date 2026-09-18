import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateStudioGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

const howItWorksColumnFields = [
  { name: 'title', type: 'text' as const, required: true },
  { name: 'subtitle', type: 'text' as const },
  {
    name: 'items',
    type: 'array' as const,
    labels: { singular: 'Item', plural: 'Items' },
    fields: [
      { name: 'text', type: 'text' as const, required: true },
      { name: 'tooltip', type: 'text' as const },
    ],
  },
]

export const Studio: GlobalConfig = {
  slug: 'studio',
  label: 'Studio Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public DX Living studio page.',
    group: 'Pages',
    preview: pagePreview('/studio'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateStudioGlobal],
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
                  defaultValue: 'DX STUDIO',
                },
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1118934579',
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
                  'Left floating jump-link labels, in page order: Introduction → Why Us? → How It Works → Other Modules → Book a Call → Contact Us. Section targets are fixed in the page template.',
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
                { label: 'Why Us?' },
                { label: 'How It Works' },
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
              type: 'textarea',
              label: 'Introduction',
              defaultValue:
                'We leverage building expertise and 3D/4D technology to help you decide confidently, spot issues early, and complete projects successfully.',
            },
          ],
        },
        {
          label: 'Why Partner',
          fields: [
            {
              name: 'whyPartner',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Why Partner with DX Studio for High-End Residential Projects?',
                },
                {
                  name: 'list',
                  type: 'array',
                  labels: { singular: 'Reason', plural: 'Reasons' },
                  maxRows: 4,
                  fields: [
                    { name: 'heading', type: 'text', required: true },
                    { name: 'content', type: 'textarea', required: true },
                  ],
                  defaultValue: [
                    {
                      heading: 'Master Craftsmanship Insight',
                      content:
                        'We bring deep construction expertise to residential projects, ensuring every detail from structural accuracy to premium finishes, is precisely planned and beautifully executed.',
                    },
                    {
                      heading: 'Foresight for Flawless Execution',
                      content:
                        'Residential projects require specialised expertise. We identify coordination issues and risks early, preventing costly changes and ensuring on-time, on-budget delivery.',
                    },
                    {
                      heading: 'Uncompromising Visual Communication',
                      content:
                        'DX Studio provide photorealistic visualisations that bridge the gap between plans and reality, giving clients certainty and helping you secure approvals faster.',
                    },
                    {
                      heading: 'Agile & Iterative Design Collaboration',
                      content:
                        'We create 3D & 4D experiences that give clients a complete understanding of the finished home, accelerating decision-making and securing commitments.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'How It Works',
          fields: [
            {
              name: 'howItWorks',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'How it Works',
                },
                {
                  name: 'columns',
                  type: 'array',
                  labels: { singular: 'Column', plural: 'Columns' },
                  maxRows: 4,
                  fields: howItWorksColumnFields,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'button',
                      type: 'text',
                      label: 'Button label',
                      defaultValue: 'Begin Your Dream Home',
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
          label: 'Other Modules',
          fields: [
            {
              name: 'otherModulesHeading',
              type: 'text',
              label: 'Heading',
              defaultValue: 'Check out our other modules',
              admin: {
                description:
                  'Cards are pulled from the Modules page (excluding Studio). Edit cards there.',
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
                  defaultValue: 'Explore our subscription options',
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
              titleDefault: '3D Home Design Australia | VR & BIM by DX Living',
              descriptionDefault:
                '3D home design in Australia by DX Living Studio. Experience immersive VR and BIM to visualise, plan and refine your custom home with precision.',
            }),
          ],
        },
      ],
    },
  ],
}

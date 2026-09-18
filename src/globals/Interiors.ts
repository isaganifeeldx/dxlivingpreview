import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateInteriorsGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const Interiors: GlobalConfig = {
  slug: 'interiors',
  label: 'Interiors Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public DX Living interiors page.',
    group: 'Pages',
    preview: pagePreview('/interiors'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateInteriorsGlobal],
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
                  defaultValue: 'DX Interiors',
                },
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1118934561',
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
                    'DX Interiors brings homeowners, designers, and suppliers together in one intelligent design space.',
                },
                {
                  name: 'introVideo',
                  type: 'group',
                  label: 'Intro video',
                  fields: [
                    {
                      name: 'heading',
                      type: 'text',
                      defaultValue: 'Your Virtual Design Studio',
                    },
                    {
                      name: 'content',
                      type: 'textarea',
                      defaultValue:
                        'DX Interiors blends intelligent visualisation with curated sourcing, enabling you to select real products, apply colors and textures, and experience your interior design unfold in real-time 3D.',
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
          label: 'Design Your Space',
          fields: [
            {
              name: 'designYourSpace',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'DESIGN YOUR SPACE YOUR WAY WITH DX INTERIORS',
                },
                {
                  name: 'list',
                  type: 'array',
                  labels: { singular: 'Feature', plural: 'Features' },
                  maxRows: 4,
                  fields: [
                    { name: 'heading', type: 'text', required: true },
                    { name: 'content', type: 'textarea', required: true },
                  ],
                  defaultValue: [
                    {
                      heading: 'Instant Design Validation',
                      content:
                        'Bring your vision to life instantly, simply upload a photo or pick a template, then drag and drop photo-realistic furniture and decor to see new ideas unfold.',
                    },
                    {
                      heading: 'Real-time Material Visualisation',
                      content:
                        'Experience materials with absolute authenticity. Browse curated finishes from our suppliers and see their accurate product details.',
                    },
                    {
                      heading: 'Immersive Supplier Showroom',
                      content:
                        'Elevate your product catalog into interactive 2D environments, enabling designers and homeowners to engage with your products as they envision their ideal spaces.',
                    },
                    {
                      heading: 'Guided Path to Purchase',
                      content:
                        'Seamlessly move from idea to decision as users collect products, craft mood boards, and complete selections within an intuitive platform.',
                    },
                  ],
                },
                {
                  name: 'lastContent',
                  type: 'textarea',
                  label: 'Closing paragraph',
                  defaultValue:
                    'DX Interiors empowers homeowners to elegantly design their spaces using authentic supplier products, envision furniture and finishes within your rooms for making confident choices.',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'button',
                      type: 'text',
                      label: 'Button label',
                      defaultValue: 'COMING SOON',
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
                  name: 'note',
                  type: 'textarea',
                  label: 'Note (HTML allowed)',
                  defaultValue: 'For Inquiries, Please Contact us.',
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
                  'Cards are pulled from the Modules page (excluding Interiors). Edit cards there.',
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
                    "We'll help you map your goals, uncover priorities, and choose the right DXLIVING solution for your project.",
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
              titleDefault: 'DX Interiors Luxury Homes | Interior Design Australia',
              descriptionDefault:
                'Interior design Australia reimagined by DX Interiors. DX Interiors provides custom, personalized luxury interiors that reflect your family lifestyle.',
            }),
          ],
        },
      ],
    },
  ],
}

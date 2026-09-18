import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateApplyGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const Apply: GlobalConfig = {
  slug: 'apply',
  label: 'Apply Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public DX Living apply / supplier partnership page.',
    group: 'Pages',
    preview: pagePreview('/apply'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateApplyGlobal],
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
                  defaultValue: 'JOIN US NOW',
                },
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1117307964',
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
                  'Left floating jump-link labels, in page order: Introduction → Why Join US? → Who This Is For? → How It Works? → Apply Now. Section targets are fixed in the page template.',
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
                { label: 'Why Join US?' },
                { label: 'Who This Is For?' },
                { label: 'How It Works?' },
                { label: 'Apply Now' },
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
                  type: 'text',
                  defaultValue: "Be Part of Australia's Most Immersive Home Experiences",
                },
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Content (HTML allowed)',
                  defaultValue:
                    "Here's where you come in: everything clients see on our platform is real. That means your products whether flooring, lighting, appliances, or smart home systems can be featured directly inside the design experience. By partnering with us, your brand becomes part of the decision-making process, giving clients the confidence to choose your products early and often. Together, we create not just homes, but experiences powered by premium suppliers like you.",
                },
              ],
            },
          ],
        },
        {
          label: 'Why Join',
          fields: [
            {
              name: 'whyJoin',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Why Join the DX LIVING Supplier Network',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Content (HTML allowed)',
                  defaultValue:
                    "At DX LIVING, we don't just design homes, we create experiences. By joining our supplier network, your products become part of the journey homeowners take when bringing their dream home to life. Here's why it's worth it:",
                },
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Reason', plural: 'Reasons' },
                  maxRows: 4,
                  fields: [
                    { name: 'heading', type: 'text', required: true },
                    {
                      name: 'content',
                      type: 'textarea',
                      label: 'Content (HTML allowed)',
                      required: true,
                    },
                  ],
                  defaultValue: [
                    {
                      heading: 'Your products, brought to life',
                      content:
                        'See your flooring, lighting, appliances, and more showcased inside stunning 3D and 4D home walkthroughs.',
                    },
                    {
                      heading: 'Be part of the decision-making',
                      content:
                        'Homeowners explore, compare, and choose products before a single brick is laid, and your brand is right there when it matters most.',
                    },
                    {
                      heading: 'Turn dreams into sales',
                      content:
                        'When a client falls in love with your product in their digital home, they can go directly to your site to make the purchase.',
                    },
                    {
                      heading: 'Stand out as premium',
                      content:
                        'Join a curated network of trusted brands that set the standard for luxury living.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Videos',
          fields: [
            {
              name: 'videos',
              type: 'group',
              fields: [
                {
                  name: 'left',
                  type: 'text',
                  label: 'Left Vimeo ID',
                  defaultValue: '1117610205',
                },
                {
                  name: 'right',
                  type: 'text',
                  label: 'Right Vimeo ID',
                  defaultValue: '1117610250',
                },
              ],
            },
          ],
        },
        {
          label: 'Who This Is For',
          fields: [
            {
              name: 'whoThisIsFor',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Who This Is For',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Content (HTML allowed)',
                  defaultValue: 'We welcome suppliers and manufacturers in the following categories:',
                },
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Category', plural: 'Categories' },
                  maxRows: 11,
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Category label (HTML allowed)',
                      required: true,
                    },
                  ],
                  defaultValue: [
                    { text: 'Timber, tile, or hybrid flooring' },
                    { text: 'Stone and benchtops' },
                    { text: 'Lighting and electrical' },
                    { text: 'Cabinetry, joinery, and finishes' },
                    { text: 'Kitchen and bathroom appliances' },
                    { text: 'Tapware, sanitaryware, and accessories' },
                    { text: 'Windows and glazing' },
                    { text: 'Cladding, paint, render systems' },
                    { text: 'Smart home and automation technology' },
                    { text: 'Outdoor and landscaping materials' },
                    { text: 'Hydronics, HVAC, and in-slab systems' },
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
                  defaultValue: 'How It Works',
                },
                {
                  name: 'steps',
                  type: 'array',
                  labels: { singular: 'Step', plural: 'Steps' },
                  maxRows: 4,
                  fields: [
                    { name: 'heading', type: 'text', required: true },
                    {
                      name: 'content',
                      type: 'textarea',
                      label: 'Content (HTML allowed)',
                      required: true,
                    },
                  ],
                  defaultValue: [
                    {
                      heading: 'Application',
                      content:
                        'Suppliers submit their application with product details, certifications, and portfolio.',
                    },
                    {
                      heading: 'Review',
                      content:
                        'DX LIVING reviews to ensure alignment with our premium standards and project requirements.',
                    },
                    {
                      heading: 'Product Integration',
                      content:
                        'Approved products are digitised and integrated into our immersive 3D/4D platform',
                    },
                    {
                      heading: 'Partnership Launch',
                      content:
                        'Suppliers join the DX LIVING network, gain visibility in luxury projects, and start benefiting from early client engagement, project specifications, and direct sales opportunities.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Apply To Join',
          fields: [
            {
              name: 'applyToJoin',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Apply to Join',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Content (HTML allowed)',
                  defaultValue:
                    'Please complete the form below to express your interest in joining the DX LIVING Supplier Partner Program. Our team will be in touch within 1-2 business days.',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            seoFields({
              titleDefault: 'Supplier Partnership Australia | Apply with DX Living',
              descriptionDefault:
                'Supplier partnership opportunities in Australia with DX Living. Apply now to join luxury residential projects with leading architects and builders.',
            }),
          ],
        },
      ],
    },
  ],
}

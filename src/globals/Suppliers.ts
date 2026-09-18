import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateSuppliersGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const Suppliers: GlobalConfig = {
  slug: 'suppliers',
  label: 'Suppliers Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public DX Living suppliers page.',
    group: 'Pages',
    preview: pagePreview('/suppliers'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateSuppliersGlobal],
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
                  defaultValue: 'Become a DX LIVING partner',
                },
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1117308086',
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
                  'Left floating jump-link labels, in page order: Introduction → What We Offer → Material Integration → Our Process → Supplier Tiers → Apply Now. Section targets are fixed in the page template.',
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
                { label: 'What We Offer' },
                { label: 'Material Integration' },
                { label: 'Our Process' },
                { label: 'Supplier Tiers' },
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
              type: 'textarea',
              label: 'Introduction (HTML allowed)',
              defaultValue:
                'Partner with us to feature your products in premier homes, integrated into immersive visual tours that help you attract more clients effortlessly.',
            },
            {
              name: 'fullWidthVideo',
              type: 'text',
              label: 'Full-width Vimeo ID',
              defaultValue: '1117005774',
            },
          ],
        },
        {
          label: 'What We Offer',
          fields: [
            {
              name: 'whatWeOffer',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'What We Offer',
                },
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Offer', plural: 'Offers' },
                  maxRows: 3,
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    {
                      name: 'content',
                      type: 'textarea',
                      label: 'Content (HTML allowed)',
                      required: true,
                    },
                  ],
                  defaultValue: [
                    {
                      title: 'Seamless Integration',
                      content:
                        "Bring every detail to life through finishes and furnishings precisely embedded within DX LIVING's advanced 3D/4D and BIM ecosystem.",
                    },
                    {
                      title: 'Direct Access to Decision-Makers',
                      content:
                        'Position your brand before the most selective architects, builders, and homeowners, precisely when it matters most.',
                    },
                    {
                      title: 'Long-Term Opportunities',
                      content:
                        "Gain privileged early access to DX LIVING's upcoming developments and forge enduring partnerships within an elite design network.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Material Integration',
          fields: [
            {
              name: 'materialIntegration',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'SUPPLIER MATERIAL INTEGRATION',
                },
                {
                  name: 'vimeoVideo',
                  type: 'text',
                  label: 'Vimeo ID',
                  defaultValue: '1129395838',
                },
              ],
            },
          ],
        },
        {
          label: 'Process',
          fields: [
            {
              name: 'process',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Our Process: From Onboarding to Build',
                },
                {
                  name: 'rightSideVideo',
                  type: 'text',
                  label: 'Right-side Vimeo ID',
                  defaultValue: '1117005842',
                },
                {
                  name: 'steps',
                  type: 'array',
                  labels: { singular: 'Step', plural: 'Steps' },
                  maxRows: 6,
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    {
                      name: 'content',
                      type: 'textarea',
                      label: 'Content (HTML allowed)',
                      required: true,
                    },
                  ],
                  defaultValue: [
                    {
                      title: 'Partner with DX LIVING',
                      content:
                        'Register your company and product portfolio today through our official supplier application.',
                    },
                    {
                      title: 'Evaluation & Onboarding',
                      content:
                        'Each potential supplier undergoes a rigorous evaluation to ensure they meet our exacting standards of design excellence and superior quality.',
                    },
                    {
                      title: 'Material Specs & Samples Submission',
                      content:
                        'Provide precise material specifications and curated samples for comprehensive premium review and approval.',
                    },
                    {
                      title: 'Integration into Render & Model Environment',
                      content:
                        'Approved materials are seamlessly integrated into our 3D & 4D models, delivering unmatched precision and photorealistic visualisation.',
                    },
                    {
                      title: 'Showcasing in VR / CGI Deliverables',
                      content:
                        'We will present your vision with exceptional clarity, combining hyper-realistic CGI and immersive VR to captivate and engage clients.',
                    },
                    {
                      title: 'Final Handover / Case Study Inclusion',
                      content:
                        'Our finalised projects proudly showcase the suppliers, recognising their role in bringing each design vision to life.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Tiers',
          fields: [
            {
              name: 'tiers',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Our Supplier Tiers',
                },
                {
                  name: 'rows',
                  type: 'array',
                  labels: { singular: 'Tier', plural: 'Tiers' },
                  maxRows: 2,
                  fields: [
                    { name: 'level', type: 'text', required: true },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Description (HTML allowed)',
                      required: true,
                    },
                    {
                      name: 'visibility',
                      type: 'textarea',
                      label: 'Visibility (HTML allowed)',
                      required: true,
                    },
                  ],
                  defaultValue: [
                    {
                      level: 'Basic Tier',
                      description:
                        'Showcase up to 5 of your material finishes as realistic textures. Users can easily drag and drop your supplied finishes into their curated designs within our applications.',
                      visibility: 'DX Interiors & DX Model Lite (Visibility)',
                    },
                    {
                      level: 'Premium Tier',
                      description:
                        'One 3D/4D product is included at NO EXTRA COST, and is fully integrated across our applications. Enhance your product collections further with our premium options.',
                      visibility: 'DX Model & DX Model Lite (Visibility)',
                    },
                  ],
                },
                {
                  name: 'buttonDesktop',
                  type: 'text',
                  label: 'Button label (desktop)',
                  defaultValue: 'Become a Preferred Supplier',
                },
                {
                  name: 'buttonMobile',
                  type: 'text',
                  label: 'Button label (mobile)',
                  defaultValue: 'Become a Supplier',
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
                  defaultValue: 'BECOME A DX LIVING PARTNER TODAY',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Content (HTML allowed)',
                  defaultValue:
                    "Submit your expression of interest to become a featured supplier on Australia's most digitally advanced residential projects.",
                },
                {
                  name: 'button',
                  type: 'text',
                  defaultValue: 'PARTNER WITH US',
                },
                {
                  name: 'buttonLink',
                  type: 'text',
                  defaultValue: '/apply',
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
              titleDefault: 'Premium Building Suppliers Australia | DX Living',
              descriptionDefault:
                'Building suppliers in Australia with DX Living. Discover premium materials, finishes and trusted partners for luxury residential construction projects.',
            }),
          ],
        },
      ],
    },
  ],
}

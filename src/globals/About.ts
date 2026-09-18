import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateAboutGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public DX Living about page.',
    group: 'Pages',
    preview: pagePreview('/about'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateAboutGlobal],
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
                  defaultValue: 'ABOUT US',
                },
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1116999894',
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
                  'Left floating jump-link labels, in page order: Introduction → Why DX LIVING? → LinkedIn Stories → Get in Touch. Section targets are fixed in the page template.',
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
                { label: 'Why DX LIVING?' },
                { label: 'LinkedIn Stories' },
                { label: 'Get in Touch' },
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
                'Craft your vision with <strong>DX</strong> LIVING, explore authentic furniture and materials, styled perfectly in your actual space.',
            },
            {
              name: 'videoLeft',
              type: 'text',
              label: 'Left Vimeo ID',
              defaultValue: '1117005475',
            },
            {
              name: 'contentRight',
              type: 'textarea',
              label: 'Right content (HTML allowed)',
              defaultValue:
                "With <strong>DX</strong> LIVING, your future home is more than a vision, it&apos;s an experience. Explore your space through hyper-real visuals, intelligent design technology, and real supplier materials that bring absolute certainty to every decision.",
            },
            {
              name: 'fullWidthVideo',
              type: 'text',
              label: 'Full-width Vimeo ID',
              defaultValue: '1117005489',
            },
          ],
        },
        {
          label: 'Why DX Living',
          fields: [
            {
              name: 'whyDxLiving',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Why DX LIVING?',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Intro content (HTML allowed)',
                  defaultValue:
                    '<strong>DX</strong> LIVING elevates clarity in home design, seamlessly uniting design excellence, construction precision, and unwavering client assurance. By merging technology with artistry, <strong>DX</strong> LIVING transforms the way homes are imagined, experienced, and brought to life.',
                },
                {
                  name: 'contentList',
                  type: 'array',
                  labels: { singular: 'List item', plural: 'List items' },
                  maxRows: 5,
                  fields: [
                    {
                      name: 'text',
                      type: 'textarea',
                      required: true,
                    },
                  ],
                  defaultValue: [
                    {
                      text: 'For Developers: Accelerate sales and reduce risk with immersive 3D and 4D visuals that transform plans into investment-ready experiences. Streamline the pre-construction phase, showcase every design option with photoreal realism, and secure off-the-plan commitments sooner.',
                    },
                    {
                      text: 'For Architects: Preserve design intent from concept to completion. DX LIVING ensures your vision is presented exactly as imagined through cinematic visualisation, accurate material mapping, and BIM-aligned precision. Engage clients emotionally while maintaining full creative control.',
                    },
                    {
                      text: 'For Custom Builders: Plan and communicate with confidence. Explore layouts, test lighting and materials, and select finishes from real suppliers before building. Minimise rework, align all stakeholders, and deliver every project on time and on budget.',
                    },
                    {
                      text: 'For Suppliers: Showcase your products in context within realistic, immersive spaces where clients can experience materials, textures, and furnishings before purchase. DX LIVING connects your brand directly to decision-makers in high-end residential projects.',
                    },
                    {
                      text: "For Homeowners & Investors: Step inside your future home before it's built. Experience scale, light, and atmosphere exactly as they will feel in reality. Compare finishes, explore options, and make confident, informed decisions at every stage.",
                    },
                  ],
                },
                {
                  name: 'lastContent',
                  type: 'textarea',
                  label: 'Closing content (HTML allowed)',
                  defaultValue:
                    "<strong>DX</strong> LIVING is more than visualisation, it&apos;s the future of home design, where vision, precision, and experience come together in perfect harmony.",
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
                  defaultValue:
                    'TRUE LUXURY BEGINS WITH YOUR VISION AND WE HELP YOU BRING IT TO LIFE',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  defaultValue:
                    'We transform your ideas into immersive realities, where design precision and emotional depth create homes that truly reflect your style.',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'button',
                      type: 'text',
                      label: 'Button label',
                      defaultValue: "Let's Build Your Vision",
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
              titleDefault: 'About DX LIVING | Clarity in Luxury Home Design',
              descriptionDefault:
                'About DX LIVING: immersive 3D, VR and BIM solutions that give architects and developers clarity, confidence and control in luxury home design.',
            }),
          ],
        },
      ],
    },
  ],
}

import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateHomeGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

const ctaRow = (
  labelDefault: string,
  hrefDefault: string,
  labelName = 'buttonText',
  hrefName = 'buttonLink',
) => ({
  type: 'row' as const,
  fields: [
    {
      name: labelName,
      type: 'text' as const,
      label: 'Button label',
      defaultValue: labelDefault,
      admin: { width: '50%' },
    },
    {
      name: hrefName,
      type: 'text' as const,
      label: 'Button link',
      defaultValue: hrefDefault,
      admin: { width: '50%' },
    },
  ],
})

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public DX Living homepage.',
    group: 'Pages',
    preview: pagePreview('/'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateHomeGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'sliderItems',
              type: 'array',
              labels: { singular: 'Slide', plural: 'Slides' },
              maxRows: 4,
              fields: [
                { name: 'heading', type: 'text', required: true },
                { name: 'content', type: 'textarea', required: true },
                { name: 'button', type: 'text', required: true },
                { name: 'buttonLink', type: 'text', required: true },
              ],
              defaultValue: [
                {
                  heading: 'Who we are',
                  content:
                    'We bring your dream home to life through immersive visualisation and exceptional design.',
                  button: 'Learn More',
                  buttonLink: '/about',
                },
                {
                  heading: 'Our Expertise',
                  content:
                    'Experience future living through immersive visualisation and intelligent design.',
                  button: 'Learn More',
                  buttonLink: '/modules',
                },
                {
                  heading: 'Collaborate With Us',
                  content: 'Bring your designs to life in the spaces your clients envision.',
                  button: 'Learn More',
                  buttonLink: '/suppliers',
                },
                {
                  heading: 'Stay Informed',
                  content: 'Explore the latest in high-end residential design and innovation.',
                  button: 'Learn More',
                  buttonLink: '/articles',
                },
              ],
            },
            {
              name: 'interactiveButton',
              type: 'group',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  defaultValue: 'Start Interactive',
                },
                {
                  name: 'link',
                  type: 'text',
                  defaultValue: '/start-interactive',
                },
              ],
            },
            {
              name: 'heroVideoId',
              type: 'text',
              label: 'Hero Vimeo ID',
              defaultValue: '1121801459',
              admin: {
                description: 'Used for hero poster preload when not overridden elsewhere.',
              },
            },
          ],
        },
        {
          label: 'Redefining Home',
          fields: [
            {
              name: 'redefiningHome',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Redefining Home Building Experience',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  defaultValue:
                    'Step inside lifelike digital homes where architecture, interiors, and products come together seamlessly. DX Living transforms how homes are designed, explored, and specified through immersive 3D environments.',
                },
                ctaRow('Learn More About Us', '/about'),
              ],
            },
          ],
        },
        {
          label: 'Bring Designs',
          fields: [
            {
              name: 'bringYourDesigns',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Bring your designs to life',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  defaultValue:
                    'Convert elevation drawings and facade sketches into realistic exterior visuals. Review materials, proportions, and architectural character before committing with lighting and context that reflect real conditions.',
                },
                {
                  name: 'leftImage',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'rightImage',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'leftCaption',
                      type: 'text',
                      defaultValue: 'Sketch',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'rightCaption',
                      type: 'text',
                      defaultValue: 'Rendered',
                      admin: { width: '50%' },
                    },
                  ],
                },
                ctaRow('Check out DX Studio', '/studio'),
              ],
            },
          ],
        },
        {
          label: 'Modules',
          fields: [
            {
              name: 'exploreLimitless',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Explore Limitless Design Potential',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  defaultValue:
                    'Our intelligent modules transform how residential projects are planned and delivered, reducing ambiguity, aligning all stakeholders, and preserving design intent through every stage of the journey.',
                },
                {
                  name: 'modules',
                  type: 'array',
                  labels: { singular: 'Module', plural: 'Modules' },
                  maxRows: 12,
                  fields: [
                    { name: 'subTitle', type: 'text', required: true },
                    { name: 'title', type: 'text', required: true },
                    { name: 'content', type: 'textarea', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Projects',
          fields: [
            {
              name: 'ourProject',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Our Project Gallery',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  defaultValue:
                    'Explore residential spaces crafted with a focus on light, proportion, materiality, and atmosphere. From modern family homes to refined luxury interiors, this gallery helps teams align on mood and direction early.',
                },
                {
                  name: 'videos',
                  type: 'array',
                  labels: { singular: 'Video', plural: 'Videos' },
                  maxRows: 6,
                  fields: [
                    {
                      name: 'id',
                      type: 'text',
                      label: 'Vimeo ID',
                      required: true,
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                  ],
                  defaultValue: [
                    {
                      id: '1125050493',
                      title: 'Brighton Smart Home Project | DX LIVING Project',
                    },
                    {
                      id: '1125056634',
                      title: 'Brighton Smart Home Project | DX LIVING Project',
                    },
                    {
                      id: '1125050516',
                      title: 'Brighton Smart Home Project | DX LIVING Project',
                    },
                    {
                      id: '1125056466',
                      title: 'Brighton Smart Home Project | DX LIVING Project',
                    },
                    {
                      id: '1125050088',
                      title: 'Brighton Smart Home Project | DX LIVING Project',
                    },
                    {
                      id: '1125050726',
                      title: 'Brighton Smart Home Project | DX LIVING Project',
                    },
                  ],
                },
                ctaRow('View More', '/projects'),
              ],
            },
          ],
        },
        {
          label: 'Space Realisation',
          fields: [
            {
              name: 'spaceRealisation',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Space Realisation',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  defaultValue:
                    'Turn annotated floorplans into fully rendered interior views. Upload your labeled floorplan and watch as our app generates realistic visualisations with furniture and decor that match the purpose of every room.',
                },
                {
                  name: 'leftImage',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'rightImage',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'leftCaption',
                      type: 'text',
                      defaultValue: 'Floorplan',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'rightCaption',
                      type: 'text',
                      defaultValue: '4D Interactive',
                      admin: { width: '50%' },
                    },
                  ],
                },
                ctaRow('Check out DX Model', '/start-interactive'),
              ],
            },
          ],
        },
        {
          label: 'Workflow',
          fields: [
            {
              name: 'optimizeDesign',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Optimize Your Design Workflow',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  defaultValue:
                    'Join other professionals who have revolutionised their project delivery. Create presentation-ready visuals in minutes, win more contracts, and deliver results that impress every stakeholder.',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'items',
                  type: 'array',
                  labels: { singular: 'Item', plural: 'Items' },
                  maxRows: 4,
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'content', type: 'textarea', required: true },
                  ],
                  defaultValue: [
                    {
                      title: 'Secure More Projects',
                      content: 'Present high-end visuals that close deals 30% faster.',
                    },
                    {
                      title: 'Save Valuable Time',
                      content:
                        'Replace days of manual rendering with minutes of efficient design.',
                    },
                    {
                      title: 'No Technical Barriers',
                      content:
                        'App interface that makes professional-grade visualisation accessible to everyone.',
                    },
                    {
                      title: 'Industry Standard',
                      content:
                        'Trusted by leading global firms and award-winning companies in the construction industry.',
                    },
                  ],
                },
                ctaRow('Book a Discovery Call', '/contact'),
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            seoFields({
              titleDefault: 'Luxury Home Design Australia | 3D, VR & BIM by DX Living',
              descriptionDefault:
                "Experience luxury home design in Australia with DX Living. Use immersive 3D, VR and BIM to explore and plan your home before it's built.",
            }),
          ],
        },
      ],
    },
  ],
}

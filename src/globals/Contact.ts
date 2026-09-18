import type { GlobalConfig } from 'payload'
import { adminOnlyApiView, publicReadAuthenticatedUpdate } from '@/access'
import { seoFields } from '@/fields/seo'
import { revalidateContactGlobal } from '@/hooks/revalidateCms'
import { pagePreview } from '@/lib/cms/previewUrl'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact Page',
  access: publicReadAuthenticatedUpdate,
  admin: {
    description: 'Editable content for the public DX Living contact page.',
    group: 'Pages',
    preview: pagePreview('/contact'),
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateContactGlobal],
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
                  defaultValue: 'CONTACT US',
                },
                {
                  name: 'vimeoBackgroundVideo',
                  type: 'text',
                  label: 'Background Vimeo ID',
                  defaultValue: '1117308017',
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
                  'Left floating jump-link labels, in page order: Overview → Contact Information → Where to Find Us → LinkedIn Stories. Section targets are fixed in the page template.',
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
                { label: 'Overview' },
                { label: 'Contact Information' },
                { label: 'Where to Find Us' },
                { label: 'LinkedIn Stories' },
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
                'From dream to reality, we bring your vision to life through expert craftsmanship and guidance at every stage of the journey.',
            },
          ],
        },
        {
          label: 'Quick Enquiries',
          fields: [
            {
              name: 'quickEnquiries',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'FOR QUICK ENQUIRIES',
                },
                {
                  name: 'content',
                  type: 'textarea',
                  defaultValue:
                    'Have a question or need assistance fast? Reach out to us directly, our team is available from 8:30 AM to 6:00 PM to provide quick support and answers.',
                },
                {
                  name: 'phone',
                  type: 'text',
                  defaultValue: '1800 333 539',
                },
                {
                  name: 'email',
                  type: 'text',
                  defaultValue: 'contact@dxliving.com.au',
                },
              ],
            },
          ],
        },
        {
          label: 'Where to Find Us',
          fields: [
            {
              name: 'whereToFindUs',
              type: 'group',
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Where to Find Us',
                },
                {
                  name: 'branches',
                  type: 'array',
                  labels: { singular: 'Branch', plural: 'Branches' },
                  maxRows: 4,
                  fields: [
                    { name: 'branchName', type: 'text', required: true },
                    { name: 'location', type: 'textarea', required: true },
                    {
                      name: 'locationLink',
                      type: 'text',
                      label: 'Google Maps link',
                    },
                    { name: 'phone', type: 'text', required: true },
                    {
                      name: 'mapImage',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Map image',
                      admin: {
                        description:
                          'Optional. When empty, the page uses the built-in SVG at /images/map/{state}.svg.',
                      },
                    },
                  ],
                  defaultValue: [
                    {
                      branchName: 'VIC (HEAD OFFICE)',
                      location: 'Suite 70 44 Lakeview DR Scoresby VIC 3179',
                      locationLink: 'https://maps.app.goo.gl/MC2gyhLwGvroMYoE7',
                      phone: '1800 333 539',
                    },
                    {
                      branchName: 'NSW',
                      location: 'Level 10 418A Elizabeth ST Surry Hills NSW 2010',
                      locationLink: 'https://maps.app.goo.gl/MC2gyhLwGvroMYoE7',
                      phone: '1800 333 539',
                    },
                    {
                      branchName: 'QLD',
                      location: 'Level 14/167 Eagle ST Brisbane QLD 4000',
                      locationLink: 'https://maps.app.goo.gl/MC2gyhLwGvroMYoE7',
                      phone: '1800 333 539',
                    },
                    {
                      branchName: 'WA',
                      location: 'Level 12 197 St Georges Terrace Perth WA 6000',
                      locationLink: 'https://maps.app.goo.gl/MC2gyhLwGvroMYoE7',
                      phone: '1800 333 539',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            seoFields({
              titleDefault: 'Contact DX Living | Luxury Home Design Consultation',
              descriptionDefault:
                'Contact DX Living for luxury home design consultation. Speak with our team to plan your custom home project with clarity and confidence.',
            }),
          ],
        },
      ],
    },
  ],
}

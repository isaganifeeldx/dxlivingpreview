import type { GlobalConfig } from 'payload'
import {
  adminOnlyApiView,
  authenticatedFieldRead,
  authenticatedReadAuthenticatedUpdate,
} from '@/access'
import { menuLinkRowsField } from '@/fields/menuLinks'
import { revalidateSettingsGlobal } from '@/hooks/revalidateCms'
import { siteSettingsDefaults } from '@/lib/settings/defaults'

const d = siteSettingsDefaults

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Settings',
  access: authenticatedReadAuthenticatedUpdate,
  admin: {
    description: 'Site-wide header, footer, floating CTA, and tracking scripts.',
    group: 'Site',
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  hooks: {
    afterChange: [revalidateSettingsGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            {
              name: 'header',
              type: 'group',
              label: false,
              fields: [
                menuLinkRowsField('navLinks', 'Main menu links', d.header.navLinks),
                {
                  name: 'productLabel',
                  type: 'text',
                  label: 'Product dropdown label',
                  defaultValue: d.header.productLabel,
                },
                menuLinkRowsField(
                  'productLinks',
                  'Product dropdown links',
                  d.header.productLinks,
                ),
                {
                  name: 'resourcesLabel',
                  type: 'text',
                  label: 'Resources dropdown label',
                  defaultValue: d.header.resourcesLabel,
                },
                menuLinkRowsField(
                  'resourceLinks',
                  'Resources dropdown links',
                  d.header.resourceLinks,
                ),
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'loginLabel',
                      type: 'text',
                      label: 'Log in label',
                      defaultValue: d.header.login.label,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'loginHref',
                      type: 'text',
                      label: 'Log in URL',
                      defaultValue: d.header.login.href,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'demoLabel',
                      type: 'text',
                      label: 'Get a demo label',
                      defaultValue: d.header.demo.label,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'demoHref',
                      type: 'text',
                      label: 'Get a demo URL',
                      defaultValue: d.header.demo.href,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'startFreeLabel',
                      type: 'text',
                      label: 'Start Free label',
                      defaultValue: d.header.startFree.label,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'startFreeHref',
                      type: 'text',
                      label: 'Start Free URL',
                      defaultValue: d.header.startFree.href,
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footer',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'linkColumnTitle',
                  type: 'text',
                  label: 'Link column title',
                  defaultValue: d.footer.linkColumnTitle,
                },
                menuLinkRowsField('linkColumn', 'Link column', d.footer.linkColumn),
                {
                  name: 'resourcesColumnTitle',
                  type: 'text',
                  label: 'Resources column title',
                  defaultValue: d.footer.resourcesColumnTitle,
                },
                menuLinkRowsField(
                  'resourcesColumn',
                  'Resources column',
                  d.footer.resourcesColumn,
                ),
                {
                  name: 'companyColumnTitle',
                  type: 'text',
                  label: 'Company column title',
                  defaultValue: d.footer.companyColumnTitle,
                },
                menuLinkRowsField('companyColumn', 'Company column', d.footer.companyColumn),
                {
                  name: 'contact',
                  type: 'group',
                  label: 'Contact column',
                  fields: [
                    {
                      name: 'email',
                      type: 'email',
                      label: 'Email',
                      defaultValue: d.footer.contact.email,
                    },
                    {
                      name: 'phone',
                      type: 'text',
                      label: 'Phone display',
                      defaultValue: d.footer.contact.phone,
                    },
                    {
                      name: 'phoneHref',
                      type: 'text',
                      label: 'Phone link (tel:)',
                      defaultValue: d.footer.contact.phoneHref,
                    },
                    {
                      name: 'location',
                      type: 'text',
                      label: 'Location',
                      defaultValue: d.footer.contact.location,
                    },
                  ],
                },
                {
                  name: 'social',
                  type: 'array',
                  label: 'Social links',
                  labels: { singular: 'Social link', plural: 'Social links' },
                  defaultValue: d.footer.social,
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'YouTube', value: 'youtube' },
                      ],
                    },
                    {
                      name: 'href',
                      type: 'text',
                      required: true,
                      label: 'URL',
                    },
                  ],
                },
                menuLinkRowsField('legalLinks', 'Legal / bottom links', d.footer.legalLinks),
                {
                  name: 'copyright',
                  type: 'text',
                  label: 'Copyright text',
                  defaultValue: d.footer.copyright,
                },
              ],
            },
          ],
        },
        {
          label: 'Floating CTA',
          fields: [
            {
              name: 'floatingCta',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Show floating contact menu',
                  defaultValue: d.floatingCta.enabled,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'whatsappLabel',
                      type: 'text',
                      label: 'WhatsApp label',
                      defaultValue: d.floatingCta.whatsapp.label,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'whatsappHref',
                      type: 'text',
                      label: 'WhatsApp URL',
                      defaultValue: d.floatingCta.whatsapp.href,
                      admin: {
                        width: '60%',
                        description: 'e.g. https://wa.me/61400000000',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'messengerLabel',
                      type: 'text',
                      label: 'Messenger label',
                      defaultValue: d.floatingCta.messenger.label,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'messengerHref',
                      type: 'text',
                      label: 'Messenger URL',
                      defaultValue: d.floatingCta.messenger.href,
                      admin: {
                        width: '60%',
                        description: 'e.g. https://m.me/yourpage',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'supportLabel',
                      type: 'text',
                      label: 'Support label',
                      defaultValue: d.floatingCta.support.label,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'supportHref',
                      type: 'text',
                      label: 'Support URL',
                      defaultValue: d.floatingCta.support.href,
                      admin: {
                        width: '60%',
                        description: 'e.g. mailto:support@â€¦ or /faq',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'submitFormLabel',
                      type: 'text',
                      label: 'Submit Form label',
                      defaultValue: d.floatingCta.submitForm.label,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'submitFormHref',
                      type: 'text',
                      label: 'Submit Form URL',
                      defaultValue: d.floatingCta.submitForm.href,
                      admin: {
                        width: '60%',
                        description: 'e.g. /contact',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'callLabel',
                      type: 'text',
                      label: 'Call label',
                      defaultValue: d.floatingCta.call.label,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'callHref',
                      type: 'text',
                      label: 'Call URL',
                      defaultValue: d.floatingCta.call.href,
                      admin: {
                        width: '60%',
                        description: 'e.g. tel:1800333539',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Tracking',
          fields: [
            {
              name: 'tracking',
              type: 'group',
              label: false,
              access: authenticatedFieldRead,
              admin: {
                description:
                  'Tracking snippets are privileged â€” not exposed on the public Settings API. Only logged-in CMS users can read or edit them.',
              },
              fields: [
                {
                  name: 'googleTagHead',
                  type: 'textarea',
                  label: 'Google Tag / GTM (head)',
                  access: authenticatedFieldRead,
                  admin: {
                    description:
                      'Paste the Google tag (gtag.js) or Google Tag Manager snippet that belongs in <head>. Leave empty to disable.',
                    rows: 10,
                  },
                },
                {
                  name: 'googleTagBody',
                  type: 'textarea',
                  label: 'Google Tag Manager (body)',
                  access: authenticatedFieldRead,
                  admin: {
                    description:
                      'Optional. Paste the GTM <noscript> snippet that belongs right after <body>.',
                    rows: 6,
                  },
                },
                {
                  name: 'metaPixel',
                  type: 'textarea',
                  label: 'Meta Pixel',
                  access: authenticatedFieldRead,
                  admin: {
                    description:
                      'Paste the Meta (Facebook) Pixel base code. Leave empty to disable.',
                    rows: 10,
                  },
                },
                {
                  name: 'ahrefs',
                  type: 'textarea',
                  label: 'Ahrefs',
                  access: authenticatedFieldRead,
                  admin: {
                    description:
                      'Paste the Ahrefs Analytics script. Leave empty to disable.',
                    rows: 10,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}


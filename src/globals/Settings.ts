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
    description: 'Site-wide header labels, footer, floating CTA, and tracking scripts.',
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
                      name: 'applyLabel',
                      type: 'text',
                      label: 'Apply label',
                      defaultValue: d.header.apply.label,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'applyHref',
                      type: 'text',
                      label: 'Apply URL',
                      defaultValue: d.header.apply.href,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'contactLabel',
                      type: 'text',
                      label: 'Contact label',
                      defaultValue: d.header.contact.label,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'contactHref',
                      type: 'text',
                      label: 'Contact URL',
                      defaultValue: d.header.contact.href,
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
                  name: 'tagline',
                  type: 'textarea',
                  label: 'Brand tagline',
                  defaultValue: d.footer.tagline,
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
                {
                  name: 'linkColumnTitle',
                  type: 'text',
                  label: 'Link column title',
                  defaultValue: d.footer.linkColumnTitle,
                },
                menuLinkRowsField('linkColumn', 'Link column', d.footer.linkColumn),
                {
                  name: 'modulesColumnTitle',
                  type: 'text',
                  label: 'Modules column title',
                  defaultValue: d.footer.modulesColumnTitle,
                },
                menuLinkRowsField('modulesColumn', 'Modules column', d.footer.modulesColumn),
                {
                  name: 'contact',
                  type: 'group',
                  label: 'Contact column',
                  fields: [
                    {
                      name: 'intro',
                      type: 'textarea',
                      label: 'Intro text',
                      defaultValue: d.footer.contact.intro,
                    },
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
                    {
                      name: 'locationHref',
                      type: 'text',
                      label: 'Location map URL',
                      defaultValue: d.footer.contact.locationHref,
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
                  admin: {
                    description:
                      'Floating contact shortcuts. Support opens the in-app chat; other rows use the URLs below.',
                  },
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
                      admin: { width: '60%' },
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
                      admin: { width: '60%' },
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
                      admin: {
                        width: '40%',
                        description: 'Opens the in-app support chat (not a URL).',
                      },
                    },
                    {
                      name: 'supportHref',
                      type: 'text',
                      label: 'Support URL (unused)',
                      defaultValue: d.floatingCta.support.href,
                      admin: {
                        width: '60%',
                        description: 'Kept for CMS parity; Support always opens the chatbot.',
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
                      admin: { width: '60%' },
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
                      admin: { width: '60%' },
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
                  'Tracking snippets are privileged — not exposed on the public Settings API. Only logged-in CMS users can read or edit them.',
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
                    description: 'Paste the Ahrefs Analytics script. Leave empty to disable.',
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

import type { Field } from 'payload'

type SeoFieldsOptions = {
  titleDefault?: string
  descriptionDefault?: string
}

/** Rank Math–style SEO fields reusable across globals/collections. */
export const seoFields = ({
  titleDefault = '',
  descriptionDefault = '',
}: SeoFieldsOptions = {}): Field => ({
  name: 'seo',
  type: 'group',
  label: 'SEO',
  fields: [
    {
      type: 'collapsible',
      label: 'Search engine listing',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta title',
          defaultValue: titleDefault,
          admin: {
            components: {
              Description: '/components/payload/SeoMetaTitleDescription',
            },
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta description',
          defaultValue: descriptionDefault,
          admin: {
            components: {
              Description: '/components/payload/SeoMetaDescriptionDescription',
            },
          },
        },
        {
          name: 'focusKeyword',
          type: 'text',
          label: 'Focus keyword',
          admin: {
            description: 'Primary phrase you want this page to rank for (for editorial guidance).',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Additional keywords',
          admin: {
            description: 'Optional comma-separated secondary keywords.',
          },
        },
        {
          name: 'canonicalUrl',
          type: 'text',
          label: 'Canonical URL',
          admin: {
            description: 'Leave blank to use the default page URL. Use a full URL if overriding.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Robots',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'noIndex',
          type: 'checkbox',
          label: 'No index',
          defaultValue: false,
          admin: {
            description: 'Ask search engines not to show this page in results.',
          },
        },
        {
          name: 'noFollow',
          type: 'checkbox',
          label: 'No follow',
          defaultValue: false,
          admin: {
            description: 'Ask search engines not to follow links on this page.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Open Graph (Facebook / LinkedIn)',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'ogTitle',
          type: 'text',
          label: 'OG title',
          admin: {
            description: 'Defaults to meta title if empty.',
          },
        },
        {
          name: 'ogDescription',
          type: 'textarea',
          label: 'OG description',
          admin: {
            description: 'Defaults to meta description if empty.',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG image',
          admin: {
            description: 'Recommended: 1200×630px. Used for social share previews.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Twitter / X',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'twitterCard',
          type: 'select',
          label: 'Card type',
          defaultValue: 'summary_large_image',
          options: [
            { label: 'Summary large image', value: 'summary_large_image' },
            { label: 'Summary', value: 'summary' },
          ],
        },
        {
          name: 'twitterTitle',
          type: 'text',
          label: 'Twitter title',
          admin: {
            description: 'Defaults to OG title, then meta title.',
          },
        },
        {
          name: 'twitterDescription',
          type: 'textarea',
          label: 'Twitter description',
          admin: {
            description: 'Defaults to OG description, then meta description.',
          },
        },
        {
          name: 'twitterImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Twitter image',
          admin: {
            description: 'Defaults to OG image if empty.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Custom JSON-LD',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'customJsonLd',
          type: 'textarea',
          label: 'Custom JSON-LD',
          admin: {
            description:
              'Optional. Paste a JSON object or array (Schema.org). Do not include <script> tags — JSON only. Rendered as an extra application/ld+json script.',
            rows: 12,
          },
          validate: (value: unknown) => {
            if (value == null || value === '') return true
            if (typeof value !== 'string') return 'JSON-LD must be text'
            const trimmed = value.trim()
            if (!trimmed) return true
            try {
              const parsed: unknown = JSON.parse(trimmed)
              if (parsed === null || typeof parsed !== 'object') {
                return 'JSON-LD must be a JSON object or array'
              }
              return true
            } catch {
              return 'Invalid JSON — check for missing commas or quotes'
            }
          },
        },
        {
          name: 'replaceDefaultJsonLd',
          type: 'checkbox',
          label: 'Replace default JSON-LD',
          defaultValue: false,
          admin: {
            description:
              'If checked, only your custom JSON-LD is output (auto Organization / WebSite / WebPage is skipped).',
          },
        },
      ],
    },
  ],
})

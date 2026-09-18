import type { Field } from 'payload'

/** Reusable label + href rows for nav / footer menus. */
export function menuLinkRowsField(
  name: string,
  label: string,
  defaults: Array<{ label: string; href: string }>,
): Field {
  return {
    name,
    type: 'array',
    label,
    labels: {
      singular: 'Link',
      plural: 'Links',
    },
    admin: {
      initCollapsed: false,
    },
    defaultValue: defaults,
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
        label: 'Label',
      },
      {
        name: 'href',
        type: 'text',
        required: true,
        label: 'URL',
        admin: {
          description: 'Internal path (e.g. /faq) or full URL. Use # for a placeholder.',
        },
      },
    ],
  }
}

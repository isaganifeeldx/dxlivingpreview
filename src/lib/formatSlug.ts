/** Matches Payload's default `slugify` so client auto-fill stays consistent with Generate / save hooks. */
export function formatSlug(value: string): string {
  return value
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()
}

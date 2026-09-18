type MediaLike = {
  url?: string | null
  filename?: string | null
} | null

/**
 * Resolve a Payload media URL for next/image and <img>.
 * - Blob / external absolute URLs are kept as-is
 * - Payload local file URLs are returned as site-relative paths so next/image
 *   can use `images.localPatterns` (absolute self-URLs often 400 in the optimizer)
 */
export function getMediaUrl(media: number | MediaLike | undefined | null): string | null {
  if (!media || typeof media === 'number') return null
  const raw = media.url?.trim()
  if (!raw) return null

  if (raw.startsWith('/')) return raw

  try {
    const parsed = new URL(raw)
    if (parsed.pathname.startsWith('/api/media/file/')) {
      return `${parsed.pathname}${parsed.search}`
    }
    return raw
  } catch {
    return raw
  }
}

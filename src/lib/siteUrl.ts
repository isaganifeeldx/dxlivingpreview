function normalizeUrl(url: string): string {
  return url.replace(/\/$/, '')
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Coerce a host or absolute URL into a canonical https origin.
 * Rejects postgres / blob-token / other non-http values that would later
 * blow up Next metadata (`new URL`) or get redacted in Vercel logs.
 */
function toAbsoluteHttpUrl(hostOrUrl: string): string | null {
  const trimmed = hostOrUrl.trim()
  if (!trimmed) return null

  // Never treat DB / blob secrets as a public site origin.
  if (/^(postgres(ql)?|mysql|mongodb(\+srv)?):/i.test(trimmed)) return null
  if (trimmed.startsWith('vercel_blob_rw_')) return null

  const absolute = /^https?:\/\//i.test(trimmed)
    ? normalizeUrl(trimmed)
    : normalizeUrl(`https://${trimmed}`)

  return isHttpUrl(absolute) ? absolute : null
}

const FALLBACK_SITE_URL = 'https://dxliving.com'

/**
 * Public site origin for metadata, canonicals, JSON-LD, etc.
 *
 * Resolution order (same idea as Payload `serverURL` in payload.config):
 * 1. NEXT_PUBLIC_SITE_URL (set this for custom domains)
 * 2. On Vercel: production URL, or preview URL for preview deploys
 * 3. Fallback https://dxliving.com
 *
 * First Vercel deploy does **not** require NEXT_PUBLIC_SITE_URL —
 * Vercel injects VERCEL_URL / VERCEL_PROJECT_PRODUCTION_URL automatically.
 */
export const getSiteUrl = () => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) {
    const url = toAbsoluteHttpUrl(configured)
    if (url) return url
  }

  const vercelUrl = process.env.VERCEL_URL?.trim()
  const vercelBranchUrl = process.env.VERCEL_BRANCH_URL?.trim()
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  const isPreview = process.env.VERCEL_ENV === 'preview'

  if (isPreview) {
    const preview = vercelUrl || vercelBranchUrl || vercelProductionUrl
    if (preview) {
      const url = toAbsoluteHttpUrl(preview)
      if (url) return url
    }
  }

  const production = vercelProductionUrl || vercelUrl
  if (production) {
    const url = toAbsoluteHttpUrl(production)
    if (url) return url
  }

  return FALLBACK_SITE_URL
}

/**
 * Only the live production host should be crawlable.
 * Staging, localhost, and preview hosts stay noindex.
 *
 * Override with NEXT_PUBLIC_ALLOW_SEARCH_INDEXING=0|1 when needed.
 */
export const isSearchIndexingEnabled = (): boolean => {
  const override = process.env.NEXT_PUBLIC_ALLOW_SEARCH_INDEXING?.trim()
  if (override === '0' || override === 'false') return false
  if (override === '1' || override === 'true') return true

  try {
    const host = new URL(getSiteUrl()).hostname.toLowerCase()
    return host === 'dxliving.com' || host === 'www.dxliving.com'
  } catch {
    return false
  }
}

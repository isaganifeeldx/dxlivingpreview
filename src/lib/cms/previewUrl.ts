import type { GeneratePreviewURL } from 'payload'
import { getSiteUrl } from '@/lib/siteUrl'

/** Absolute frontend URL for Payload admin Preview (opens in a new tab). */
export function absolutePreviewUrl(path: string): string {
  const base = getSiteUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized === '/' ? '' : normalized}` || `${base}/`
}

/** Fixed path for a page global (Home, FAQ, etc.). */
export function pagePreview(path: string): GeneratePreviewURL {
  return () => absolutePreviewUrl(path)
}

/** Collection doc preview → `/articles/{slug}`. */
export const articlePreview: GeneratePreviewURL = (data) => {
  const slug =
    typeof data?.slug === 'string' && data.slug.trim()
      ? data.slug.trim()
      : typeof data?.id === 'string' || typeof data?.id === 'number'
        ? String(data.id)
        : ''
  return absolutePreviewUrl(slug ? `/articles/${slug}` : '/articles')
}

/** Collection doc preview → `/projects/{slug}`. */
export const projectPreview: GeneratePreviewURL = (data) => {
  const slug =
    typeof data?.slug === 'string' && data.slug.trim()
      ? data.slug.trim()
      : typeof data?.id === 'string' || typeof data?.id === 'number'
        ? String(data.id)
        : ''
  return absolutePreviewUrl(slug ? `/projects/${slug}` : '/projects')
}

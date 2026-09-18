import type { Metadata } from 'next'
import { getSiteUrl, isSearchIndexingEnabled } from '@/lib/siteUrl'
import type { SeoData } from './types'

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function toAbsoluteUrl(urlOrPath: string, siteUrl: string): string | null {
  const trimmed = urlOrPath.trim()
  if (!trimmed) return null

  const absolute = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `${siteUrl}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`

  return isValidHttpUrl(absolute) ? absolute : null
}

type BuildMetadataOptions = {
  seo: SeoData
  path: string
  fallbackTitle: string
  fallbackDescription: string
  fallbackImageUrl?: string | null
  siteName?: string
  locale?: string
  absoluteTitle?: boolean
}

/** Staging / preview hosts must stay noindex even if CMS robots fields allow indexing. */
function withIndexingGuard(metadata: Metadata): Metadata {
  if (isSearchIndexingEnabled()) return metadata

  return {
    ...metadata,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  }
}

export function buildMetadataFromSeo({
  seo,
  path,
  fallbackTitle,
  fallbackDescription,
  fallbackImageUrl = null,
  siteName = 'DX Living',
  locale = 'en_AU',
  absoluteTitle = false,
}: BuildMetadataOptions): Metadata {
  const siteUrl = getSiteUrl()
  const title = seo.title || fallbackTitle
  const description = seo.description || fallbackDescription
  const pathCanonical = `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
  const canonical =
    (seo.canonicalUrl ? toAbsoluteUrl(seo.canonicalUrl, siteUrl) : null) ||
    pathCanonical

  const ogTitle = seo.ogTitle || title
  const ogDescription = seo.ogDescription || description
  const ogImageRaw = seo.ogImageUrl || fallbackImageUrl
  const ogImage = ogImageRaw ? toAbsoluteUrl(ogImageRaw, siteUrl) : null

  const twitterTitle = seo.twitterTitle || ogTitle
  const twitterDescription = seo.twitterDescription || ogDescription
  const twitterImageRaw = seo.twitterImageUrl || ogImageRaw
  const twitterImage = twitterImageRaw
    ? toAbsoluteUrl(twitterImageRaw, siteUrl)
    : null

  const keywords = [
    seo.focusKeyword,
    ...seo.keywords
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  ].filter(Boolean)

  const allowIndex = isSearchIndexingEnabled() && !seo.noIndex
  const allowFollow = isSearchIndexingEnabled() && !seo.noFollow

  return withIndexingGuard({
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords.length > 0 ? { keywords } : {}),
    robots: {
      index: allowIndex,
      follow: allowFollow,
      googleBot: {
        index: allowIndex,
        follow: allowFollow,
      },
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'website',
      url: canonical,
      siteName,
      locale,
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                alt: ogTitle,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: seo.twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      ...(twitterImage
        ? {
            images: [twitterImage],
          }
        : {}),
    },
  })
}

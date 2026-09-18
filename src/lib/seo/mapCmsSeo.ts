import { getMediaUrl } from '@/lib/media'
import { emptySeoData, type SeoData } from './types'

type CmsMedia = {
  url?: string | null
} | null

export type CmsSeo = {
  title?: string | null
  description?: string | null
  focusKeyword?: string | null
  keywords?: string | null
  canonicalUrl?: string | null
  noIndex?: boolean | null
  noFollow?: boolean | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: number | CmsMedia
  twitterCard?: 'summary' | 'summary_large_image' | null
  twitterTitle?: string | null
  twitterDescription?: string | null
  twitterImage?: number | CmsMedia
  customJsonLd?: string | null
  replaceDefaultJsonLd?: boolean | null
} | null

function text(value: string | null | undefined, fallback = ''): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

export function mapCmsSeo(doc: CmsSeo | undefined, fallback: SeoData): SeoData {
  if (!doc) return fallback

  return emptySeoData({
    title: text(doc.title, fallback.title),
    description: text(doc.description, fallback.description),
    focusKeyword: text(doc.focusKeyword, fallback.focusKeyword),
    keywords: text(doc.keywords, fallback.keywords),
    canonicalUrl: text(doc.canonicalUrl, fallback.canonicalUrl),
    noIndex: Boolean(doc.noIndex),
    noFollow: Boolean(doc.noFollow),
    ogTitle: text(doc.ogTitle, fallback.ogTitle),
    ogDescription: text(doc.ogDescription, fallback.ogDescription),
    ogImageUrl: getMediaUrl(doc.ogImage) ?? fallback.ogImageUrl,
    twitterCard: doc.twitterCard === 'summary' ? 'summary' : 'summary_large_image',
    twitterTitle: text(doc.twitterTitle, fallback.twitterTitle),
    twitterDescription: text(doc.twitterDescription, fallback.twitterDescription),
    twitterImageUrl: getMediaUrl(doc.twitterImage) ?? fallback.twitterImageUrl,
    customJsonLd: text(doc.customJsonLd, fallback.customJsonLd),
    replaceDefaultJsonLd: Boolean(doc.replaceDefaultJsonLd),
  })
}

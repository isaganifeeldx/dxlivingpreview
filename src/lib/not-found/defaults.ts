import { emptySeoData } from '@/lib/seo/types'
import type { NotFoundPageContentData } from './types'

export const NOT_FOUND_METADATA_TITLE = '404 | Page Not Found | DX Living'

export const NOT_FOUND_METADATA_DESCRIPTION =
  'The page you are looking for does not exist or has been moved.'

export const notFoundPageDefaults: NotFoundPageContentData = {
  heading: '404',
  title: 'Page Not Found',
  description: "The page you are looking for doesn't exist or has been moved.",
  hint: 'Please check the URL or return to the homepage.',
  ctaLabel: 'Go to Homepage',
  ctaHref: '/',
  seo: emptySeoData({
    title: NOT_FOUND_METADATA_TITLE,
    description: NOT_FOUND_METADATA_DESCRIPTION,
    focusKeyword: '404',
    keywords: '404, page not found, DX Living',
    ogTitle: NOT_FOUND_METADATA_TITLE,
    ogDescription: NOT_FOUND_METADATA_DESCRIPTION,
    ogImageUrl: '/og/og.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: NOT_FOUND_METADATA_TITLE,
    twitterDescription: NOT_FOUND_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/og.jpg',
    // 404 must stay out of search results.
    noIndex: true,
    noFollow: true,
  }),
}

export const FALLBACK_NOT_FOUND_CONTENT = notFoundPageDefaults

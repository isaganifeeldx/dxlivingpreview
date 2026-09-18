import { fallbackTermsOfServiceContent } from '@/data/legalContent'
import { emptySeoData } from '@/lib/seo/types'
import type { TermsPageContentData } from './types'

export const TERMS_METADATA_TITLE = 'Terms of Service | DX LIVING'

export const TERMS_METADATA_DESCRIPTION =
  'Read the DX Living terms of service outlining the rules, conditions and responsibilities when using our website and services.'

export const termsPageDefaults: TermsPageContentData = {
  title: 'TERMS OF SERVICE',
  body: fallbackTermsOfServiceContent,
  seo: emptySeoData({
    title: TERMS_METADATA_TITLE,
    description: TERMS_METADATA_DESCRIPTION,
    focusKeyword: 'DX Living terms of service',
    keywords: 'terms of service, terms of use, DX Living legal',
    ogTitle: TERMS_METADATA_TITLE,
    ogDescription: TERMS_METADATA_DESCRIPTION,
    ogImageUrl: '/og/og.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: TERMS_METADATA_TITLE,
    twitterDescription: TERMS_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/og.jpg',
  }),
}

export const FALLBACK_TERMS_CONTENT = termsPageDefaults

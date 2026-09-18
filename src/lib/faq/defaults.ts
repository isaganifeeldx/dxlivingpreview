import { emptySeoData } from '@/lib/seo/types'
import { faqIntro, fallbackFaqItems } from '@/data/faqData'
import type { FaqPageContentData } from './types'

export const FAQ_METADATA_TITLE = 'FAQ | DX LIVING'

export const FAQ_METADATA_DESCRIPTION =
  'Frequently asked questions about DX Living, Studio, Interiors, Models, Prestige, and how we help bring unbuilt homes to life.'

export const faqPageDefaults: FaqPageContentData = {
  title: 'FREQUENTLY ASKED QUESTIONS',
  intro: faqIntro,
  items: fallbackFaqItems,
  seo: emptySeoData({
    title: FAQ_METADATA_TITLE,
    description: FAQ_METADATA_DESCRIPTION,
    focusKeyword: 'DX Living FAQ',
    keywords: 'FAQ, DX Living, DX Studio, DX Interiors, DX Model, DX Prestige',
    ogTitle: FAQ_METADATA_TITLE,
    ogDescription: FAQ_METADATA_DESCRIPTION,
    ogImageUrl: '/og/og.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: FAQ_METADATA_TITLE,
    twitterDescription: FAQ_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/og.jpg',
  }),
}

export const FALLBACK_FAQ_CONTENT = faqPageDefaults

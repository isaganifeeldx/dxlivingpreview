import { fallbackPrivacyPolicyContent } from '@/data/legalContent'
import { emptySeoData } from '@/lib/seo/types'
import type { PrivacyPageContentData } from './types'

export const PRIVACY_METADATA_TITLE = 'Privacy Policy | DX Living'
export const PRIVACY_METADATA_DESCRIPTION =
  'Read the DX Living privacy policy to understand how we collect, use and protect your personal information across our website and services.'
export const privacyPageDefaults: PrivacyPageContentData = {
  title: 'PRIVACY POLICY',
  body: fallbackPrivacyPolicyContent,
  seo: emptySeoData({
    title: PRIVACY_METADATA_TITLE,
    description: PRIVACY_METADATA_DESCRIPTION,
    focusKeyword: 'DX Living privacy policy',
    keywords: 'privacy policy, personal information, DX Living privacy',
    ogTitle: PRIVACY_METADATA_TITLE,
    ogDescription: PRIVACY_METADATA_DESCRIPTION,
    ogImageUrl: '/og/og.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: PRIVACY_METADATA_TITLE,
    twitterDescription: PRIVACY_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/og.jpg',
  }),
}

export const FALLBACK_PRIVACY_CONTENT = privacyPageDefaults

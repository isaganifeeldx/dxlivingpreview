export type SeoData = {
  title: string
  description: string
  focusKeyword: string
  keywords: string
  canonicalUrl: string
  noIndex: boolean
  noFollow: boolean
  ogTitle: string
  ogDescription: string
  ogImageUrl: string | null
  twitterCard: 'summary' | 'summary_large_image'
  twitterTitle: string
  twitterDescription: string
  twitterImageUrl: string | null
  /** Raw JSON string from CMS; validated before render. */
  customJsonLd: string
  /** When true, skip auto-generated JSON-LD and only output custom. */
  replaceDefaultJsonLd: boolean
}

export const emptySeoData = (overrides: Partial<SeoData> = {}): SeoData => ({
  title: '',
  description: '',
  focusKeyword: '',
  keywords: '',
  canonicalUrl: '',
  noIndex: false,
  noFollow: false,
  ogTitle: '',
  ogDescription: '',
  ogImageUrl: null,
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImageUrl: null,
  customJsonLd: '',
  replaceDefaultJsonLd: false,
  ...overrides,
})

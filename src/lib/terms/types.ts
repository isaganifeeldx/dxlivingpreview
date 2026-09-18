import type { SeoData } from '@/lib/seo/types'

export type TermsPageContentData = {
  title: string
  /** Plain/HTML fallback string, or Lexical editor JSON from CMS. */
  body: unknown
  seo: SeoData
}

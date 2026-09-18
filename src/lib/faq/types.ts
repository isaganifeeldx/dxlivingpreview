import type { FaqItem } from '@/data/faqData'
import type { SeoData } from '@/lib/seo/types'

export type FaqPageContentData = {
  title: string
  intro: string
  items: FaqItem[]
  seo: SeoData
}

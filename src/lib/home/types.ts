import type { HomePageContentData } from '@/data/homeContent'
import type { SeoData } from '@/lib/seo/types'

export type { HomePageContentData }

export type HomePageCmsContent = HomePageContentData & {
  seo: SeoData
}

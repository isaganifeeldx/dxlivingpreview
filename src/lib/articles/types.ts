import type { ArticleData } from '@/data/articles'
import type { SeoData } from '@/lib/seo/types'
import type { ArticleCategory } from './categoryDefs'

export type ArticlesAnchorMenuItem = {
  id: string
  label: string
}

export type ArticlesCta = {
  heading: string
  content: string
  button: string
  buttonLink: string
  videoBackground: string
}

export type ArticlesPageContentData = {
  banner: {
    title: string
    vimeoBackgroundVideo: string
  }
  anchorMenu: ArticlesAnchorMenuItem[]
  introduction: string
  cta: ArticlesCta
  detailBanner: {
    vimeoBackgroundVideo: string
  }
  detailCta: {
    heading: string
    button: string
    buttonLink: string
    videoBackground: string
  }
}

export type ArticleCmsItem = ArticleData & {
  seo: SeoData
}

export type ArticlesPageCmsContent = ArticlesPageContentData & {
  seo: SeoData
  articles: ArticleCmsItem[]
  categories: ArticleCategory[]
}

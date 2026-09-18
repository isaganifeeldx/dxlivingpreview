import type { SeoData } from '@/lib/seo/types'
import type { ModulesPageModuleCard } from '@/lib/modules/types'

export type ModelAnchorMenuItem = {
  id: string
  label: string
}

export type ModelFeatureItem = {
  heading: string
  content: string
}

export type ModelPageContentData = {
  banner: {
    title: string
    vimeoBackgroundVideo: string
  }
  anchorMenu: ModelAnchorMenuItem[]
  introduction: {
    heading: string
    introVideo: {
      heading: string
      content: string
      vimeoVideo: string
    }
  }
  features: {
    heading: string
    list: ModelFeatureItem[]
    button: string
    buttonMobile: string
    buttonLink: string
  }
  otherModulesHeading: string
  book: {
    heading: string
    content: string
    button: string
    buttonLink: string
  }
  cta: {
    heading: string
    content: string
    button: string
    buttonLink: string
    videoBackground: string
  }
}

export type ModelPageCmsContent = ModelPageContentData & {
  seo: SeoData
  moduleCards: ModulesPageModuleCard[]
}

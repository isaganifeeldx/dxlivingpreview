import type { SeoData } from '@/lib/seo/types'
import type { ModulesPageModuleCard } from '@/lib/modules/types'

export type PrestigeAnchorMenuItem = {
  id: string
  label: string
}

export type PrestigeFeatureItem = {
  heading: string
  content: string
}

export type PrestigePageContentData = {
  banner: {
    title: string
    vimeoBackgroundVideo: string
  }
  anchorMenu: PrestigeAnchorMenuItem[]
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
    list: PrestigeFeatureItem[]
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

export type PrestigePageCmsContent = PrestigePageContentData & {
  seo: SeoData
  moduleCards: ModulesPageModuleCard[]
}

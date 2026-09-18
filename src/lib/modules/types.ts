import type { SeoData } from '@/lib/seo/types'

export type ModulesAnchorMenuItem = {
  id: string
  label: string
}

export type ModulesPageModuleCard = {
  title: string
  content: string
  image: string
  link: string
}

export type ModulesPageContentData = {
  banner: {
    title: string
    vimeoBackgroundVideo: string
  }
  anchorMenu: ModulesAnchorMenuItem[]
  introduction: string
  moduleCards: ModulesPageModuleCard[]
  cta: {
    heading: string
    content: string
    button: string
    buttonLink: string
    videoBackground: string
  }
}

export type ModulesPageCmsContent = ModulesPageContentData & {
  seo: SeoData
}

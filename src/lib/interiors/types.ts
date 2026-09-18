import type { SeoData } from '@/lib/seo/types'
import type { ModulesPageModuleCard } from '@/lib/modules/types'

export type InteriorsAnchorMenuItem = {
  id: string
  label: string
}

export type InteriorsDesignYourSpaceItem = {
  heading: string
  content: string
}

export type InteriorsPageContentData = {
  banner: {
    title: string
    vimeoBackgroundVideo: string
  }
  anchorMenu: InteriorsAnchorMenuItem[]
  introduction: {
    heading: string
    introVideo: {
      heading: string
      content: string
      vimeoVideo: string
    }
  }
  designYourSpace: {
    heading: string
    list: InteriorsDesignYourSpaceItem[]
    lastContent: string
    button: string
    buttonLink: string
    note: string
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

export type InteriorsPageCmsContent = InteriorsPageContentData & {
  seo: SeoData
  moduleCards: ModulesPageModuleCard[]
}

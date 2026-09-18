import type { SeoData } from '@/lib/seo/types'
import type { ModulesPageModuleCard } from '@/lib/modules/types'

export type StudioAnchorMenuItem = {
  id: string
  label: string
}

export type StudioWhyPartnerItem = {
  heading: string
  content: string
}

export type StudioHowItWorksItem = {
  text: string
  tooltip: string
}

export type StudioHowItWorksColumn = {
  title: string
  subtitle: string
  items: StudioHowItWorksItem[]
}

export type StudioPageContentData = {
  banner: {
    title: string
    vimeoBackgroundVideo: string
  }
  anchorMenu: StudioAnchorMenuItem[]
  introduction: string
  whyPartner: {
    heading: string
    list: StudioWhyPartnerItem[]
  }
  howItWorks: {
    heading: string
    columns: StudioHowItWorksColumn[]
    button: string
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

export type StudioPageCmsContent = StudioPageContentData & {
  seo: SeoData
  moduleCards: ModulesPageModuleCard[]
}

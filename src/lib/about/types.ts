import type { SeoData } from '@/lib/seo/types'

export type AboutAnchorMenuItem = {
  id: string
  label: string
}

export type AboutPageContentData = {
  banner: {
    title: string
    vimeoBackgroundVideo: string
  }
  anchorMenu: AboutAnchorMenuItem[]
  introduction: string
  videoLeft: string
  contentRight: string
  fullWidthVideo: string
  whyDxLiving: {
    heading: string
    content: string
    contentList: string[]
    lastContent: string
  }
  cta: {
    heading: string
    content: string
    button: string
    buttonLink: string
    videoBackground: string
  }
}

export type AboutPageCmsContent = AboutPageContentData & {
  seo: SeoData
}

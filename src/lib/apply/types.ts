import type { SeoData } from '@/lib/seo/types'

export type ApplyAnchorMenuItem = {
  id: string
  label: string
}

export type ApplyWhyJoinItem = {
  heading: string
  content: string
}

export type ApplyHowItWorksStep = {
  heading: string
  content: string
}

export type ApplyPageContentData = {
  banner: {
    title: string
    vimeoBackgroundVideo: string
  }
  anchorMenu: ApplyAnchorMenuItem[]
  introduction: {
    heading: string
    content: string
  }
  whyJoin: {
    heading: string
    content: string
    items: ApplyWhyJoinItem[]
  }
  videos: {
    left: string
    right: string
  }
  whoThisIsFor: {
    heading: string
    content: string
    items: string[]
  }
  howItWorks: {
    heading: string
    steps: ApplyHowItWorksStep[]
  }
  applyToJoin: {
    heading: string
    content: string
  }
}

export type ApplyPageCmsContent = ApplyPageContentData & {
  seo: SeoData
}

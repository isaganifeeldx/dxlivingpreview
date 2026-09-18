import type { SeoData } from '@/lib/seo/types'

export type SuppliersAnchorMenuItem = {
  id: string
  label: string
}

export type SuppliersOfferItem = {
  title: string
  content: string
}

export type SuppliersProcessStep = {
  title: string
  content: string
}

export type SuppliersTierRow = {
  level: string
  description: string
  visibility: string
}

export type SuppliersPageContentData = {
  banner: {
    title: string
    vimeoBackgroundVideo: string
  }
  anchorMenu: SuppliersAnchorMenuItem[]
  introduction: string
  fullWidthVideo: string
  whatWeOffer: {
    heading: string
    items: SuppliersOfferItem[]
  }
  materialIntegration: {
    heading: string
    vimeoVideo: string
  }
  process: {
    heading: string
    rightSideVideo: string
    steps: SuppliersProcessStep[]
  }
  tiers: {
    heading: string
    rows: SuppliersTierRow[]
    buttonDesktop: string
    buttonMobile: string
  }
  cta: {
    heading: string
    content: string
    button: string
    buttonLink: string
    videoBackground: string
  }
}

export type SuppliersPageCmsContent = SuppliersPageContentData & {
  seo: SeoData
}

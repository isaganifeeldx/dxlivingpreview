import type { SeoData } from '@/lib/seo/types'

export type ContactAnchorMenuItem = {
  id: string
  label: string
}

export type ContactBranch = {
  branchName: string
  location: string
  locationLink?: string
  phone: string
  /** Resolved map image URL (uploaded Media, or built-in SVG fallback). */
  svgImageUrl: string
}

export type ContactPageContentData = {
  banner: {
    title: string
    vimeoBackgroundVideo: string
  }
  anchorMenu: ContactAnchorMenuItem[]
  introduction: string
  quickEnquiries: {
    heading: string
    content: string
    phone: string
    email: string
  }
  whereToFindUs: {
    heading: string
    branches: ContactBranch[]
  }
}

export type ContactPageCmsContent = ContactPageContentData & {
  seo: SeoData
}

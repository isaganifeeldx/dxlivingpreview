export type MenuLink = {
  label: string
  href: string
}

export type FloatingCtaAction = {
  label: string
  href: string
}

export type SiteSettingsData = {
  header: {
    navLinks: MenuLink[]
    productLabel: string
    productLinks: MenuLink[]
    resourcesLabel: string
    resourceLinks: MenuLink[]
    login: MenuLink
    demo: MenuLink
    startFree: MenuLink
  }
  footer: {
    linkColumnTitle: string
    linkColumn: MenuLink[]
    resourcesColumnTitle: string
    resourcesColumn: MenuLink[]
    companyColumnTitle: string
    companyColumn: MenuLink[]
    contact: {
      email: string
      phone: string
      phoneHref: string
      location: string
    }
    social: Array<{
      platform: 'facebook' | 'linkedin' | 'instagram' | 'youtube'
      href: string
    }>
    legalLinks: MenuLink[]
    copyright: string
  }
  floatingCta: {
    enabled: boolean
    whatsapp: FloatingCtaAction
    messenger: FloatingCtaAction
    support: FloatingCtaAction
    submitForm: FloatingCtaAction
    call: FloatingCtaAction
  }
  tracking: {
    googleTagHead: string
    googleTagBody: string
    metaPixel: string
    ahrefs: string
  }
}

export const siteSettingsDefaults: SiteSettingsData = {
  header: {
    navLinks: [
      { label: 'Plans', href: '/plans' },
      { label: 'Business', href: '/business' },
    ],
    productLabel: 'Product',
    productLinks: [
      { label: 'DX Interiors', href: '/product/dx-interiors' },
      { label: 'SpaceSense AI', href: '/product/spacesense-ai' },
    ],
    resourcesLabel: 'Resources',
    resourceLinks: [
      { label: 'Articles', href: '/articles' },
      { label: 'Tutorials', href: '/tutorial' },
      { label: 'Inspiration', href: '/inspiration' },
      { label: 'Help', href: '#' },
    ],
    login: { label: 'Log in', href: '#' },
    demo: { label: 'Get a demo', href: '/contact' },
    startFree: { label: 'Start Free', href: '/login' },
  },
  footer: {
    linkColumnTitle: 'Link',
    linkColumn: [
      { label: 'DX Interiors', href: '/product/dx-interiors' },
      { label: 'SpaceSense AI', href: '/product/spacesense-ai' },
      { label: 'Plans', href: '/plans' },
      { label: 'Business', href: '/business' },
      { label: 'FAQs', href: '/faq' },
    ],
    resourcesColumnTitle: 'Resources',
    resourcesColumn: [
      { label: 'Articles', href: '/articles' },
      { label: 'Tutorials', href: '/tutorial' },
      { label: 'Inspiration', href: '/inspiration' },
      { label: 'Help', href: '#' },
    ],
    companyColumnTitle: 'Company',
    companyColumn: [
      { label: 'About us', href: '/about' },
      { label: 'Request a demo', href: '/contact' },
      { label: 'DX Living', href: '#' },
      { label: 'FeelDX', href: '#' },
    ],
    contact: {
      email: 'sales@dxinteriors.ai',
      phone: '1800 333 539',
      phoneHref: 'tel:1800333539',
      location: 'Victoria, Australia',
    },
    social: [
      { platform: 'facebook', href: 'https://www.facebook.com/dxlivingaustralia' },
      { platform: 'linkedin', href: 'https://www.linkedin.com/company/108389291' },
      { platform: 'instagram', href: 'https://www.instagram.com/dxliving.au/' },
      { platform: 'youtube', href: 'https://www.youtube.com/@DXLivingofficial' },
    ],
    legalLinks: [
      { label: 'Terms & Conditions', href: '/terms-of-service' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'User Agreement', href: '#' },
    ],
    copyright: 'Â© 2026 DX Living. All rights reserved',
  },
  floatingCta: {
    enabled: true,
    whatsapp: { label: 'Whatsapp', href: 'https://wa.me/1800333539' },
    messenger: { label: 'Messenger', href: 'https://m.me/dxlivingaustralia' },
    support: { label: 'Support', href: 'mailto:sales@dxinteriors.ai' },
    submitForm: { label: 'Submit Form', href: '/contact' },
    call: { label: 'Call', href: 'tel:1800333539' },
  },
  tracking: {
    googleTagHead: '',
    googleTagBody: '',
    metaPixel: '',
    ahrefs: '',
  },
}


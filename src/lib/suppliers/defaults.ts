import { emptySeoData } from '@/lib/seo/types'
import type { SuppliersPageCmsContent, SuppliersPageContentData } from './types'

/** Fixed Suppliers page section targets — not editable in CMS. */
export const SUPPLIERS_ANCHOR_SECTION_IDS = [
  'intro',
  'what-we-offer',
  'supplier-material',
  'our-process',
  'our-supplier-tiers',
  'apply-now',
] as const

export const FALLBACK_SUPPLIERS_CONTENT: SuppliersPageContentData = {
  banner: {
    title: 'Become a DX LIVING partner',
    vimeoBackgroundVideo: '1117308086',
  },
  anchorMenu: [
    { id: 'intro', label: 'Introduction' },
    { id: 'what-we-offer', label: 'What We Offer' },
    { id: 'supplier-material', label: 'Material Integration' },
    { id: 'our-process', label: 'Our Process' },
    { id: 'our-supplier-tiers', label: 'Supplier Tiers' },
    { id: 'apply-now', label: 'Apply Now' },
  ],
  introduction:
    'Partner with us to feature your products in premier homes, integrated into immersive visual tours that help you attract more clients effortlessly.',
  fullWidthVideo: '1117005774',
  whatWeOffer: {
    heading: 'What We Offer',
    items: [
      {
        title: 'Seamless Integration',
        content:
          "Bring every detail to life through finishes and furnishings precisely embedded within DX LIVING's advanced 3D/4D and BIM ecosystem.",
      },
      {
        title: 'Direct Access to Decision-Makers',
        content:
          'Position your brand before the most selective architects, builders, and homeowners, precisely when it matters most.',
      },
      {
        title: 'Long-Term Opportunities',
        content:
          "Gain privileged early access to DX LIVING's upcoming developments and forge enduring partnerships within an elite design network.",
      },
    ],
  },
  materialIntegration: {
    heading: 'SUPPLIER MATERIAL INTEGRATION',
    vimeoVideo: '1129395838',
  },
  process: {
    heading: 'Our Process: From Onboarding to Build',
    rightSideVideo: '1117005842',
    steps: [
      {
        title: 'Partner with DX LIVING',
        content:
          'Register your company and product portfolio today through our official supplier application.',
      },
      {
        title: 'Evaluation & Onboarding',
        content:
          'Each potential supplier undergoes a rigorous evaluation to ensure they meet our exacting standards of design excellence and superior quality.',
      },
      {
        title: 'Material Specs & Samples Submission',
        content:
          'Provide precise material specifications and curated samples for comprehensive premium review and approval.',
      },
      {
        title: 'Integration into Render & Model Environment',
        content:
          'Approved materials are seamlessly integrated into our 3D & 4D models, delivering unmatched precision and photorealistic visualisation.',
      },
      {
        title: 'Showcasing in VR / CGI Deliverables',
        content:
          'We will present your vision with exceptional clarity, combining hyper-realistic CGI and immersive VR to captivate and engage clients.',
      },
      {
        title: 'Final Handover / Case Study Inclusion',
        content:
          'Our finalised projects proudly showcase the suppliers, recognising their role in bringing each design vision to life.',
      },
    ],
  },
  tiers: {
    heading: 'Our Supplier Tiers',
    rows: [
      {
        level: 'Basic Tier',
        description:
          'Showcase up to 5 of your material finishes as realistic textures. Users can easily drag and drop your supplied finishes into their curated designs within our applications.',
        visibility: 'DX Interiors & DX Model Lite (Visibility)',
      },
      {
        level: 'Premium Tier',
        description:
          'One 3D/4D product is included at NO EXTRA COST, and is fully integrated across our applications. Enhance your product collections further with our premium options.',
        visibility: 'DX Model & DX Model Lite (Visibility)',
      },
    ],
    buttonDesktop: 'Become a Preferred Supplier',
    buttonMobile: 'Become a Supplier',
  },
  cta: {
    heading: 'BECOME A DX LIVING PARTNER TODAY',
    content:
      "Submit your expression of interest to become a featured supplier on Australia's most digitally advanced residential projects.",
    button: 'PARTNER WITH US',
    buttonLink: '/apply',
    videoBackground: '1117308030',
  },
}

export const SUPPLIERS_METADATA_TITLE =
  'Premium Building Suppliers Australia | DX Living'
export const SUPPLIERS_METADATA_DESCRIPTION =
  'Building suppliers in Australia with DX Living. Discover premium materials, finishes and trusted partners for luxury residential construction projects.'
export const SUPPLIERS_FOCUS_KEYWORD = 'building suppliers Australia'

export const suppliersPageDefaults: SuppliersPageCmsContent = {
  ...FALLBACK_SUPPLIERS_CONTENT,
  seo: emptySeoData({
    title: SUPPLIERS_METADATA_TITLE,
    description: SUPPLIERS_METADATA_DESCRIPTION,
    focusKeyword: SUPPLIERS_FOCUS_KEYWORD,
    ogTitle: SUPPLIERS_METADATA_TITLE,
    ogDescription: SUPPLIERS_METADATA_DESCRIPTION,
    ogImageUrl: '/og/supplier-og.jpg',
    twitterTitle: SUPPLIERS_METADATA_TITLE,
    twitterDescription: SUPPLIERS_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/supplier-og.jpg',
  }),
}

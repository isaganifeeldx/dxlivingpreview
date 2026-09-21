import { emptySeoData } from '@/lib/seo/types'
import type { ApplyPageCmsContent, ApplyPageContentData } from './types'

/** Fixed Apply page section targets — not editable in CMS. */
export const APPLY_ANCHOR_SECTION_IDS = [
  'intro',
  'section-1',
  'section-2',
  'section-3',
  'apply-now',
] as const

export const FALLBACK_APPLY_CONTENT: ApplyPageContentData = {
  banner: {
    title: 'JOIN US NOW',
    vimeoBackgroundVideo: '1117307964',
  },
  anchorMenu: [
    { id: 'intro', label: 'Introduction' },
    { id: 'section-1', label: 'Why Join US?' },
    { id: 'section-2', label: 'Who This Is For?' },
    { id: 'section-3', label: 'How It Works?' },
    { id: 'apply-now', label: 'Apply Now' },
  ],
  introduction: {
    heading: "Be Part of Australia's Most Immersive Home Experiences",
    content:
      "Here's where you come in: everything clients see on our platform is real. That means your products whether flooring, lighting, appliances, or smart home systems can be featured directly inside the design experience. By partnering with us, your brand becomes part of the decision-making process, giving clients the confidence to choose your products early and often. Together, we create not just homes, but experiences powered by premium suppliers like you.",
  },
  whyJoin: {
    heading: 'Why Join the DX LIVING Supplier Network',
    content:
      "At DX LIVING, we don't just design homes, we create experiences. By joining our supplier network, your products become part of the journey homeowners take when bringing their dream home to life. Here's why it's worth it:",
    items: [
      {
        heading: 'Your products, brought to life',
        content:
          'See your flooring, lighting, appliances, and more showcased inside stunning 3D and 4D home walkthroughs.',
      },
      {
        heading: 'Be part of the decision-making',
        content:
          'Homeowners explore, compare, and choose products before a single brick is laid, and your brand is right there when it matters most.',
      },
      {
        heading: 'Turn dreams into sales',
        content:
          'When a client falls in love with your product in their digital home, they can go directly to your site to make the purchase.',
      },
      {
        heading: 'Stand out as premium',
        content: 'Join a curated network of trusted brands that set the standard for luxury living.',
      },
    ],
  },
  videos: {
    left: '1117610205',
    right: '1117610250',
  },
  whoThisIsFor: {
    heading: 'Who This Is For',
    content: 'We welcome suppliers and manufacturers in the following categories:',
    items: [
      'Timber, tile, or hybrid flooring',
      'Stone and benchtops',
      'Lighting and electrical',
      'Cabinetry, joinery, and finishes',
      'Kitchen and bathroom appliances',
      'Tapware, sanitaryware, and accessories',
      'Windows and glazing',
      'Cladding, paint, render systems',
      'Smart home and automation technology',
      'Outdoor and landscaping materials',
      'Hydronics, HVAC, and in-slab systems',
    ],
  },
  howItWorks: {
    heading: 'How It Works',
    steps: [
      {
        heading: 'Application',
        content: 'Suppliers submit their application with product details, certifications, and portfolio.',
      },
      {
        heading: 'Review',
        content:
          'DX LIVING reviews to ensure alignment with our premium standards and project requirements.',
      },
      {
        heading: 'Product Integration',
        content: 'Approved products are digitised and integrated into our immersive 3D/4D platform',
      },
      {
        heading: 'Partnership Launch',
        content:
          'Suppliers join the DX LIVING network, gain visibility in luxury projects, and start benefiting from early client engagement, project specifications, and direct sales opportunities.',
      },
    ],
  },
  applyToJoin: {
    heading: 'Apply to Join',
    content:
      'Please complete the form below to express your interest in joining the DX LIVING Supplier Partner Program. Our team will be in touch within 1-2 business days.',
  },
}

export const APPLY_METADATA_TITLE = 'Supplier Partnership Australia | Apply with DX Living'
export const APPLY_METADATA_DESCRIPTION =
  'Supplier partnership opportunities in Australia with DX Living. Apply now to join luxury residential projects with leading architects and builders.'
export const APPLY_FOCUS_KEYWORD = 'supplier partnership'
export const applyPageDefaults: ApplyPageCmsContent = {
  ...FALLBACK_APPLY_CONTENT,
  seo: emptySeoData({
    title: APPLY_METADATA_TITLE,
    description: APPLY_METADATA_DESCRIPTION,
    focusKeyword: APPLY_FOCUS_KEYWORD,
    ogTitle: APPLY_METADATA_TITLE,
    ogDescription: APPLY_METADATA_DESCRIPTION,
    ogImageUrl: '/og/apply-og.jpg',
    twitterTitle: APPLY_METADATA_TITLE,
    twitterDescription: APPLY_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/apply-og.jpg',
  }),
}

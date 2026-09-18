import { emptySeoData } from '@/lib/seo/types'
import type { InteriorsPageCmsContent, InteriorsPageContentData } from './types'

/** Fixed Interiors page section targets — not editable in CMS. */
export const INTERIORS_ANCHOR_SECTION_IDS = [
  'intro',
  'section-1',
  'section-2',
  'section-5',
  'section-6',
  'contact-us',
] as const

export const FALLBACK_INTERIORS_CONTENT: InteriorsPageContentData = {
  banner: {
    title: 'DX Interiors',
    vimeoBackgroundVideo: '1118934561',
  },
  anchorMenu: [
    { id: 'intro', label: 'Introduction' },
    { id: 'section-1', label: 'Video' },
    { id: 'section-2', label: 'Features' },
    { id: 'section-5', label: 'Other Modules' },
    { id: 'section-6', label: 'Book a Call' },
    { id: 'contact-us', label: 'Contact Us' },
  ],
  introduction: {
    heading:
      'DX Interiors brings homeowners, designers, and suppliers together in one intelligent design space.',
    introVideo: {
      heading: 'Your Virtual Design Studio',
      content:
        'DX Interiors blends intelligent visualisation with curated sourcing, enabling you to select real products, apply colors and textures, and experience your interior design unfold in real-time 3D.',
      vimeoVideo: '1117005489',
    },
  },
  designYourSpace: {
    heading: 'DESIGN YOUR SPACE YOUR WAY WITH DX INTERIORS',
    list: [
      {
        heading: 'Instant Design Validation',
        content:
          'Bring your vision to life instantly, simply upload a photo or pick a template, then drag and drop photo-realistic furniture and decor to see new ideas unfold.',
      },
      {
        heading: 'Real-time Material Visualisation',
        content:
          'Experience materials with absolute authenticity. Browse curated finishes from our suppliers and see their accurate product details.',
      },
      {
        heading: 'Immersive Supplier Showroom',
        content:
          'Elevate your product catalog into interactive 2D environments, enabling designers and homeowners to engage with your products as they envision their ideal spaces.',
      },
      {
        heading: 'Guided Path to Purchase',
        content:
          'Seamlessly move from idea to decision as users collect products, craft mood boards, and complete selections within an intuitive platform.',
      },
    ],
    lastContent:
      'DX Interiors empowers homeowners to elegantly design their spaces using authentic supplier products, envision furniture and finishes within your rooms for making confident choices.',
    button: 'COMING SOON',
    buttonLink: '/contact',
    note: 'For Inquiries, Please Contact us.',
  },
  otherModulesHeading: 'Check out our other modules',
  book: {
    heading: 'Not sure which module fits your needs best?',
    content: "Let's talk. Book a call and we'll help you find the perfect fit.",
    button: 'Book a discovery call',
    buttonLink: '/contact',
  },
  cta: {
    heading: 'FINDING THE MODULE THAT FITS YOUR AMBITION',
    content:
      "We'll help you map your goals, uncover priorities, and choose the right DXLIVING solution for your project.",
    button: 'Book a discovery call',
    buttonLink: '/contact',
    videoBackground: '1117308030',
  },
}

export const INTERIORS_METADATA_TITLE =
  'DX Interiors Luxury Homes | Interior Design Australia'
export const INTERIORS_METADATA_DESCRIPTION =
  'Interior design Australia reimagined by DX Interiors. DX Interiors provides custom, personalized luxury interiors that reflect your family lifestyle.'
export const INTERIORS_FOCUS_KEYWORD = 'interior design Australia'

export const interiorsPageDefaults: InteriorsPageCmsContent = {
  ...FALLBACK_INTERIORS_CONTENT,
  seo: emptySeoData({
    title: INTERIORS_METADATA_TITLE,
    description: INTERIORS_METADATA_DESCRIPTION,
    focusKeyword: INTERIORS_FOCUS_KEYWORD,
    ogTitle: INTERIORS_METADATA_TITLE,
    ogDescription: INTERIORS_METADATA_DESCRIPTION,
    ogImageUrl: '/og/interior-og.jpg',
    twitterTitle: INTERIORS_METADATA_TITLE,
    twitterDescription: INTERIORS_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/interior-og.jpg',
  }),
  moduleCards: [],
}

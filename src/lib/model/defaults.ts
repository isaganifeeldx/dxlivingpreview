import { emptySeoData } from '@/lib/seo/types'
import type { ModelPageCmsContent, ModelPageContentData } from './types'

/** Fixed Model page section targets — not editable in CMS. */
export const MODEL_ANCHOR_SECTION_IDS = [
  'intro',
  'section-1',
  'section-2',
  'section-6',
  'section-7',
  'contact-us',
] as const

export const FALLBACK_MODEL_CONTENT: ModelPageContentData = {
  banner: {
    title: 'DX Model',
    vimeoBackgroundVideo: '1118934596',
  },
  anchorMenu: [
    { id: 'intro', label: 'Introduction' },
    { id: 'section-1', label: 'Video' },
    { id: 'section-2', label: 'Features' },
    { id: 'section-6', label: 'Other Modules' },
    { id: 'section-7', label: 'Book a Call' },
    { id: 'contact-us', label: 'Contact Us' },
  ],
  introduction: {
    heading:
      'Step inside your design with interactive 4D walkthroughs and explore every detail in immersive, VR-ready realism.',
    introVideo: {
      heading: 'Experience Your Space in Motion',
      content:
        '<strong>DX</strong> Model delivers an immersive 4D design experience allowing you to freely swap materials, adjust lighting, and visualize authentic supplier products in real time.',
      vimeoVideo: '1124715847',
    },
  },
  features: {
    heading: 'TRANSFORM HOW CLIENTS EXPERIENCE THEIR FUTURE HOMES WITH DX MODEL',
    list: [
      {
        heading: 'Immersive Visualisation',
        content:
          'Experience the full depth of your future home with vibrant, photorealistic 4D walkthroughs that combine realistic visuals with time-based construction sequencing.',
      },
      {
        heading: 'Real Product Integration',
        content:
          'Discover and integrate premium, authentic materials and furnishings from esteemed suppliers, with expert guidance to bring your design vision to life.',
      },
      {
        heading: 'Collaborative Ecosystem',
        content:
          'Unifying homeowners, designers, architects, and builders on a single platform that supports collaborative planning and efficient coordinated project management.',
      },
      {
        heading: 'Informed Decision-Making',
        content:
          'Make confident decisions by virtually touring your project and refining the design before final approval.',
      },
      {
        heading: 'Dynamic Lighting Simulation',
        content:
          'Observe how lighting transforms your design at any time of day with realism.',
      },
      {
        heading: 'Ultra-High Definition Rendering',
        content:
          'Visualise your project in breathtaking high definition quality and details.',
      },
      {
        heading: 'Immersive Virtual Reality',
        content: 'Experience your project through immersive, life-size VR walkthroughs.',
      },
    ],
    button: 'Step into your future home today',
    buttonMobile: "Let's get started",
    buttonLink: '/contact',
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

export const MODEL_METADATA_TITLE = 'DX Model Australia | Modern Home Models'
export const MODEL_METADATA_DESCRIPTION =
  'Modern home models reimagined by DX Model. Contemporary architectural designs combining sustainability, luxury, and personalization for Australian families.'
export const MODEL_FOCUS_KEYWORD = 'Modern home models'
export const modelPageDefaults: ModelPageCmsContent = {
  ...FALLBACK_MODEL_CONTENT,
  seo: emptySeoData({
    title: MODEL_METADATA_TITLE,
    description: MODEL_METADATA_DESCRIPTION,
    focusKeyword: MODEL_FOCUS_KEYWORD,
    ogTitle: MODEL_METADATA_TITLE,
    ogDescription: MODEL_METADATA_DESCRIPTION,
    ogImageUrl: '/og/model-og.jpg',
    twitterTitle: MODEL_METADATA_TITLE,
    twitterDescription: MODEL_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/model-og.jpg',
  }),
  moduleCards: [],
}

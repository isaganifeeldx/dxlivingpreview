import { emptySeoData } from '@/lib/seo/types'
import type { PrestigePageCmsContent, PrestigePageContentData } from './types'

/** Fixed Prestige page section targets — not editable in CMS. */
export const PRESTIGE_ANCHOR_SECTION_IDS = [
  'intro',
  'section-1',
  'section-2',
  'section-5',
  'section-6',
  'contact-us',
] as const

export const FALLBACK_PRESTIGE_CONTENT: PrestigePageContentData = {
  banner: {
    title: 'DX Prestige',
    vimeoBackgroundVideo: '1118934620',
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
      'Experience the full power of DX Studio, DX Interiors, and DX Model seamlessly integrated in DX Prestige.',
    introVideo: {
      heading: 'DX Prestige: The Pinnacle of VIP Luxury Home Creation',
      content:
        '<strong>DX</strong> Prestige combines the artistry of <strong>DX</strong> Studio, the refinement of <strong>DX</strong> Interiors, and the innovation of <strong>DX</strong> Model to deliver an unparalleled luxury home experience.',
      vimeoVideo: '1117005489',
    },
  },
  features: {
    heading: 'ELEVATE LUXURY HOMES BEYOND IMAGINATION WITH DX PRESTIGE',
    list: [
      {
        heading: 'Unified Platform Access',
        content:
          '<strong>DX</strong> Prestige is a VIP platform that brings together every <strong>DX</strong> LIVING services, combining cutting-edge visualisation, personalized interactive design, and immersive virtual tours for a complete luxury home experience.',
      },
      {
        heading: 'Immersive VIP Visualization',
        content:
          'Step inside your future space with lifelike 4D tours, VR integration, and true-to-material visualisations.',
      },
      {
        heading: 'White-Glove Collaboration',
        content:
          'Our platform empowers high-end teams to collaborate, share real-time updates, and monitor progress, with immediate access to supplier materials and all <strong>DX</strong> LIVING services.',
      },
      {
        heading: 'Curated Real-World Integration',
        content:
          'Elevate your project with curated premium materials from premier suppliers, integrated into your design model for unmatched realism.',
      },
      {
        heading: 'Project Management & Insight',
        content:
          'Compare before/after versions of designs instantly and generate summaries of design trends, material usage, and supplier performance.',
      },
      {
        heading: 'Exclusive VIP Perks',
        content:
          'Personal <strong>DX</strong> LIVING curator for guidance from concept to completion & faster turnaround for 4D and cinematic outputs.',
      },
      {
        heading: 'VIP VR Ready',
        content: 'Experience your design in VR via available portable VR kits.',
      },
    ],
    button: 'Step into your future home today',
    buttonMobile: "Let's get started",
    buttonLink: '/contact',
  },
  otherModulesHeading: 'Other Modules',
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

export const PRESTIGE_METADATA_TITLE =
  'Luxury Home Design Service Australia | DX Living Prestige'
export const PRESTIGE_METADATA_DESCRIPTION =
  'DX Prestige offers luxury home design service in Australia. Bespoke, sustainable architecture tailored to your vision and prestige standards.'
export const PRESTIGE_FOCUS_KEYWORD = 'luxury home design service'
export const prestigePageDefaults: PrestigePageCmsContent = {
  ...FALLBACK_PRESTIGE_CONTENT,
  seo: emptySeoData({
    title: PRESTIGE_METADATA_TITLE,
    description: PRESTIGE_METADATA_DESCRIPTION,
    focusKeyword: PRESTIGE_FOCUS_KEYWORD,
    ogTitle: PRESTIGE_METADATA_TITLE,
    ogDescription: PRESTIGE_METADATA_DESCRIPTION,
    ogImageUrl: '/og/prestige-og.jpg',
    twitterTitle: PRESTIGE_METADATA_TITLE,
    twitterDescription: PRESTIGE_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/prestige-og.jpg',
  }),
  moduleCards: [],
}

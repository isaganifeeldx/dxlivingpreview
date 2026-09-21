import { emptySeoData } from '@/lib/seo/types'
import type { StudioPageCmsContent, StudioPageContentData } from './types'

/** Fixed Studio page section targets — not editable in CMS. */
export const STUDIO_ANCHOR_SECTION_IDS = [
  'intro',
  'section-1',
  'section-2',
  'section-5',
  'section-6',
  'contact-us',
] as const

export const FALLBACK_STUDIO_CONTENT: StudioPageContentData = {
  banner: {
    title: 'DX STUDIO',
    vimeoBackgroundVideo: '1118934579',
  },
  anchorMenu: [
    { id: 'intro', label: 'Introduction' },
    { id: 'section-1', label: 'Why Us?' },
    { id: 'section-2', label: 'How It Works' },
    { id: 'section-5', label: 'Other Modules' },
    { id: 'section-6', label: 'Book a Call' },
    { id: 'contact-us', label: 'Contact Us' },
  ],
  introduction:
    'We leverage building expertise and 3D/4D technology to help you decide confidently, spot issues early, and complete projects successfully.',
  whyPartner: {
    heading: 'Why Partner with DX Studio for High-End Residential Projects?',
    list: [
      {
        heading: 'Master Craftsmanship Insight',
        content:
          'We bring deep construction expertise to residential projects, ensuring every detail from structural accuracy to premium finishes, is precisely planned and beautifully executed.',
      },
      {
        heading: 'Foresight for Flawless Execution',
        content:
          'Residential projects require specialised expertise. We identify coordination issues and risks early, preventing costly changes and ensuring on-time, on-budget delivery.',
      },
      {
        heading: 'Uncompromising Visual Communication',
        content:
          'DX Studio provide photorealistic visualisations that bridge the gap between plans and reality, giving clients certainty and helping you secure approvals faster.',
      },
      {
        heading: 'Agile & Iterative Design Collaboration',
        content:
          'We create 3D & 4D experiences that give clients a complete understanding of the finished home, accelerating decision-making and securing commitments.',
      },
    ],
  },
  howItWorks: {
    heading: 'How it Works',
    columns: [
      {
        title: 'Pre-tender',
        subtitle: '(Client Side)',
        items: [
          { text: 'Master plan programs', tooltip: 'DX LIVING - Master plan programs' },
          { text: 'What-if scenario analysis', tooltip: 'DX LIVING - What-if scenario analysis' },
          {
            text: 'Interior & exterior render shots',
            tooltip: 'DX LIVING - Interior & exterior render shots',
          },
          {
            text: '3D models & 4D interactive tours',
            tooltip: 'DX LIVING - 3D models & 4D interactive tours',
          },
          { text: '2D site management plans', tooltip: 'DX LIVING - 2D site management plans' },
          {
            text: '4D methodology & flythroughs',
            tooltip: 'DX LIVING - 4D methodology & flythroughs',
          },
          { text: '3D methodology', tooltip: 'DX LIVING - 3D methodology' },
        ],
      },
      {
        title: 'Pre-Construction',
        subtitle: '(Client Side)',
        items: [
          {
            text: 'Pre-construction program & sub-contractor program validation',
            tooltip: 'DX LIVING - Pre-construction program & sub-contractor program validation',
          },
          { text: 'Master plan programs', tooltip: 'DX LIVING - Master plan programs' },
          { text: 'What-if scenario analysis', tooltip: 'DX LIVING - What-if scenario analysis' },
          {
            text: 'Interior & exterior render shots',
            tooltip: 'DX LIVING - Interior & exterior render shots',
          },
          {
            text: '3D models & 4D interactive tours',
            tooltip: 'DX LIVING - 3D models & 4D interactive tours',
          },
          { text: '2D site management plans', tooltip: 'DX LIVING - 2D site management plans' },
          {
            text: '4D methodology & flythroughs',
            tooltip: 'DX LIVING - 4D methodology & flythroughs',
          },
          { text: '3D methodology', tooltip: 'DX LIVING - 3D methodology' },
        ],
      },
      {
        title: 'Pre-Construction',
        subtitle: '(Contractor Side)',
        items: [
          {
            text: 'Pre-construction program and sub-contractor programs',
            tooltip: 'DX LIVING - Pre-construction program and sub-contractor programs',
          },
          {
            text: 'Construction Management Plans',
            tooltip: 'DX LIVING - Construction Management Plans',
          },
          {
            text: 'Pre-Construction Written Methodologies',
            tooltip: 'DX LIVING - Pre-Construction Written Methodologies',
          },
          { text: 'Forensic Cashflow Analysis', tooltip: 'DX LIVING - Forensic Cashflow Analysis' },
          { text: 'Resource Loaded Histograms', tooltip: 'DX LIVING - Resource Loaded Histograms' },
          { text: '3D Methodologies', tooltip: 'DX LIVING - 3D Methodologies' },
          { text: '4D Methodologies', tooltip: 'DX LIVING - 4D Methodologies' },
          { text: '4D Interactives', tooltip: 'DX LIVING - 4D Interactives' },
          {
            text: 'Internal and External Render Shots',
            tooltip: 'DX LIVING - Internal and External Render Shots',
          },
          { text: '2D Site Management Plans', tooltip: 'DX LIVING - 2D Site Management Plans' },
        ],
      },
      {
        title: 'Construction',
        subtitle: '',
        items: [
          {
            text: 'Project statusing and plan vs actual videos',
            tooltip: 'DX LIVING - Project statusing and plan vs actual videos',
          },
          {
            text: 'Notice of delay and extension of time validation',
            tooltip: 'DX LIVING - Notice of delay and extension of time validation',
          },
          {
            text: 'Construction program validation',
            tooltip: 'DX LIVING - Construction program validation',
          },
          { text: 'What-if scenario analysis', tooltip: 'DX LIVING - What-if scenario analysis' },
          { text: 'Critical path validation', tooltip: 'DX LIVING - Critical path validation' },
          { text: 'Interactive models', tooltip: 'DX LIVING - Interactive models' },
        ],
      },
    ],
    button: 'Begin Your Dream Home',
    buttonLink: '/contact',
  },
  otherModulesHeading: 'Check out our other modules',
  book: {
    heading: 'Explore our subscription options',
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

export const STUDIO_METADATA_TITLE = '3D Home Design Australia | VR & BIM by DX Living'
export const STUDIO_METADATA_DESCRIPTION =
  '3D home design in Australia by DX Living Studio. Experience immersive VR and BIM to visualise, plan and refine your custom home with precision.'
export const STUDIO_FOCUS_KEYWORD = 'home design Australia'
export const studioPageDefaults: StudioPageCmsContent = {
  ...FALLBACK_STUDIO_CONTENT,
  seo: emptySeoData({
    title: STUDIO_METADATA_TITLE,
    description: STUDIO_METADATA_DESCRIPTION,
    focusKeyword: STUDIO_FOCUS_KEYWORD,
    ogTitle: STUDIO_METADATA_TITLE,
    ogDescription: STUDIO_METADATA_DESCRIPTION,
    ogImageUrl: '/og/studio-og.jpg',
    twitterTitle: STUDIO_METADATA_TITLE,
    twitterDescription: STUDIO_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/studio-og.jpg',
  }),
  moduleCards: [],
}

import { emptySeoData } from '@/lib/seo/types'
import type { ModulesPageCmsContent, ModulesPageContentData } from './types'

/** Fixed Modules page section targets — not editable in CMS. */
export const MODULES_ANCHOR_SECTION_IDS = [
  'intro',
  'section-1',
  'book-a-call',
] as const

export const FALLBACK_MODULES_CONTENT: ModulesPageContentData = {
  banner: {
    title: 'Our Modules',
    vimeoBackgroundVideo: '1118936146',
  },
  anchorMenu: [
    { id: 'intro', label: 'Introduction' },
    { id: 'section-1', label: 'Modules' },
    { id: 'book-a-call', label: 'Book a Call' },
  ],
  introduction:
    'Our modular suite of premium services adapts seamlessly to your vision, delivering sophisticated solutions with remarkable speed.',
  moduleCards: [
    {
      title: 'DX Studio',
      content:
        'Construction project management and visualisation services, using 3D/4D modeling, renders, and interactive tools.<br /><br />For Architects, Custom Builders & Developers',
      image: '/images/module-1.jpg',
      link: '/studio',
    },
    {
      title: 'DX Interiors',
      content:
        'Choose colors, textures, and materials to decorate realistic 3D rooms in real-time.<br /><br />For Homeowners, Suppliers & Custom Builders',
      image: '/images/module-2.jpg',
      link: '/interiors',
    },
    {
      title: 'DX Model',
      content:
        'Interactive, 4D property walkthroughs that lets you freely explore spaces with VR compatibility and easy-to-use navigation.<br /><br />For Homeowners, Suppliers, Architects & Custom Builders',
      image: '/images/module-3.jpg',
      link: '/model',
    },
    {
      title: 'DX Prestige',
      content:
        'VIP service that combines advanced project visualisation, bespoke interactive design experiences, and immersive virtual tours all together.<br /><br />For High-End Homeowners, Custom Builders, Architects & Developers',
      image: '/images/module-4.jpg',
      link: '/prestige',
    },
  ],
  cta: {
    heading: 'Wondering which module fits your needs best?',
    content: "Let's discuss your goals and craft the ideal solution.",
    button: 'Book a Discovery Call',
    buttonLink: '/contact',
    videoBackground: '1117308030',
  },
}

export const MODULES_METADATA_TITLE =
  'DX LIVING Luxury Homes Australia | Custom Modular Design'
export const MODULES_METADATA_DESCRIPTION =
  "Experience custom modular design excellence. DX Living offers premium architectural solutions for luxury homes across Australia's leading families."
export const MODULES_FOCUS_KEYWORD = 'Custom modular design'

export const modulesPageDefaults: ModulesPageCmsContent = {
  ...FALLBACK_MODULES_CONTENT,
  seo: emptySeoData({
    title: MODULES_METADATA_TITLE,
    description: MODULES_METADATA_DESCRIPTION,
    focusKeyword: MODULES_FOCUS_KEYWORD,
    ogTitle: MODULES_METADATA_TITLE,
    ogDescription: MODULES_METADATA_DESCRIPTION,
    ogImageUrl: '/og/module-og.jpg',
    twitterTitle: MODULES_METADATA_TITLE,
    twitterDescription: MODULES_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/module-og.jpg',
  }),
}

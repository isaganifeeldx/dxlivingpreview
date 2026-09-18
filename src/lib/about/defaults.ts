import { emptySeoData } from '@/lib/seo/types'
import type { AboutPageCmsContent, AboutPageContentData } from './types'

/** Fixed About page section targets — not editable in CMS. */
export const ABOUT_ANCHOR_SECTION_IDS = [
  'intro',
  'section-2',
  'section-4',
  'get-in-touch',
] as const

export const FALLBACK_ABOUT_CONTENT: AboutPageContentData = {
  banner: {
    title: 'ABOUT US',
    vimeoBackgroundVideo: '1116999894',
  },
  anchorMenu: [
    { id: 'intro', label: 'Introduction' },
    { id: 'section-2', label: 'Why DX LIVING?' },
    { id: 'section-4', label: 'LinkedIn Stories' },
    { id: 'get-in-touch', label: 'Get in Touch' },
  ],
  introduction:
    'Craft your vision with <strong>DX</strong> LIVING, explore authentic furniture and materials, styled perfectly in your actual space.',
  videoLeft: '1117005475',
  contentRight:
    "With <strong>DX</strong> LIVING, your future home is more than a vision, it&apos;s an experience. Explore your space through hyper-real visuals, intelligent design technology, and real supplier materials that bring absolute certainty to every decision.",
  fullWidthVideo: '1117005489',
  whyDxLiving: {
    heading: 'Why DX LIVING?',
    content:
      '<strong>DX</strong> LIVING elevates clarity in home design, seamlessly uniting design excellence, construction precision, and unwavering client assurance. By merging technology with artistry, <strong>DX</strong> LIVING transforms the way homes are imagined, experienced, and brought to life.',
    contentList: [
      'For Developers: Accelerate sales and reduce risk with immersive 3D and 4D visuals that transform plans into investment-ready experiences. Streamline the pre-construction phase, showcase every design option with photoreal realism, and secure off-the-plan commitments sooner.',
      'For Architects: Preserve design intent from concept to completion. DX LIVING ensures your vision is presented exactly as imagined through cinematic visualisation, accurate material mapping, and BIM-aligned precision. Engage clients emotionally while maintaining full creative control.',
      'For Custom Builders: Plan and communicate with confidence. Explore layouts, test lighting and materials, and select finishes from real suppliers before building. Minimise rework, align all stakeholders, and deliver every project on time and on budget.',
      'For Suppliers: Showcase your products in context within realistic, immersive spaces where clients can experience materials, textures, and furnishings before purchase. DX LIVING connects your brand directly to decision-makers in high-end residential projects.',
      "For Homeowners & Investors: Step inside your future home before it's built. Experience scale, light, and atmosphere exactly as they will feel in reality. Compare finishes, explore options, and make confident, informed decisions at every stage.",
    ],
    lastContent:
      "<strong>DX</strong> LIVING is more than visualisation, it&apos;s the future of home design, where vision, precision, and experience come together in perfect harmony.",
  },
  cta: {
    heading: 'TRUE LUXURY BEGINS WITH YOUR VISION AND WE HELP YOU BRING IT TO LIFE',
    content:
      'We transform your ideas into immersive realities, where design precision and emotional depth create homes that truly reflect your style.',
    button: "Let's Build Your Vision",
    buttonLink: '/contact',
    videoBackground: '1117308030',
  },
}

export const ABOUT_METADATA_TITLE = 'About DX LIVING | Clarity in Luxury Home Design'
export const ABOUT_METADATA_DESCRIPTION =
  'About DX LIVING: immersive 3D, VR and BIM solutions that give architects and developers clarity, confidence and control in luxury home design.'
export const ABOUT_FOCUS_KEYWORD = 'About'

export const aboutPageDefaults: AboutPageCmsContent = {
  ...FALLBACK_ABOUT_CONTENT,
  seo: emptySeoData({
    title: ABOUT_METADATA_TITLE,
    description: ABOUT_METADATA_DESCRIPTION,
    focusKeyword: ABOUT_FOCUS_KEYWORD,
    ogTitle: ABOUT_METADATA_TITLE,
    ogDescription: ABOUT_METADATA_DESCRIPTION,
    ogImageUrl: '/og/about-og.jpg',
    twitterTitle: ABOUT_METADATA_TITLE,
    twitterDescription: ABOUT_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/about-og.jpg',
  }),
}

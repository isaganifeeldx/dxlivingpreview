import { emptySeoData } from '@/lib/seo/types'
import type { ContactPageCmsContent, ContactPageContentData } from './types'

/** Fixed Contact page section targets — not editable in CMS. */
export const CONTACT_ANCHOR_SECTION_IDS = [
  'intro',
  'contact-information',
  'where-to-find-us',
  'section-4',
] as const

export const FALLBACK_CONTACT_CONTENT: ContactPageContentData = {
  banner: {
    title: 'CONTACT US',
    vimeoBackgroundVideo: '1117308017',
  },
  anchorMenu: [
    { id: 'intro', label: 'Overview' },
    { id: 'contact-information', label: 'Contact Information' },
    { id: 'where-to-find-us', label: 'Where to Find Us' },
    { id: 'section-4', label: 'LinkedIn Stories' },
  ],
  introduction:
    'From dream to reality, we bring your vision to life through expert craftsmanship and guidance at every stage of the journey.',
  quickEnquiries: {
    heading: 'FOR QUICK ENQUIRIES',
    content:
      'Have a question or need assistance fast? Reach out to us directly, our team is available from 8:30 AM to 6:00 PM to provide quick support and answers.',
    phone: '1800 333 539',
    email: 'contact@dxliving.com.au',
  },
  whereToFindUs: {
    heading: 'Where to Find Us',
    branches: [
      {
        branchName: 'VIC (HEAD OFFICE)',
        location: 'Suite 70 44 Lakeview DR Scoresby VIC 3179',
        locationLink: 'https://maps.app.goo.gl/MC2gyhLwGvroMYoE7',
        phone: '1800 333 539',
        svgImageUrl: '/images/map/vic.svg',
      },
      {
        branchName: 'NSW',
        location: 'Level 10 418A Elizabeth ST Surry Hills NSW 2010',
        locationLink: 'https://maps.app.goo.gl/MC2gyhLwGvroMYoE7',
        phone: '1800 333 539',
        svgImageUrl: '/images/map/nsw.svg',
      },
      {
        branchName: 'QLD',
        location: 'Level 14/167 Eagle ST Brisbane QLD 4000',
        locationLink: 'https://maps.app.goo.gl/MC2gyhLwGvroMYoE7',
        phone: '1800 333 539',
        svgImageUrl: '/images/map/qld.svg',
      },
      {
        branchName: 'WA',
        location: 'Level 12 197 St Georges Terrace Perth WA 6000',
        locationLink: 'https://maps.app.goo.gl/MC2gyhLwGvroMYoE7',
        phone: '1800 333 539',
        svgImageUrl: '/images/map/wa.svg',
      },
    ],
  },
}

export const CONTACT_METADATA_TITLE =
  'Contact DX Living | Luxury Home Design Consultation'
export const CONTACT_METADATA_DESCRIPTION =
  'Contact DX Living for luxury home design consultation. Speak with our team to plan your custom home project with clarity and confidence.'
export const CONTACT_FOCUS_KEYWORD = 'Contact DX Living'
export const contactPageDefaults: ContactPageCmsContent = {
  ...FALLBACK_CONTACT_CONTENT,
  seo: emptySeoData({
    title: CONTACT_METADATA_TITLE,
    description: CONTACT_METADATA_DESCRIPTION,
    focusKeyword: CONTACT_FOCUS_KEYWORD,
    ogTitle: CONTACT_METADATA_TITLE,
    ogDescription: CONTACT_METADATA_DESCRIPTION,
    ogImageUrl: '/og/contact-og.jpg',
    twitterTitle: CONTACT_METADATA_TITLE,
    twitterDescription: CONTACT_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/contact-og.jpg',
  }),
}

import { emptySeoData } from '@/lib/seo/types'

export const REGISTER_METADATA_TITLE = 'DX LIVING Register | Create Your Account'

export const REGISTER_METADATA_DESCRIPTION =
  'Register with DX LIVING to start your premium home design journey and collaborate with our team.'

export const registerPageDefaults = {
  seo: emptySeoData({
    title: REGISTER_METADATA_TITLE,
    description: REGISTER_METADATA_DESCRIPTION,
    focusKeyword: 'DX Living register',
    keywords: 'register, create account, DX Living sign up',
    ogTitle: REGISTER_METADATA_TITLE,
    ogDescription: REGISTER_METADATA_DESCRIPTION,
    ogImageUrl: '/og/og.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: REGISTER_METADATA_TITLE,
    twitterDescription: REGISTER_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/og.jpg',
  }),
}

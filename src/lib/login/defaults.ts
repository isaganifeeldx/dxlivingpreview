import { emptySeoData } from '@/lib/seo/types'

export const LOGIN_METADATA_TITLE = 'Log in | DX LIVING Account'

export const LOGIN_METADATA_DESCRIPTION =
  'DX LIVING login portal for managing your custom home project, designs, and updates.'

export const loginPageDefaults = {
  seo: emptySeoData({
    title: LOGIN_METADATA_TITLE,
    description: LOGIN_METADATA_DESCRIPTION,
    focusKeyword: 'DX Living login',
    keywords: 'login, DX Living account, sign in',
    ogTitle: LOGIN_METADATA_TITLE,
    ogDescription: LOGIN_METADATA_DESCRIPTION,
    ogImageUrl: '/og/og.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: LOGIN_METADATA_TITLE,
    twitterDescription: LOGIN_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/og.jpg',
  }),
}

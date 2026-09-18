import { FALLBACK_HOME_CONTENT } from '@/data/homeContent'
import {
  HOMEPAGE_FOCUS_KEYWORD,
  HOMEPAGE_METADATA_DESCRIPTION,
  HOMEPAGE_METADATA_TITLE,
} from '@/lib/seo/homepageSchema'
import { emptySeoData } from '@/lib/seo/types'
import type { HomePageCmsContent } from './types'

export const homePageDefaults: HomePageCmsContent = {
  ...FALLBACK_HOME_CONTENT,
  seo: emptySeoData({
    title: HOMEPAGE_METADATA_TITLE,
    description: HOMEPAGE_METADATA_DESCRIPTION,
    focusKeyword: HOMEPAGE_FOCUS_KEYWORD,
    ogTitle: HOMEPAGE_METADATA_TITLE,
    ogDescription: HOMEPAGE_METADATA_DESCRIPTION,
    ogImageUrl: '/og/og.jpg',
    twitterTitle: HOMEPAGE_METADATA_TITLE,
    twitterDescription: HOMEPAGE_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/og.jpg',
  }),
}

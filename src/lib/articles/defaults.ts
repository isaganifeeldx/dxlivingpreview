import { emptySeoData } from '@/lib/seo/types'
import { FALLBACK_ARTICLE_CATEGORIES } from './categoryDefs'
import type { ArticlesPageCmsContent, ArticlesPageContentData } from './types'

/** Fixed Articles listing section targets — not editable in CMS. */
export const ARTICLES_ANCHOR_SECTION_IDS = [
  'intro',
  'latest-articles',
  'all-articles',
  'section-4',
  'contact-us',
] as const

export const FALLBACK_ARTICLES_PAGE_CONTENT: ArticlesPageContentData = {
  banner: {
    title: 'Articles',
    vimeoBackgroundVideo: '1118950459',
  },
  anchorMenu: [
    { id: 'intro', label: 'Introduction' },
    { id: 'latest-articles', label: 'Latest Articles' },
    { id: 'all-articles', label: 'All Articles' },
    { id: 'section-4', label: 'LinkedIn Stories' },
    { id: 'contact-us', label: 'Contact Us' },
  ],
  introduction:
    'Explore the evolution of modern luxury through curated design trends, intelligent living innovations, and expert perspectives for refined living and investment.',
  cta: {
    heading: "Shaping your build starts with the right solution, let's make it happen",
    content: '',
    button: 'Contact us today',
    buttonLink: '/contact',
    videoBackground: '1117308030',
  },
  detailBanner: {
    vimeoBackgroundVideo: '1118934520',
  },
  detailCta: {
    heading: "Shaping your build starts with the right solution, let's make it happen.",
    button: 'Contact us today',
    buttonLink: '/contact',
    videoBackground: '1117308030',
  },
}

export const ARTICLES_METADATA_TITLE = 'Articles Modern Architecture Insights | DX Living'
export const ARTICLES_METADATA_DESCRIPTION =
  'Explore modern architecture insights from DX Living. Expert articles on luxury design, sustainability, and contemporary homes for Australian families'
export const ARTICLES_FOCUS_KEYWORD = 'modern architecture insights'

export const articlesPageDefaults: ArticlesPageCmsContent = {
  ...FALLBACK_ARTICLES_PAGE_CONTENT,
  articles: [],
  categories: FALLBACK_ARTICLE_CATEGORIES,
  seo: emptySeoData({
    title: ARTICLES_METADATA_TITLE,
    description: ARTICLES_METADATA_DESCRIPTION,
    focusKeyword: ARTICLES_FOCUS_KEYWORD,
    ogTitle: ARTICLES_METADATA_TITLE,
    ogDescription: ARTICLES_METADATA_DESCRIPTION,
    ogImageUrl: '/og/article-og.jpg',
    twitterTitle: ARTICLES_METADATA_TITLE,
    twitterDescription: ARTICLES_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/article-og.jpg',
  }),
}

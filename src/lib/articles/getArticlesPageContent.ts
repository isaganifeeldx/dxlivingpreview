import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import {
  ARTICLES_ANCHOR_SECTION_IDS,
  FALLBACK_ARTICLES_PAGE_CONTENT,
  articlesPageDefaults,
} from './defaults'
import { getAllArticles } from './getArticles'
import { getArticleCategories } from './getArticleCategories'
import type { ArticlesAnchorMenuItem, ArticlesPageCmsContent } from './types'

type CmsArticlesPage = {
  banner?: {
    title?: string | null
    vimeoBackgroundVideo?: string | null
  } | null
  anchorMenu?: Array<{
    label?: string | null
  } | null> | null
  introduction?: string | null
  cta?: {
    heading?: string | null
    content?: string | null
    button?: string | null
    buttonLink?: string | null
    videoBackground?: string | null
  } | null
  detailBanner?: {
    vimeoBackgroundVideo?: string | null
  } | null
  detailCta?: {
    heading?: string | null
    button?: string | null
    buttonLink?: string | null
    videoBackground?: string | null
  } | null
  seo?: CmsSeo
}

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function videoId(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function linkValue(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  if (!trimmed) return fallback
  if (trimmed.startsWith('/') || /^https?:\/\//i.test(trimmed)) return trimmed
  if (/^[a-z0-9][a-z0-9\-_/]*$/i.test(trimmed)) return `/${trimmed}`
  return fallback
}

function mapArticlesPageFromCms(
  doc: CmsArticlesPage | null | undefined,
): Omit<ArticlesPageCmsContent, 'articles'> {
  const defaults = articlesPageDefaults
  if (!doc) {
    const { articles: _articles, ...rest } = defaults
    return rest
  }

  const anchorMenu: ArticlesAnchorMenuItem[] = []
  for (let index = 0; index < ARTICLES_ANCHOR_SECTION_IDS.length; index += 1) {
    const sectionId = ARTICLES_ANCHOR_SECTION_IDS[index]
    const fallback = defaults.anchorMenu[index]
    if (!sectionId || !fallback) continue
    anchorMenu.push({
      id: sectionId,
      label: text(doc.anchorMenu?.[index]?.label, fallback.label),
    })
  }

  return {
    banner: {
      title: text(doc.banner?.title, defaults.banner.title),
      vimeoBackgroundVideo: videoId(
        doc.banner?.vimeoBackgroundVideo,
        defaults.banner.vimeoBackgroundVideo,
      ),
    },
    anchorMenu: anchorMenu.length > 0 ? anchorMenu : defaults.anchorMenu,
    introduction: text(doc.introduction, defaults.introduction),
    cta: {
      heading: text(doc.cta?.heading, defaults.cta.heading),
      content: text(doc.cta?.content, defaults.cta.content),
      button: text(doc.cta?.button, defaults.cta.button),
      buttonLink: linkValue(doc.cta?.buttonLink, defaults.cta.buttonLink),
      videoBackground: videoId(doc.cta?.videoBackground, defaults.cta.videoBackground),
    },
    detailBanner: {
      vimeoBackgroundVideo: videoId(
        doc.detailBanner?.vimeoBackgroundVideo,
        defaults.detailBanner.vimeoBackgroundVideo,
      ),
    },
    detailCta: {
      heading: text(doc.detailCta?.heading, defaults.detailCta.heading),
      button: text(doc.detailCta?.button, defaults.detailCta.button),
      buttonLink: linkValue(doc.detailCta?.buttonLink, defaults.detailCta.buttonLink),
      videoBackground: videoId(
        doc.detailCta?.videoBackground,
        defaults.detailCta.videoBackground,
      ),
    },
    seo: mapCmsSeo(doc.seo, defaults.seo),
  }
}

/** Dedupes layout metadata + page within a single request. */
export const getArticlesPageContent = cache(async (): Promise<ArticlesPageCmsContent> => {
  const [articles, categories] = await Promise.all([
    getAllArticles(),
    getArticleCategories(),
  ])

  if (shouldSkipCmsAtBuild()) {
    return { ...articlesPageDefaults, articles, categories }
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'articles-page',
      depth: 0,
    })) as CmsArticlesPage

    return {
      ...mapArticlesPageFromCms(doc),
      articles,
      categories,
    }
  } catch (error) {
    console.error(
      '[articles] Failed to load Articles Page global from Payload — using defaults.',
      error,
    )
    return {
      ...FALLBACK_ARTICLES_PAGE_CONTENT,
      seo: articlesPageDefaults.seo,
      articles,
      categories,
    }
  }
})

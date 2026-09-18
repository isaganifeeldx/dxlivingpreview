import { cache } from 'react'
import { fallbackArticleData, slugFromLink } from '@/data/articles'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsArticle, toFallbackArticleItem, type CmsArticle } from './mapArticle'
import type { ArticleCmsItem } from './types'

function fallbackItems(): ArticleCmsItem[] {
  return fallbackArticleData.map(toFallbackArticleItem)
}

function fallbackBySlug(slug: string): ArticleCmsItem | null {
  return (
    fallbackItems().find((article) => slugFromLink(article.link) === slug) ?? null
  )
}

function fallbackArticleFor(slug: string) {
  return fallbackArticleData.find((article) => slugFromLink(article.link) === slug)
}

/** Dedupes within a single request. */
export const getAllArticles = cache(async (): Promise<ArticleCmsItem[]> => {
  if (shouldSkipCmsAtBuild()) {
    return fallbackItems()
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'articles',
      depth: 1,
      limit: 200,
      sort: '-publishedAt',
      where: {
        or: [
          { _status: { equals: 'published' } },
          { _status: { exists: false } },
        ],
      },
    })

    const mapped = (
      await Promise.all(
        result.docs.map(async (doc) => {
          const cmsDoc = doc as CmsArticle
          const slug = typeof cmsDoc.slug === 'string' ? cmsDoc.slug : ''
          return mapCmsArticle(cmsDoc, fallbackArticleFor(slug), payload)
        }),
      )
    ).filter((article): article is ArticleCmsItem => Boolean(article))

    return mapped.length > 0 ? mapped : fallbackItems()
  } catch (error) {
    console.error('[articles] Failed to load articles from Payload — using defaults.', error)
    return fallbackItems()
  }
})

export const getArticleBySlug = cache(async (slug: string): Promise<ArticleCmsItem | null> => {
  const normalized = slug.trim()
  if (!normalized) return null

  if (shouldSkipCmsAtBuild()) {
    return fallbackBySlug(normalized)
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'articles',
      depth: 1,
      limit: 1,
      where: {
        and: [
          { slug: { equals: normalized } },
          {
            or: [
              { _status: { equals: 'published' } },
              { _status: { exists: false } },
            ],
          },
        ],
      },
    })

    const doc = result.docs[0] as CmsArticle | undefined
    if (!doc) return fallbackBySlug(normalized)

    return mapCmsArticle(doc, fallbackArticleFor(normalized), payload)
  } catch (error) {
    console.error(
      `[articles] Failed to load article "${normalized}" from Payload — using defaults.`,
      error,
    )
    return fallbackBySlug(normalized)
  }
})

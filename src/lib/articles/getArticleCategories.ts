import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import {
  FALLBACK_ARTICLE_CATEGORIES,
  type ArticleCategory,
} from './categoryDefs'

type CmsCategory = {
  id?: number | string
  name?: string | null
  slug?: string | null
  sortOrder?: number | null
}

function mapCmsCategory(doc: CmsCategory): ArticleCategory | null {
  const id = doc.slug?.trim()
  const label = doc.name?.trim()
  if (!id || !label) return null

  return {
    id,
    label,
    sortOrder: typeof doc.sortOrder === 'number' ? doc.sortOrder : 0,
  }
}

/** Dedupes within a single request. */
export const getArticleCategories = cache(async (): Promise<ArticleCategory[]> => {
  if (shouldSkipCmsAtBuild()) {
    return FALLBACK_ARTICLE_CATEGORIES
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'article-categories',
      depth: 0,
      limit: 100,
      sort: 'sortOrder',
      overrideAccess: true,
    })

    const mapped = result.docs
      .map((doc) => mapCmsCategory(doc as CmsCategory))
      .filter((category): category is ArticleCategory => Boolean(category))

    return mapped.length > 0 ? mapped : FALLBACK_ARTICLE_CATEGORIES
  } catch (error) {
    console.error(
      '[articles] Failed to load article categories from Payload — using defaults.',
      error,
    )
    return FALLBACK_ARTICLE_CATEGORIES
  }
})

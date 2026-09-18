import type { Payload } from 'payload'
import { slugFromLink } from '@/data/articles'
import type { ArticleData } from '@/data/articles'
import { getMediaUrl } from '@/lib/media'
import { emptySeoData } from '@/lib/seo/types'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import {
  resolveRichTextHtml,
  resolveRichTextHtmlAsync,
} from '@/lib/seo/resolveRichTextHtml'
import {
  getArticleCategoryLabel,
  normalizeArticleCategoryId,
} from './categoryDefs'
import type { ArticleCmsItem } from './types'

const ARTICLE_OG_IMAGE = '/og/article-og.jpg'
const DEFAULT_CATEGORY_SLUG = 'homes-residential-guides'

type CmsMedia = {
  url?: string | null
  filename?: string | null
} | null

type CmsCategory =
  | number
  | string
  | {
      id?: number | string
      name?: string | null
      slug?: string | null
    }
  | null

export type CmsArticle = {
  title?: string | null
  slug?: string | null
  category?: CmsCategory
  featuredImage?: number | CmsMedia
  content?: unknown
  readTime?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  seo?: CmsSeo
}

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function toDateOnly(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  if (!trimmed) return fallback.slice(0, 10)
  return trimmed.slice(0, 10)
}

function withSiteSuffix(title: string): string {
  const trimmed = title.trim()
  if (!trimmed) return 'Article | DX LIVING'
  if (/\| DX LIVING$/i.test(trimmed)) return trimmed
  return `${trimmed} | DX LIVING`
}

function resolveCategory(
  category: CmsCategory,
  fallbackCategory: string | undefined,
): { slug: string; label: string } {
  const fallbackSlug = normalizeArticleCategoryId(fallbackCategory) || DEFAULT_CATEGORY_SLUG

  if (category && typeof category === 'object') {
    const slug = category.slug?.trim() || fallbackSlug
    const label =
      category.name?.trim() || getArticleCategoryLabel(slug) || slug
    return { slug, label }
  }

  if (typeof category === 'string' && category.trim()) {
    const slug = normalizeArticleCategoryId(category) || fallbackSlug
    return { slug, label: getArticleCategoryLabel(slug) || slug }
  }

  return {
    slug: fallbackSlug,
    label: getArticleCategoryLabel(fallbackSlug) || fallbackSlug,
  }
}

export async function mapCmsArticle(
  doc: CmsArticle,
  fallback: ArticleData | undefined,
  payload: Payload,
): Promise<ArticleCmsItem | null> {
  const fallbackSlug = fallback ? slugFromLink(fallback.link) : ''
  const slug = text(doc.slug, fallbackSlug)
  if (!slug) return null

  const title = text(doc.title, fallback?.title ?? '')
  const datePublished = toDateOnly(doc.publishedAt, fallback?.datePublished ?? '')
  const dateModified = toDateOnly(doc.updatedAt, fallback?.dateModified ?? datePublished)
  const featuredImage =
    getMediaUrl(doc.featuredImage) ?? fallback?.featuredImage ?? ''
  const seoDescription = text(doc.seo?.description, fallback?.seoDescription ?? '')
  const seoTitle = withSiteSuffix(text(doc.seo?.title, fallback?.seoTitle || title))
  const seo = mapCmsSeo(
    doc.seo,
    emptySeoData({
      title: seoTitle,
      description: seoDescription,
      ogTitle: seoTitle,
      ogDescription: seoDescription,
      ogImageUrl: featuredImage || ARTICLE_OG_IMAGE,
      twitterTitle: seoTitle,
      twitterDescription: seoDescription,
      twitterImageUrl: featuredImage || ARTICLE_OG_IMAGE,
    }),
  )

  seo.title = withSiteSuffix(seo.title)
  seo.ogTitle = withSiteSuffix(seo.ogTitle || seo.title)
  seo.twitterTitle = withSiteSuffix(seo.twitterTitle || seo.title)

  const { slug: categorySlug, label: categoryLabel } = resolveCategory(
    doc.category ?? null,
    fallback?.category,
  )

  return {
    title,
    featuredImage,
    content: await resolveRichTextHtmlAsync(
      doc.content,
      fallback?.content ?? '',
      payload,
    ),
    datePublished,
    dateModified,
    link: `/articles/${slug}`,
    category: categorySlug,
    categoryLabel,
    readTime: text(doc.readTime, fallback?.readTime ?? '5 mins'),
    seoTitle: seo.title,
    seoDescription,
    seo,
  }
}

export function toFallbackArticleItem(article: ArticleData): ArticleCmsItem {
  const seoTitle = withSiteSuffix(article.seoTitle || article.title)
  const category = normalizeArticleCategoryId(article.category) || DEFAULT_CATEGORY_SLUG
  return {
    ...article,
    category,
    categoryLabel: article.categoryLabel ?? getArticleCategoryLabel(category),
    content: resolveRichTextHtml(null, article.content),
    seoTitle,
    seo: emptySeoData({
      title: seoTitle,
      description: article.seoDescription,
      ogTitle: seoTitle,
      ogDescription: article.seoDescription,
      ogImageUrl: article.featuredImage || ARTICLE_OG_IMAGE,
      twitterTitle: seoTitle,
      twitterDescription: article.seoDescription,
      twitterImageUrl: article.featuredImage || ARTICLE_OG_IMAGE,
    }),
  }
}

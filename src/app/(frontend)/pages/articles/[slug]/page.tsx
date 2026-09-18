import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticlePageContent from '@/components/pages/articles/ArticlePageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { slugFromLink, getRecentArticles } from '@/data/articles'
import { getAllArticles, getArticleBySlug } from '@/lib/articles/getArticles'
import { getArticlesPageContent } from '@/lib/articles/getArticlesPageContent'
import { RECENT_ARTICLES_DETAIL_COUNT } from '@/data/articles'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildArticleJsonLd } from '@/lib/seo/articleDetailSchema'

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>
}

/** Soft ISR. Payload article saves also revalidate detail paths. */
export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const articles = await getAllArticles()
    return articles.map((article) => ({ slug: slugFromLink(article.link) }))
  } catch (error) {
    console.error(
      '[articles] generateStaticParams failed — skipping static article paths for this build.',
      error,
    )
    return []
  }
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article | DX Living' }

  return buildMetadataFromSeo({
    seo: article.seo,
    path: `/articles/${slugFromLink(article.link)}`,
    fallbackTitle: article.seo.title || article.seoTitle,
    fallbackDescription: article.seo.description || article.seoDescription,
    fallbackImageUrl: article.seo.ogImageUrl ?? article.featuredImage ?? '/og/article-og.jpg',
    siteName: 'DX Living',
    absoluteTitle: true,
  })
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params
  const [article, articles, page] = await Promise.all([
    getArticleBySlug(slug),
    getAllArticles(),
    getArticlesPageContent(),
  ])

  if (!article) notFound()

  const recentArticles = getRecentArticles(
    articles,
    article.link,
    RECENT_ARTICLES_DETAIL_COUNT,
  )
  const articleJsonLd = buildArticleJsonLd(article)

  return (
    <>
      <JsonLdScripts
        id={`article-${slugFromLink(article.link)}`}
        seo={article.seo}
        defaultJsonLd={articleJsonLd}
      />
      <ArticlePageContent
        article={article}
        recentArticles={recentArticles}
        bannerVideoId={page.detailBanner.vimeoBackgroundVideo}
        cta={page.detailCta}
      />
    </>
  )
}

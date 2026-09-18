import type { Metadata } from 'next'
import { Suspense } from 'react'
import ArticlesPageContent from '@/components/pages/articles/ArticlesPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getArticlesPageContent } from '@/lib/articles/getArticlesPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildArticlesListingJsonLd } from '@/lib/seo/articlesListingSchema'

/** Soft ISR. Payload Articles saves also revalidate listing paths. */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getArticlesPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/articles',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/article-og.jpg',
    siteName: 'DX Living',
    absoluteTitle: true,
  })
}

export default async function ArticlesPage() {
  const content = await getArticlesPageContent()
  const articlesJsonLd = buildArticlesListingJsonLd(content.articles, {
    name: content.seo.title,
    description: content.seo.description,
  })

  return (
    <>
      <JsonLdScripts id="articles" seo={content.seo} defaultJsonLd={articlesJsonLd} />
      <Suspense fallback={null}>
        <ArticlesPageContent content={content} articles={content.articles} />
      </Suspense>
    </>
  )
}

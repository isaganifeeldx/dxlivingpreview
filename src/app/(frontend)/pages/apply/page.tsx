import type { Metadata } from 'next'
import ApplyPageContent from '@/components/pages/apply/ApplyPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getApplyPageContent } from '@/lib/apply/getApplyPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildApplyPageJsonLd } from '@/lib/seo/applySchema'

/** Soft ISR fallback. Payload Apply saves also call revalidatePath('/apply'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getApplyPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/apply',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/apply-og.jpg',
    siteName: 'DX Living',
  })
}

export default async function ApplyPage() {
  const content = await getApplyPageContent()
  const applyJsonLd = buildApplyPageJsonLd(content.seo)

  return (
    <>
      <JsonLdScripts id="apply" seo={content.seo} defaultJsonLd={applyJsonLd} />
      <ApplyPageContent content={content} />
    </>
  )
}

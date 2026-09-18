import type { Metadata } from 'next'
import ModelPageContent from '@/components/pages/model/ModelPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getModelPageContent } from '@/lib/model/getModelPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildModelPageJsonLd } from '@/lib/seo/modelSchema'

/** Soft ISR fallback. Payload Model saves also call revalidatePath('/model'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getModelPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/model',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/model-og.jpg',
    siteName: 'DX Living',
  })
}

export default async function ModelPage() {
  const content = await getModelPageContent()
  const modelJsonLd = buildModelPageJsonLd(content.seo)

  return (
    <>
      <JsonLdScripts id="model" seo={content.seo} defaultJsonLd={modelJsonLd} />
      <ModelPageContent content={content} moduleCards={content.moduleCards} />
    </>
  )
}

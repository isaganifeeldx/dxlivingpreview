import type { Metadata } from 'next'
import InteriorsPageContent from '@/components/pages/interiors/InteriorsPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getInteriorsPageContent } from '@/lib/interiors/getInteriorsPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildInteriorsPageJsonLd } from '@/lib/seo/interiorsSchema'

/** Soft ISR fallback. Payload Interiors saves also call revalidatePath('/interiors'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getInteriorsPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/interiors',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/interior-og.jpg',
    siteName: 'DX Living',
  })
}

export default async function InteriorsPage() {
  const content = await getInteriorsPageContent()
  const interiorsJsonLd = buildInteriorsPageJsonLd(content.seo)

  return (
    <>
      <JsonLdScripts id="interiors" seo={content.seo} defaultJsonLd={interiorsJsonLd} />
      <InteriorsPageContent content={content} moduleCards={content.moduleCards} />
    </>
  )
}

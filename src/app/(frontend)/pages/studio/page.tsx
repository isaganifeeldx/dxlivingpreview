import type { Metadata } from 'next'
import StudioPageContent from '@/components/pages/studio/StudioPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildStudioPageJsonLd } from '@/lib/seo/studioSchema'
import { getStudioPageContent } from '@/lib/studio/getStudioPageContent'

/** Soft ISR fallback. Payload Studio saves also call revalidatePath('/studio'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getStudioPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/studio',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/studio-og.jpg',
    siteName: 'DX Living',
  })
}

export default async function StudioPage() {
  const content = await getStudioPageContent()
  const studioJsonLd = buildStudioPageJsonLd(content.seo)

  return (
    <>
      <JsonLdScripts id="studio" seo={content.seo} defaultJsonLd={studioJsonLd} />
      <StudioPageContent content={content} moduleCards={content.moduleCards} />
    </>
  )
}

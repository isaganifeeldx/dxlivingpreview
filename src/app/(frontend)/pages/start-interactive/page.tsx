import type { Metadata } from 'next'
import StartInteractivePageContent from '@/components/pages/start-interactive/StartInteractivePageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildStartInteractivePageJsonLd } from '@/lib/seo/startInteractiveSchema'
import { getStartInteractivePageContent } from '@/lib/start-interactive/getStartInteractivePageContent'

/** Soft ISR fallback. CMS saves also call revalidatePath. */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getStartInteractivePageContent()

  return buildMetadataFromSeo({
    seo,
    path: '/start-interactive',
    fallbackTitle: seo.title,
    fallbackDescription: seo.description,
    fallbackImageUrl: seo.ogImageUrl ?? '/og/og.jpg',
    siteName: 'DX Living',
    absoluteTitle: true,
  })
}

export default async function StartInteractivePage() {
  const { seo } = await getStartInteractivePageContent()
  const jsonLd = buildStartInteractivePageJsonLd(seo)

  return (
    <>
      <JsonLdScripts id="start-interactive" seo={seo} defaultJsonLd={jsonLd} />
      <StartInteractivePageContent />
    </>
  )
}

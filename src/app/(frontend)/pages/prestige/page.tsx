import type { Metadata } from 'next'
import PrestigePageContent from '@/components/pages/prestige/PrestigePageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getPrestigePageContent } from '@/lib/prestige/getPrestigePageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildPrestigePageJsonLd } from '@/lib/seo/prestigeSchema'

/** Soft ISR fallback. Payload Prestige saves also call revalidatePath('/prestige'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPrestigePageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/prestige',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/prestige-og.jpg',
    siteName: 'DX Living',
  })
}

export default async function PrestigePage() {
  const content = await getPrestigePageContent()
  const prestigeJsonLd = buildPrestigePageJsonLd(content.seo)

  return (
    <>
      <JsonLdScripts id="prestige" seo={content.seo} defaultJsonLd={prestigeJsonLd} />
      <PrestigePageContent content={content} moduleCards={content.moduleCards} />
    </>
  )
}

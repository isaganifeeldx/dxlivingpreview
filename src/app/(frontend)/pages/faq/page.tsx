import type { Metadata } from 'next'
import FaqPageContent from '@/components/pages/faq/FaqPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getFaqPageContent } from '@/lib/faq/getFaqPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildFaqPageJsonLd } from '@/lib/seo/faqSchema'

/** Soft ISR fallback. Payload FAQ saves also call revalidatePath('/faq'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getFaqPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/faq',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/og.jpg',
    siteName: 'DX Living',
  })
}

export default async function FaqPage() {
  const content = await getFaqPageContent()
  const faqJsonLd = buildFaqPageJsonLd(content.items)

  return (
    <>
      <JsonLdScripts id="faq" seo={content.seo} defaultJsonLd={faqJsonLd} />
      <FaqPageContent title={content.title} intro={content.intro} items={content.items} />
    </>
  )
}

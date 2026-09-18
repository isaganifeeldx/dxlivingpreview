import type { Metadata } from 'next'
import AboutPageContent from '@/components/pages/about/AboutPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getAboutPageContent } from '@/lib/about/getAboutPageContent'
import { buildAboutPageJsonLd } from '@/lib/seo/aboutSchema'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'

/** Soft ISR fallback. Payload About saves also call revalidatePath('/about'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/about',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/about-og.jpg',
    siteName: 'DX Living',
  })
}

export default async function AboutPage() {
  const content = await getAboutPageContent()
  const aboutJsonLd = buildAboutPageJsonLd(content.seo)

  return (
    <>
      <JsonLdScripts id="about" seo={content.seo} defaultJsonLd={aboutJsonLd} />
      <AboutPageContent content={content} />
    </>
  )
}

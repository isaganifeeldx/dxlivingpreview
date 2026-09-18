import type { Metadata } from 'next'
import ContactPageContent from '@/components/pages/contact/ContactPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getContactPageContent } from '@/lib/contact/getContactPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildContactPageJsonLd } from '@/lib/seo/contactSchema'

/** Soft ISR fallback. Payload Contact saves also call revalidatePath('/contact'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/contact',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/contact-og.jpg',
    siteName: 'DX Living',
  })
}

export default async function ContactPage() {
  const content = await getContactPageContent()
  const contactJsonLd = buildContactPageJsonLd(content.seo)

  return (
    <>
      <JsonLdScripts id="contact" seo={content.seo} defaultJsonLd={contactJsonLd} />
      <ContactPageContent content={content} />
    </>
  )
}

import type { Metadata } from 'next'
import LegalPageContent from '@/components/pages/legal/LegalPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { resolveLegalBodyHtml } from '@/lib/legal/resolveLegalBodyHtml'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildTermsOfServicePageJsonLd } from '@/lib/seo/termsOfServiceSchema'
import { termsPageDefaults } from '@/lib/terms/defaults'
import { getTermsPageContent } from '@/lib/terms/getTermsPageContent'

/** Soft ISR fallback. Payload Terms of Service saves also call revalidatePath('/terms-of-service'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getTermsPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/terms-of-service',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/og.jpg',
    siteName: 'DX Living',
  })
}

export default async function TermsOfServicePage() {
  const content = await getTermsPageContent()
  const contentHtml = resolveLegalBodyHtml(
    content.body,
    typeof termsPageDefaults.body === 'string' ? termsPageDefaults.body : '',
    { linkPrivacyPolicy: true },
  )
  const termsJsonLd = buildTermsOfServicePageJsonLd(content.seo)

  return (
    <>
      <JsonLdScripts id="terms-of-service" seo={content.seo} defaultJsonLd={termsJsonLd} />
      <LegalPageContent
        title={content.title}
        ariaLabel="Terms of Service"
        contentHtml={contentHtml}
      />
    </>
  )
}

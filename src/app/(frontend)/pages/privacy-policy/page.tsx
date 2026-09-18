import type { Metadata } from 'next'
import LegalPageContent from '@/components/pages/legal/LegalPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { resolveLegalBodyHtml } from '@/lib/legal/resolveLegalBodyHtml'
import { privacyPageDefaults } from '@/lib/privacy/defaults'
import { getPrivacyPageContent } from '@/lib/privacy/getPrivacyPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildPrivacyPolicyPageJsonLd } from '@/lib/seo/privacyPolicySchema'

/** Soft ISR fallback. Payload Privacy Policy saves also call revalidatePath('/privacy-policy'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPrivacyPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/privacy-policy',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/og.jpg',
    siteName: 'DX Living',
  })
}

export default async function PrivacyPolicyPage() {
  const content = await getPrivacyPageContent()
  const contentHtml = resolveLegalBodyHtml(
    content.body,
    typeof privacyPageDefaults.body === 'string'
      ? privacyPageDefaults.body
      : '',
  )
  const privacyJsonLd = buildPrivacyPolicyPageJsonLd(content.seo)

  return (
    <>
      <JsonLdScripts id="privacy-policy" seo={content.seo} defaultJsonLd={privacyJsonLd} />
      <LegalPageContent
        title={content.title}
        ariaLabel="Privacy Policy"
        contentHtml={contentHtml}
      />
    </>
  )
}

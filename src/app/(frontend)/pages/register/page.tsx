import type { Metadata } from 'next'
import { Suspense } from 'react'
import RegistrationPageContent from '@/components/pages/auth/RegistrationPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getRegisterPageContent } from '@/lib/register/getRegisterPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildRegisterPageJsonLd } from '@/lib/seo/registerSchema'

/** Soft ISR fallback. CMS saves also call revalidatePath. */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getRegisterPageContent()

  return buildMetadataFromSeo({
    seo,
    path: '/register',
    fallbackTitle: seo.title,
    fallbackDescription: seo.description,
    fallbackImageUrl: seo.ogImageUrl ?? '/og/og.jpg',
    siteName: 'DX Living',
    absoluteTitle: true,
  })
}

export default async function RegisterPage() {
  const { seo } = await getRegisterPageContent()
  const registerJsonLd = buildRegisterPageJsonLd(seo)

  return (
    <>
      <JsonLdScripts id="register" seo={seo} defaultJsonLd={registerJsonLd} />
      <Suspense fallback={null}>
        <RegistrationPageContent />
      </Suspense>
    </>
  )
}

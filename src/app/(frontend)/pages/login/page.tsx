import type { Metadata } from 'next'
import LoginPageContent from '@/components/pages/auth/LoginPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getLoginPageContent } from '@/lib/login/getLoginPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildLoginPageJsonLd } from '@/lib/seo/loginSchema'

/** Soft ISR fallback. CMS saves also call revalidatePath. */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getLoginPageContent()

  return buildMetadataFromSeo({
    seo,
    path: '/login',
    fallbackTitle: seo.title,
    fallbackDescription: seo.description,
    fallbackImageUrl: seo.ogImageUrl ?? '/og/og.jpg',
    siteName: 'DX Living',
    absoluteTitle: true,
  })
}

export default async function LoginPage() {
  const { seo } = await getLoginPageContent()
  const loginJsonLd = buildLoginPageJsonLd(seo)

  return (
    <>
      <JsonLdScripts id="login" seo={seo} defaultJsonLd={loginJsonLd} />
      <LoginPageContent />
    </>
  )
}

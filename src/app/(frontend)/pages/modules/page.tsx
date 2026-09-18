import type { Metadata } from 'next'
import ModulesPageContent from '@/components/pages/modules/ModulesPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getModulesPageContent } from '@/lib/modules/getModulesPageContent'
import { buildModulesPageJsonLd } from '@/lib/seo/modulesSchema'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'

/** Soft ISR fallback. Payload Modules saves also call revalidatePath('/modules'). */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getModulesPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/modules',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/module-og.jpg',
    siteName: 'DX Living',
  })
}

export default async function ModulesPage() {
  const content = await getModulesPageContent()
  const modulesJsonLd = buildModulesPageJsonLd(content.seo)

  return (
    <>
      <JsonLdScripts id="modules" seo={content.seo} defaultJsonLd={modulesJsonLd} />
      <ModulesPageContent content={content} />
    </>
  )
}

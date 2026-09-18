import type { Metadata } from 'next'
import InteractiveExperiencePageContent from '@/components/pages/start-interactive/InteractiveExperiencePageContent'
import { DX_MODEL_APP } from '@/data/interactiveApps'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { getDxModelPageContent } from '@/lib/start-interactive/getDxModelPageContent'

/** Soft ISR fallback. CMS saves also call revalidatePath. */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getDxModelPageContent()

  return buildMetadataFromSeo({
    seo,
    path: '/start-interactive/dx-model',
    fallbackTitle: seo.title,
    fallbackDescription: seo.description,
    fallbackImageUrl: seo.ogImageUrl ?? '/og/og.jpg',
    siteName: 'DX Living',
    absoluteTitle: true,
  })
}

export default function DXModelInteractivePage() {
  return <InteractiveExperiencePageContent app={DX_MODEL_APP} />
}

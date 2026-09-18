import type { Metadata } from 'next'
import InteractiveExperiencePageContent from '@/components/pages/start-interactive/InteractiveExperiencePageContent'
import { DX_MODEL_LITE_APP } from '@/data/interactiveApps'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { getDxModelLitePageContent } from '@/lib/start-interactive/getDxModelLitePageContent'

/** Soft ISR fallback. CMS saves also call revalidatePath. */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getDxModelLitePageContent()

  return buildMetadataFromSeo({
    seo,
    path: '/start-interactive/dx-model-lite',
    fallbackTitle: seo.title,
    fallbackDescription: seo.description,
    fallbackImageUrl: seo.ogImageUrl ?? '/og/og.jpg',
    siteName: 'DX Living',
    absoluteTitle: true,
  })
}

export default function DXModelLiteInteractivePage() {
  return <InteractiveExperiencePageContent app={DX_MODEL_LITE_APP} />
}

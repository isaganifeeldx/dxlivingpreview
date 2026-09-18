import type { Metadata } from 'next'
import NotFoundPageContent from '@/components/pages/not-found/NotFoundPageContent'
import { getNotFoundPageContent } from '@/lib/not-found/getNotFoundPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'

/** Soft ISR fallback. Payload Not Found saves also call revalidatePath. */
export const revalidate = 3600

/** Guaranteed noindex even if generateMetadata is skipped for not-found. */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getNotFoundPageContent()

  return buildMetadataFromSeo({
    // Always keep 404 out of the index, matching reference1.
    seo: { ...content.seo, noIndex: true, noFollow: true },
    path: '/404',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/og.jpg',
    siteName: 'DX Living',
    absoluteTitle: true,
  })
}

export default async function NotFound() {
  const content = await getNotFoundPageContent()

  return (
    <NotFoundPageContent
      heading={content.heading}
      title={content.title}
      description={content.description}
      hint={content.hint}
      ctaLabel={content.ctaLabel}
      ctaHref={content.ctaHref}
    />
  )
}

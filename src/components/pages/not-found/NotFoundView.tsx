import NotFoundPageContent from '@/components/pages/not-found/NotFoundPageContent'
import { getNotFoundPageContent } from '@/lib/not-found/getNotFoundPageContent'

/** Shared branded 404 body (CMS-backed with safe defaults). */
export default async function NotFoundView() {
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

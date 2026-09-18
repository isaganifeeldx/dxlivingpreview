import { parseCustomJsonLd, serializeJsonLd } from '@/lib/seo/jsonLd'
import type { SeoData } from '@/lib/seo/types'

type JsonLdScriptsProps = {
  seo: SeoData
  /** Auto-generated schema for this page (Organization/WebSite/etc.). */
  defaultJsonLd?: Record<string, unknown> | null
  /** Stable id for the default script element. */
  id?: string
}

/** Renders default + optional editor custom JSON-LD script tags. */
export default function JsonLdScripts({
  seo,
  defaultJsonLd = null,
  id = 'page',
}: JsonLdScriptsProps) {
  const custom = parseCustomJsonLd(seo.customJsonLd)
  const showDefault = Boolean(defaultJsonLd) && !seo.replaceDefaultJsonLd

  return (
    <>
      {showDefault && defaultJsonLd ? (
        <script
          id={`json-ld-${id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(defaultJsonLd) }}
        />
      ) : null}
      {custom ? (
        <script
          id={`json-ld-${id}-custom`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(custom) }}
        />
      ) : null}
    </>
  )
}

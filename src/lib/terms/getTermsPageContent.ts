import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import { FALLBACK_TERMS_CONTENT, termsPageDefaults } from './defaults'
import type { TermsPageContentData } from './types'

type CmsTerms = {
  title?: string | null
  body?: unknown
  seo?: CmsSeo
}

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function mapTermsFromCms(doc: CmsTerms | null | undefined): TermsPageContentData {
  const defaults = termsPageDefaults
  if (!doc) return defaults

  return {
    title: text(doc.title, defaults.title),
    body: doc.body ?? defaults.body,
    seo: mapCmsSeo(doc.seo, defaults.seo),
  }
}

/** Dedupes layout metadata + page within a single request. */
export const getTermsPageContent = cache(async (): Promise<TermsPageContentData> => {
  if (shouldSkipCmsAtBuild()) {
    return termsPageDefaults
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'terms-of-service',
      depth: 0,
    })) as CmsTerms
    return mapTermsFromCms(doc)
  } catch (error) {
    console.error(
      '[terms] Failed to load Terms of Service global from Payload — using defaults.',
      error,
    )
    return FALLBACK_TERMS_CONTENT
  }
})

import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import { FALLBACK_NOT_FOUND_CONTENT, notFoundPageDefaults } from './defaults'
import type { NotFoundPageContentData } from './types'

type CmsNotFound = {
  heading?: string | null
  title?: string | null
  description?: string | null
  hint?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  seo?: CmsSeo
}

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function mapNotFoundFromCms(doc: CmsNotFound | null | undefined): NotFoundPageContentData {
  const defaults = notFoundPageDefaults
  if (!doc) return defaults

  const seo = mapCmsSeo(doc.seo, defaults.seo)

  return {
    heading: text(doc.heading, defaults.heading),
    title: text(doc.title, defaults.title),
    description: text(doc.description, defaults.description),
    hint: text(doc.hint, defaults.hint),
    ctaLabel: text(doc.ctaLabel, defaults.ctaLabel),
    ctaHref: text(doc.ctaHref, defaults.ctaHref),
    seo: {
      ...seo,
      // Prefer CMS when explicitly set; otherwise keep 404 defaults (noIndex/noFollow).
      noIndex: doc.seo?.noIndex ?? defaults.seo.noIndex,
      noFollow: doc.seo?.noFollow ?? defaults.seo.noFollow,
    },
  }
}

/** Dedupes layout metadata + page within a single request. */
export const getNotFoundPageContent = cache(async (): Promise<NotFoundPageContentData> => {
  if (shouldSkipCmsAtBuild()) {
    return notFoundPageDefaults
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'not-found',
      depth: 1,
    })) as CmsNotFound
    return mapNotFoundFromCms(doc)
  } catch (error) {
    console.error(
      '[not-found] Failed to load Not Found global from Payload — using defaults.',
      error,
    )
    return FALLBACK_NOT_FOUND_CONTENT
  }
})

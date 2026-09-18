import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import { FALLBACK_PRIVACY_CONTENT, privacyPageDefaults } from './defaults'
import type { PrivacyPageContentData } from './types'

type CmsPrivacy = {
  title?: string | null
  body?: unknown
  seo?: CmsSeo
}

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function mapPrivacyFromCms(doc: CmsPrivacy | null | undefined): PrivacyPageContentData {
  const defaults = privacyPageDefaults
  if (!doc) return defaults

  return {
    title: text(doc.title, defaults.title),
    body: doc.body ?? defaults.body,
    seo: mapCmsSeo(doc.seo, defaults.seo),
  }
}

/** Dedupes layout metadata + page within a single request. */
export const getPrivacyPageContent = cache(async (): Promise<PrivacyPageContentData> => {
  if (shouldSkipCmsAtBuild()) {
    return privacyPageDefaults
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'privacy-policy',
      depth: 0,
    })) as CmsPrivacy
    return mapPrivacyFromCms(doc)
  } catch (error) {
    console.error(
      '[privacy] Failed to load Privacy Policy global from Payload — using defaults.',
      error,
    )
    return FALLBACK_PRIVACY_CONTENT
  }
})

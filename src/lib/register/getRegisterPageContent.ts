import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import type { SeoData } from '@/lib/seo/types'
import { registerPageDefaults } from './defaults'

export type RegisterPageContentData = {
  seo: SeoData
}

type CmsRegister = {
  seo?: CmsSeo
}

function mapRegisterFromCms(doc: CmsRegister | null | undefined): RegisterPageContentData {
  if (!doc) return registerPageDefaults
  return {
    seo: mapCmsSeo(doc.seo, registerPageDefaults.seo),
  }
}

/** Dedupes layout metadata + page within a single request. */
export const getRegisterPageContent = cache(async (): Promise<RegisterPageContentData> => {
  if (shouldSkipCmsAtBuild()) {
    return registerPageDefaults
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'register',
      depth: 1,
    })) as CmsRegister
    return mapRegisterFromCms(doc)
  } catch (error) {
    console.error(
      '[register] Failed to load Registration global from Payload — using defaults.',
      error,
    )
    return registerPageDefaults
  }
})

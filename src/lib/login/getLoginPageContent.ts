import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import type { SeoData } from '@/lib/seo/types'
import { loginPageDefaults } from './defaults'

export type LoginPageContentData = {
  seo: SeoData
}

type CmsLogin = {
  seo?: CmsSeo
}

function mapLoginFromCms(doc: CmsLogin | null | undefined): LoginPageContentData {
  if (!doc) return loginPageDefaults
  return {
    seo: mapCmsSeo(doc.seo, loginPageDefaults.seo),
  }
}

/** Dedupes layout metadata + page within a single request. */
export const getLoginPageContent = cache(async (): Promise<LoginPageContentData> => {
  if (shouldSkipCmsAtBuild()) {
    return loginPageDefaults
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'login',
      depth: 1,
    })) as CmsLogin
    return mapLoginFromCms(doc)
  } catch (error) {
    console.error('[login] Failed to load Login global from Payload — using defaults.', error)
    return loginPageDefaults
  }
})

import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import type { SeoData } from '@/lib/seo/types'
import { startInteractivePageDefaults } from './defaults'

export type StartInteractivePageContentData = {
  seo: SeoData
}

type CmsStartInteractive = {
  seo?: CmsSeo
}

function mapFromCms(doc: CmsStartInteractive | null | undefined): StartInteractivePageContentData {
  if (!doc) return startInteractivePageDefaults
  return {
    seo: mapCmsSeo(doc.seo, startInteractivePageDefaults.seo),
  }
}

export const getStartInteractivePageContent = cache(
  async (): Promise<StartInteractivePageContentData> => {
    if (shouldSkipCmsAtBuild()) {
      return startInteractivePageDefaults
    }

    try {
      const payload = await getPayloadClient()
      const doc = (await payload.findGlobal({
        slug: 'start-interactive',
        depth: 1,
      })) as CmsStartInteractive
      return mapFromCms(doc)
    } catch (error) {
      console.error(
        '[start-interactive] Failed to load Start Interactive global from Payload — using defaults.',
        error,
      )
      return startInteractivePageDefaults
    }
  },
)

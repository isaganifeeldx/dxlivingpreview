import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import type { SeoData } from '@/lib/seo/types'
import { dxModelLitePageDefaults } from './defaults'

export type DxModelLitePageContentData = {
  seo: SeoData
}

type CmsDxModelLite = {
  seo?: CmsSeo
}

function mapFromCms(doc: CmsDxModelLite | null | undefined): DxModelLitePageContentData {
  if (!doc) return dxModelLitePageDefaults
  return {
    seo: mapCmsSeo(doc.seo, dxModelLitePageDefaults.seo),
  }
}

export const getDxModelLitePageContent = cache(async (): Promise<DxModelLitePageContentData> => {
  if (shouldSkipCmsAtBuild()) {
    return dxModelLitePageDefaults
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'dx-model-lite',
      depth: 1,
    })) as CmsDxModelLite
    return mapFromCms(doc)
  } catch (error) {
    console.error(
      '[dx-model-lite] Failed to load DX Model Lite Interactive global from Payload — using defaults.',
      error,
    )
    return dxModelLitePageDefaults
  }
})

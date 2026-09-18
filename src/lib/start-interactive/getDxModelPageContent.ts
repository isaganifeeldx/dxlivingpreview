import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import type { SeoData } from '@/lib/seo/types'
import { dxModelPageDefaults } from './defaults'

export type DxModelPageContentData = {
  seo: SeoData
}

type CmsDxModel = {
  seo?: CmsSeo
}

function mapFromCms(doc: CmsDxModel | null | undefined): DxModelPageContentData {
  if (!doc) return dxModelPageDefaults
  return {
    seo: mapCmsSeo(doc.seo, dxModelPageDefaults.seo),
  }
}

export const getDxModelPageContent = cache(async (): Promise<DxModelPageContentData> => {
  if (shouldSkipCmsAtBuild()) {
    return dxModelPageDefaults
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'dx-model',
      depth: 1,
    })) as CmsDxModel
    return mapFromCms(doc)
  } catch (error) {
    console.error(
      '[dx-model] Failed to load DX Model Interactive global from Payload — using defaults.',
      error,
    )
    return dxModelPageDefaults
  }
})

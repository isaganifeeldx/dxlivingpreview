import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import {
  FALLBACK_SUPPLIERS_CONTENT,
  SUPPLIERS_ANCHOR_SECTION_IDS,
  suppliersPageDefaults,
} from './defaults'
import type {
  SuppliersAnchorMenuItem,
  SuppliersOfferItem,
  SuppliersPageCmsContent,
  SuppliersProcessStep,
  SuppliersTierRow,
} from './types'

type CmsSuppliers = {
  banner?: {
    title?: string | null
    vimeoBackgroundVideo?: string | null
  } | null
  anchorMenu?: Array<{
    label?: string | null
  } | null> | null
  introduction?: string | null
  fullWidthVideo?: string | null
  whatWeOffer?: {
    heading?: string | null
    items?: Array<{
      title?: string | null
      content?: string | null
    } | null> | null
  } | null
  materialIntegration?: {
    heading?: string | null
    vimeoVideo?: string | null
  } | null
  process?: {
    heading?: string | null
    rightSideVideo?: string | null
    steps?: Array<{
      title?: string | null
      content?: string | null
    } | null> | null
  } | null
  tiers?: {
    heading?: string | null
    rows?: Array<{
      level?: string | null
      description?: string | null
      visibility?: string | null
    } | null> | null
    buttonDesktop?: string | null
    buttonMobile?: string | null
  } | null
  cta?: {
    heading?: string | null
    content?: string | null
    button?: string | null
    buttonLink?: string | null
    videoBackground?: string | null
  } | null
  seo?: CmsSeo
}

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function videoId(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function linkValue(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  if (!trimmed) return fallback
  if (trimmed.startsWith('/') || /^https?:\/\//i.test(trimmed)) return trimmed
  if (/^[a-z0-9][a-z0-9\-_/]*$/i.test(trimmed)) return `/${trimmed}`
  return fallback
}

function mapSuppliersFromCms(doc: CmsSuppliers | null | undefined): SuppliersPageCmsContent {
  const defaults = suppliersPageDefaults
  if (!doc) return defaults

  const offerItems: SuppliersOfferItem[] =
    doc.whatWeOffer?.items
      ?.map((item, index) => {
        const fallback = defaults.whatWeOffer.items[index]
        if (!fallback) return null
        return {
          title: text(item?.title, fallback.title),
          content: text(item?.content, fallback.content),
        }
      })
      .filter((item): item is SuppliersOfferItem => Boolean(item)) ?? []

  const steps: SuppliersProcessStep[] =
    doc.process?.steps
      ?.map((item, index) => {
        const fallback = defaults.process.steps[index]
        if (!fallback) return null
        return {
          title: text(item?.title, fallback.title),
          content: text(item?.content, fallback.content),
        }
      })
      .filter((item): item is SuppliersProcessStep => Boolean(item)) ?? []

  const tierRows: SuppliersTierRow[] =
    doc.tiers?.rows
      ?.map((item, index) => {
        const fallback = defaults.tiers.rows[index]
        if (!fallback) return null
        return {
          level: text(item?.level, fallback.level),
          description: text(item?.description, fallback.description),
          visibility: text(item?.visibility, fallback.visibility),
        }
      })
      .filter((item): item is SuppliersTierRow => Boolean(item)) ?? []

  const anchorMenu: SuppliersAnchorMenuItem[] = []
  for (let index = 0; index < SUPPLIERS_ANCHOR_SECTION_IDS.length; index += 1) {
    const sectionId = SUPPLIERS_ANCHOR_SECTION_IDS[index]
    const fallback = defaults.anchorMenu[index]
    if (!sectionId || !fallback) continue

    const label = text(doc.anchorMenu?.[index]?.label, fallback.label)
    anchorMenu.push({ id: sectionId, label })
  }

  return {
    banner: {
      title: text(doc.banner?.title, defaults.banner.title),
      vimeoBackgroundVideo: videoId(
        doc.banner?.vimeoBackgroundVideo,
        defaults.banner.vimeoBackgroundVideo,
      ),
    },
    anchorMenu: anchorMenu.length > 0 ? anchorMenu : defaults.anchorMenu,
    introduction: text(doc.introduction, defaults.introduction),
    fullWidthVideo: videoId(doc.fullWidthVideo, defaults.fullWidthVideo),
    whatWeOffer: {
      heading: text(doc.whatWeOffer?.heading, defaults.whatWeOffer.heading),
      items: offerItems.length > 0 ? offerItems : defaults.whatWeOffer.items,
    },
    materialIntegration: {
      heading: text(
        doc.materialIntegration?.heading,
        defaults.materialIntegration.heading,
      ),
      vimeoVideo: videoId(
        doc.materialIntegration?.vimeoVideo,
        defaults.materialIntegration.vimeoVideo,
      ),
    },
    process: {
      heading: text(doc.process?.heading, defaults.process.heading),
      rightSideVideo: videoId(doc.process?.rightSideVideo, defaults.process.rightSideVideo),
      steps: steps.length > 0 ? steps : defaults.process.steps,
    },
    tiers: {
      heading: text(doc.tiers?.heading, defaults.tiers.heading),
      rows: tierRows.length > 0 ? tierRows : defaults.tiers.rows,
      buttonDesktop: text(doc.tiers?.buttonDesktop, defaults.tiers.buttonDesktop),
      buttonMobile: text(doc.tiers?.buttonMobile, defaults.tiers.buttonMobile),
    },
    cta: {
      heading: text(doc.cta?.heading, defaults.cta.heading),
      content: text(doc.cta?.content, defaults.cta.content),
      button: text(doc.cta?.button, defaults.cta.button),
      buttonLink: linkValue(doc.cta?.buttonLink, defaults.cta.buttonLink),
      videoBackground: videoId(doc.cta?.videoBackground, defaults.cta.videoBackground),
    },
    seo: mapCmsSeo(doc.seo, defaults.seo),
  }
}

/** Dedupes layout metadata + page within a single request. */
export const getSuppliersPageContent = cache(async (): Promise<SuppliersPageCmsContent> => {
  if (shouldSkipCmsAtBuild()) {
    return suppliersPageDefaults
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'suppliers',
      depth: 0,
    })) as CmsSuppliers
    return mapSuppliersFromCms(doc)
  } catch (error) {
    console.error(
      '[suppliers] Failed to load Suppliers global from Payload — using defaults.',
      error,
    )
    return {
      ...FALLBACK_SUPPLIERS_CONTENT,
      seo: suppliersPageDefaults.seo,
    }
  }
})

import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import {
  APPLY_ANCHOR_SECTION_IDS,
  FALLBACK_APPLY_CONTENT,
  applyPageDefaults,
} from './defaults'
import type {
  ApplyAnchorMenuItem,
  ApplyHowItWorksStep,
  ApplyPageCmsContent,
  ApplyWhyJoinItem,
} from './types'

type CmsApply = {
  banner?: {
    title?: string | null
    vimeoBackgroundVideo?: string | null
  } | null
  anchorMenu?: Array<{
    label?: string | null
  } | null> | null
  introduction?: {
    heading?: string | null
    content?: string | null
  } | null
  whyJoin?: {
    heading?: string | null
    content?: string | null
    items?: Array<{
      heading?: string | null
      content?: string | null
    } | null> | null
  } | null
  videos?: {
    left?: string | null
    right?: string | null
  } | null
  whoThisIsFor?: {
    heading?: string | null
    content?: string | null
    items?: Array<{
      text?: string | null
    } | null> | null
  } | null
  howItWorks?: {
    heading?: string | null
    steps?: Array<{
      heading?: string | null
      content?: string | null
    } | null> | null
  } | null
  applyToJoin?: {
    heading?: string | null
    content?: string | null
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

function mapApplyFromCms(doc: CmsApply | null | undefined): ApplyPageCmsContent {
  const defaults = applyPageDefaults
  if (!doc) return defaults

  const whyJoinItems: ApplyWhyJoinItem[] =
    doc.whyJoin?.items
      ?.map((item, index) => {
        const fallback = defaults.whyJoin.items[index]
        if (!fallback) return null
        return {
          heading: text(item?.heading, fallback.heading),
          content: text(item?.content, fallback.content),
        }
      })
      .filter((item): item is ApplyWhyJoinItem => Boolean(item)) ?? []

  const whoItems: string[] =
    doc.whoThisIsFor?.items
      ?.map((item, index) => {
        const fallback = defaults.whoThisIsFor.items[index]
        if (!fallback) return null
        return text(item?.text, fallback)
      })
      .filter((item): item is string => Boolean(item)) ?? []

  const howSteps: ApplyHowItWorksStep[] =
    doc.howItWorks?.steps
      ?.map((item, index) => {
        const fallback = defaults.howItWorks.steps[index]
        if (!fallback) return null
        return {
          heading: text(item?.heading, fallback.heading),
          content: text(item?.content, fallback.content),
        }
      })
      .filter((item): item is ApplyHowItWorksStep => Boolean(item)) ?? []

  const anchorMenu: ApplyAnchorMenuItem[] = []
  for (let index = 0; index < APPLY_ANCHOR_SECTION_IDS.length; index += 1) {
    const sectionId = APPLY_ANCHOR_SECTION_IDS[index]
    const fallback = defaults.anchorMenu[index]
    if (!sectionId || !fallback) continue
    anchorMenu.push({
      id: sectionId,
      label: text(doc.anchorMenu?.[index]?.label, fallback.label),
    })
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
    introduction: {
      heading: text(doc.introduction?.heading, defaults.introduction.heading),
      content: text(doc.introduction?.content, defaults.introduction.content),
    },
    whyJoin: {
      heading: text(doc.whyJoin?.heading, defaults.whyJoin.heading),
      content: text(doc.whyJoin?.content, defaults.whyJoin.content),
      items: whyJoinItems.length > 0 ? whyJoinItems : defaults.whyJoin.items,
    },
    videos: {
      left: videoId(doc.videos?.left, defaults.videos.left),
      right: videoId(doc.videos?.right, defaults.videos.right),
    },
    whoThisIsFor: {
      heading: text(doc.whoThisIsFor?.heading, defaults.whoThisIsFor.heading),
      content: text(doc.whoThisIsFor?.content, defaults.whoThisIsFor.content),
      items: whoItems.length > 0 ? whoItems : defaults.whoThisIsFor.items,
    },
    howItWorks: {
      heading: text(doc.howItWorks?.heading, defaults.howItWorks.heading),
      steps: howSteps.length > 0 ? howSteps : defaults.howItWorks.steps,
    },
    applyToJoin: {
      heading: text(doc.applyToJoin?.heading, defaults.applyToJoin.heading),
      content: text(doc.applyToJoin?.content, defaults.applyToJoin.content),
    },
    seo: mapCmsSeo(doc.seo, defaults.seo),
  }
}

/** Dedupes layout metadata + page within a single request. */
export const getApplyPageContent = cache(async (): Promise<ApplyPageCmsContent> => {
  if (shouldSkipCmsAtBuild()) {
    return applyPageDefaults
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'apply',
      depth: 0,
    })) as CmsApply
    return mapApplyFromCms(doc)
  } catch (error) {
    console.error('[apply] Failed to load Apply global from Payload — using defaults.', error)
    return {
      ...FALLBACK_APPLY_CONTENT,
      seo: applyPageDefaults.seo,
    }
  }
})

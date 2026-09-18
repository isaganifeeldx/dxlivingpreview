import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { FALLBACK_MODULES_CONTENT } from '@/lib/modules/defaults'
import { getModulesPageContent } from '@/lib/modules/getModulesPageContent'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import {
  FALLBACK_PRESTIGE_CONTENT,
  PRESTIGE_ANCHOR_SECTION_IDS,
  prestigePageDefaults,
} from './defaults'
import type {
  PrestigeAnchorMenuItem,
  PrestigeFeatureItem,
  PrestigePageCmsContent,
} from './types'

type CmsPrestige = {
  banner?: {
    title?: string | null
    vimeoBackgroundVideo?: string | null
  } | null
  anchorMenu?: Array<{
    label?: string | null
  } | null> | null
  introduction?: {
    heading?: string | null
    introVideo?: {
      heading?: string | null
      content?: string | null
      vimeoVideo?: string | null
    } | null
  } | null
  features?: {
    heading?: string | null
    list?: Array<{
      heading?: string | null
      content?: string | null
    } | null> | null
    button?: string | null
    buttonMobile?: string | null
    buttonLink?: string | null
  } | null
  otherModulesHeading?: string | null
  book?: {
    heading?: string | null
    content?: string | null
    button?: string | null
    buttonLink?: string | null
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

function mapPrestigeFromCms(
  doc: CmsPrestige | null | undefined,
  moduleCards: PrestigePageCmsContent['moduleCards'],
): PrestigePageCmsContent {
  const defaults = prestigePageDefaults
  if (!doc) {
    return {
      ...defaults,
      moduleCards,
    }
  }

  const featuresList: PrestigeFeatureItem[] =
    doc.features?.list
      ?.map((item, index) => {
        const fallback = defaults.features.list[index]
        if (!fallback) return null
        return {
          heading: text(item?.heading, fallback.heading),
          content: text(item?.content, fallback.content),
        }
      })
      .filter((item): item is PrestigeFeatureItem => Boolean(item)) ?? []

  const anchorMenu: PrestigeAnchorMenuItem[] = []
  for (let index = 0; index < PRESTIGE_ANCHOR_SECTION_IDS.length; index += 1) {
    const sectionId = PRESTIGE_ANCHOR_SECTION_IDS[index]
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
    introduction: {
      heading: text(doc.introduction?.heading, defaults.introduction.heading),
      introVideo: {
        heading: text(
          doc.introduction?.introVideo?.heading,
          defaults.introduction.introVideo.heading,
        ),
        content: text(
          doc.introduction?.introVideo?.content,
          defaults.introduction.introVideo.content,
        ),
        vimeoVideo: videoId(
          doc.introduction?.introVideo?.vimeoVideo,
          defaults.introduction.introVideo.vimeoVideo,
        ),
      },
    },
    features: {
      heading: text(doc.features?.heading, defaults.features.heading),
      list: featuresList.length > 0 ? featuresList : defaults.features.list,
      button: text(doc.features?.button, defaults.features.button),
      buttonMobile: text(doc.features?.buttonMobile, defaults.features.buttonMobile),
      buttonLink: linkValue(doc.features?.buttonLink, defaults.features.buttonLink),
    },
    otherModulesHeading: text(doc.otherModulesHeading, defaults.otherModulesHeading),
    book: {
      heading: text(doc.book?.heading, defaults.book.heading),
      content: text(doc.book?.content, defaults.book.content),
      button: text(doc.book?.button, defaults.book.button),
      buttonLink: linkValue(doc.book?.buttonLink, defaults.book.buttonLink),
    },
    cta: {
      heading: text(doc.cta?.heading, defaults.cta.heading),
      content: text(doc.cta?.content, defaults.cta.content),
      button: text(doc.cta?.button, defaults.cta.button),
      buttonLink: linkValue(doc.cta?.buttonLink, defaults.cta.buttonLink),
      videoBackground: videoId(doc.cta?.videoBackground, defaults.cta.videoBackground),
    },
    seo: mapCmsSeo(doc.seo, defaults.seo),
    moduleCards,
  }
}

function otherModuleCards(
  cards: PrestigePageCmsContent['moduleCards'],
): PrestigePageCmsContent['moduleCards'] {
  return cards.filter((card) => card.link !== '/prestige').slice(0, 3)
}

async function getPrestigeModuleCards() {
  if (shouldSkipCmsAtBuild()) {
    return otherModuleCards(FALLBACK_MODULES_CONTENT.moduleCards)
  }

  try {
    const modules = await getModulesPageContent()
    return otherModuleCards(modules.moduleCards)
  } catch {
    return otherModuleCards(FALLBACK_MODULES_CONTENT.moduleCards)
  }
}

/** Dedupes layout metadata + page within a single request. */
export const getPrestigePageContent = cache(async (): Promise<PrestigePageCmsContent> => {
  const moduleCards = await getPrestigeModuleCards()

  if (shouldSkipCmsAtBuild()) {
    return {
      ...prestigePageDefaults,
      moduleCards,
    }
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'prestige',
      depth: 0,
    })) as CmsPrestige
    return mapPrestigeFromCms(doc, moduleCards)
  } catch (error) {
    console.error(
      '[prestige] Failed to load Prestige global from Payload — using defaults.',
      error,
    )
    return {
      ...FALLBACK_PRESTIGE_CONTENT,
      seo: prestigePageDefaults.seo,
      moduleCards,
    }
  }
})

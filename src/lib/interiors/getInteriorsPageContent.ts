import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { FALLBACK_MODULES_CONTENT } from '@/lib/modules/defaults'
import { getModulesPageContent } from '@/lib/modules/getModulesPageContent'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import {
  FALLBACK_INTERIORS_CONTENT,
  INTERIORS_ANCHOR_SECTION_IDS,
  interiorsPageDefaults,
} from './defaults'
import type {
  InteriorsAnchorMenuItem,
  InteriorsDesignYourSpaceItem,
  InteriorsPageCmsContent,
} from './types'

type CmsInteriors = {
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
  designYourSpace?: {
    heading?: string | null
    list?: Array<{
      heading?: string | null
      content?: string | null
    } | null> | null
    lastContent?: string | null
    button?: string | null
    buttonLink?: string | null
    note?: string | null
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

function mapInteriorsFromCms(
  doc: CmsInteriors | null | undefined,
  moduleCards: InteriorsPageCmsContent['moduleCards'],
): InteriorsPageCmsContent {
  const defaults = interiorsPageDefaults
  if (!doc) {
    return {
      ...defaults,
      moduleCards,
    }
  }

  const designList: InteriorsDesignYourSpaceItem[] =
    doc.designYourSpace?.list
      ?.map((item, index) => {
        const fallback = defaults.designYourSpace.list[index]
        if (!fallback) return null
        return {
          heading: text(item?.heading, fallback.heading),
          content: text(item?.content, fallback.content),
        }
      })
      .filter((item): item is InteriorsDesignYourSpaceItem => Boolean(item)) ?? []

  const anchorMenu: InteriorsAnchorMenuItem[] = []
  for (let index = 0; index < INTERIORS_ANCHOR_SECTION_IDS.length; index += 1) {
    const sectionId = INTERIORS_ANCHOR_SECTION_IDS[index]
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
    designYourSpace: {
      heading: text(doc.designYourSpace?.heading, defaults.designYourSpace.heading),
      list: designList.length > 0 ? designList : defaults.designYourSpace.list,
      lastContent: text(
        doc.designYourSpace?.lastContent,
        defaults.designYourSpace.lastContent,
      ),
      button: text(doc.designYourSpace?.button, defaults.designYourSpace.button),
      buttonLink: linkValue(
        doc.designYourSpace?.buttonLink,
        defaults.designYourSpace.buttonLink,
      ),
      note: text(doc.designYourSpace?.note, defaults.designYourSpace.note),
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
  cards: InteriorsPageCmsContent['moduleCards'],
): InteriorsPageCmsContent['moduleCards'] {
  return cards.filter((card) => card.link !== '/interiors').slice(0, 3)
}

async function getInteriorsModuleCards() {
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
export const getInteriorsPageContent = cache(async (): Promise<InteriorsPageCmsContent> => {
  const moduleCards = await getInteriorsModuleCards()

  if (shouldSkipCmsAtBuild()) {
    return {
      ...interiorsPageDefaults,
      moduleCards,
    }
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'interiors',
      depth: 0,
    })) as CmsInteriors
    return mapInteriorsFromCms(doc, moduleCards)
  } catch (error) {
    console.error(
      '[interiors] Failed to load Interiors global from Payload — using defaults.',
      error,
    )
    return {
      ...FALLBACK_INTERIORS_CONTENT,
      seo: interiorsPageDefaults.seo,
      moduleCards,
    }
  }
})

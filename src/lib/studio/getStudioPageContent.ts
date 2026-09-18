import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { FALLBACK_MODULES_CONTENT } from '@/lib/modules/defaults'
import { getModulesPageContent } from '@/lib/modules/getModulesPageContent'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import {
  FALLBACK_STUDIO_CONTENT,
  STUDIO_ANCHOR_SECTION_IDS,
  studioPageDefaults,
} from './defaults'
import type {
  StudioAnchorMenuItem,
  StudioHowItWorksColumn,
  StudioPageCmsContent,
  StudioWhyPartnerItem,
} from './types'

type CmsStudio = {
  banner?: {
    title?: string | null
    vimeoBackgroundVideo?: string | null
  } | null
  anchorMenu?: Array<{
    label?: string | null
  } | null> | null
  introduction?: string | null
  whyPartner?: {
    heading?: string | null
    list?: Array<{
      heading?: string | null
      content?: string | null
    } | null> | null
  } | null
  howItWorks?: {
    heading?: string | null
    columns?: Array<{
      title?: string | null
      subtitle?: string | null
      items?: Array<{
        text?: string | null
        tooltip?: string | null
      } | null> | null
    } | null> | null
    button?: string | null
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

function mapColumn(
  column: NonNullable<NonNullable<CmsStudio['howItWorks']>['columns']>[number],
  fallback: StudioHowItWorksColumn,
): StudioHowItWorksColumn {
  const items =
    column?.items
      ?.map((item, index) => {
        const fallbackItem = fallback.items[index]
        const itemText = text(item?.text, fallbackItem?.text ?? '')
        if (!itemText) return null
        return {
          text: itemText,
          tooltip: text(
            item?.tooltip,
            fallbackItem?.tooltip ?? `DX LIVING - ${itemText}`,
          ),
        }
      })
      .filter((item): item is { text: string; tooltip: string } => Boolean(item)) ?? []

  return {
    title: text(column?.title, fallback.title),
    subtitle: text(column?.subtitle, fallback.subtitle),
    items: items.length > 0 ? items : fallback.items,
  }
}

function mapStudioFromCms(
  doc: CmsStudio | null | undefined,
  moduleCards: StudioPageCmsContent['moduleCards'],
): StudioPageCmsContent {
  const defaults = studioPageDefaults
  if (!doc) {
    return {
      ...defaults,
      moduleCards,
    }
  }

  const whyPartnerList: StudioWhyPartnerItem[] =
    doc.whyPartner?.list
      ?.map((item, index) => {
        const fallback = defaults.whyPartner.list[index]
        if (!fallback) return null
        return {
          heading: text(item?.heading, fallback.heading),
          content: text(item?.content, fallback.content),
        }
      })
      .filter((item): item is StudioWhyPartnerItem => Boolean(item)) ?? []

  const columns: StudioHowItWorksColumn[] =
    doc.howItWorks?.columns
      ?.map((column, index) => {
        const fallback = defaults.howItWorks.columns[index]
        if (!fallback) return null
        return mapColumn(column, fallback)
      })
      .filter((column): column is StudioHowItWorksColumn => Boolean(column)) ?? []

  const anchorMenu: StudioAnchorMenuItem[] = []
  for (let index = 0; index < STUDIO_ANCHOR_SECTION_IDS.length; index += 1) {
    const sectionId = STUDIO_ANCHOR_SECTION_IDS[index]
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
    whyPartner: {
      heading: text(doc.whyPartner?.heading, defaults.whyPartner.heading),
      list: whyPartnerList.length > 0 ? whyPartnerList : defaults.whyPartner.list,
    },
    howItWorks: {
      heading: text(doc.howItWorks?.heading, defaults.howItWorks.heading),
      columns: columns.length > 0 ? columns : defaults.howItWorks.columns,
      button: text(doc.howItWorks?.button, defaults.howItWorks.button),
      buttonLink: linkValue(doc.howItWorks?.buttonLink, defaults.howItWorks.buttonLink),
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
  cards: StudioPageCmsContent['moduleCards'],
): StudioPageCmsContent['moduleCards'] {
  return cards.filter((card) => card.link !== '/studio').slice(0, 3)
}

async function getStudioModuleCards() {
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
export const getStudioPageContent = cache(async (): Promise<StudioPageCmsContent> => {
  const moduleCards = await getStudioModuleCards()

  if (shouldSkipCmsAtBuild()) {
    return {
      ...studioPageDefaults,
      moduleCards,
    }
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'studio',
      depth: 0,
    })) as CmsStudio
    return mapStudioFromCms(doc, moduleCards)
  } catch (error) {
    console.error('[studio] Failed to load Studio global from Payload — using defaults.', error)
    return {
      ...FALLBACK_STUDIO_CONTENT,
      seo: studioPageDefaults.seo,
      moduleCards,
    }
  }
})

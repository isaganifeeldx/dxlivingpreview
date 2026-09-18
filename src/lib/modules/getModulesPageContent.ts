import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import {
  FALLBACK_MODULES_CONTENT,
  MODULES_ANCHOR_SECTION_IDS,
  modulesPageDefaults,
} from './defaults'
import type { ModulesAnchorMenuItem, ModulesPageCmsContent, ModulesPageModuleCard } from './types'

type CmsMedia = {
  url?: string | null
} | null

type CmsModules = {
  banner?: {
    title?: string | null
    vimeoBackgroundVideo?: string | null
  } | null
  anchorMenu?: Array<{
    label?: string | null
  } | null> | null
  introduction?: string | null
  moduleCards?: Array<{
    title?: string | null
    content?: string | null
    image?: number | CmsMedia
    link?: string | null
  } | null> | null
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

function mapModulesFromCms(doc: CmsModules | null | undefined): ModulesPageCmsContent {
  const defaults = modulesPageDefaults
  if (!doc) return defaults

  const anchorMenu: ModulesAnchorMenuItem[] = []
  for (let index = 0; index < MODULES_ANCHOR_SECTION_IDS.length; index += 1) {
    const sectionId = MODULES_ANCHOR_SECTION_IDS[index]
    const fallback = defaults.anchorMenu[index]
    if (!sectionId || !fallback) continue
    anchorMenu.push({
      id: sectionId,
      label: text(doc.anchorMenu?.[index]?.label, fallback.label),
    })
  }

  const moduleCards: ModulesPageModuleCard[] =
    doc.moduleCards
      ?.map((card, index) => {
        const fallback = defaults.moduleCards[index] ?? defaults.moduleCards[0]
        if (!fallback) return null
        return {
          title: text(card?.title, fallback.title),
          content: text(card?.content, fallback.content),
          image: getMediaUrl(card?.image) ?? fallback.image,
          link: linkValue(card?.link, fallback.link),
        }
      })
      .filter((card): card is ModulesPageModuleCard => Boolean(card)) ?? []

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
    moduleCards: moduleCards.length > 0 ? moduleCards : defaults.moduleCards,
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

/** Dedupes metadata + page within a single request. */
export const getModulesPageContent = cache(async (): Promise<ModulesPageCmsContent> => {
  if (shouldSkipCmsAtBuild()) return modulesPageDefaults

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'modules',
      depth: 1,
    })) as CmsModules
    return mapModulesFromCms(doc)
  } catch (error) {
    console.error('[modules] Failed to load Modules global from Payload — using defaults.', error)
    return {
      ...FALLBACK_MODULES_CONTENT,
      seo: modulesPageDefaults.seo,
    }
  }
})

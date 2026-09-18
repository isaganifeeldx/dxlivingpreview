import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import { aboutPageDefaults, ABOUT_ANCHOR_SECTION_IDS, FALLBACK_ABOUT_CONTENT } from './defaults'
import type { AboutAnchorMenuItem, AboutPageCmsContent } from './types'

type CmsAbout = {
  banner?: {
    title?: string | null
    vimeoBackgroundVideo?: string | null
  } | null
  anchorMenu?: Array<{
    label?: string | null
  } | null> | null
  introduction?: string | null
  videoLeft?: string | null
  contentRight?: string | null
  fullWidthVideo?: string | null
  whyDxLiving?: {
    heading?: string | null
    content?: string | null
    contentList?: Array<{ text?: string | null } | null> | null
    lastContent?: string | null
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

function mapAboutFromCms(doc: CmsAbout | null | undefined): AboutPageCmsContent {
  const defaults = aboutPageDefaults
  if (!doc) return defaults

  const contentList =
    doc.whyDxLiving?.contentList
      ?.map((item, index) =>
        text(item?.text, defaults.whyDxLiving.contentList[index] ?? ''),
      )
      .filter(Boolean) ?? []

  const anchorMenu: AboutAnchorMenuItem[] = []
  for (let index = 0; index < ABOUT_ANCHOR_SECTION_IDS.length; index += 1) {
    const sectionId = ABOUT_ANCHOR_SECTION_IDS[index]
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
    videoLeft: videoId(doc.videoLeft, defaults.videoLeft),
    contentRight: text(doc.contentRight, defaults.contentRight),
    fullWidthVideo: videoId(doc.fullWidthVideo, defaults.fullWidthVideo),
    whyDxLiving: {
      heading: text(doc.whyDxLiving?.heading, defaults.whyDxLiving.heading),
      content: text(doc.whyDxLiving?.content, defaults.whyDxLiving.content),
      contentList:
        contentList.length > 0 ? contentList : defaults.whyDxLiving.contentList,
      lastContent: text(doc.whyDxLiving?.lastContent, defaults.whyDxLiving.lastContent),
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
export const getAboutPageContent = cache(async (): Promise<AboutPageCmsContent> => {
  if (shouldSkipCmsAtBuild()) return aboutPageDefaults

  try {
    // Dynamic import keeps Payload/pg out of the Vercel build skip path so a
    // malformed DATABASE_URI cannot throw ERR_INVALID_URL during page-data collection.
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'about',
      depth: 0,
    })) as CmsAbout
    return mapAboutFromCms(doc)
  } catch (error) {
    console.error('[about] Failed to load About global from Payload — using defaults.', error)
    return {
      ...FALLBACK_ABOUT_CONTENT,
      seo: aboutPageDefaults.seo,
    }
  }
})

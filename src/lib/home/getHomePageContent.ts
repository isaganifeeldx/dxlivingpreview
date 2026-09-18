import { cache } from 'react'
import { FALLBACK_HOME_CONTENT } from '@/data/homeContent'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import { getSiteSettings } from '@/lib/settings/getSiteSettings'
import { socialLinksFromSettings, DEFAULT_SOCIAL_LINKS } from '@/lib/socialLinks'
import { homePageDefaults } from './defaults'
import type { HomePageCmsContent } from './types'

type CmsMedia = {
  url?: string | null
} | null

type CmsHome = {
  sliderItems?: Array<{
    heading?: string | null
    content?: string | null
    button?: string | null
    buttonLink?: string | null
  } | null> | null
  interactiveButton?: {
    label?: string | null
    link?: string | null
  } | null
  redefiningHome?: {
    heading?: string | null
    content?: string | null
    buttonText?: string | null
    buttonLink?: string | null
  } | null
  bringYourDesigns?: {
    heading?: string | null
    content?: string | null
    leftImage?: number | CmsMedia
    rightImage?: number | CmsMedia
    leftCaption?: string | null
    rightCaption?: string | null
    buttonText?: string | null
    buttonLink?: string | null
  } | null
  exploreLimitless?: {
    heading?: string | null
    content?: string | null
    modules?: Array<{
      subTitle?: string | null
      title?: string | null
      content?: string | null
    } | null> | null
  } | null
  ourProject?: {
    heading?: string | null
    content?: string | null
    videos?: Array<{
      id?: string | null
      title?: string | null
    } | null> | null
    buttonText?: string | null
    buttonLink?: string | null
  } | null
  spaceRealisation?: {
    heading?: string | null
    content?: string | null
    leftImage?: number | CmsMedia
    rightImage?: number | CmsMedia
    leftCaption?: string | null
    rightCaption?: string | null
    buttonText?: string | null
    buttonLink?: string | null
  } | null
  optimizeDesign?: {
    heading?: string | null
    content?: string | null
    image?: number | CmsMedia
    items?: Array<{
      title?: string | null
      content?: string | null
    } | null> | null
    buttonText?: string | null
    buttonLink?: string | null
  } | null
  seo?: CmsSeo
}

function text(value: string | null | undefined, fallback: string): string {
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

function mapHomeFromCms(doc: CmsHome | null | undefined): HomePageCmsContent {
  const defaults = homePageDefaults
  if (!doc) return defaults

  const sliderItems =
    doc.sliderItems
      ?.map((item, index) => {
        const fallback = defaults.sliderItems[index] ?? defaults.sliderItems[0]
        if (!fallback) return null
        return {
          heading: text(item?.heading, fallback.heading),
          content: text(item?.content, fallback.content),
          button: text(item?.button, fallback.button),
          buttonLink: linkValue(item?.buttonLink, fallback.buttonLink),
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []

  const modules =
    doc.exploreLimitless?.modules
      ?.map((item, index) => {
        const fallback =
          defaults.exploreLimitless.modules[index] ??
          defaults.exploreLimitless.modules[0]
        if (!fallback) return null
        return {
          subTitle: text(item?.subTitle, fallback.subTitle),
          title: text(item?.title, fallback.title),
          content: text(item?.content, fallback.content),
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []

  const videos =
    doc.ourProject?.videos
      ?.map((item, index) => {
        const fallback = defaults.ourProject.videos[index] ?? defaults.ourProject.videos[0]
        if (!fallback) return null
        return {
          id: text(item?.id, fallback.id),
          title: text(item?.title, fallback.title),
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []

  const workflowItems =
    doc.optimizeDesign?.items
      ?.map((item, index) => {
        const fallback =
          defaults.optimizeDesign.items[index] ?? defaults.optimizeDesign.items[0]
        if (!fallback) return null
        return {
          title: text(item?.title, fallback.title),
          content: text(item?.content, fallback.content),
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item)) ?? []

  return {
    sliderItems: sliderItems.length > 0 ? sliderItems : defaults.sliderItems,
    socialLinks: defaults.socialLinks,
    interactiveButton: {
      label: text(doc.interactiveButton?.label, defaults.interactiveButton.label),
      link: linkValue(doc.interactiveButton?.link, defaults.interactiveButton.link),
    },
    redefiningHome: {
      heading: text(doc.redefiningHome?.heading, defaults.redefiningHome.heading),
      content: text(doc.redefiningHome?.content, defaults.redefiningHome.content),
      buttonText: text(
        doc.redefiningHome?.buttonText,
        defaults.redefiningHome.buttonText,
      ),
      buttonLink: linkValue(
        doc.redefiningHome?.buttonLink,
        defaults.redefiningHome.buttonLink,
      ),
    },
    bringYourDesigns: {
      heading: text(doc.bringYourDesigns?.heading, defaults.bringYourDesigns.heading),
      content: text(doc.bringYourDesigns?.content, defaults.bringYourDesigns.content),
      leftImage:
        getMediaUrl(doc.bringYourDesigns?.leftImage) ??
        defaults.bringYourDesigns.leftImage,
      rightImage:
        getMediaUrl(doc.bringYourDesigns?.rightImage) ??
        defaults.bringYourDesigns.rightImage,
      leftCaption: text(
        doc.bringYourDesigns?.leftCaption,
        defaults.bringYourDesigns.leftCaption,
      ),
      rightCaption: text(
        doc.bringYourDesigns?.rightCaption,
        defaults.bringYourDesigns.rightCaption,
      ),
      buttonText: text(
        doc.bringYourDesigns?.buttonText,
        defaults.bringYourDesigns.buttonText,
      ),
      buttonLink: linkValue(
        doc.bringYourDesigns?.buttonLink,
        defaults.bringYourDesigns.buttonLink,
      ),
    },
    exploreLimitless: {
      heading: text(doc.exploreLimitless?.heading, defaults.exploreLimitless.heading),
      content: text(doc.exploreLimitless?.content, defaults.exploreLimitless.content),
      modules: modules.length > 0 ? modules : defaults.exploreLimitless.modules,
    },
    ourProject: {
      heading: text(doc.ourProject?.heading, defaults.ourProject.heading),
      content: text(doc.ourProject?.content, defaults.ourProject.content),
      videos: videos.length > 0 ? videos : defaults.ourProject.videos,
      buttonText: text(doc.ourProject?.buttonText, defaults.ourProject.buttonText),
      buttonLink: linkValue(doc.ourProject?.buttonLink, defaults.ourProject.buttonLink),
    },
    spaceRealisation: {
      heading: text(doc.spaceRealisation?.heading, defaults.spaceRealisation.heading),
      content: text(doc.spaceRealisation?.content, defaults.spaceRealisation.content),
      leftImage:
        getMediaUrl(doc.spaceRealisation?.leftImage) ??
        defaults.spaceRealisation.leftImage,
      rightImage:
        getMediaUrl(doc.spaceRealisation?.rightImage) ??
        defaults.spaceRealisation.rightImage,
      leftCaption: text(
        doc.spaceRealisation?.leftCaption,
        defaults.spaceRealisation.leftCaption,
      ),
      rightCaption: text(
        doc.spaceRealisation?.rightCaption,
        defaults.spaceRealisation.rightCaption,
      ),
      buttonText: text(
        doc.spaceRealisation?.buttonText,
        defaults.spaceRealisation.buttonText,
      ),
      buttonLink: linkValue(
        doc.spaceRealisation?.buttonLink,
        defaults.spaceRealisation.buttonLink,
      ),
    },
    optimizeDesign: {
      heading: text(doc.optimizeDesign?.heading, defaults.optimizeDesign.heading),
      content: text(doc.optimizeDesign?.content, defaults.optimizeDesign.content),
      items: workflowItems.length > 0 ? workflowItems : defaults.optimizeDesign.items,
      buttonText: text(
        doc.optimizeDesign?.buttonText,
        defaults.optimizeDesign.buttonText,
      ),
      buttonLink: linkValue(
        doc.optimizeDesign?.buttonLink,
        defaults.optimizeDesign.buttonLink,
      ),
      image: getMediaUrl(doc.optimizeDesign?.image) ?? defaults.optimizeDesign.image,
    },
    seo: mapCmsSeo(doc.seo, defaults.seo),
  }
}

/** Dedupes layout + generateMetadata + page within a single request. */
export const getHomePageContent = cache(async (): Promise<HomePageCmsContent> => {
  const resolveSocial = async () => {
    try {
      const settings = await getSiteSettings()
      return socialLinksFromSettings(settings.footer.social)
    } catch {
      return DEFAULT_SOCIAL_LINKS
    }
  }

  if (shouldSkipCmsAtBuild()) {
    return {
      ...homePageDefaults,
      socialLinks: await resolveSocial(),
    }
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'home',
      depth: 1,
    })) as CmsHome
    const content = mapHomeFromCms(doc)
    return {
      ...content,
      socialLinks: await resolveSocial(),
    }
  } catch (error) {
    console.error('[home] Failed to load Home global from Payload — using defaults.', error)
    return {
      ...FALLBACK_HOME_CONTENT,
      seo: homePageDefaults.seo,
      socialLinks: await resolveSocial(),
    }
  }
})

import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getMediaUrl } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import {
  CONTACT_ANCHOR_SECTION_IDS,
  FALLBACK_CONTACT_CONTENT,
  contactPageDefaults,
} from './defaults'
import type {
  ContactAnchorMenuItem,
  ContactBranch,
  ContactPageCmsContent,
} from './types'

type CmsMedia = {
  url?: string | null
} | null

type CmsContact = {
  banner?: {
    title?: string | null
    vimeoBackgroundVideo?: string | null
  } | null
  anchorMenu?: Array<{
    label?: string | null
  } | null> | null
  introduction?: string | null
  quickEnquiries?: {
    heading?: string | null
    content?: string | null
    phone?: string | null
    email?: string | null
  } | null
  whereToFindUs?: {
    heading?: string | null
    branches?: Array<{
      branchName?: string | null
      location?: string | null
      locationLink?: string | null
      phone?: string | null
      mapImage?: number | CmsMedia
      /** Legacy text URL field — ignored once mapImage is used. */
      svgImageUrl?: string | null
    } | null> | null
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

function optionalLink(
  value: string | null | undefined,
  fallback?: string,
): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed) return fallback
  if (trimmed.startsWith('/') || /^https?:\/\//i.test(trimmed)) return trimmed
  return fallback
}

function mapContactFromCms(doc: CmsContact | null | undefined): ContactPageCmsContent {
  const defaults = contactPageDefaults
  if (!doc) return defaults

  const branches: ContactBranch[] =
    doc.whereToFindUs?.branches
      ?.map((item, index) => {
        const fallback = defaults.whereToFindUs.branches[index]
        if (!fallback) return null
        const locationLink = optionalLink(item?.locationLink, fallback.locationLink)
        return {
          branchName: text(item?.branchName, fallback.branchName),
          location: text(item?.location, fallback.location),
          ...(locationLink ? { locationLink } : {}),
          phone: text(item?.phone, fallback.phone),
          // Prefer uploaded Media; otherwise keep built-in SVG path fallbacks.
          svgImageUrl: getMediaUrl(item?.mapImage) ?? fallback.svgImageUrl,
        }
      })
      .filter((item): item is ContactBranch => Boolean(item)) ?? []

  const anchorMenu: ContactAnchorMenuItem[] = []
  for (let index = 0; index < CONTACT_ANCHOR_SECTION_IDS.length; index += 1) {
    const sectionId = CONTACT_ANCHOR_SECTION_IDS[index]
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
    introduction: text(doc.introduction, defaults.introduction),
    quickEnquiries: {
      heading: text(doc.quickEnquiries?.heading, defaults.quickEnquiries.heading),
      content: text(doc.quickEnquiries?.content, defaults.quickEnquiries.content),
      phone: text(doc.quickEnquiries?.phone, defaults.quickEnquiries.phone),
      email: text(doc.quickEnquiries?.email, defaults.quickEnquiries.email),
    },
    whereToFindUs: {
      heading: text(doc.whereToFindUs?.heading, defaults.whereToFindUs.heading),
      branches: branches.length > 0 ? branches : defaults.whereToFindUs.branches,
    },
    seo: mapCmsSeo(doc.seo, defaults.seo),
  }
}

/** Dedupes layout metadata + page within a single request. */
export const getContactPageContent = cache(async (): Promise<ContactPageCmsContent> => {
  if (shouldSkipCmsAtBuild()) {
    return contactPageDefaults
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'contact',
      depth: 1,
    })) as CmsContact
    return mapContactFromCms(doc)
  } catch (error) {
    console.error('[contact] Failed to load Contact global from Payload — using defaults.', error)
    return {
      ...FALLBACK_CONTACT_CONTENT,
      seo: contactPageDefaults.seo,
    }
  }
})

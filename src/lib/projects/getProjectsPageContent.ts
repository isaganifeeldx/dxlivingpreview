import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import {
  FALLBACK_PROJECTS_PAGE_CONTENT,
  PROJECTS_ANCHOR_SECTION_IDS,
  projectsPageDefaults,
} from './defaults'
import { getAllProjects } from './getProjects'
import type { ProjectsAnchorMenuItem, ProjectsPageCmsContent } from './types'

type CmsProjectsPage = {
  banner?: {
    title?: string | null
    vimeoBackgroundVideo?: string | null
  } | null
  anchorMenu?: Array<{
    label?: string | null
  } | null> | null
  introduction?: string | null
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

function mapProjectsPageFromCms(
  doc: CmsProjectsPage | null | undefined,
): Omit<ProjectsPageCmsContent, 'projects'> {
  const defaults = projectsPageDefaults
  if (!doc) {
    const { projects: _projects, ...rest } = defaults
    return rest
  }

  const anchorMenu: ProjectsAnchorMenuItem[] = []
  for (let index = 0; index < PROJECTS_ANCHOR_SECTION_IDS.length; index += 1) {
    const sectionId = PROJECTS_ANCHOR_SECTION_IDS[index]
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
export const getProjectsPageContent = cache(async (): Promise<ProjectsPageCmsContent> => {
  const projects = await getAllProjects()

  if (shouldSkipCmsAtBuild()) {
    return { ...projectsPageDefaults, projects }
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'projects-page',
      depth: 0,
    })) as CmsProjectsPage

    return {
      ...mapProjectsPageFromCms(doc),
      projects,
    }
  } catch (error) {
    console.error(
      '[projects] Failed to load Projects Page global from Payload — using defaults.',
      error,
    )
    return {
      ...FALLBACK_PROJECTS_PAGE_CONTENT,
      seo: projectsPageDefaults.seo,
      projects,
    }
  }
})

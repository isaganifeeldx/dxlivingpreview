import { cache } from 'react'
import { projects as fallbackProjects } from '@/data/projects'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { canonicalizeProjectSlug } from './defaults'
import { mapCmsProject, toFallbackProjectItem } from './mapProject'
import type { ProjectItem } from './types'

type CmsProjectDoc = Parameters<typeof mapCmsProject>[0] & {
  id?: number | string
  sortOrder?: number | null
  publishedAt?: string | null
}

function fallbackItems(): ProjectItem[] {
  return fallbackProjects.map(toFallbackProjectItem)
}

function fallbackBySlug(slug: string): ProjectItem | null {
  const canonical = canonicalizeProjectSlug(slug)
  return fallbackItems().find((project) => project.slug === canonical) ?? null
}

/** Dedupes within a single request. */
export const getAllProjects = cache(async (): Promise<ProjectItem[]> => {
  if (shouldSkipCmsAtBuild()) {
    return fallbackItems()
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 100,
      sort: 'sortOrder',
      where: {
        or: [
          { _status: { equals: 'published' } },
          { _status: { exists: false } },
        ],
      },
    })

    const fallbackByKey = new Map(fallbackProjects.map((project) => [project.slug, project]))
    const mapped = result.docs
      .map((doc) => {
        const cmsDoc = doc as CmsProjectDoc
        const slug = typeof cmsDoc.slug === 'string' ? cmsDoc.slug : ''
        const fallback = fallbackByKey.get(slug) ?? fallbackProjects[0]
        if (!fallback) return null
        return mapCmsProject(cmsDoc, fallback)
      })
      .filter((project): project is ProjectItem => Boolean(project))

    return mapped.length > 0 ? mapped : fallbackItems()
  } catch (error) {
    console.error('[projects] Failed to load projects from Payload — using defaults.', error)
    return fallbackItems()
  }
})

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectItem | null> => {
  const canonical = canonicalizeProjectSlug(slug)

  if (shouldSkipCmsAtBuild()) {
    return fallbackBySlug(canonical)
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1,
      where: {
        and: [
          { slug: { equals: canonical } },
          {
            or: [
              { _status: { equals: 'published' } },
              { _status: { exists: false } },
            ],
          },
        ],
      },
    })

    const doc = result.docs[0] as CmsProjectDoc | undefined
    if (!doc) return fallbackBySlug(canonical)

    const fallback =
      fallbackProjects.find((project) => project.slug === canonical) ?? fallbackProjects[0]
    if (!fallback) return null
    return mapCmsProject(doc, fallback)
  } catch (error) {
    console.error(
      `[projects] Failed to load project "${canonical}" from Payload — using defaults.`,
      error,
    )
    return fallbackBySlug(canonical)
  }
})

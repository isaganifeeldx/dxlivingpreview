import { emptySeoData } from '@/lib/seo/types'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import { getProjectOgPath } from '@/lib/seo/ogImage'
import type { Project, ProjectVideos } from '@/data/projects'
import type { ProjectItem } from './types'

type CmsProject = {
  title?: string | null
  slug?: string | null
  description?: string | null
  timeframe?: string | null
  location?: string | null
  state?: string | null
  technologies?: string | null
  status?: string | null
  type?: string | null
  featuredTitle?: string | null
  listingVideo?: string | null
  videos?: {
    hero?: string | null
    primary?: string | null
    galleryLeft?: string | null
    galleryRight?: string | null
    fullWidth?: string | null
    carousel?: Array<{ vimeoId?: string | null } | null> | null
  } | null
  centerHeroOnMobile?: boolean | null
  alignTechnologiesEnd?: boolean | null
  sortOrder?: number | null
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

function mapCarousel(
  carousel: Array<{ vimeoId?: string | null } | null> | null | undefined,
  fallback: ProjectVideos['carousel'],
): ProjectVideos['carousel'] {
  const ids = (carousel ?? [])
    .map((item) => item?.vimeoId?.trim())
    .filter((id): id is string => Boolean(id))

  return [ids[0] ?? fallback[0], ids[1] ?? fallback[1], ids[2] ?? fallback[2]]
}

export function mapCmsProject(doc: CmsProject, fallback: Project): ProjectItem | null {
  const slug = text(doc.slug, fallback.slug)
  if (!slug) return null

  const title = text(doc.title, fallback.title)
  const seoTitle = text(doc.seo?.title, fallback.seoTitle || `${title} | DX LIVING Project`)
  const seoDescription = text(
    doc.seo?.description,
    fallback.seoDescription || fallback.description,
  )
  const ogImage = getProjectOgPath(slug)

  const videos: ProjectVideos = {
    hero: videoId(doc.videos?.hero, fallback.videos.hero),
    primary: videoId(doc.videos?.primary, fallback.videos.primary),
    galleryLeft: videoId(doc.videos?.galleryLeft, fallback.videos.galleryLeft),
    galleryRight: videoId(doc.videos?.galleryRight, fallback.videos.galleryRight),
    fullWidth: videoId(doc.videos?.fullWidth, fallback.videos.fullWidth),
    carousel: mapCarousel(doc.videos?.carousel, fallback.videos.carousel),
  }

  return {
    slug,
    title,
    description: text(doc.description, fallback.description),
    seoTitle,
    seoDescription,
    timeframe: text(doc.timeframe, fallback.timeframe),
    location: text(doc.location, fallback.location),
    state: text(doc.state, fallback.state),
    technologies: text(doc.technologies, fallback.technologies),
    status: text(doc.status, fallback.status),
    video: videoId(doc.listingVideo, fallback.video),
    videos,
    featuredTitle: text(doc.featuredTitle, fallback.featuredTitle),
    link: `/projects/${slug}`,
    type: text(doc.type, fallback.type),
    image: fallback.image,
    images: fallback.images,
    centerHeroOnMobile: Boolean(doc.centerHeroOnMobile ?? fallback.centerHeroOnMobile),
    alignTechnologiesEnd: Boolean(
      doc.alignTechnologiesEnd ?? fallback.alignTechnologiesEnd,
    ),
    seo: mapCmsSeo(
      doc.seo,
      emptySeoData({
        title: seoTitle,
        description: seoDescription,
        ogTitle: seoTitle,
        ogDescription: seoDescription,
        ogImageUrl: ogImage,
        twitterTitle: seoTitle,
        twitterDescription: seoDescription,
        twitterImageUrl: ogImage,
      }),
    ),
  }
}

export function toFallbackProjectItem(project: Project): ProjectItem {
  const ogImage = getProjectOgPath(project.slug)
  return {
    ...project,
    link: `/projects/${project.slug}`,
    seo: emptySeoData({
      title: project.seoTitle,
      description: project.seoDescription,
      ogTitle: project.seoTitle,
      ogDescription: project.seoDescription,
      ogImageUrl: ogImage,
      twitterTitle: project.seoTitle,
      twitterDescription: project.seoDescription,
      twitterImageUrl: ogImage,
    }),
  }
}

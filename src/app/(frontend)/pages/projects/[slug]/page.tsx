import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import ProjectDetailPageContent from '@/components/pages/projects/ProjectDetailPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { PROJECT_SLUG_ALIASES } from '@/lib/projects/defaults'
import { getAllProjects, getProjectBySlug } from '@/lib/projects/getProjects'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildProjectDetailJsonLd } from '@/lib/seo/projectDetailSchema'
import { getProjectOgPath } from '@/lib/seo/ogImage'

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

/** Soft ISR. Payload project saves also revalidate detail paths. */
export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const projects = await getAllProjects()
    return projects.map((project) => ({ slug: project.slug }))
  } catch (error) {
    console.error(
      '[projects] generateStaticParams failed — skipping static project paths for this build.',
      error,
    )
    return []
  }
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  if (PROJECT_SLUG_ALIASES[slug]) {
    return {}
  }

  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project | DX Living' }

  return buildMetadataFromSeo({
    seo: project.seo,
    path: `/projects/${project.slug}`,
    fallbackTitle: project.seo.title || project.seoTitle,
    fallbackDescription: project.seo.description || project.seoDescription,
    fallbackImageUrl: project.seo.ogImageUrl ?? getProjectOgPath(project.slug),
    siteName: 'DX Living',
    absoluteTitle: true,
  })
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const aliasTarget = PROJECT_SLUG_ALIASES[slug]
  if (aliasTarget) {
    permanentRedirect(`/projects/${aliasTarget}`)
  }

  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const projects = await getAllProjects()
  const projectJsonLd = buildProjectDetailJsonLd(project.slug)

  return (
    <>
      {projectJsonLd ? (
        <JsonLdScripts id={`project-${project.slug}`} seo={project.seo} defaultJsonLd={projectJsonLd} />
      ) : null}
      <ProjectDetailPageContent project={project} projects={projects} />
    </>
  )
}

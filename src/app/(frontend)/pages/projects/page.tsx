import type { Metadata } from 'next'
import ProjectsPageContent from '@/components/pages/projects/ProjectsPageContent'
import JsonLdScripts from '@/components/seo/JsonLdScripts'
import { getProjectsPageContent } from '@/lib/projects/getProjectsPageContent'
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata'
import { buildProjectsPageJsonLd } from '@/lib/seo/projectsSchema'

/** Soft ISR. Payload Projects saves also revalidate listing paths. */
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const content = await getProjectsPageContent()

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/projects',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/projects-og.jpg',
    siteName: 'DX Living',
  })
}

export default async function ProjectsPage() {
  const content = await getProjectsPageContent()
  const projectsJsonLd = buildProjectsPageJsonLd(content.seo, content.projects)

  return (
    <>
      <JsonLdScripts id="projects" seo={content.seo} defaultJsonLd={projectsJsonLd} />
      <ProjectsPageContent content={content} projects={content.projects} />
    </>
  )
}

import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import type { Project } from '@/data/projects'
import {
  PROJECTS_METADATA_DESCRIPTION,
  PROJECTS_METADATA_TITLE,
} from '@/lib/projects/defaults'

/** Projects page JSON-LD (CollectionPage, ItemList portfolio, BreadcrumbList). */
export const buildProjectsPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
  projects: Project[] = [],
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const projectsUrl = `${siteUrl}/projects`
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const listId = `${projectsUrl}#list`
  const name = seo?.title?.trim() || PROJECTS_METADATA_TITLE
  const description = seo?.description?.trim() || PROJECTS_METADATA_DESCRIPTION

  const itemListElement = projects.map((project, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'CreativeWork',
      name: project.title,
      url: `${siteUrl}/projects/${project.slug}`,
      about: project.description.replace(/<[^>]+>/g, '').slice(0, 180),
      creator: { '@id': organizationId },
      locationCreated: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: project.location,
          addressRegion: project.state,
          addressCountry: 'AU',
        },
      },
      keywords: project.technologies,
    },
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${projectsUrl}#page`,
        url: projectsUrl,
        name,
        description,
        isPartOf: { '@id': websiteId },
        publisher: { '@id': organizationId },
        mainEntity: { '@id': listId },
      },
      {
        '@type': 'ItemList',
        '@id': listId,
        name: 'DX Living Project Portfolio',
        numberOfItems: itemListElement.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: projectsUrl,
          },
        ],
      },
    ],
  }
}

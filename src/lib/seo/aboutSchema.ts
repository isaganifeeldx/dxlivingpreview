import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  ABOUT_METADATA_DESCRIPTION,
  ABOUT_METADATA_TITLE,
} from '@/lib/about/defaults'

/** About page JSON-LD (AboutPage + BreadcrumbList — Organization lives on the homepage). */
export const buildAboutPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const aboutUrl = `${siteUrl}/about`
  const organizationId = `${siteUrl}/#organization`
  const name = seo?.title?.trim() || ABOUT_METADATA_TITLE
  const description = seo?.description?.trim() || ABOUT_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${aboutUrl}#page`,
        url: aboutUrl,
        name,
        description,
        about: { '@id': organizationId },
        publisher: { '@id': organizationId },
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
            name: 'About',
            item: aboutUrl,
          },
        ],
      },
    ],
  }
}

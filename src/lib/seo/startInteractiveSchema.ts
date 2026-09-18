import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  START_INTERACTIVE_METADATA_DESCRIPTION,
  START_INTERACTIVE_METADATA_TITLE,
} from '@/lib/start-interactive/defaults'

const getCurrentIsoDate = () => new Date().toISOString().slice(0, 10)

/** Start Interactive landing JSON-LD (WebPage + BreadcrumbList). */
export const buildStartInteractivePageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const pageUrl = `${siteUrl}/start-interactive`
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const name = seo?.title?.trim() || START_INTERACTIVE_METADATA_TITLE
  const description = seo?.description?.trim() || START_INTERACTIVE_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#page`,
        url: pageUrl,
        name,
        description,
        isPartOf: { '@id': websiteId },
        publisher: { '@id': organizationId },
        about: { '@id': organizationId },
        inLanguage: 'en-AU',
        dateModified: getCurrentIsoDate(),
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
            name: 'Start Interactive',
            item: pageUrl,
          },
        ],
      },
    ],
  }
}

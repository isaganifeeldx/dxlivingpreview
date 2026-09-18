import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  LOGIN_METADATA_DESCRIPTION,
  LOGIN_METADATA_TITLE,
} from '@/lib/login/defaults'

const getCurrentIsoDate = () => new Date().toISOString().slice(0, 10)

/** Login page JSON-LD (WebPage + BreadcrumbList). */
export const buildLoginPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const loginUrl = `${siteUrl}/login`
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const name = seo?.title?.trim() || LOGIN_METADATA_TITLE
  const description = seo?.description?.trim() || LOGIN_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${loginUrl}#page`,
        url: loginUrl,
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
            name: 'Log in',
            item: loginUrl,
          },
        ],
      },
    ],
  }
}

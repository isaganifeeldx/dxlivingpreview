import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  REGISTER_METADATA_DESCRIPTION,
  REGISTER_METADATA_TITLE,
} from '@/lib/register/defaults'

const getCurrentIsoDate = () => new Date().toISOString().slice(0, 10)

/** Register page JSON-LD (WebPage + BreadcrumbList). */
export const buildRegisterPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const registerUrl = `${siteUrl}/register`
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const name = seo?.title?.trim() || REGISTER_METADATA_TITLE
  const description = seo?.description?.trim() || REGISTER_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${registerUrl}#page`,
        url: registerUrl,
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
            name: 'Register',
            item: registerUrl,
          },
        ],
      },
    ],
  }
}

import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  TERMS_METADATA_DESCRIPTION,
  TERMS_METADATA_TITLE,
} from '@/lib/terms/defaults'

const TERMS_PAGE_DESCRIPTION =
  'The terms and conditions governing the use of DX Living services, platform, and website.'

const getCurrentIsoDate = () => new Date().toISOString().slice(0, 10)

/** Terms of Service page JSON-LD (WebPage + BreadcrumbList). */
export const buildTermsOfServicePageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const termsUrl = `${siteUrl}/terms-of-service`
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const name = seo?.title?.trim() || TERMS_METADATA_TITLE
  const description =
    seo?.description?.trim() || TERMS_PAGE_DESCRIPTION || TERMS_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${termsUrl}#page`,
        url: termsUrl,
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
            name: 'Terms of Service',
            item: termsUrl,
          },
        ],
      },
    ],
  }
}

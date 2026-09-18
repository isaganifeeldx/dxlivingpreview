import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  PRIVACY_METADATA_DESCRIPTION,
  PRIVACY_METADATA_TITLE,
} from '@/lib/privacy/defaults'

const PRIVACY_POLICY_PAGE_DESCRIPTION =
  'How DX Living collects, uses, stores, and protects personal information, in accordance with the Australian Privacy Principles.'

const getCurrentIsoDate = () => new Date().toISOString().slice(0, 10)

/** Privacy Policy page JSON-LD (WebPage + BreadcrumbList). */
export const buildPrivacyPolicyPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const privacyPolicyUrl = `${siteUrl}/privacy-policy`
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const name = seo?.title?.trim() || PRIVACY_METADATA_TITLE
  const description =
    seo?.description?.trim() || PRIVACY_POLICY_PAGE_DESCRIPTION || PRIVACY_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${privacyPolicyUrl}#page`,
        url: privacyPolicyUrl,
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
            name: 'Privacy Policy',
            item: privacyPolicyUrl,
          },
        ],
      },
    ],
  }
}

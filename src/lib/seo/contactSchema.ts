import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  CONTACT_METADATA_DESCRIPTION,
  CONTACT_METADATA_TITLE,
} from '@/lib/contact/defaults'

/** Contact page JSON-LD (ContactPage, location LocalBusinesses, BreadcrumbList). */
export const buildContactPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const contactUrl = `${siteUrl}/contact`
  const organizationId = `${siteUrl}/#organization`
  const name = seo?.title?.trim() || CONTACT_METADATA_TITLE

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${contactUrl}#page`,
        url: contactUrl,
        name,
        description: seo?.description?.trim() || CONTACT_METADATA_DESCRIPTION,
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#location-vic`,
        name: 'DX Living — Victoria',
        url: contactUrl,
        telephone: '1800333539',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '44 Lakeview Drive',
          addressLocality: 'Scoresby',
          addressRegion: 'VIC',
          postalCode: '3179',
          addressCountry: 'AU',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -37.8834,
          longitude: 145.2395,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:00',
        },
        parentOrganization: { '@id': organizationId },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#location-nsw`,
        name: 'DX Living — New South Wales',
        url: contactUrl,
        telephone: '1800333539',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Sydney',
          addressRegion: 'NSW',
          addressCountry: 'AU',
        },
        parentOrganization: { '@id': organizationId },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#location-qld`,
        name: 'DX Living — Queensland',
        url: contactUrl,
        telephone: '1800333539',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Brisbane',
          addressRegion: 'QLD',
          addressCountry: 'AU',
        },
        parentOrganization: { '@id': organizationId },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#location-wa`,
        name: 'DX Living — Western Australia',
        url: contactUrl,
        telephone: '1800333539',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Perth',
          addressRegion: 'WA',
          addressCountry: 'AU',
        },
        parentOrganization: { '@id': organizationId },
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
            name: 'Contact',
            item: contactUrl,
          },
        ],
      },
    ],
  }
}

import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  INTERIORS_METADATA_DESCRIPTION,
  INTERIORS_METADATA_TITLE,
} from '@/lib/interiors/defaults'

const INTERIORS_SERVICE_NAME = 'DX Interiors — Interior Design Visualisation'

const INTERIORS_SERVICE_DESCRIPTION =
  'DX Interiors brings interior spaces to life with photorealistic 3D renders and VR-enabled interior design visualisation for luxury residential projects across Australia.'

/** Interiors page JSON-LD (Service + BreadcrumbList — Organization lives on the homepage). */
export const buildInteriorsPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const interiorsUrl = `${siteUrl}/interiors`
  const organizationId = `${siteUrl}/#organization`
  const name = seo?.title?.trim() || INTERIORS_METADATA_TITLE
  const description = seo?.description?.trim() || INTERIORS_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${interiorsUrl}#service`,
        name: INTERIORS_SERVICE_NAME,
        url: interiorsUrl,
        description: description || INTERIORS_SERVICE_DESCRIPTION,
        provider: { '@id': organizationId },
        areaServed: {
          '@type': 'Country',
          name: 'Australia',
        },
        serviceType: 'Interior Design Visualisation, 3D Interior Rendering',
        offers: {
          '@type': 'Offer',
          url: interiorsUrl,
          priceCurrency: 'AUD',
          availability: 'https://schema.org/InStock',
        },
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
            name: name.includes('|') ? 'DX Interiors' : name,
            item: interiorsUrl,
          },
        ],
      },
    ],
  }
}

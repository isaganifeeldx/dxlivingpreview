import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  STUDIO_METADATA_DESCRIPTION,
  STUDIO_METADATA_TITLE,
} from '@/lib/studio/defaults'

const STUDIO_SERVICE_NAME = 'DX Studio — 3D, VR & BIM Design Services'

const STUDIO_SERVICE_DESCRIPTION =
  'DX Studio provides end-to-end 3D visualisation, virtual reality walkthroughs, and BIM coordination services for luxury home builders and residential developers across Australia.'

/** Studio page JSON-LD (Service + BreadcrumbList — Organization lives on the homepage). */
export const buildStudioPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const studioUrl = `${siteUrl}/studio`
  const organizationId = `${siteUrl}/#organization`
  const name = seo?.title?.trim() || STUDIO_METADATA_TITLE
  const description = seo?.description?.trim() || STUDIO_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${studioUrl}#service`,
        name: STUDIO_SERVICE_NAME,
        url: studioUrl,
        description: description || STUDIO_SERVICE_DESCRIPTION,
        provider: { '@id': organizationId },
        areaServed: {
          '@type': 'Country',
          name: 'Australia',
        },
        serviceType: '3D Visualisation, VR Walkthrough, BIM Coordination',
        offers: {
          '@type': 'Offer',
          url: studioUrl,
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
            name: name.includes('|') ? 'DX Studio' : name,
            item: studioUrl,
          },
        ],
      },
    ],
  }
}

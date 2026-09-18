import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  PRESTIGE_METADATA_DESCRIPTION,
  PRESTIGE_METADATA_TITLE,
} from '@/lib/prestige/defaults'

const PRESTIGE_SERVICE_NAME = 'DX Prestige — Luxury Residential Visualisation'

const PRESTIGE_SERVICE_DESCRIPTION =
  "DX Prestige delivers premium 3D rendering and visualisation services for Australia's most discerning residential developers, architects, and custom home builders."

/** Prestige page JSON-LD (Service + BreadcrumbList — Organization lives on the homepage). */
export const buildPrestigePageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const prestigeUrl = `${siteUrl}/prestige`
  const organizationId = `${siteUrl}/#organization`
  const name = seo?.title?.trim() || PRESTIGE_METADATA_TITLE
  const description = seo?.description?.trim() || PRESTIGE_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${prestigeUrl}#service`,
        name: PRESTIGE_SERVICE_NAME,
        url: prestigeUrl,
        description: description || PRESTIGE_SERVICE_DESCRIPTION,
        provider: { '@id': organizationId },
        areaServed: {
          '@type': 'Country',
          name: 'Australia',
        },
        serviceType: 'Luxury Home Visualisation, Architectural 3D Rendering',
        offers: {
          '@type': 'Offer',
          url: prestigeUrl,
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
            name: name.includes('|') ? 'DX Prestige' : name,
            item: prestigeUrl,
          },
        ],
      },
    ],
  }
}

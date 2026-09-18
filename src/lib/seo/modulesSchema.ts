import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  MODULES_METADATA_DESCRIPTION,
  MODULES_METADATA_TITLE,
} from '@/lib/modules/defaults'

const MODULES_SERVICE_NAME = 'DX Living Services — 3D, VR & BIM Modules'

const MODULES_SERVICE_DESCRIPTION =
  'DX Living offers a full suite of immersive design modules including 3D visualisation, VR walkthroughs, BIM coordination, and luxury residential rendering for Australian builders and developers.'

/** Modules page JSON-LD (Service catalog + BreadcrumbList — Organization lives on the homepage). */
export const buildModulesPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const modulesUrl = `${siteUrl}/modules`
  const organizationId = `${siteUrl}/#organization`
  const name = seo?.title?.trim() || MODULES_METADATA_TITLE
  const description = seo?.description?.trim() || MODULES_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${modulesUrl}#service`,
        name: MODULES_SERVICE_NAME,
        url: modulesUrl,
        description: description || MODULES_SERVICE_DESCRIPTION,
        alternateName: name,
        provider: { '@id': organizationId },
        areaServed: {
          '@type': 'Country',
          name: 'Australia',
        },
        serviceType: '3D Visualisation, BIM Coordination, VR Walkthrough',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'DX Living Modules',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'DX Studio' },
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'DX Model' },
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'DX Prestige' },
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'DX Interiors' },
            },
          ],
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
            name: 'Our Services',
            item: modulesUrl,
          },
        ],
      },
    ],
  }
}

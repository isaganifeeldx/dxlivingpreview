import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  APPLY_METADATA_DESCRIPTION,
  APPLY_METADATA_TITLE,
} from '@/lib/apply/defaults'

const APPLY_PAGE_DESCRIPTION =
  'Supplier partnership opportunities in Australia with DX Living. Apply now to join luxury residential projects with leading architects and builders.'

const APPLY_HOWTO_DESCRIPTION =
  'Four-step application process for suppliers seeking to have their products featured inside DX Living immersive 3D and 4D home experiences.'

const APPLY_AUDIENCE_NAME =
  'Flooring, cabinetry and joinery, windows and glazing, landscaping materials, stone and benchtops, kitchen and bathroom appliances, cladding and paint systems, hydronics and HVAC, lighting and electrical, tapware and sanitaryware, smart home automation'

/** Apply page JSON-LD (WebPage, HowTo, BreadcrumbList). */
export const buildApplyPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const applyUrl = `${siteUrl}/apply`
  const suppliersUrl = `${siteUrl}/suppliers`
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const howToId = `${applyUrl}#howto`
  const name = seo?.title?.trim() || APPLY_METADATA_TITLE
  const description = seo?.description?.trim() || APPLY_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${applyUrl}#page`,
        url: applyUrl,
        name,
        description: description || APPLY_PAGE_DESCRIPTION,
        isPartOf: { '@id': websiteId },
        publisher: { '@id': organizationId },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${siteUrl}/og/apply-og.jpg`,
          width: 1200,
          height: 630,
        },
        audience: {
          '@type': 'BusinessAudience',
          audienceType: 'Building material suppliers and manufacturers',
          name: APPLY_AUDIENCE_NAME,
        },
        mainEntity: { '@id': howToId },
      },
      {
        '@type': 'HowTo',
        '@id': howToId,
        name: 'How to Apply to the DX Living Supplier Network',
        description: APPLY_HOWTO_DESCRIPTION,
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Application',
            text: 'Suppliers submit their application with product details, certifications, and portfolio.',
            url: applyUrl,
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Review',
            text: 'DX Living reviews each application to ensure alignment with premium standards and project requirements. Response within 1-2 business days.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Product Integration',
            text: 'Approved products are digitised and integrated into the DX Living immersive 3D and 4D platform.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Partnership Launch',
            text: 'Suppliers join the DX Living network, gain visibility in luxury projects, and benefit from early client engagement, project specifications, and direct sales opportunities.',
          },
        ],
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
            name: 'Suppliers',
            item: suppliersUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Apply',
            item: applyUrl,
          },
        ],
      },
    ],
  }
}

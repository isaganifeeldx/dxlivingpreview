import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  MODEL_METADATA_DESCRIPTION,
  MODEL_METADATA_TITLE,
} from '@/lib/model/defaults'

const MODEL_SERVICE_NAME = 'DX Model — 4D VR Home Walkthroughs'

const MODEL_SERVICE_DESCRIPTION =
  'Explore your future home before it is built with DX Model. Interactive 4D virtual reality walkthroughs with VR headset compatibility — swap materials, adjust lighting, and tour every space in immersive detail.'

/** Model page JSON-LD (Service + BreadcrumbList — Organization lives on the homepage). */
export const buildModelPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const modelUrl = `${siteUrl}/model`
  const organizationId = `${siteUrl}/#organization`
  const name = seo?.title?.trim() || MODEL_METADATA_TITLE
  const description = seo?.description?.trim() || MODEL_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${modelUrl}#service`,
        name: MODEL_SERVICE_NAME,
        url: modelUrl,
        description: description || MODEL_SERVICE_DESCRIPTION,
        provider: { '@id': organizationId },
        areaServed: {
          '@type': 'Country',
          name: 'Australia',
        },
        serviceType:
          '4D VR Walkthrough, Virtual Reality Home Tour, Interactive Home Design',
        offers: {
          '@type': 'Offer',
          url: modelUrl,
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
            name: name.includes('|') ? 'DX Model' : name,
            item: modelUrl,
          },
        ],
      },
    ],
  }
}

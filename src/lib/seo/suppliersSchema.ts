import { getSiteUrl } from '@/lib/siteUrl'
import type { SeoData } from '@/lib/seo/types'
import {
  SUPPLIERS_METADATA_DESCRIPTION,
  SUPPLIERS_METADATA_TITLE,
} from '@/lib/suppliers/defaults'

const SUPPLIERS_PAGE_DESCRIPTION =
  'Partner with DX Living to feature your products in premier Australian homes, integrated into immersive 3D, 4D and BIM visual tours.'

const SUPPLIERS_HOWTO_DESCRIPTION =
  'The six-step process for building material and product suppliers to join the DX Living partner network, from application through to integration in 3D and 4D project deliverables.'

/** Suppliers page JSON-LD (WebPage, HowTo, OfferCatalog tiers, BreadcrumbList). */
export const buildSuppliersPageJsonLd = (
  seo?: Pick<SeoData, 'title' | 'description'>,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl()
  const suppliersUrl = `${siteUrl}/suppliers`
  const organizationId = `${siteUrl}/#organization`
  const websiteId = `${siteUrl}/#website`
  const howToId = `${suppliersUrl}#howto`
  const name = seo?.title?.trim() || SUPPLIERS_METADATA_TITLE
  const description = seo?.description?.trim() || SUPPLIERS_METADATA_DESCRIPTION

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${suppliersUrl}#page`,
        url: suppliersUrl,
        name,
        description: description || SUPPLIERS_PAGE_DESCRIPTION,
        isPartOf: { '@id': websiteId },
        publisher: { '@id': organizationId },
        mainEntity: { '@id': howToId },
      },
      {
        '@type': 'HowTo',
        '@id': howToId,
        name: 'How to Become a DX Living Supplier Partner',
        description: SUPPLIERS_HOWTO_DESCRIPTION,
        totalTime: 'P4W',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Partner with DX Living',
            text: 'Register your company and product portfolio through the official supplier application.',
            url: `${siteUrl}/apply`,
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Evaluation and Onboarding',
            text: "Each potential supplier undergoes a rigorous evaluation to ensure they meet DX Living's standards of design excellence and quality.",
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Material Specs and Sample Submission',
            text: 'Provide precise material specifications and curated samples for comprehensive review and approval.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Integration into Render and Model Environment',
            text: 'Approved materials are integrated into DX Living 3D and 4D models, delivering precise, photorealistic visualisation.',
          },
          {
            '@type': 'HowToStep',
            position: 5,
            name: 'Showcasing in VR and CGI Deliverables',
            text: 'Your products are presented through hyper-realistic CGI and immersive VR walkthroughs delivered to clients.',
          },
          {
            '@type': 'HowToStep',
            position: 6,
            name: 'Final Handover and Case Study Inclusion',
            text: 'Finalised projects credit participating suppliers, recognising their role in delivering each design vision.',
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        '@id': `${suppliersUrl}#tiers`,
        name: 'DX Living Supplier Tiers',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Basic Tier',
              description:
                'Showcase up to 5 material finishes as realistic textures. Users can drag and drop supplied finishes into their designs within DX Interiors and DX Model Lite.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Premium Tier',
              description:
                'One 3D/4D product included at no extra cost, fully integrated across DX Model and DX Model Lite, with options to expand your product collection.',
            },
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
            name: name.includes('|') ? 'Suppliers' : name,
            item: suppliersUrl,
          },
        ],
      },
    ],
  }
}

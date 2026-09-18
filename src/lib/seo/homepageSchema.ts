import { getSiteUrl } from '@/lib/siteUrl';
import type { SocialLinks } from '@/lib/socialLinks';
import { DEFAULT_SOCIAL_LINKS } from '@/lib/socialLinks';

/** Keep in sync with the homepage FAQ preview slice (UI only — FAQ schema lives on /faq). */
export const HOMEPAGE_FAQ_SCHEMA_LIMIT = 10;

/** Live Rank Math meta title (dxliving.com homepage). */
export const HOMEPAGE_METADATA_TITLE =
  'Luxury Home Design Australia | 3D, VR & BIM by DX Living';

/** Live Rank Math meta description (dxliving.com homepage). */
export const HOMEPAGE_METADATA_DESCRIPTION =
  "Experience luxury home design in Australia with DX Living. Use immersive 3D, VR and BIM to explore and plan your home before it's built.";

/** Live Rank Math focus keyword (dxliving.com homepage). */
export const HOMEPAGE_FOCUS_KEYWORD = 'luxury home design Australia';

const GOOGLE_BUSINESS_PROFILE_URL = 'https://share.google/Jo51bR6fVvrTn4ykm';
const GOOGLE_MAPS_PLACE_URL = 'https://maps.app.goo.gl/2fhPcL9gbXszsjfh8';

const socialSameAs = (links: SocialLinks) =>
  [
    links.facebook,
    links.linkedIn,
    links.instagram,
    links.youtube,
    GOOGLE_BUSINESS_PROFILE_URL,
    GOOGLE_MAPS_PLACE_URL,
  ].filter(Boolean);

export interface HomepageSchemaInput {
  socialLinks?: SocialLinks;
}

/**
 * Homepage JSON-LD: single @graph (Organization/LocalBusiness, FeelDX parent, WebSite, WebPage).
 * DX Living uses multi-type Organization + LocalBusiness on one @id so AI/local signals
 * stay on the homepage without a second competing Organization node.
 */
export const buildHomepageJsonLd = ({
  socialLinks = DEFAULT_SOCIAL_LINKS,
}: HomepageSchemaInput = {}): Record<string, unknown> => {
  const siteUrl = getSiteUrl();
  const homeUrl = `${siteUrl}/`;
  const organizationId = `${siteUrl}/#organization`;
  const logoId = `${siteUrl}/#logo`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${siteUrl}/#webpage`;
  const modulesId = `${siteUrl}/#modules`;
  const feeldxOrganizationId = 'https://feeldx.com.au/#organization';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        // Multi-type: keeps the entity brief (one #organization) and restores
        // LocalBusiness for homepage AI/local visibility scoring.
        '@type': ['Organization', 'LocalBusiness'],
        '@id': organizationId,
        name: 'DX Living',
        alternateName: 'DX Living Australia',
        url: homeUrl,
        description:
          'DX Living is an Australian project control specialist firm that combines project planning with immersive visualisation to de-risk high-end residential projects before construction begins. It converts drawings and BIM data into 3D, 4D, interactive and VR environments so developers, architects, custom builders, suppliers and homeowners can review layout, sequencing and real supplier finishes before committing.',
        disambiguatingDescription:
          'DX Living is the high-end residential division of FeelDX, based in Scoresby, Victoria, operating across Australia. It is a project control and visualisation specialist. It is not an architecture practice, a project management firm, a builder or contractor, or an interior design studio, and it is not affiliated with any similarly named architecture or design business.',
        logo: {
          '@type': 'ImageObject',
          '@id': logoId,
          url: `${siteUrl}/dxlogo.svg`,
          caption: 'DX Living',
        },
        image: { '@id': logoId },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '44 Lakeview Drive',
          addressLocality: 'Scoresby',
          addressRegion: 'VIC',
          postalCode: '3179',
          addressCountry: 'AU',
        },
        telephone: '+61-1800-333-539',
        email: 'contact@dxliving.com',
        areaServed: { '@type': 'Country', name: 'Australia' },
        parentOrganization: { '@id': feeldxOrganizationId },
        knowsAbout: [
          'Project control for residential construction',
          'Programme of works and 4D construction sequencing',
          'Plan-versus-actual progress tracking',
          'BIM 3D, 4D and 5D coordination',
          'Pre-construction visualisation',
          'Interactive and VR walkthroughs of unbuilt homes',
          'Real supplier material and finish visualisation',
          'Off-the-plan sales and display suite presentation tools',
        ],
        sameAs: socialSameAs(socialLinks),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          '@id': modulesId,
          name: 'DX Living modules',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                '@id': `${siteUrl}/studio#service`,
                name: 'DX Studio',
                url: `${siteUrl}/studio`,
                serviceType: 'Pre-construction planning and visualisation',
                description:
                  'Converts drawings and BIM data into immersive 3D and 4D environments showing scale, flow, design intent and construction sequencing.',
                provider: { '@id': organizationId },
                areaServed: { '@type': 'Country', name: 'Australia' },
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                '@id': `${siteUrl}/interiors#service`,
                name: 'DX Interiors',
                url: `${siteUrl}/interiors`,
                serviceType: 'Material and finish visualisation',
                description:
                  'Real tiles, stone, cabinetry, lighting and appliances shown at full scale inside the model, with real-time swapping and side-by-side comparison so selections are locked once rather than revisited on site.',
                provider: { '@id': organizationId },
                areaServed: { '@type': 'Country', name: 'Australia' },
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                '@id': `${siteUrl}/model#service`,
                name: 'DX Models',
                url: `${siteUrl}/model`,
                serviceType: 'Interactive presentation and sales visualisation',
                description:
                  'Interactive module for off-the-plan sales, display suites, buyer walkthroughs and configuration experiences, with VR-compatible navigation.',
                provider: { '@id': organizationId },
                areaServed: { '@type': 'Country', name: 'Australia' },
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                '@id': `${siteUrl}/prestige#service`,
                name: 'DX Prestige',
                url: `${siteUrl}/prestige`,
                serviceType: 'Integrated project control and visualisation programme',
                description:
                  'The unified top tier combining DX Studio, DX Interiors and DX Models into one coordinated workflow for complex, high-value residential projects.',
                provider: { '@id': organizationId },
                areaServed: { '@type': 'Country', name: 'Australia' },
              },
            },
          ],
        },
      },
      {
        '@type': 'Organization',
        '@id': feeldxOrganizationId,
        name: 'FeelDX',
        url: 'https://feeldx.com.au/',
        description:
          'FeelDX is the Australian parent company of DX Living. DX Living is its high-end residential division.',
        subOrganization: { '@id': organizationId },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: homeUrl,
        name: 'DX Living',
        inLanguage: 'en-AU',
        publisher: { '@id': organizationId },
        about: { '@id': organizationId },
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: homeUrl,
        name: 'DX Living | Project Control and Immersive Visualisation for Australian Homes',
        isPartOf: { '@id': websiteId },
        about: { '@id': organizationId },
        primaryImageOfPage: { '@id': logoId },
        inLanguage: 'en-AU',
      },
    ],
  };
};

import { getSiteUrl } from '@/lib/siteUrl';

/** 251 Station Street project JSON-LD. */
export const build251StationProjectJsonLd = (): Record<string, unknown> => {
  const siteUrl = getSiteUrl();
  const homeUrl = `${siteUrl}/`;
  const projectsUrl = `${siteUrl}/projects`;
  const projectUrl = `${siteUrl}/projects/251-station-st`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${projectUrl}#webpage`;
  const projectId = `${projectUrl}#project`;
  const breadcrumbId = `${projectUrl}#breadcrumb`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'DX Living',
        url: homeUrl,
        email: 'contact@dxliving.com',
        telephone: '+61 1800 333 539',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '44 Lakeview Drive',
          addressLocality: 'Scoresby',
          addressRegion: 'VIC',
          postalCode: '3179',
          addressCountry: 'AU',
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: homeUrl,
        name: 'DX Living',
        publisher: { '@id': organizationId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: projectUrl,
        name: '251 Station Street | DX Living Project',
        description:
          'Explore 251 Station Street in Edithvale, Victoria, a DX Living project featuring 4D sequencing and VR flythrough.',
        isPartOf: { '@id': websiteId },
        about: { '@id': projectId },
        mainEntity: { '@id': projectId },
        breadcrumb: { '@id': breadcrumbId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'CreativeWork',
        '@id': projectId,
        name: '251 Station Street',
        url: projectUrl,
        description:
          'A DX Living residential project in Edithvale, Victoria, featuring 4D sequencing and VR flythrough, with a stated timeframe of three months.',
        creator: { '@id': organizationId },
        publisher: { '@id': organizationId },
        locationCreated: {
          '@type': 'Place',
          name: 'Edithvale, VIC 3196',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '251 Station Street',
            addressLocality: 'Edithvale',
            addressRegion: 'VIC',
            postalCode: '3196',
            addressCountry: 'AU',
          },
        },
        about: [
          { '@type': 'Thing', name: '4D sequencing' },
          { '@type': 'Thing', name: 'VR flythrough' },
        ],
        keywords: '4D sequencing, VR flythrough',
        inLanguage: 'en-AU',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: projectsUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '251 Station Street',
            item: projectUrl,
          },
        ],
      },
    ],
  };
};

/** 20 Head Street project JSON-LD. */
export const build20HeadStreetProjectJsonLd = (): Record<string, unknown> => {
  const siteUrl = getSiteUrl();
  const homeUrl = `${siteUrl}/`;
  const projectsUrl = `${siteUrl}/projects`;
  const projectUrl = `${siteUrl}/projects/20-head-street`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${projectUrl}#webpage`;
  const projectId = `${projectUrl}#project`;
  const breadcrumbId = `${projectUrl}#breadcrumb`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'DX Living',
        url: homeUrl,
        email: 'contact@dxliving.com',
        telephone: '+61 1800 333 539',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '44 Lakeview Drive',
          addressLocality: 'Scoresby',
          addressRegion: 'VIC',
          postalCode: '3179',
          addressCountry: 'AU',
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: homeUrl,
        name: 'DX Living',
        publisher: { '@id': organizationId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: projectUrl,
        name: '20 Head Street Residential | DX Living Project',
        description:
          'Explore the 20 Head Street project by DX Living, featuring immersive visualisation, modern architecture and luxury residential design.',
        isPartOf: { '@id': websiteId },
        about: { '@id': projectId },
        mainEntity: { '@id': projectId },
        breadcrumb: { '@id': breadcrumbId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'CreativeWork',
        '@id': projectId,
        name: '20 Head Street',
        url: projectUrl,
        description:
          '20 Head Street demonstrates contemporary refinement through precise geometry, organic materials and oversized window systems that connect the residence with its natural setting. The stated project timeframe is 10 days.',
        creator: { '@id': organizationId },
        publisher: { '@id': organizationId },
        locationCreated: {
          '@type': 'Place',
          name: 'Brighton, VIC',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '20 Head Street',
            addressLocality: 'Brighton',
            addressRegion: 'VIC',
            addressCountry: 'AU',
          },
        },
        about: [
          { '@type': 'Thing', name: '2D SMP' },
          { '@type': 'Thing', name: '3D rendering' },
          { '@type': 'Thing', name: 'Flythrough' },
        ],
        keywords: '2D SMP, 3D rendering, flythrough',
        inLanguage: 'en-AU',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: projectsUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '20 Head Street',
            item: projectUrl,
          },
        ],
      },
    ],
  };
};

/** 85 Commodore Drive project JSON-LD. */
export const build85CommodoreDriveProjectJsonLd = (): Record<string, unknown> => {
  const siteUrl = getSiteUrl();
  const homeUrl = `${siteUrl}/`;
  const projectsUrl = `${siteUrl}/projects`;
  const projectUrl = `${siteUrl}/projects/85-commodore-drive`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${projectUrl}#webpage`;
  const projectId = `${projectUrl}#project`;
  const breadcrumbId = `${projectUrl}#breadcrumb`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'DX Living',
        url: homeUrl,
        email: 'contact@dxliving.com',
        telephone: '+61 1800 333 539',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '44 Lakeview Drive',
          addressLocality: 'Scoresby',
          addressRegion: 'VIC',
          postalCode: '3179',
          addressCountry: 'AU',
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: homeUrl,
        name: 'DX Living',
        publisher: { '@id': organizationId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: projectUrl,
        name: '85 Commodore Drive | DX Living Project',
        description:
          'Explore 85 Commodore Drive in Surfers Paradise, Queensland, a DX Living project featuring 2D SMP, 3D rendering and flythrough.',
        isPartOf: { '@id': websiteId },
        about: { '@id': projectId },
        mainEntity: { '@id': projectId },
        breadcrumb: { '@id': breadcrumbId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'CreativeWork',
        '@id': projectId,
        name: '85 Commodore Drive',
        url: projectUrl,
        description:
          'A DX Living residential project in Surfers Paradise, Queensland, featuring 2D SMP, 3D rendering and flythrough, with a stated timeframe of one month.',
        creator: { '@id': organizationId },
        publisher: { '@id': organizationId },
        locationCreated: {
          '@type': 'Place',
          name: 'Surfers Paradise, QLD',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '85 Commodore Drive',
            addressLocality: 'Surfers Paradise',
            addressRegion: 'QLD',
            addressCountry: 'AU',
          },
        },
        about: [
          { '@type': 'Thing', name: '2D SMP' },
          { '@type': 'Thing', name: '3D rendering' },
          { '@type': 'Thing', name: 'Flythrough' },
        ],
        keywords: '2D SMP, 3D rendering, flythrough',
        inLanguage: 'en-AU',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: projectsUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '85 Commodore Drive',
            item: projectUrl,
          },
        ],
      },
    ],
  };
};

/** 813 Clarendon Street project JSON-LD. */
export const build813ClarendonStreetProjectJsonLd = (): Record<string, unknown> => {
  const siteUrl = getSiteUrl();
  const homeUrl = `${siteUrl}/`;
  const projectsUrl = `${siteUrl}/projects`;
  const projectUrl = `${siteUrl}/projects/813-clarendon-street`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${projectUrl}#webpage`;
  const projectId = `${projectUrl}#project`;
  const breadcrumbId = `${projectUrl}#breadcrumb`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'DX Living',
        url: homeUrl,
        email: 'contact@dxliving.com',
        telephone: '+61 1800 333 539',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '44 Lakeview Drive',
          addressLocality: 'Scoresby',
          addressRegion: 'VIC',
          postalCode: '3179',
          addressCountry: 'AU',
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: homeUrl,
        name: 'DX Living',
        publisher: { '@id': organizationId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: projectUrl,
        name: '813 Clarendon Street Residential | DX Living Project',
        description:
          'Explore the 813 Clarendon Street project by DX Living, featuring immersive visualisation, contemporary architecture and luxury residential design.',
        isPartOf: { '@id': websiteId },
        about: { '@id': projectId },
        mainEntity: { '@id': projectId },
        breadcrumb: { '@id': breadcrumbId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'CreativeWork',
        '@id': projectId,
        name: '813 Clarendon Street',
        url: projectUrl,
        description:
          'A DX Living residential project in South Melbourne, Victoria, featuring 2D SMP, 3D rendering, flythrough, 4D methodology and 4D interactive technology, with a stated timeframe of one month.',
        creator: { '@id': organizationId },
        publisher: { '@id': organizationId },
        locationCreated: {
          '@type': 'Place',
          name: 'South Melbourne, VIC',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '813 Clarendon Street',
            addressLocality: 'South Melbourne',
            addressRegion: 'VIC',
            addressCountry: 'AU',
          },
        },
        about: [
          { '@type': 'Thing', name: '2D SMP' },
          { '@type': 'Thing', name: '3D rendering' },
          { '@type': 'Thing', name: 'Flythrough' },
          { '@type': 'Thing', name: '4D methodology' },
          { '@type': 'Thing', name: '4D interactive' },
        ],
        keywords: '2D SMP, 3D rendering, flythrough, 4D methodology, 4D interactive',
        inLanguage: 'en-AU',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: projectsUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '813 Clarendon Street',
            item: projectUrl,
          },
        ],
      },
    ],
  };
};

/** 31 McIlwain Drive project JSON-LD. */
export const build31McIlwainDriveProjectJsonLd = (): Record<string, unknown> => {
  const siteUrl = getSiteUrl();
  const homeUrl = `${siteUrl}/`;
  const projectsUrl = `${siteUrl}/projects`;
  const projectUrl = `${siteUrl}/projects/31-mcilwain-drive`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${projectUrl}#webpage`;
  const projectId = `${projectUrl}#project`;
  const breadcrumbId = `${projectUrl}#breadcrumb`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'DX Living',
        url: homeUrl,
        email: 'contact@dxliving.com',
        telephone: '+61 1800 333 539',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '44 Lakeview Drive',
          addressLocality: 'Scoresby',
          addressRegion: 'VIC',
          postalCode: '3179',
          addressCountry: 'AU',
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: homeUrl,
        name: 'DX Living',
        publisher: { '@id': organizationId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: projectUrl,
        name: '31 McIlwain Drive Residential | DX Living Project',
        description:
          'Explore 31 McIlwain Drive in Mermaid Waters, a DX Living residential project shaped by waterfront views, architectural massing and textural richness.',
        isPartOf: { '@id': websiteId },
        about: { '@id': projectId },
        mainEntity: { '@id': projectId },
        breadcrumb: { '@id': breadcrumbId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'CreativeWork',
        '@id': projectId,
        name: '31 McIlwain Drive',
        url: projectUrl,
        description:
          '31 McIlwain Drive occupies a waterfront position in Mermaid Waters, combining architectural massing, textural richness and expansive proportions in a contemporary residential design. The stated project timeframe is one month.',
        creator: { '@id': organizationId },
        publisher: { '@id': organizationId },
        locationCreated: {
          '@type': 'Place',
          name: 'Mermaid Waters, QLD',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '31 McIlwain Drive',
            addressLocality: 'Mermaid Waters',
            addressRegion: 'QLD',
            addressCountry: 'AU',
          },
        },
        about: [
          { '@type': 'Thing', name: '2D SMP' },
          { '@type': 'Thing', name: '3D rendering' },
          { '@type': 'Thing', name: 'Flythrough' },
        ],
        keywords: '2D SMP, 3D rendering, flythrough',
        inLanguage: 'en-AU',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: projectsUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: '31 McIlwain Drive',
            item: projectUrl,
          },
        ],
      },
    ],
  };
};

/** Nagambie Project JSON-LD. */
export const buildNagambieProjectJsonLd = (): Record<string, unknown> => {
  const siteUrl = getSiteUrl();
  const homeUrl = `${siteUrl}/`;
  const projectsUrl = `${siteUrl}/projects`;
  const projectUrl = `${siteUrl}/projects/nagambie-project`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const webpageId = `${projectUrl}#webpage`;
  const projectId = `${projectUrl}#project`;
  const breadcrumbId = `${projectUrl}#breadcrumb`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'DX Living',
        url: homeUrl,
        email: 'contact@dxliving.com',
        telephone: '+61 1800 333 539',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '44 Lakeview Drive',
          addressLocality: 'Scoresby',
          addressRegion: 'VIC',
          postalCode: '3179',
          addressCountry: 'AU',
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: homeUrl,
        name: 'DX Living',
        publisher: { '@id': organizationId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        url: projectUrl,
        name: 'Nagambie Home Design | DX Living Project',
        description:
          'Explore the Nagambie home design project by DX Living, a luxury residential concept combining immersive visualisation and modern architecture.',
        isPartOf: { '@id': websiteId },
        about: { '@id': projectId },
        mainEntity: { '@id': projectId },
        breadcrumb: { '@id': breadcrumbId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'CreativeWork',
        '@id': projectId,
        name: 'Nagambie Project',
        url: projectUrl,
        description:
          'The Nagambie Project combines elemental forms, technical precision, oxidised metallic cladding and expansive glazing to connect the residence with its landscape. The stated project timeframe is one month.',
        creator: { '@id': organizationId },
        publisher: { '@id': organizationId },
        locationCreated: {
          '@type': 'Place',
          name: 'Nagambie, VIC',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Nagambie',
            addressRegion: 'VIC',
            addressCountry: 'AU',
          },
        },
        about: [
          { '@type': 'Thing', name: '2D SMP' },
          { '@type': 'Thing', name: '3D rendering' },
          { '@type': 'Thing', name: 'Flythrough' },
        ],
        keywords: '2D SMP, 3D rendering, flythrough',
        inLanguage: 'en-AU',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Projects',
            item: projectsUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Nagambie Project',
            item: projectUrl,
          },
        ],
      },
    ],
  };
};

/** Returns project-detail JSON-LD for a known slug, or null when none is defined. */
export const buildProjectDetailJsonLd = (
  slug: string,
): Record<string, unknown> | null => {
  switch (slug) {
    case '251-station-st':
      return build251StationProjectJsonLd();
    case '20-head-street':
      return build20HeadStreetProjectJsonLd();
    case '85-commodore-drive':
    case '85-commodore-drive-surfers-paradise':
      return build85CommodoreDriveProjectJsonLd();
    case '813-clarendon-street':
      return build813ClarendonStreetProjectJsonLd();
    case '31-mcilwain-drive':
      return build31McIlwainDriveProjectJsonLd();
    case 'nagambie-project':
      return buildNagambieProjectJsonLd();
    default:
      return null;
  }
};

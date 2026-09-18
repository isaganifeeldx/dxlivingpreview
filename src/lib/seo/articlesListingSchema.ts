import type { ArticleData } from '@/data/articles';
import { sortArticlesByDate } from '@/data/articles';
import { getSiteUrl } from '@/lib/siteUrl';

const ARTICLES_PAGE_NAME = 'Articles Modern Architecture Insights | DX Living';

const ARTICLES_PAGE_DESCRIPTION =
  'Explore modern architecture insights from DX Living. Expert articles on luxury design, sustainability, and contemporary homes for Australian families';

const toAbsoluteUrl = (pathOrUrl: string, siteUrl: string) => {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  return `${siteUrl}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
};

/** Articles listing JSON-LD (CollectionPage + ItemList + BreadcrumbList). */
export const buildArticlesListingJsonLd = (
  articles: ArticleData[],
  seo?: { name?: string; description?: string },
): Record<string, unknown> => {
  const siteUrl = getSiteUrl();
  const articlesUrl = `${siteUrl}/articles`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const listId = `${articlesUrl}#list`;
  const sorted = sortArticlesByDate(articles);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${articlesUrl}#page`,
        url: articlesUrl,
        name: seo?.name?.trim() || ARTICLES_PAGE_NAME,
        description: seo?.description?.trim() || ARTICLES_PAGE_DESCRIPTION,
        isPartOf: { '@id': websiteId },
        publisher: { '@id': organizationId },
        mainEntity: { '@id': listId },
        inLanguage: 'en-AU',
      },
      {
        '@type': 'ItemList',
        '@id': listId,
        name: 'DX Living Articles',
        numberOfItems: sorted.length,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: sorted.map((article, index) => {
          const articleUrl = toAbsoluteUrl(article.link, siteUrl);

          return {
            '@type': 'ListItem',
            position: index + 1,
            url: articleUrl,
            name: article.title,
            item: {
              '@type': 'Article',
              '@id': articleUrl,
              headline: article.title,
              url: articleUrl,
              datePublished: article.datePublished.slice(0, 10),
              description: article.seoDescription.trim() || undefined,
            },
          };
        }),
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
            name: 'Articles',
            item: articlesUrl,
          },
        ],
      },
    ],
  };
};

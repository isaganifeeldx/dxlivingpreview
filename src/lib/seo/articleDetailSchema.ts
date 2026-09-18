import type { ArticleData } from '@/data/articles';
import { getSiteUrl } from '@/lib/siteUrl';

const defaultDescription =
  'Explore luxury living news on design trends, smart innovations, and market moves. Our luxury living news guides better choices for your home or investment.';

const toAbsoluteUrl = (pathOrUrl: string, siteUrl: string) => {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  return `${siteUrl}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
};

const toIsoDate = (value: string | undefined, fallback: string) => {
  const candidate = (value ?? '').trim() || fallback.trim();
  return candidate.slice(0, 10);
};

/** Article + BreadcrumbList JSON-LD for `/articles/[slug]`. */
export const buildArticleJsonLd = (
  article: ArticleData,
): Record<string, unknown> => {
  const siteUrl = getSiteUrl();
  const articleUrl = toAbsoluteUrl(
    article.link.startsWith('/') ? article.link : `/articles/${article.link}`,
    siteUrl,
  );
  const imageUrl = toAbsoluteUrl(article.featuredImage, siteUrl);
  const description = article.seoDescription.trim() || defaultDescription;
  const datePublished = toIsoDate(article.datePublished, '');
  const dateModified = toIsoDate(article.dateModified, datePublished);
  const organizationId = `${siteUrl}/#organization`;

  const articleSchema = {
    '@type': 'Article',
    headline: article.title,
    description,
    image: imageUrl,
    datePublished,
    dateModified,
    author: { '@id': organizationId },
    publisher: { '@id': organizationId },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: `${siteUrl}/articles`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [articleSchema, breadcrumbSchema],
  };
};

/** Extract article slug from public or internal article detail paths. */
export const getArticleSlugFromPathname = (pathname: string): string | null => {
  const match = pathname.match(/^\/(?:pages\/)?articles\/([^/]+)\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

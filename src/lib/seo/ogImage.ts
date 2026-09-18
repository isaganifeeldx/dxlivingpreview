import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/siteUrl';

export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;
export const DEFAULT_OG_IMAGE_TYPE = 'image/jpeg';

/** Default share image (home + pages without a dedicated asset). */
export const DEFAULT_OG_IMAGE_PATH = '/og/og.jpg';

export const PAGE_OG_IMAGES = {
  default: DEFAULT_OG_IMAGE_PATH,
  home: '/og/og.jpg',
  about: '/og/about-og.jpg',
  apply: '/og/apply-og.jpg',
  articles: '/og/article-og.jpg',
  contact: '/og/contact-og.jpg',
  interiors: '/og/interior-og.jpg',
  model: '/og/model-og.jpg',
  modules: '/og/module-og.jpg',
  prestige: '/og/prestige-og.jpg',
  projects: '/og/projects-og.jpg',
  studio: '/og/studio-og.jpg',
  suppliers: '/og/supplier-og.jpg',
} as const;

export type PageOgKey = keyof typeof PAGE_OG_IMAGES;

/** Project detail share images keyed by project slug. */
export const PROJECT_OG_IMAGES: Record<string, string> = {
  '251-station-st': '/og/251-station-og.jpg',
  '20-head-street': '/og/20-head-og.jpg',
  '85-commodore-drive': '/og/85-commodore-og.jpg',
  '85-commodore-drive-surfers-paradise': '/og/85-commodore-og.jpg',
  '813-clarendon-street': '/og/813-claredon-og.jpg',
  '31-mcilwain-drive': '/og/31-mcilwain-og.jpg',
  'nagambie-project': '/og/nagambie-og.jpg',
};

const toAbsoluteUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
};

export const getOgImageUrl = (path: string = DEFAULT_OG_IMAGE_PATH) => toAbsoluteUrl(path);

export const getOgImages = (
  pathOrKey: string | PageOgKey = 'default',
): NonNullable<Metadata['openGraph']>['images'] => {
  const path =
    pathOrKey in PAGE_OG_IMAGES
      ? PAGE_OG_IMAGES[pathOrKey as PageOgKey]
      : pathOrKey;

  return [
    {
      url: getOgImageUrl(path),
      width: DEFAULT_OG_IMAGE_WIDTH,
      height: DEFAULT_OG_IMAGE_HEIGHT,
      type: DEFAULT_OG_IMAGE_TYPE,
    },
  ];
};

export const getTwitterImages = (pathOrKey: string | PageOgKey = 'default') => {
  const path =
    pathOrKey in PAGE_OG_IMAGES
      ? PAGE_OG_IMAGES[pathOrKey as PageOgKey]
      : pathOrKey;

  return [getOgImageUrl(path)];
};

export const getDefaultOgImageUrl = () => getOgImageUrl(DEFAULT_OG_IMAGE_PATH);
export const getDefaultOgImages = () => getOgImages('default');
export const getDefaultTwitterImages = () => getTwitterImages('default');

export const getProjectOgPath = (slug: string) =>
  PROJECT_OG_IMAGES[slug] ?? DEFAULT_OG_IMAGE_PATH;

export const getProjectOgImages = (slug: string) => getOgImages(getProjectOgPath(slug));
export const getProjectTwitterImages = (slug: string) =>
  getTwitterImages(getProjectOgPath(slug));

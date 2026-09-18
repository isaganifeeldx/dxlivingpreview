import { cache } from 'react';
import { buildHomepageJsonLd } from '@/lib/seo/homepageSchema';
import { getHomePageContent } from '@/lib/home/getHomePageContent';
import { DEFAULT_SOCIAL_LINKS } from '@/lib/socialLinks';

export const getHomepageJsonLdScript = cache(async () => {
  try {
    const content = await getHomePageContent();
    return buildHomepageJsonLd({ socialLinks: content.socialLinks });
  } catch {
    return buildHomepageJsonLd({ socialLinks: DEFAULT_SOCIAL_LINKS });
  }
});

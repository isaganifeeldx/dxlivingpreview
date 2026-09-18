import type { Metadata } from 'next';
import HomePageContent from '@/components/pages/home/HomePageContent';
import JsonLdScripts from '@/components/seo/JsonLdScripts';
import { getLatestArticles } from '@/data/articles';
import { getAllArticles } from '@/lib/articles/getArticles';
import { getFaqPageContent } from '@/lib/faq/getFaqPageContent';
import { getHomePageContent } from '@/lib/home/getHomePageContent';
import {
  buildHomepageJsonLd,
  HOMEPAGE_FAQ_SCHEMA_LIMIT,
} from '@/lib/seo/homepageSchema';
import { buildMetadataFromSeo } from '@/lib/seo/buildMetadata';
import { getVimeoThumbnailUrl, HOMEPAGE_VIMEO_ID } from '@/lib/vimeoThumbnail';

/**
 * Soft ISR fallback. Payload Home saves also call revalidatePath('/').
 * Matches reference1 WordPress fetch TTL more closely than 60s.
 */
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomePageContent();

  return buildMetadataFromSeo({
    seo: content.seo,
    path: '/',
    fallbackTitle: content.seo.title,
    fallbackDescription: content.seo.description,
    fallbackImageUrl: content.seo.ogImageUrl ?? '/og/og.jpg',
    siteName: 'DX Living',
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const [content, faqContent, heroPosterUrl] = await Promise.all([
    getHomePageContent(),
    getFaqPageContent(),
    getVimeoThumbnailUrl(HOMEPAGE_VIMEO_ID, 1920),
  ]);

  const homepageFaqs = faqContent.items.slice(0, HOMEPAGE_FAQ_SCHEMA_LIMIT);
  const articles = getLatestArticles(await getAllArticles(), 6);
  const homepageJsonLd = buildHomepageJsonLd({ socialLinks: content.socialLinks });

  return (
    <>
      <JsonLdScripts id="homepage" seo={content.seo} defaultJsonLd={homepageJsonLd} />
      {heroPosterUrl ? (
        <link rel="preload" as="image" href={heroPosterUrl} fetchPriority="high" />
      ) : null}
      <HomePageContent
        content={{
          ...content,
          heroPosterUrl,
          faqItems: homepageFaqs,
          articles,
        }}
      />
    </>
  );
}

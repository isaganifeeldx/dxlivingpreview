import type { Metadata } from 'next';
import { getSiteUrl, isSearchIndexingEnabled } from '@/lib/siteUrl';

const siteUrl = getSiteUrl();
const allowIndexing = isSearchIndexingEnabled();

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DX Living',
    template: '%s | DX Living',
  },
  description:
    'DX Living — premium building design and supplier partnerships in Australia.',
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  ...(allowIndexing
    ? {
        alternates: {
          types: {
            'text/plain': `${siteUrl}/llms.txt`,
          },
        },
      }
    : {}),
  openGraph: {
    type: 'website',
    siteName: 'DX Living',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const getSiteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dxliving.com').replace(/\/$/, '');

/**
 * Only the live production host should be crawlable.
 * Staging, localhost, and preview hosts stay noindex.
 *
 * Override with NEXT_PUBLIC_ALLOW_SEARCH_INDEXING=0|1 when needed.
 */
export const isSearchIndexingEnabled = (): boolean => {
  const override = process.env.NEXT_PUBLIC_ALLOW_SEARCH_INDEXING?.trim();
  if (override === '0' || override === 'false') return false;
  if (override === '1' || override === 'true') return true;

  try {
    const host = new URL(getSiteUrl()).hostname.toLowerCase();
    return host === 'dxliving.com' || host === 'www.dxliving.com';
  } catch {
    return false;
  }
};

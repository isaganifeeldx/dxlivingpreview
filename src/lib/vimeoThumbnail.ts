const thumbnailCache = new Map<string, string>();
const inflightRequests = new Map<string, Promise<string | null>>();

type VimeoOEmbedResponse = {
  thumbnail_url?: string;
};

/** Homepage hero Vimeo id — shared by page + content. */
export const HOMEPAGE_VIMEO_ID = '1211909080';

/**
 * Resolves the custom/upload thumbnail Vimeo serves for a video (oEmbed).
 * Cached in-memory so repeated embeds of the same id do not refetch.
 */
export async function getVimeoThumbnailUrl(
  videoId: string,
  width = 1920,
): Promise<string | null> {
  const normalizedId = videoId.trim();
  if (!normalizedId) return null;

  const cached = thumbnailCache.get(normalizedId);
  if (cached) return cached;

  const inflight = inflightRequests.get(normalizedId);
  if (inflight) return inflight;

  const request = (async () => {
    try {
      const oembedUrl =
        `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${normalizedId}`)}` +
        `&width=${width}`;

      const response = await fetch(oembedUrl, {
        ...(typeof window === 'undefined'
          ? ({ next: { revalidate: 86400 } } as RequestInit)
          : undefined),
      });

      if (!response.ok) return null;

      const data = (await response.json()) as VimeoOEmbedResponse;
      const thumbnailUrl = data.thumbnail_url?.trim();
      if (!thumbnailUrl) return null;

      // Prefer a larger crop when Vimeo returns a sized URL (_640 → _1920).
      const upgraded = thumbnailUrl.replace(/_(\d+)(?=\.\w+(?:\?|$))/, `_${width}`);
      thumbnailCache.set(normalizedId, upgraded);
      return upgraded;
    } catch {
      return null;
    } finally {
      inflightRequests.delete(normalizedId);
    }
  })();

  inflightRequests.set(normalizedId, request);
  return request;
}

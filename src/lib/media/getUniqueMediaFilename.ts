import { getSafeFileName } from 'payload/internal'
import type { PayloadRequest } from 'payload'

/**
 * Prefer `article.webp`, then `article-1.webp`, `article-2.webp`, …
 * based on existing Media documents in the database.
 *
 * Blob orphans from a failed first save are handled with allowOverwrite on upload,
 * not by bumping the number here.
 */
export async function getUniqueMediaFilename({
  desiredFilename,
  req,
}: {
  desiredFilename: string
  req: PayloadRequest
  token?: string
}): Promise<string> {
  return getSafeFileName({
    collectionSlug: 'media',
    desiredFilename,
    req,
  })
}

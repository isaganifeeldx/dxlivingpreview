'use client'

import { createClientUploadHandler, getFileKey } from '@payloadcms/plugin-cloud-storage/client'
import { upload } from '@vercel/blob/client'
import { formatAdminURL } from 'payload/shared'
import { convertImageFileToWebp } from '@/lib/media/convertImageToWebp'

function posixBasename(key: string): string {
  const normalized = key.replace(/^\/+/, '')
  const lastSlash = normalized.lastIndexOf('/')
  return lastSlash === -1 ? normalized : normalized.slice(lastSlash + 1)
}

function incrementFilename(name: string): string {
  const dot = name.lastIndexOf('.')
  const base = dot === -1 ? name : name.slice(0, dot)
  const ext = dot === -1 ? '' : name.slice(dot)
  const match = base.match(/^(.*)-(\d+)$/)
  if (!match) return `${base}-1${ext}`
  return `${match[1]}-${Number(match[2]) + 1}${ext}`
}

/**
 * Numbered filenames when another Media doc already uses the name
 * (`article-1.webp`), converts images to WebP before Blob upload, and
 * overwrites so retrying save after a validation error does not fail.
 */
export const NumberedBlobUploadHandler = createClientUploadHandler({
  handler: async ({
    apiRoute,
    collectionSlug,
    docPrefix,
    extra,
    file,
    prefix,
    serverHandlerPath,
    serverURL,
    updateFilename,
  }) => {
    const useCompositePrefixes = Boolean(extra?.useCompositePrefixes)

    // Convert JPEG/PNG/etc → WebP before upload (filename becomes *.webp).
    const uploadFile = await convertImageFileToWebp(file)

    const uniqueRoute = formatAdminURL({
      apiRoute,
      path: '/media/unique-filename',
      serverURL,
    })

    const uniqueRes = await fetch(uniqueRoute, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: uploadFile.name }),
    })

    if (!uniqueRes.ok) {
      throw new Error('Could not reserve a unique media filename.')
    }

    let uniqueFilename = ((await uniqueRes.json()) as { filename?: string }).filename
    if (!uniqueFilename) {
      throw new Error('Unique filename response was empty.')
    }

    // Ensure reserved name keeps .webp after conversion.
    if (uploadFile.type === 'image/webp' && !uniqueFilename.toLowerCase().endsWith('.webp')) {
      uniqueFilename = `${uniqueFilename.replace(/\.[^.]+$/, '')}.webp`
    }

    updateFilename(uniqueFilename)

    const endpointRoute = formatAdminURL({
      apiRoute,
      path: serverHandlerPath,
      serverURL,
    })

    const uploadOnce = async (filename: string) => {
      const { fileKey: pathname, sanitizedDocPrefix } = getFileKey({
        collectionPrefix: prefix,
        docPrefix,
        filename,
        useCompositePrefixes,
      })

      const result = await upload(pathname, uploadFile, {
        access: 'public',
        clientPayload: collectionSlug,
        contentType: uploadFile.type,
        handleUploadUrl: endpointRoute,
        ...({ allowOverwrite: true } as Record<string, unknown>),
      })

      return { result, sanitizedDocPrefix }
    }

    try {
      const { result, sanitizedDocPrefix } = await uploadOnce(uniqueFilename)
      const pathnameFromBlob = result.pathname.replace(/^\/+/, '')
      updateFilename(decodeURIComponent(posixBasename(pathnameFromBlob)))
      return { prefix: sanitizedDocPrefix }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (!/blob already exists/i.test(message)) {
        throw error
      }

      uniqueFilename = incrementFilename(uniqueFilename)
      updateFilename(uniqueFilename)
      const { result, sanitizedDocPrefix } = await uploadOnce(uniqueFilename)
      const pathnameFromBlob = result.pathname.replace(/^\/+/, '')
      updateFilename(decodeURIComponent(posixBasename(pathnameFromBlob)))
      return { prefix: sanitizedDocPrefix }
    }
  },
})

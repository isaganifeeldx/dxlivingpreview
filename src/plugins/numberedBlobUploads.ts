import { handleUpload } from '@vercel/blob/client'
import { put } from '@vercel/blob'
import { getFileKey, initClientUploads } from '@payloadcms/plugin-cloud-storage/utilities'
import type { CollectionAfterChangeHook, Endpoint, Plugin } from 'payload'
import { APIError, Forbidden } from 'payload'

const OVERWRITE_ROUTE = '/vercel-blob-client-upload-route-overwrite'
const NUMBERED_HANDLER =
  '/components/payload/NumberedBlobUploadHandler#NumberedBlobUploadHandler'

function createOverwriteClientUploadHandler(token: string): Endpoint['handler'] {
  return async (req) => {
    const body = await (req as Request).json()

    try {
      const jsonResponse = await handleUpload({
        body,
        request: req as unknown as Request,
        token,
        onBeforeGenerateToken: async (_pathname, collectionSlug) => {
          if (!collectionSlug) {
            throw new APIError('No payload was provided')
          }
          if (!req.user) {
            throw new Forbidden()
          }
          return {
            addRandomSuffix: false,
            allowOverwrite: true,
            cacheControlMaxAge: 60 * 60 * 24 * 365,
          }
        },
        onUploadCompleted: async () => {},
      })

      return Response.json(jsonResponse)
    } catch (error) {
      req.payload.logger.error(error)
      throw new APIError('storage-vercel-blob client upload route error')
    }
  }
}

function providerPath(provider: unknown): string {
  if (typeof provider === 'string') return provider
  if (provider && typeof provider === 'object' && 'path' in provider) {
    return String((provider as { path: unknown }).path)
  }
  return ''
}

/**
 * Replaces Payload's default Vercel Blob client uploader with numbered filenames
 * + allowOverwrite, and makes server-side put() overwrite on validation retries.
 */
export function numberedBlobUploadsPlugin(token: string): Plugin {
  return (incomingConfig) => {
    if (!token.startsWith('vercel_blob_rw_')) {
      return incomingConfig
    }

    const config = { ...incomingConfig }

    config.admin = { ...config.admin }
    config.admin.components = { ...config.admin.components }
    config.admin.components.providers = (config.admin.components.providers ?? []).filter(
      (provider) => !providerPath(provider).includes('VercelBlobClientUploadHandler'),
    )

    config.endpoints = (config.endpoints ?? []).filter(
      (endpoint) => endpoint.path !== OVERWRITE_ROUTE,
    )

    initClientUploads({
      clientHandler: NUMBERED_HANDLER,
      collections: { media: true },
      config,
      enabled: true,
      extraClientHandlerProps: () => ({
        addRandomSuffix: false,
        useCompositePrefixes: false,
      }),
      serverHandler: createOverwriteClientUploadHandler(token),
      serverHandlerPath: OVERWRITE_ROUTE,
    })

    // Patch stock Blob client route(s) so leftover callers also allow overwrite.
    config.endpoints = (config.endpoints ?? []).map((endpoint) => {
      if (
        typeof endpoint.path === 'string' &&
        endpoint.path.startsWith('/vercel-blob-client-upload-route') &&
        endpoint.path !== OVERWRITE_ROUTE
      ) {
        return {
          ...endpoint,
          handler: createOverwriteClientUploadHandler(token),
        }
      }
      return endpoint
    })

    config.collections = (config.collections ?? []).map((collection) => {
      if (collection.slug !== 'media') return collection

      const ensureBlobOverwrite: CollectionAfterChangeHook = async ({ doc, req }) => {
        const file = req.file
        if (!file || file.clientUploadContext) return doc
        if (!doc.filename || !doc.mimeType) return doc

        const { fileKey } = getFileKey({
          collectionPrefix: '',
          docPrefix: typeof doc.prefix === 'string' ? doc.prefix : '',
          filename: doc.filename,
          useCompositePrefixes: false,
        })

        await put(fileKey, file.data, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
          contentType: doc.mimeType,
          token,
        })

        // Stock cloud-storage afterChange skips put() when this is set.
        file.clientUploadContext = { prefix: doc.prefix ?? '' }
        return doc
      }

      return {
        ...collection,
        hooks: {
          ...collection.hooks,
          afterChange: [ensureBlobOverwrite, ...(collection.hooks?.afterChange ?? [])],
        },
      }
    })

    return config
  }
}

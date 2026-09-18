import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { adminOnlyApiView, authenticated } from '@/access'
import { getUniqueMediaFilename } from '@/lib/media/getUniqueMediaFilename'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    components: {
      views: {
        edit: adminOnlyApiView,
      },
    },
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  endpoints: [
    {
      path: '/unique-filename',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('Unauthorized', 401)
        }

        const body = (await req.json?.()) as { filename?: string } | null
        const filename = body?.filename?.trim()
        if (!filename) {
          throw new APIError('filename is required', 400)
        }

        const unique = await getUniqueMediaFilename({
          desiredFilename: filename,
          req,
        })

        return Response.json({ filename: unique })
      },
    },
  ],
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Server / S3 uploads: convert raster originals to WebP via sharp.
    // Vercel Blob client uploads convert in NumberedBlobUploadHandler first.
    formatOptions: {
      format: 'webp',
      options: {
        quality: 82,
      },
    },
    mimeTypes: [
      'image/*',
      'image/webp',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'image/avif',
    ],
  },
}

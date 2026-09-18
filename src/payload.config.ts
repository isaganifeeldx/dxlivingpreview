import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  EXPERIMENTAL_TableFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Articles } from './collections/Articles'
import { ArticleCategories } from './collections/ArticleCategories'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { About } from './globals/About'
import { Apply } from './globals/Apply'
import { ArticlesPage } from './globals/ArticlesPage'
import { Contact } from './globals/Contact'
import { DxModelInteractive } from './globals/DxModelInteractive'
import { DxModelLiteInteractive } from './globals/DxModelLiteInteractive'
import { Faq } from './globals/Faq'
import { Home } from './globals/Home'
import { Interiors } from './globals/Interiors'
import { Login } from './globals/Login'
import { Model } from './globals/Model'
import { Modules } from './globals/Modules'
import { NotFound } from './globals/NotFound'
import { Prestige } from './globals/Prestige'
import { PrivacyPolicy } from './globals/PrivacyPolicy'
import { ProjectsPage } from './globals/ProjectsPage'
import { Register } from './globals/Register'
import { Settings } from './globals/Settings'
import { StartInteractive } from './globals/StartInteractive'
import { Studio } from './globals/Studio'
import { Suppliers } from './globals/Suppliers'
import { TermsOfService } from './globals/TermsOfService'
import { normalizeDatabaseUri } from './lib/cms/databaseUri'
import { numberedBlobUploadsPlugin } from './plugins/numberedBlobUploads'
import {
  buildS3ClientConfig,
  getMediaStorageMode,
  getS3Acl,
  getS3Bucket,
  getS3PublicUrl,
} from './lib/cms/mediaStorage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const blobToken = (process.env.BLOB_READ_WRITE_TOKEN || '').trim()
const isVercel = process.env.VERCEL === '1'
const mediaStorageMode = getMediaStorageMode()
const useBlob = mediaStorageMode === 'blob'
const useS3 = mediaStorageMode === 's3'
const s3Bucket = getS3Bucket()
const s3PublicUrl = getS3PublicUrl()
const s3Acl = getS3Acl()

function normalizeUrl(url: string): string {
  return url.replace(/\/$/, '')
}

function toAbsoluteUrl(hostOrUrl: string): string {
  if (/^https?:\/\//i.test(hostOrUrl)) return normalizeUrl(hostOrUrl)
  return normalizeUrl(`https://${hostOrUrl}`)
}

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? toAbsoluteUrl(process.env.NEXT_PUBLIC_SITE_URL)
  : ''

const vercelOrigins = [
  process.env.VERCEL_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
]
  .filter((value): value is string => Boolean(value))
  .map(toAbsoluteUrl)

const productionVercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? toAbsoluteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  : ''

const isPreviewDeploy = process.env.VERCEL_ENV === 'preview'

const serverURL =
  configuredSiteUrl ||
  (isPreviewDeploy ? vercelOrigins[0] : productionVercelUrl) ||
  vercelOrigins[0] ||
  ''

const trustedOrigins = [
  ...new Set(
    [serverURL, configuredSiteUrl, ...vercelOrigins]
      .filter(Boolean)
      .flatMap((origin) => {
        try {
          const url = new URL(origin)
          const altHost = url.hostname.startsWith('www.')
            ? url.hostname.slice(4)
            : `www.${url.hostname}`
          return [origin, `${url.protocol}//${altHost}`]
        } catch {
          return [origin]
        }
      }),
  ),
]

export default buildConfig({
  ...(serverURL ? { serverURL } : {}),
  csrf: trustedOrigins,
  cors: trustedOrigins,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— DX Living CMS',
    },
    components: {
      graphics: {
        Logo: '/components/payload/Logo',
        Icon: '/components/payload/Icon',
      },
      // Always in import map — numberedBlobUploadsPlugin swaps this in at runtime
      // when BLOB_READ_WRITE_TOKEN is set (generate:importmap skips it without the token).
      providers: [
        '/components/payload/NumberedBlobUploadHandler#NumberedBlobUploadHandler',
      ],
    },
    suppressHydrationWarning: true,
  },
  collections: [Media, ArticleCategories, Articles, Projects, Users],
  globals: [
    About,
    Apply,
    ArticlesPage,
    Contact,
    DxModelInteractive,
    DxModelLiteInteractive,
    Faq,
    Home,
    Interiors,
    Login,
    Model,
    Modules,
    NotFound,
    Prestige,
    PrivacyPolicy,
    ProjectsPage,
    Register,
    Settings,
    StartInteractive,
    Studio,
    Suppliers,
    TermsOfService,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      EXPERIMENTAL_TableFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    if (process.env.PAYLOAD_MIGRATING === 'true') return

    try {
      const users = await payload.find({
        collection: 'users',
        limit: 50,
        depth: 0,
        overrideAccess: true,
      })

      for (const user of users.docs) {
        const role = (user as { role?: string | null }).role
        if (role === 'admin' || role === 'editor') continue

        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            role: users.totalDocs === 1 ? 'admin' : 'editor',
          },
          overrideAccess: true,
          depth: 0,
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      payload.logger.warn(
        `Skipped users role backfill on init (${message}). Safe to ignore on first schema push.`,
      )
    }
  },
  db: postgresAdapter({
    pool: {
      connectionString: normalizeDatabaseUri(process.env.DATABASE_URI || ''),
      ...(isVercel
        ? {
            max: 3,
            idleTimeoutMillis: 10_000,
            connectionTimeoutMillis:
              process.env.NEXT_PHASE === 'phase-production-build' ? 5_000 : 20_000,
          }
        : {}),
    },
  }),
  plugins: [
    vercelBlobStorage({
      enabled: useBlob,
      collections: {
        media: true,
      },
      token: blobToken,
      // Bypass Vercel serverless 4.5MB body limit for larger images.
      clientUploads: true,
      // Numbered names + overwrite are handled by numberedBlobUploadsPlugin.
      addRandomSuffix: false,
    }),
    // Only patches Blob client uploads when Blob mode is active.
    numberedBlobUploadsPlugin(useBlob ? blobToken : ''),
    s3Storage({
      enabled: useS3,
      bucket: s3Bucket || 'unused',
      collections: {
        media: s3PublicUrl
          ? {
              generateFileURL: ({ filename, prefix }) => {
                const key = [prefix, filename].filter(Boolean).join('/')
                return `${s3PublicUrl}/${key}`
              },
            }
          : true,
      },
      config: buildS3ClientConfig(),
      ...(s3Acl ? { acl: s3Acl } : {}),
      // EC2 has no Vercel body limit — server uploads keep WebP conversion via sharp.
      clientUploads: false,
    }),
  ],
  sharp,
})

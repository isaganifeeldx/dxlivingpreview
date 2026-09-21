/**
 * Media storage selection for Payload uploads.
 *
 * Priority:
 * - Valid BLOB_READ_WRITE_TOKEN → Vercel Blob (local seed + Vercel)
 * - S3_BUCKET set (EC2 / local against AWS) → S3
 * - Otherwise → local disk (dev / single-node EC2 without S3)
 */

export type MediaStorageMode = 'blob' | 's3' | 'local'

/**
 * Read env at runtime. Direct `process.env.NAME` access is inlined by Next
 * at build time, so a Blob token added on Vercel can stay empty in the
 * serverless bundle and Payload falls back to local `mkdir('media')`.
 */
function serverEnv(name: string): string {
  const value = process.env[name]
  return typeof value === 'string' ? value.trim() : ''
}

export function isVercelRuntime(): boolean {
  return serverEnv('VERCEL') === '1'
}

export function getBlobReadWriteToken(): string {
  return serverEnv('BLOB_READ_WRITE_TOKEN')
}

export function getMediaStorageMode(): MediaStorageMode {
  const blobToken = getBlobReadWriteToken()
  const hasValidBlobToken = blobToken.startsWith('vercel_blob_rw_')
  const s3Bucket = getS3Bucket()

  // Prefer Blob whenever a token exists — including local `npm run seed:*`
  // against Neon/Vercel. Gating on VERCEL=1 left seed writes on local disk
  // while Media rows landed in the remote DB (broken thumbnails / 404 deletes).
  if (hasValidBlobToken) return 'blob'
  if (s3Bucket) return 's3'
  return 'local'
}

export function getS3Bucket(): string {
  return serverEnv('S3_BUCKET')
}

export function getS3Region(): string {
  return serverEnv('S3_REGION') || 'us-east-1'
}

/** Optional CloudFront / custom domain base (no trailing slash). */
export function getS3PublicUrl(): string {
  return serverEnv('S3_PUBLIC_URL').replace(/\/$/, '')
}

/**
 * ACL for PutObject. Omit when the bucket uses "Bucket owner enforced"
 * (ACLs disabled) — use a bucket policy for public read instead.
 */
export function getS3Acl(): 'private' | 'public-read' | undefined {
  const raw = (serverEnv('S3_ACL') || 'public-read').toLowerCase()
  if (!raw || raw === 'none' || raw === 'off') return undefined
  if (raw === 'private') return 'private'
  return 'public-read'
}

/** Build AWS SDK client config; omit credentials to use the instance IAM role. */
export function buildS3ClientConfig(): {
  region: string
  credentials?: { accessKeyId: string; secretAccessKey: string }
  endpoint?: string
  forcePathStyle?: boolean
} {
  const accessKeyId = serverEnv('S3_ACCESS_KEY_ID') || serverEnv('AWS_ACCESS_KEY_ID')
  const secretAccessKey =
    serverEnv('S3_SECRET_ACCESS_KEY') || serverEnv('AWS_SECRET_ACCESS_KEY')
  const endpoint = serverEnv('S3_ENDPOINT')
  const forcePathStyleFlag = serverEnv('S3_FORCE_PATH_STYLE')
  const forcePathStyle = forcePathStyleFlag === 'true' || forcePathStyleFlag === '1'

  return {
    region: getS3Region(),
    ...(accessKeyId && secretAccessKey
      ? { credentials: { accessKeyId, secretAccessKey } }
      : {}),
    ...(endpoint ? { endpoint } : {}),
    ...(forcePathStyle ? { forcePathStyle: true } : {}),
  }
}

/** Hostnames for next/image remotePatterns (build-time env). */
export function getS3ImageRemotePatterns(): Array<{
  protocol: 'http' | 'https'
  hostname: string
  pathname: string
}> {
  const patterns: Array<{
    protocol: 'http' | 'https'
    hostname: string
    pathname: string
  }> = [
    { protocol: 'https', hostname: '*.amazonaws.com', pathname: '/**' },
    { protocol: 'https', hostname: '*.cloudfront.net', pathname: '/**' },
  ]

  const publicUrl = getS3PublicUrl()
  if (publicUrl) {
    try {
      const url = new URL(publicUrl)
      const protocol = url.protocol === 'http:' ? 'http' : 'https'
      patterns.push({
        protocol,
        hostname: url.hostname,
        pathname: '/**',
      })
    } catch {
      // ignore invalid S3_PUBLIC_URL
    }
  }

  const bucket = getS3Bucket()
  const region = getS3Region()
  if (bucket) {
    patterns.push(
      {
        protocol: 'https',
        hostname: `${bucket}.s3.${region}.amazonaws.com`,
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: `${bucket}.s3.amazonaws.com`,
        pathname: '/**',
      },
    )
  }

  return patterns
}

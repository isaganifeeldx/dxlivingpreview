/**
 * Media storage selection for Payload uploads.
 *
 * Priority:
 * - Vercel + BLOB_READ_WRITE_TOKEN → Vercel Blob
 * - S3_BUCKET set (EC2 / local against AWS) → S3
 * - Otherwise → local disk (dev / single-node EC2 without S3)
 */

export type MediaStorageMode = 'blob' | 's3' | 'local'

export function getMediaStorageMode(): MediaStorageMode {
  const isVercel = process.env.VERCEL === '1'
  const blobToken = (process.env.BLOB_READ_WRITE_TOKEN || '').trim()
  const hasValidBlobToken = blobToken.startsWith('vercel_blob_rw_')
  const s3Bucket = (process.env.S3_BUCKET || '').trim()

  if (isVercel && hasValidBlobToken) return 'blob'
  if (s3Bucket) return 's3'
  return 'local'
}

export function getS3Bucket(): string {
  return (process.env.S3_BUCKET || '').trim()
}

export function getS3Region(): string {
  return (process.env.S3_REGION || 'us-east-1').trim()
}

/** Optional CloudFront / custom domain base (no trailing slash). */
export function getS3PublicUrl(): string {
  return (process.env.S3_PUBLIC_URL || '').trim().replace(/\/$/, '')
}

/**
 * ACL for PutObject. Omit when the bucket uses "Bucket owner enforced"
 * (ACLs disabled) — use a bucket policy for public read instead.
 */
export function getS3Acl(): 'private' | 'public-read' | undefined {
  const raw = (process.env.S3_ACL || 'public-read').trim().toLowerCase()
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
  const accessKeyId = (process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '').trim()
  const secretAccessKey = (
    process.env.S3_SECRET_ACCESS_KEY ||
    process.env.AWS_SECRET_ACCESS_KEY ||
    ''
  ).trim()
  const endpoint = (process.env.S3_ENDPOINT || '').trim()
  const forcePathStyle =
    process.env.S3_FORCE_PATH_STYLE === 'true' ||
    process.env.S3_FORCE_PATH_STYLE === '1'

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

/**
 * Seed one (or more) WordPress articles into Payload from cms.dxliving.com.
 *
 * Downloads featured + inline remote images into Payload Media, converts HTML
 * to Lexical, and upserts by slug — same shape as `seed:articles`.
 *
 * Usage:
 *   npm run seed:articles-from-wp
 *   npm run seed:articles-from-wp -- --slug=before-you-sign-with-a-builder-checklist
 *   npm run seed:articles-from-wp -- --limit=1
 *
 * Requires DATABASE_URI + PAYLOAD_SECRET and Blob or S3 (not local disk against remote DB).
 * Run `npm run seed:article-categories` first if categories are empty.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'
import { JSDOM } from 'jsdom'
import {
  convertHTMLToLexical,
  editorConfigFactory,
  EXPERIMENTAL_TableFeature,
} from '@payloadcms/richtext-lexical'
import type { Payload } from 'payload'
import { LEGACY_ARTICLE_CATEGORY_ID_TO_SLUG } from '../src/lib/articles/categoryDefs'
import { getMediaStorageMode } from '../src/lib/cms/mediaStorage'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const WP_API_BASE = (
  process.env.WORDPRESS_API_BASE_URL || 'https://cms.dxliving.com/wp-json/wp/v2'
).replace(/\/$/, '')

const WP_ORIGIN = (() => {
  const fromEnv = process.env.WORDPRESS_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  try {
    return new URL(WP_API_BASE).origin
  } catch {
    return 'https://cms.dxliving.com'
  }
})()

type WpPost = {
  id: number
  slug: string
  status?: string
  date?: string
  modified?: string
  link?: string
  title?: { rendered?: string }
  content?: { rendered?: string }
  excerpt?: { rendered?: string }
  featured_media?: number
  categories?: number[]
  rank_math?: { title?: string; description?: string }
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>
  }
}

function parseArgs(argv: string[]) {
  let slug = (process.env.WP_SEED_SLUG || '').trim()
  let limit = Math.max(1, Number(process.env.WP_SEED_LIMIT) || 1)
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--slug' && argv[i + 1]) {
      slug = argv[++i].trim()
      continue
    }
    if (arg.startsWith('--slug=')) {
      slug = arg.slice('--slug='.length).trim()
      continue
    }
    if (arg === '--limit' && argv[i + 1]) {
      limit = Math.max(1, Number(argv[++i]) || 1)
      continue
    }
    if (arg.startsWith('--limit=')) {
      limit = Math.max(1, Number(arg.slice('--limit='.length)) || 1)
    }
  }
  return { slug, limit }
}

function databaseLooksRemote(uri: string): boolean {
  if (!uri) return false
  try {
    const host = new URL(uri).hostname.toLowerCase()
    if (!host || host === 'localhost' || host === '127.0.0.1') return false
    return true
  } catch {
    return /neon\.tech|amazonaws\.com|supabase\.co|railway|render\.com/i.test(uri)
  }
}

function assertSeedStorageSafe(): void {
  const mode = getMediaStorageMode()
  const dbUri = (process.env.DATABASE_URI || '').trim()

  if (mode !== 'local') {
    console.log(`Media storage mode: ${mode}`)
    return
  }

  if (!databaseLooksRemote(dbUri)) {
    console.log('Media storage mode: local (ok for local Postgres)')
    return
  }

  throw new Error(
    [
      'Refusing to seed Media against a remote DATABASE_URI with local disk storage.',
      'Fix: set BLOB_READ_WRITE_TOKEN (Vercel) or S3_BUCKET, then re-run.',
      `DATABASE_URI host looks remote; media mode is "${mode}".`,
    ].join('\n'),
  )
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function textValue(value: unknown, fallback: string) {
  if (typeof value !== 'string') return fallback
  const trimmed = decodeHtmlEntities(value.replace(/<[^>]*>/g, '')).trim()
  return trimmed || fallback
}

function normalizeMediaUrl(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('/wp-content/')) return `${WP_ORIGIN}${trimmed}`
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('/')) return trimmed
  return trimmed
}

function normalizeArticleContent(content: string) {
  let normalized = content
    .replace(/https?:\/\/(?:stagewp\.)?dxliving\.com\/articles\//gi, '/articles/')
    .replace(/https?:\/\/(?:www\.)?dxliving\.com\/journals\//gi, '/articles/')

  normalized = normalized.replace(
    /(src|href)=(["'])\/wp-content\//gi,
    `$1=$2${WP_ORIGIN}/wp-content/`,
  )

  normalized = normalized.replace(
    /https?:\/\/(?:stagewp\.)?dxliving\.com\/(?!wp-content\/)([\w\-./%#?=&+~:@!$'*,;]+)/gi,
    '/$1',
  )

  return normalized
}

function estimateReadTime(html: string) {
  const text = decodeHtmlEntities(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')).trim()
  const words = text.split(' ').filter(Boolean).length
  if (words === 0) return ''
  return `${Math.max(1, Math.round(words / 200))} min read`
}

function mapCategorySlug(categoryIds: number[] = []) {
  for (const id of categoryIds) {
    const mapped = LEGACY_ARTICLE_CATEGORY_ID_TO_SLUG[String(id)]
    if (mapped) return mapped
  }
  return ''
}

function collectImageUrls(html: string, featuredUrl: string): string[] {
  const urls = new Set<string>()
  if (featuredUrl) urls.add(featuredUrl)
  for (const match of html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    const src = normalizeMediaUrl(match[1]?.trim() || '')
    if (src.startsWith('http://') || src.startsWith('https://')) urls.add(src)
  }
  return [...urls]
}

function filenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const base = path.basename(pathname)
    if (base && base.includes('.')) return decodeURIComponent(base)
  } catch {
    // fall through
  }
  return `wp-image-${Date.now()}.jpg`
}

async function findExistingMediaId(
  payload: Payload,
  filename: string,
): Promise<number | string | null> {
  const found = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    where: { filename: { equals: filename } },
    overrideAccess: true,
  })
  return found.docs[0]?.id ?? null
}

async function ensureRemoteMedia(
  payload: Payload,
  remoteUrl: string,
  cache: Map<string, number | string>,
  tmpDir: string,
): Promise<number | string | null> {
  if (cache.has(remoteUrl)) return cache.get(remoteUrl)!

  const filename = filenameFromUrl(remoteUrl)
  const existing = await findExistingMediaId(payload, filename)
  if (existing != null) {
    cache.set(remoteUrl, existing)
    return existing
  }

  const response = await fetch(remoteUrl)
  if (!response.ok) {
    console.warn(`Failed to download image (${response.status}): ${remoteUrl}`)
    return null
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const tmpPath = path.join(tmpDir, filename)
  fs.writeFileSync(tmpPath, buffer)

  const alt = filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()

  try {
    const created = await payload.create({
      collection: 'media',
      data: { alt: alt || 'Article image' },
      filePath: tmpPath,
      overrideAccess: true,
      overwriteExistingFiles: true,
    })
    cache.set(remoteUrl, created.id)
    console.log(`Uploaded media: ${filename} → ${created.id}`)
    return created.id
  } finally {
    try {
      fs.unlinkSync(tmpPath)
    } catch {
      // ignore
    }
  }
}

function attachUploadIdsToHtml(
  html: string,
  mediaByUrl: Map<string, number | string>,
): string {
  return html.replace(/<img\b([^>]*)>/gi, (full, attrs: string) => {
    const srcMatch = attrs.match(/\bsrc=["']([^"']+)["']/i)
    const rawSrc = srcMatch?.[1]?.trim()
    if (!rawSrc) return full
    const src = normalizeMediaUrl(rawSrc)
    const id = mediaByUrl.get(src)
    if (id == null) return full

    let nextAttrs = attrs
      .replace(/\sdata-lexical-upload-relation-to=["'][^"']*["']/gi, '')
      .replace(/\sdata-lexical-upload-id=["'][^"']*["']/gi, '')

    nextAttrs += ` data-lexical-upload-relation-to="media" data-lexical-upload-id="${id}"`
    return `<img${nextAttrs}>`
  })
}

function coerceUploadIds(node: unknown): void {
  if (!node || typeof node !== 'object') return
  const record = node as Record<string, unknown>

  if (record.type === 'upload' && typeof record.value === 'string' && /^\d+$/.test(record.value)) {
    record.value = Number(record.value)
  }

  if (Array.isArray(record.children)) {
    for (const child of record.children) coerceUploadIds(child)
  }
}

async function fetchWpPostBySlug(slug: string): Promise<WpPost | null> {
  const url = `${WP_API_BASE}/posts?slug=${encodeURIComponent(slug)}&status=publish&_embed=wp:featuredmedia`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`WP fetch failed (${response.status}): ${url}`)
  }
  const posts = (await response.json()) as WpPost[]
  return Array.isArray(posts) && posts[0] ? posts[0] : null
}

async function fetchWpPosts(limit: number): Promise<WpPost[]> {
  const url = `${WP_API_BASE}/posts?per_page=${limit}&page=1&status=publish&_embed=wp:featuredmedia`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`WP fetch failed (${response.status}): ${url}`)
  }
  const posts = (await response.json()) as WpPost[]
  return Array.isArray(posts) ? posts.filter((p) => p.slug) : []
}

async function main() {
  const { slug, limit } = parseArgs(process.argv.slice(2))
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  assertSeedStorageSafe()

  const posts = slug
    ? ([await fetchWpPostBySlug(slug)].filter(Boolean) as WpPost[])
    : await fetchWpPosts(limit)

  if (posts.length === 0) {
    throw new Error(
      slug
        ? `No published WP post found for slug "${slug}".`
        : 'No published WP posts returned.',
    )
  }

  console.log(
    `Seeding ${posts.length} WP article(s) from ${WP_ORIGIN}: ${posts.map((p) => p.slug).join(', ')}`,
  )

  const payload = await getPayload({ config })

  const editorConfig = await editorConfigFactory.fromFeatures({
    config: payload.config,
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      EXPERIMENTAL_TableFeature(),
    ],
  })

  const categoryIdBySlug = new Map<string, number | string>()
  const categoryDocs = await payload.find({
    collection: 'article-categories',
    depth: 0,
    limit: 100,
    overrideAccess: true,
  })
  for (const doc of categoryDocs.docs) {
    const catSlug = typeof doc.slug === 'string' ? doc.slug.trim() : ''
    if (catSlug) categoryIdBySlug.set(catSlug, doc.id)
  }

  if (categoryIdBySlug.size === 0) {
    throw new Error(
      'No article categories found. Run `npm run seed:article-categories` first.',
    )
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dxliving-wp-seed-'))
  const mediaByUrl = new Map<string, number | string>()

  try {
    for (const post of posts) {
      const title = textValue(post.title?.rendered, post.slug)
      const rawContent = post.content?.rendered ?? ''
      const contentHtml = normalizeArticleContent(rawContent)
      const featuredUrl = normalizeMediaUrl(
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url?.trim() || '',
      )
      const categorySlug = mapCategorySlug(post.categories)
      const categoryId = categorySlug ? categoryIdBySlug.get(categorySlug) : undefined

      if (categoryId == null) {
        console.warn(
          `Skipping ${post.slug}: no mapped category for WP ids [${(post.categories || []).join(', ')}]`,
        )
        continue
      }

      for (const imageUrl of collectImageUrls(contentHtml, featuredUrl)) {
        await ensureRemoteMedia(payload, imageUrl, mediaByUrl, tmpDir)
      }

      const htmlWithUploads = attachUploadIdsToHtml(contentHtml, mediaByUrl)
      const content = convertHTMLToLexical({
        editorConfig,
        html: htmlWithUploads,
        JSDOM,
      })
      coerceUploadIds(content.root)

      const featuredImageId = featuredUrl ? mediaByUrl.get(featuredUrl) : undefined
      const publishedAt = post.date
        ? new Date(post.date).toISOString()
        : new Date().toISOString()
      const seoTitle = textValue(post.rank_math?.title, title)
      const seoDescription = textValue(
        post.rank_math?.description,
        textValue(post.excerpt?.rendered, ''),
      )

      const data = {
        title,
        slug: post.slug,
        category: categoryId,
        ...(featuredImageId != null ? { featuredImage: featuredImageId } : {}),
        content,
        readTime: estimateReadTime(rawContent),
        publishedAt,
        _status: 'published' as const,
        seo: {
          title: seoTitle,
          description: seoDescription,
          ogTitle: seoTitle,
          ogDescription: seoDescription,
          twitterTitle: seoTitle,
          twitterDescription: seoDescription,
          twitterCard: 'summary_large_image' as const,
        },
      }

      const existing = await payload.find({
        collection: 'articles',
        depth: 0,
        limit: 1,
        where: { slug: { equals: post.slug } },
        overrideAccess: true,
      })

      if (existing.docs[0]) {
        await payload.update({
          collection: 'articles',
          id: existing.docs[0].id,
          data,
          depth: 0,
          overrideAccess: true,
          draft: false,
        })
        console.log(`Updated article from WP: ${post.slug}`)
      } else {
        await payload.create({
          collection: 'articles',
          data,
          depth: 0,
          overrideAccess: true,
          draft: false,
        })
        console.log(`Created article from WP: ${post.slug}`)
      }

      console.log(`Public URL path: /articles/${post.slug}`)
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }

  console.log(`Done. Media uploaded for this run: ${mediaByUrl.size}`)
  void require
  void rootDir
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed article(s) from WordPress:', error)
  process.exit(1)
})

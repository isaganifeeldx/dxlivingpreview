/**
 * Upsert Payload Articles with Lexical Article body blocks converted from the
 * static HTML library (headings, paragraphs, lists, links, uploads).
 *
 * Featured images + inline `/images/...` files are uploaded to Media once,
 * then referenced on each article / as Lexical upload nodes.
 *
 * Usage: npm run seed:articles
 */
import fs from 'node:fs'
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
import {
  LEGACY_ARTICLE_CATEGORY_ID_TO_SLUG,
} from '../src/lib/articles/categoryDefs'
import { getMediaStorageMode } from '../src/lib/cms/mediaStorage'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

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
      'That creates DB rows without uploading files to Blob/S3 (broken images + 404 deletes).',
      '',
      'Fix: set BLOB_READ_WRITE_TOKEN from your Vercel Blob store (or set S3_BUCKET),',
      'then re-run npm run seed:articles.',
      '',
      `DATABASE_URI host looks remote; media mode is "${mode}".`,
    ].join('\n'),
  )
}

function collectImageSrcs(html: string): string[] {
  const srcs = new Set<string>()
  for (const match of html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    const src = match[1]?.trim()
    if (src?.startsWith('/')) srcs.add(src)
  }
  return [...srcs]
}

function filenameCandidates(publicSrc: string): string[] {
  const base = path.basename(publicSrc)
  const stem = base.replace(/\.[^.]+$/, '')
  return [...new Set([base, `${stem}.webp`, `${stem}.png`, `${stem}.jpg`, `${stem}.jpeg`])]
}

async function findExistingMediaId(
  payload: Payload,
  publicSrc: string,
): Promise<number | string | null> {
  for (const filename of filenameCandidates(publicSrc)) {
    const found = await payload.find({
      collection: 'media',
      depth: 0,
      limit: 1,
      where: { filename: { equals: filename } },
      overrideAccess: true,
    })
    if (found.docs[0]) return found.docs[0].id
  }
  return null
}

async function ensureMediaForSrc(
  payload: Payload,
  publicSrc: string,
  cache: Map<string, number | string>,
): Promise<number | string | null> {
  if (cache.has(publicSrc)) return cache.get(publicSrc)!

  const existing = await findExistingMediaId(payload, publicSrc)
  if (existing != null) {
    cache.set(publicSrc, existing)
    return existing
  }

  const absolutePath = path.join(rootDir, 'public', publicSrc.replace(/^\//, ''))
  if (!fs.existsSync(absolutePath)) {
    console.warn(`Missing image file for seed: ${publicSrc}`)
    return null
  }

  const alt = path
    .basename(publicSrc)
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()

  const created = await payload.create({
    collection: 'media',
    data: { alt: alt || 'Article image' },
    filePath: absolutePath,
    overrideAccess: true,
    overwriteExistingFiles: true,
  })

  cache.set(publicSrc, created.id)
  console.log(`Uploaded media: ${publicSrc} → ${created.id}`)
  return created.id
}

function attachUploadIdsToHtml(
  html: string,
  mediaBySrc: Map<string, number | string>,
): string {
  return html.replace(/<img\b([^>]*)>/gi, (full, attrs: string) => {
    const srcMatch = attrs.match(/\bsrc=["']([^"']+)["']/i)
    const src = srcMatch?.[1]?.trim()
    if (!src) return full
    const id = mediaBySrc.get(src)
    if (id == null) return full

    let nextAttrs = attrs
      .replace(/\sdata-lexical-upload-relation-to=["'][^"']*["']/gi, '')
      .replace(/\sdata-lexical-upload-id=["'][^"']*["']/gi, '')

    nextAttrs += ` data-lexical-upload-relation-to="media" data-lexical-upload-id="${id}"`
    return `<img${nextAttrs}>`
  })
}

/** Postgres Media IDs are numbers; HTML→Lexical stores them as strings. */
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

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { fallbackArticleData, slugFromLink } = await import('../src/data/articles')

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  assertSeedStorageSafe()

  const payload = await getPayload({ config })

  const editorConfig = await editorConfigFactory.fromFeatures({
    config: payload.config,
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      EXPERIMENTAL_TableFeature(),
    ],
  })

  const allSrcs = new Set<string>()
  for (const article of fallbackArticleData) {
    const featured = article.featuredImage?.trim()
    if (featured?.startsWith('/')) allSrcs.add(featured)
    for (const src of collectImageSrcs(article.content)) {
      allSrcs.add(src)
    }
  }

  const mediaBySrc = new Map<string, number | string>()
  for (const src of [...allSrcs].sort()) {
    await ensureMediaForSrc(payload, src, mediaBySrc)
  }

  const categoryIdBySlug = new Map<string, number | string>()
  const categoryDocs = await payload.find({
    collection: 'article-categories',
    depth: 0,
    limit: 100,
    overrideAccess: true,
  })
  for (const doc of categoryDocs.docs) {
    const slug = typeof doc.slug === 'string' ? doc.slug.trim() : ''
    if (slug) categoryIdBySlug.set(slug, doc.id)
  }

  if (categoryIdBySlug.size === 0) {
    throw new Error(
      'No article categories found. Run `npm run seed:article-categories` first.',
    )
  }

  for (const article of fallbackArticleData) {
    const slug = slugFromLink(article.link)
    if (!slug) continue

    const categorySlug =
      LEGACY_ARTICLE_CATEGORY_ID_TO_SLUG[article.category] ?? article.category
    const categoryId = categoryIdBySlug.get(categorySlug)
    if (categoryId == null) {
      console.warn(`Skipping ${slug}: missing category ${categorySlug}`)
      continue
    }

    const existing = await payload.find({
      collection: 'articles',
      depth: 0,
      limit: 1,
      where: { slug: { equals: slug } },
      overrideAccess: true,
    })

    const publishedAt = article.datePublished
      ? new Date(`${article.datePublished.slice(0, 10)}T00:00:00.000Z`).toISOString()
      : new Date().toISOString()

    const htmlWithUploads = attachUploadIdsToHtml(article.content, mediaBySrc)
    const content = convertHTMLToLexical({
      editorConfig,
      html: htmlWithUploads,
      JSDOM,
    })
    coerceUploadIds(content.root)

    const featuredSrc = article.featuredImage?.trim()
    const featuredImageId =
      featuredSrc && featuredSrc.startsWith('/')
        ? mediaBySrc.get(featuredSrc)
        : undefined
    if (featuredSrc && featuredImageId == null) {
      console.warn(`No media for featured image on ${slug}: ${featuredSrc}`)
    }

    const data = {
      title: article.title,
      slug,
      category: categoryId,
      ...(featuredImageId != null ? { featuredImage: featuredImageId } : {}),
      content,
      readTime: article.readTime,
      publishedAt,
      _status: 'published' as const,
      seo: {
        title: article.seoTitle,
        description: article.seoDescription,
        ogTitle: article.seoTitle,
        ogDescription: article.seoDescription,
        twitterTitle: article.seoTitle,
        twitterDescription: article.seoDescription,
        twitterCard: 'summary_large_image' as const,
      },
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'articles',
        id: existing.docs[0].id,
        data,
        depth: 0,
        overrideAccess: true,
        draft: false,
      })
      console.log(`Updated article: ${slug}`)
    } else {
      await payload.create({
        collection: 'articles',
        data,
        depth: 0,
        overrideAccess: true,
        draft: false,
      })
      console.log(`Created article: ${slug}`)
    }
  }

  console.log(
    `Seeded ${fallbackArticleData.length} articles with Lexical bodies (${mediaBySrc.size} media images).`,
  )
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Articles collection:', error)
  process.exit(1)
})

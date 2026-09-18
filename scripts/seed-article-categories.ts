/**
 * Upsert default Article Categories, then link existing Articles.
 *
 * Usage: npm run seed:article-categories
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'
import {
  FALLBACK_ARTICLE_CATEGORIES,
  LEGACY_ARTICLE_CATEGORY_ID_TO_SLUG,
} from '../src/lib/articles/categoryDefs'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { fallbackArticleData, slugFromLink } = await import('../src/data/articles')

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const categoryIdBySlug = new Map<string, number | string>()

  for (const category of FALLBACK_ARTICLE_CATEGORIES) {
    const existing = await payload.find({
      collection: 'article-categories',
      depth: 0,
      limit: 1,
      where: { slug: { equals: category.id } },
      overrideAccess: true,
    })

    const data = {
      name: category.label,
      slug: category.id,
      sortOrder: category.sortOrder,
    }

    if (existing.docs[0]) {
      const updated = await payload.update({
        collection: 'article-categories',
        id: existing.docs[0].id,
        data,
        depth: 0,
        overrideAccess: true,
      })
      categoryIdBySlug.set(category.id, updated.id)
      console.log(`Updated category: ${category.id}`)
    } else {
      const created = await payload.create({
        collection: 'article-categories',
        data,
        depth: 0,
        overrideAccess: true,
      })
      categoryIdBySlug.set(category.id, created.id)
      console.log(`Created category: ${category.id}`)
    }
  }

  let linked = 0
  for (const article of fallbackArticleData) {
    const slug = slugFromLink(article.link)
    if (!slug) continue

    const categorySlug =
      LEGACY_ARTICLE_CATEGORY_ID_TO_SLUG[article.category] ?? article.category
    const categoryId = categoryIdBySlug.get(categorySlug)
    if (categoryId == null) {
      console.warn(`No category id for article ${slug} (${categorySlug})`)
      continue
    }

    const existing = await payload.find({
      collection: 'articles',
      depth: 0,
      limit: 1,
      where: { slug: { equals: slug } },
      overrideAccess: true,
    })

    if (!existing.docs[0]) continue

    await payload.update({
      collection: 'articles',
      id: existing.docs[0].id,
      data: { category: categoryId },
      depth: 0,
      overrideAccess: true,
      draft: false,
    })
    linked += 1
  }

  console.log(
    `Seeded ${FALLBACK_ARTICLE_CATEGORIES.length} categories and linked ${linked} articles.`,
  )
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed article categories:', error)
  process.exit(1)
})

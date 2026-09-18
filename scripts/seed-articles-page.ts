/**
 * Sync Payload Articles Page global from DX Living articles listing fallbacks.
 *
 * Usage: npm run seed:articles-page
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { FALLBACK_ARTICLES_PAGE_CONTENT, articlesPageDefaults } = await import(
    '../src/lib/articles/defaults'
  )

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const defaults = FALLBACK_ARTICLES_PAGE_CONTENT
  const seo = articlesPageDefaults.seo

  await payload.updateGlobal({
    slug: 'articles-page',
    data: {
      banner: defaults.banner,
      anchorMenu: defaults.anchorMenu.map(({ label }) => ({ label })),
      introduction: defaults.introduction,
      cta: defaults.cta,
      detailBanner: defaults.detailBanner,
      detailCta: defaults.detailCta,
      seo: {
        title: seo.title,
        description: seo.description,
        focusKeyword: seo.focusKeyword,
        ogTitle: seo.ogTitle,
        ogDescription: seo.ogDescription,
        twitterTitle: seo.twitterTitle,
        twitterDescription: seo.twitterDescription,
        twitterCard: seo.twitterCard,
      },
    },
    depth: 0,
    overrideAccess: true,
  })

  console.log('Articles Page global synced from DX Living articles listing content + SEO.')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Articles Page global:', error)
  process.exit(1)
})

/**
 * Sync Payload FAQ global from DX Living FAQ defaults.
 *
 * Usage: npm run seed:faq
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { faqPageDefaults } = await import('../src/lib/faq/defaults')

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const seo = faqPageDefaults.seo

  await payload.updateGlobal({
    slug: 'faq',
    data: {
      title: faqPageDefaults.title,
      intro: faqPageDefaults.intro,
      items: faqPageDefaults.items.map(({ question, answer, category }) => ({
        question,
        answer,
        category,
      })),
      seo: {
        title: seo.title,
        description: seo.description,
        focusKeyword: seo.focusKeyword,
        keywords: seo.keywords,
        canonicalUrl: seo.canonicalUrl,
        noIndex: seo.noIndex,
        noFollow: seo.noFollow,
        ogTitle: seo.ogTitle,
        ogDescription: seo.ogDescription,
        twitterCard: seo.twitterCard,
        twitterTitle: seo.twitterTitle,
        twitterDescription: seo.twitterDescription,
        customJsonLd: seo.customJsonLd,
        replaceDefaultJsonLd: seo.replaceDefaultJsonLd,
      },
    },
    depth: 0,
    overrideAccess: true,
  })

  console.log('FAQ global synced (Pages > FAQ).')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed FAQ global:', error)
  process.exit(1)
})

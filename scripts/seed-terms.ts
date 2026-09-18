/**
 * Sync Payload Terms of Service global from DX Living terms defaults.
 *
 * Usage: npm run seed:terms
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { termsPageDefaults } = await import('../src/lib/terms/defaults')

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const seo = termsPageDefaults.seo

  await payload.updateGlobal({
    slug: 'terms-of-service',
    data: {
      title: termsPageDefaults.title,
      // Leave Lexical body empty so the site keeps the built-in plain-text fallback
      // until editors paste formatted terms content in admin.
      seo: {
        title: seo.title,
        description: seo.description,
        focusKeyword: seo.focusKeyword,
        keywords: seo.keywords,
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

  console.log('Terms of Service global synced (title + SEO; body left empty for built-in fallback).')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Terms of Service global:', error)
  process.exit(1)
})

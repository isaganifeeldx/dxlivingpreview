/**
 * Sync Payload 404 Not Found global from DX Living defaults.
 *
 * Usage: npm run seed:not-found
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { notFoundPageDefaults } = await import('../src/lib/not-found/defaults')

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const d = notFoundPageDefaults
  const seo = d.seo

  await payload.updateGlobal({
    slug: 'not-found',
    data: {
      heading: d.heading,
      title: d.title,
      description: d.description,
      hint: d.hint,
      ctaLabel: d.ctaLabel,
      ctaHref: d.ctaHref,
      seo: {
        title: seo.title,
        description: seo.description,
        focusKeyword: seo.focusKeyword,
        keywords: seo.keywords,
        canonicalUrl: seo.canonicalUrl,
        noIndex: true,
        noFollow: true,
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

  console.log('Not Found global synced (Pages > 404 Not Found).')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Not Found global:', error)
  process.exit(1)
})

/**
 * Sync Payload Contact global from DX Living contact fallbacks.
 *
 * Usage: npm run seed:contact
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { FALLBACK_CONTACT_CONTENT, contactPageDefaults } = await import(
    '../src/lib/contact/defaults'
  )

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const defaults = FALLBACK_CONTACT_CONTENT
  const seo = contactPageDefaults.seo

  await payload.updateGlobal({
    slug: 'contact',
    data: {
      banner: defaults.banner,
      anchorMenu: defaults.anchorMenu.map(({ label }) => ({ label })),
      introduction: defaults.introduction,
      quickEnquiries: defaults.quickEnquiries,
      whereToFindUs: {
        heading: defaults.whereToFindUs.heading,
        branches: defaults.whereToFindUs.branches.map(
          ({ branchName, location, locationLink, phone }) => ({
            branchName,
            location,
            locationLink,
            phone,
          }),
        ),
      },
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

  console.log('Contact global synced from DX Living contact content + SEO.')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Contact global:', error)
  process.exit(1)
})

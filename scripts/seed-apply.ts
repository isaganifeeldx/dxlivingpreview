/**
 * Sync Payload Apply global from DX Living apply fallbacks.
 *
 * Usage: npm run seed:apply
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { FALLBACK_APPLY_CONTENT, applyPageDefaults } = await import('../src/lib/apply/defaults')

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const defaults = FALLBACK_APPLY_CONTENT
  const seo = applyPageDefaults.seo

  await payload.updateGlobal({
    slug: 'apply',
    data: {
      banner: defaults.banner,
      anchorMenu: defaults.anchorMenu.map(({ label }) => ({ label })),
      introduction: defaults.introduction,
      whyJoin: {
        heading: defaults.whyJoin.heading,
        content: defaults.whyJoin.content,
        items: defaults.whyJoin.items,
      },
      videos: defaults.videos,
      whoThisIsFor: {
        heading: defaults.whoThisIsFor.heading,
        content: defaults.whoThisIsFor.content,
        items: defaults.whoThisIsFor.items.map((text) => ({ text })),
      },
      howItWorks: {
        heading: defaults.howItWorks.heading,
        steps: defaults.howItWorks.steps,
      },
      applyToJoin: defaults.applyToJoin,
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

  console.log('Apply global synced from DX Living apply content + SEO.')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Apply global:', error)
  process.exit(1)
})

/**
 * Sync Payload Suppliers global from DX Living suppliers fallbacks.
 *
 * Usage: npm run seed:suppliers
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { FALLBACK_SUPPLIERS_CONTENT, suppliersPageDefaults } = await import(
    '../src/lib/suppliers/defaults'
  )

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const defaults = FALLBACK_SUPPLIERS_CONTENT
  const seo = suppliersPageDefaults.seo

  await payload.updateGlobal({
    slug: 'suppliers',
    data: {
      banner: defaults.banner,
      anchorMenu: defaults.anchorMenu.map(({ label }) => ({ label })),
      introduction: defaults.introduction,
      fullWidthVideo: defaults.fullWidthVideo,
      whatWeOffer: {
        heading: defaults.whatWeOffer.heading,
        items: defaults.whatWeOffer.items,
      },
      materialIntegration: defaults.materialIntegration,
      process: {
        heading: defaults.process.heading,
        rightSideVideo: defaults.process.rightSideVideo,
        steps: defaults.process.steps,
      },
      tiers: {
        heading: defaults.tiers.heading,
        rows: defaults.tiers.rows,
        buttonDesktop: defaults.tiers.buttonDesktop,
        buttonMobile: defaults.tiers.buttonMobile,
      },
      cta: defaults.cta,
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

  console.log('Suppliers global synced from DX Living suppliers content + SEO.')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Suppliers global:', error)
  process.exit(1)
})

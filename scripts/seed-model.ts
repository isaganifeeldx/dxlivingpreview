/**
 * Sync Payload Model global from reference1 / live DX Living model fallbacks.
 *
 * Usage: npm run seed:model
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { FALLBACK_MODEL_CONTENT, modelPageDefaults } = await import(
    '../src/lib/model/defaults'
  )

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const defaults = FALLBACK_MODEL_CONTENT
  const seo = modelPageDefaults.seo

  await payload.updateGlobal({
    slug: 'model',
    data: {
      banner: defaults.banner,
      anchorMenu: defaults.anchorMenu.map(({ label }) => ({ label })),
      introduction: defaults.introduction,
      features: {
        heading: defaults.features.heading,
        list: defaults.features.list,
        button: defaults.features.button,
        buttonMobile: defaults.features.buttonMobile,
        buttonLink: defaults.features.buttonLink,
      },
      otherModulesHeading: defaults.otherModulesHeading,
      book: defaults.book,
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

  console.log('Model global synced from DX Living model content + live SEO.')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Model global:', error)
  process.exit(1)
})

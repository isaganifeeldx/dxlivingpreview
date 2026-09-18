/**
 * Sync Payload Modules global from reference1 / live DX Living modules fallbacks.
 *
 * Usage: npm run seed:modules
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { FALLBACK_MODULES_CONTENT, modulesPageDefaults } = await import(
    '../src/lib/modules/defaults'
  )

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const defaults = FALLBACK_MODULES_CONTENT
  const seo = modulesPageDefaults.seo

  await payload.updateGlobal({
    slug: 'modules',
    data: {
      banner: defaults.banner,
      anchorMenu: defaults.anchorMenu.map(({ label }) => ({ label })),
      introduction: defaults.introduction,
      moduleCards: defaults.moduleCards.map(({ title, content, link }) => ({
        title,
        content,
        link,
      })),
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

  console.log('Modules global synced from DX Living modules content + SEO.')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Modules global:', error)
  process.exit(1)
})

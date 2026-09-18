/**
 * Sync Payload Interiors global from reference1 / live DX Living interiors fallbacks.
 *
 * Usage: npm run seed:interiors
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { FALLBACK_INTERIORS_CONTENT, interiorsPageDefaults } = await import(
    '../src/lib/interiors/defaults'
  )

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const defaults = FALLBACK_INTERIORS_CONTENT
  const seo = interiorsPageDefaults.seo

  await payload.updateGlobal({
    slug: 'interiors',
    data: {
      banner: defaults.banner,
      anchorMenu: defaults.anchorMenu.map(({ label }) => ({ label })),
      introduction: defaults.introduction,
      designYourSpace: {
        heading: defaults.designYourSpace.heading,
        list: defaults.designYourSpace.list,
        lastContent: defaults.designYourSpace.lastContent,
        button: defaults.designYourSpace.button,
        buttonLink: defaults.designYourSpace.buttonLink,
        note: defaults.designYourSpace.note,
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

  console.log('Interiors global synced from DX Living interiors content + live SEO.')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Interiors global:', error)
  process.exit(1)
})

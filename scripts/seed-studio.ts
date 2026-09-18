/**
 * Sync Payload Studio global from reference1 / live DX Living studio fallbacks.
 *
 * Usage: npm run seed:studio
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { FALLBACK_STUDIO_CONTENT, studioPageDefaults } = await import(
    '../src/lib/studio/defaults'
  )

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const defaults = FALLBACK_STUDIO_CONTENT
  const seo = studioPageDefaults.seo

  await payload.updateGlobal({
    slug: 'studio',
    data: {
      banner: defaults.banner,
      anchorMenu: defaults.anchorMenu.map(({ label }) => ({ label })),
      introduction: defaults.introduction,
      whyPartner: {
        heading: defaults.whyPartner.heading,
        list: defaults.whyPartner.list,
      },
      howItWorks: {
        heading: defaults.howItWorks.heading,
        columns: defaults.howItWorks.columns,
        button: defaults.howItWorks.button,
        buttonLink: defaults.howItWorks.buttonLink,
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

  console.log('Studio global synced from DX Living studio content + live SEO.')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Studio global:', error)
  process.exit(1)
})

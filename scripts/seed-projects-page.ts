/**
 * Sync Payload Projects Page global from DX Living projects listing fallbacks.
 *
 * Usage: npm run seed:projects-page
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { FALLBACK_PROJECTS_PAGE_CONTENT, projectsPageDefaults } = await import(
    '../src/lib/projects/defaults'
  )

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const defaults = FALLBACK_PROJECTS_PAGE_CONTENT
  const seo = projectsPageDefaults.seo

  await payload.updateGlobal({
    slug: 'projects-page',
    data: {
      banner: defaults.banner,
      anchorMenu: defaults.anchorMenu.map(({ label }) => ({ label })),
      introduction: defaults.introduction,
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

  console.log('Projects Page global synced from DX Living projects listing content + SEO.')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Projects Page global:', error)
  process.exit(1)
})

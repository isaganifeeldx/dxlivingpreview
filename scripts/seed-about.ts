/**
 * Sync Payload About global from reference1 / live DX Living about fallbacks.
 *
 * Usage: npm run seed:about
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { FALLBACK_ABOUT_CONTENT, aboutPageDefaults } = await import(
    '../src/lib/about/defaults'
  )

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const defaults = FALLBACK_ABOUT_CONTENT
  const seo = aboutPageDefaults.seo

  await payload.updateGlobal({
    slug: 'about',
    data: {
      banner: defaults.banner,
      anchorMenu: defaults.anchorMenu.map(({ label }) => ({ label })),
      introduction: defaults.introduction,
      videoLeft: defaults.videoLeft,
      contentRight: defaults.contentRight,
      fullWidthVideo: defaults.fullWidthVideo,
      whyDxLiving: {
        heading: defaults.whyDxLiving.heading,
        content: defaults.whyDxLiving.content,
        contentList: defaults.whyDxLiving.contentList.map((text) => ({ text })),
        lastContent: defaults.whyDxLiving.lastContent,
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

  console.log('About global synced from DX Living about content + SEO.')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed About global:', error)
  process.exit(1)
})

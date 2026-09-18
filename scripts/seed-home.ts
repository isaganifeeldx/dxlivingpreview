/**
 * Sync Payload Home global from live dxliving.com / WordPress page 317 content.
 *
 * Usage: npm run seed:home
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

// Load env before importing Payload config (config reads PAYLOAD_SECRET at import time).
loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { FALLBACK_HOME_CONTENT } = await import('../src/data/homeContent')
  const { homePageDefaults } = await import('../src/lib/home/defaults')

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const defaults = FALLBACK_HOME_CONTENT
  const seo = homePageDefaults.seo

  await payload.updateGlobal({
    slug: 'home',
    data: {
      sliderItems: defaults.sliderItems,
      interactiveButton: defaults.interactiveButton,
      redefiningHome: defaults.redefiningHome,
      bringYourDesigns: {
        heading: defaults.bringYourDesigns.heading,
        content: defaults.bringYourDesigns.content,
        leftCaption: defaults.bringYourDesigns.leftCaption,
        rightCaption: defaults.bringYourDesigns.rightCaption,
        buttonText: defaults.bringYourDesigns.buttonText,
        buttonLink: defaults.bringYourDesigns.buttonLink,
      },
      exploreLimitless: {
        heading: defaults.exploreLimitless.heading,
        content: defaults.exploreLimitless.content,
        modules: defaults.exploreLimitless.modules,
      },
      ourProject: {
        heading: defaults.ourProject.heading,
        content: defaults.ourProject.content,
        videos: defaults.ourProject.videos,
        buttonText: defaults.ourProject.buttonText,
        buttonLink: defaults.ourProject.buttonLink,
      },
      spaceRealisation: {
        heading: defaults.spaceRealisation.heading,
        content: defaults.spaceRealisation.content,
        leftCaption: defaults.spaceRealisation.leftCaption,
        rightCaption: defaults.spaceRealisation.rightCaption,
        buttonText: defaults.spaceRealisation.buttonText,
        buttonLink: defaults.spaceRealisation.buttonLink,
      },
      optimizeDesign: {
        heading: defaults.optimizeDesign.heading,
        content: defaults.optimizeDesign.content,
        items: defaults.optimizeDesign.items,
        buttonText: defaults.optimizeDesign.buttonText,
        buttonLink: defaults.optimizeDesign.buttonLink,
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

  console.log('Home global synced from live dxliving.com content + Rank Math SEO.')
  // keep require referenced so TSX/CJS interop helpers stay available if needed
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Home global:', error)
  process.exit(1)
})

/**
 * Upsert Payload Projects collection docs from reference1 static portfolio data.
 *
 * Usage: npm run seed:projects
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { projects } = await import('../src/data/projects')

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })

  for (let index = 0; index < projects.length; index += 1) {
    const project = projects[index]
    if (!project) continue

    const existing = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1,
      where: { slug: { equals: project.slug } },
      overrideAccess: true,
    })

    const data = {
      title: project.title,
      slug: project.slug,
      description: project.description,
      timeframe: project.timeframe,
      location: project.location,
      state: project.state,
      technologies: project.technologies,
      status: project.status,
      type: project.type,
      featuredTitle: project.featuredTitle,
      listingVideo: project.video,
      videos: {
        hero: project.videos.hero,
        primary: project.videos.primary,
        galleryLeft: project.videos.galleryLeft,
        galleryRight: project.videos.galleryRight,
        fullWidth: project.videos.fullWidth,
        carousel: project.videos.carousel.map((vimeoId) => ({ vimeoId })),
      },
      centerHeroOnMobile: Boolean(project.centerHeroOnMobile),
      alignTechnologiesEnd: Boolean(project.alignTechnologiesEnd),
      sortOrder: index,
      publishedAt: new Date().toISOString(),
      _status: 'published' as const,
      seo: {
        title: project.seoTitle,
        description: project.seoDescription,
        ogTitle: project.seoTitle,
        ogDescription: project.seoDescription,
        twitterTitle: project.seoTitle,
        twitterDescription: project.seoDescription,
        twitterCard: 'summary_large_image' as const,
      },
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'projects',
        id: existing.docs[0].id,
        data,
        depth: 0,
        overrideAccess: true,
        draft: false,
      })
      console.log(`Updated project: ${project.slug}`)
    } else {
      await payload.create({
        collection: 'projects',
        data,
        depth: 0,
        overrideAccess: true,
        draft: false,
      })
      console.log(`Created project: ${project.slug}`)
    }
  }

  console.log(`Seeded ${projects.length} projects from DX Living portfolio fallbacks.`)
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Projects collection:', error)
  process.exit(1)
})

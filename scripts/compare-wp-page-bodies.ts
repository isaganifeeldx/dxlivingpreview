/**
 * Compare live WP ACF body fields vs our seed defaults.
 * Usage: node --import tsx scripts/compare-wp-page-bodies.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, '.tmp-wp-seed')

const strip = (s: string) => s.replace(/^\uFEFF/, '')
const decode = (v: unknown) =>
  String(v ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\u00a0/g, ' ')
    .trim()

const norm = (s: unknown) =>
  decode(s)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

const pick = (obj: unknown, dotted: string): unknown =>
  dotted.split('.').reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return (acc as Record<string, unknown>)[key]
  }, obj)

const load = (page: string) =>
  JSON.parse(strip(fs.readFileSync(path.join(DIR, `${page}.json`), 'utf8'))) as {
    acf?: Record<string, unknown>
  }

type Field = [string, string, (our: any) => unknown]

async function main() {
  const about = await import('../src/lib/about/defaults')
  const modules = await import('../src/lib/modules/defaults')
  const studio = await import('../src/lib/studio/defaults')
  const interiors = await import('../src/lib/interiors/defaults')
  const model = await import('../src/lib/model/defaults')
  const prestige = await import('../src/lib/prestige/defaults')
  const suppliers = await import('../src/lib/suppliers/defaults')
  const apply = await import('../src/lib/apply/defaults')
  const contact = await import('../src/lib/contact/defaults')
  const home = await import('../src/data/homeContent')
  const projects = await import('../src/lib/projects/defaults')
  const articles = await import('../src/lib/articles/defaults')

  const comparisons: Array<{ page: string; our: any; fields: Field[] }> = [
    {
      page: 'about',
      our: about.FALLBACK_ABOUT_CONTENT,
      fields: [
        ['banner.title', 'top_banner.title', (o) => o.banner.title],
        ['banner.video', 'top_banner.vimeo_background_video', (o) => o.banner.vimeoBackgroundVideo],
        ['introduction', 'introduction', (o) => o.introduction],
        ['videoLeft', 'video_left', (o) => o.videoLeft],
        ['contentRight', 'content_right', (o) => o.contentRight],
        ['fullWidthVideo', 'full_width_video', (o) => o.fullWidthVideo],
        ['why.heading', 'why_dx_living.heading', (o) => o.whyDxLiving.heading],
        ['why.content', 'why_dx_living.content', (o) => o.whyDxLiving.content],
        ['why.last', 'why_dx_living.last_content', (o) => o.whyDxLiving.lastContent],
        ['cta.heading', 'cta_banner.heading', (o) => o.cta.heading],
        ['cta.content', 'cta_banner.content', (o) => o.cta.content],
        ['cta.button', 'cta_banner.button', (o) => o.cta.button],
        ['cta.link', 'cta_banner.button_link', (o) => o.cta.buttonLink],
        ['cta.video', 'cta_banner.video_background', (o) => o.cta.videoBackground],
      ],
    },
    {
      page: 'modules',
      our: modules.FALLBACK_MODULES_CONTENT,
      fields: [
        ['banner.title', 'top_banner.title', (o) => o.banner.title],
        ['banner.video', 'top_banner.vimeo_background_video', (o) => o.banner.vimeoBackgroundVideo],
        ['introduction', 'introduction', (o) => o.introduction],
        ['cta.heading', 'cta.heading', (o) => o.cta?.heading],
        ['cta.content', 'cta.content', (o) => o.cta?.content],
        ['cta.button', 'cta.button', (o) => o.cta?.button],
        ['cta.link', 'cta.button_link', (o) => o.cta?.buttonLink],
        ['cta.video', 'cta.video_background', (o) => o.cta?.videoBackground],
      ],
    },
    {
      page: 'studio',
      our: studio.FALLBACK_STUDIO_CONTENT,
      fields: [
        ['banner.title', 'top_banner.title', (o) => o.banner.title],
        ['banner.video', 'top_banner.vimeo_background_video', (o) => o.banner.vimeoBackgroundVideo],
        ['intro.heading', 'introduction.heading', (o) => o.introduction?.heading],
        ['intro.content', 'introduction.content', (o) => o.introduction?.content],
        ['cta.heading', 'cta.heading', (o) => o.cta?.heading],
        ['cta.content', 'cta.content', (o) => o.cta?.content],
        ['cta.button', 'cta.button', (o) => o.cta?.button],
        ['cta.link', 'cta.button_link', (o) => o.cta?.buttonLink],
        ['cta.video', 'cta.video_background', (o) => o.cta?.videoBackground],
      ],
    },
    {
      page: 'interiors',
      our: interiors.FALLBACK_INTERIORS_CONTENT,
      fields: [
        ['banner.title', 'top_banner.title', (o) => o.banner.title],
        ['banner.video', 'top_banner.vimeo_background_video', (o) => o.banner.vimeoBackgroundVideo],
        ['intro.heading', 'introduction.heading', (o) => o.introduction?.heading],
        ['intro.content', 'introduction.content', (o) => o.introduction?.content],
        ['cta.heading', 'cta.heading', (o) => o.cta?.heading],
        ['cta.content', 'cta.content', (o) => o.cta?.content],
        ['cta.button', 'cta.button', (o) => o.cta?.button],
        ['cta.link', 'cta.button_link', (o) => o.cta?.buttonLink],
        ['cta.video', 'cta.video_background', (o) => o.cta?.videoBackground],
      ],
    },
    {
      page: 'model',
      our: model.FALLBACK_MODEL_CONTENT,
      fields: [
        ['banner.title', 'top_banner.title', (o) => o.banner.title],
        ['banner.video', 'top_banner.vimeo_background_video', (o) => o.banner.vimeoBackgroundVideo],
        ['intro.heading', 'introduction.heading', (o) => o.introduction?.heading],
        ['intro.content', 'introduction.content', (o) => o.introduction?.content],
        ['cta.heading', 'cta.heading', (o) => o.cta?.heading],
        ['cta.content', 'cta.content', (o) => o.cta?.content],
        ['cta.button', 'cta.button', (o) => o.cta?.button],
        ['cta.link', 'cta.button_link', (o) => o.cta?.buttonLink],
        ['cta.video', 'cta.video_background', (o) => o.cta?.videoBackground],
      ],
    },
    {
      page: 'prestige',
      our: prestige.FALLBACK_PRESTIGE_CONTENT,
      fields: [
        ['banner.title', 'top_banner.title', (o) => o.banner.title],
        ['banner.video', 'top_banner.vimeo_background_video', (o) => o.banner.vimeoBackgroundVideo],
        ['intro.heading', 'introduction.heading', (o) => o.introduction?.heading],
        ['intro.content', 'introduction.content', (o) => o.introduction?.content],
        ['cta.heading', 'cta.heading', (o) => o.cta?.heading],
        ['cta.content', 'cta.content', (o) => o.cta?.content],
        ['cta.button', 'cta.button', (o) => o.cta?.button],
        ['cta.link', 'cta.button_link', (o) => o.cta?.buttonLink],
        ['cta.video', 'cta.video_background', (o) => o.cta?.videoBackground],
      ],
    },
    {
      page: 'suppliers',
      our: suppliers.FALLBACK_SUPPLIERS_CONTENT,
      fields: [
        ['banner.title', 'top_banner.title', (o) => o.banner?.title],
        ['banner.video', 'top_banner.vimeo_background_video', (o) => o.banner?.vimeoBackgroundVideo],
        ['introduction', 'introduction', (o) => o.introduction],
        ['fullWidthVideo', 'full_width_video', (o) => o.fullWidthVideo],
        ['cta.heading', 'cta_banner.heading', (o) => o.cta?.heading],
        ['cta.content', 'cta_banner.content', (o) => o.cta?.content],
        ['cta.button', 'cta_banner.button', (o) => o.cta?.button],
        ['cta.link', 'cta_banner.button_link', (o) => o.cta?.buttonLink],
        ['cta.video', 'cta_banner.video_background', (o) => o.cta?.videoBackground],
      ],
    },
    {
      page: 'apply',
      our: apply.FALLBACK_APPLY_CONTENT,
      fields: [
        ['banner.title', 'top_banner.title', (o) => o.banner?.title],
        ['banner.video', 'top_banner.vimeo_background_video', (o) => o.banner?.vimeoBackgroundVideo],
        ['introduction', 'introduction', (o) => o.introduction],
        ['videoLeft', 'video_left', (o) => o.videos?.left],
        ['videoRight', 'video_right', (o) => o.videos?.right],
      ],
    },
    {
      page: 'contact',
      our: contact.FALLBACK_CONTACT_CONTENT,
      fields: [
        ['banner.title', 'top_banner.title', (o) => o.banner?.title],
        ['banner.video', 'top_banner.vimeo_background_video', (o) => o.banner?.vimeoBackgroundVideo],
        ['introduction', 'introduction', (o) => o.introduction],
        ['phone', 'quick_enquries.phone', (o) => o.quickEnquiries?.phone],
        ['email', 'quick_enquries.email', (o) => o.quickEnquiries?.email],
      ],
    },
    {
      page: 'home',
      our: home.FALLBACK_HOME_CONTENT,
      fields: [
        ['button', 'button', (o) => o.interactiveButton?.label],
        ['button_link', 'button_link', (o) => o.interactiveButton?.href],
        ['redefining.heading', 'redefining_home.heading', (o) => o.redefiningHome?.heading],
        ['redefining.content', 'redefining_home.content', (o) => o.redefiningHome?.content],
        ['bring.heading', 'bring_your_designs.heading', (o) => o.bringYourDesigns?.heading],
        ['bring.content', 'bring_your_designs.content', (o) => o.bringYourDesigns?.content],
        ['explore.heading', 'explore_limitless.heading', (o) => o.exploreLimitless?.heading],
        ['explore.content', 'explore_limitless.content', (o) => o.exploreLimitless?.content],
        ['our_project.heading', 'our_project.heading', (o) => o.ourProject?.heading],
        ['our_project.content', 'our_project.content', (o) => o.ourProject?.content],
        ['space.heading', 'space_realisation.heading', (o) => o.spaceRealisation?.heading],
        ['space.content', 'space_realisation.content', (o) => o.spaceRealisation?.content],
        ['optimize.heading', 'optimize_design.heading', (o) => o.optimizeDesign?.heading],
        ['optimize.content', 'optimize_design.content', (o) => o.optimizeDesign?.content],
      ],
    },
    {
      page: 'projects',
      our: projects.FALLBACK_PROJECTS_PAGE_CONTENT,
      fields: [
        ['banner.title', 'top_banner.title', (o) => o.banner.title],
        ['banner.video', 'top_banner.vimeo_background_video', (o) => o.banner.vimeoBackgroundVideo],
        ['introduction', 'introduction', (o) => o.introduction],
        ['cta.heading', 'cta_banner.heading', (o) => o.cta.heading],
        ['cta.content', 'cta_banner.content', (o) => o.cta.content],
        ['cta.button', 'cta_banner.button', (o) => o.cta.button],
        ['cta.link', 'cta_banner.button_link', (o) => o.cta.buttonLink],
        ['cta.video', 'cta_banner.video_background', (o) => o.cta.videoBackground],
      ],
    },
    {
      page: 'articles',
      our: articles.FALLBACK_ARTICLES_PAGE_CONTENT,
      fields: [
        ['banner.title', 'top_banner.title', (o) => o.banner.title],
        ['banner.video', 'top_banner.vimeo_background_video', (o) => o.banner.vimeoBackgroundVideo],
        ['introduction', 'introduction', (o) => o.introduction],
        ['cta.heading', 'cta_banner.heading', (o) => o.cta.heading],
        ['cta.content', 'cta_banner.content', (o) => o.cta.content],
        ['cta.button', 'cta_banner.button', (o) => o.cta.button],
        ['cta.link', 'cta_banner.button_link', (o) => o.cta.buttonLink],
        ['cta.video', 'cta_banner.video_background', (o) => o.cta.videoBackground],
      ],
    },
  ]

  for (const c of comparisons) {
    const wp = load(c.page).acf ?? {}
    let same = 0
    let diff = 0
    let missing = 0
    const rows: string[] = []

    for (const [label, wpPath, getter] of c.fields) {
      const ourVal = getter(c.our)
      const wpVal = pick(wp, wpPath)
      if (wpVal === undefined || wpVal === null || wpVal === '') {
        missing += 1
        rows.push(`  EMPTY ${label}`)
        continue
      }
      if (norm(ourVal) === norm(wpVal)) {
        same += 1
      } else {
        diff += 1
        rows.push(`  DIFF  ${label}`)
        rows.push(`    ours: ${String(ourVal ?? '').replace(/\s+/g, ' ').slice(0, 110)}`)
        rows.push(`    wp:   ${String(wpVal ?? '').replace(/\s+/g, ' ').slice(0, 110)}`)
      }
    }

    console.log(`\n== ${c.page.toUpperCase()} == same=${same} diff=${diff} wpEmpty=${missing}`)
    for (const row of rows) console.log(row)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

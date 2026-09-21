/**
 * Sync page SEO + project seed data from live WordPress (cms.dxliving.com).
 * Does NOT update articles collection content.
 *
 * Usage: node --import tsx scripts/sync-wp-seed-data.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const WP_API = 'https://cms.dxliving.com/wp-json/wp/v2'

const PAGE_IDS: Record<string, number> = {
  home: 317,
  about: 309,
  modules: 323,
  studio: 331,
  interiors: 319,
  model: 321,
  prestige: 325,
  suppliers: 7,
  apply: 311,
  contact: 314,
  articles: 21,
  projects: 329,
  privacy: 327,
  terms: 333,
}

const decode = (value: unknown) =>
  String(value ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\u00a0/g, ' ')
    .trim()

const esc = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n')

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`)
  return (await res.json()) as T
}

type RankMath = {
  title?: string
  description?: string
  focus_keyword?: string
}

type WpPage = {
  acf?: Record<string, unknown>
  rank_math?: RankMath
}

type WpProject = {
  slug: string
  title?: { rendered?: string }
  acf?: {
    title?: string
    description?: string
    timeframe?: string
    location?: string
    state?: string
    technologies?: string
    status?: string
    project_listing_video?: string | number
    featured_title?: string
    link?: string
    type?: string
    center_hero_on_mobile?: boolean | string
    align_technologies_end?: boolean | string
    videos?: {
      top_banner?: string | number
      primary?: string | number
      gallery_left?: string | number
      gallery_right?: string | number
      fullwidth?: string | number
      carousel?: string | number | Array<string | number>
    }
  }
  rank_math?: RankMath
}

function replaceConstString(source: string, constName: string, next: string): string {
  // Only rewrite the string literal for this const — never consume following declarations.
  const patterns = [
    new RegExp(`(export const ${constName}\\s*=\\s*)'([^'\\\\]|\\\\.)*'`),
    new RegExp(`(export const ${constName}\\s*=\\s*)"([^"\\\\]|\\\\.)*"`),
    new RegExp(
      `(export const ${constName}\\s*=\\s*\\n\\s*)'([^'\\\\]|\\\\.)*'`,
    ),
    new RegExp(
      `(export const ${constName}\\s*=\\s*\\n\\s*)"([^"\\\\]|\\\\.)*"`,
    ),
  ]

  for (const re of patterns) {
    if (re.test(source)) {
      return source.replace(re, `$1'${esc(next)}'`)
    }
  }

  console.warn(`  skip missing const ${constName}`)
  return source
}

function setSeoConsts(
  filePath: string,
  map: { title: string; description: string; focus?: string; titleConst: string; descConst: string; focusConst?: string },
) {
  let src = fs.readFileSync(filePath, 'utf8')
  src = replaceConstString(src, map.titleConst, map.title)
  src = replaceConstString(src, map.descConst, map.description)
  if (map.focusConst && map.focus) {
    src = replaceConstString(src, map.focusConst, map.focus)
  }
  fs.writeFileSync(filePath, src)
  console.log(`updated SEO: ${path.relative(ROOT, filePath)}`)
}

function boolVal(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return fallback
}

function videoId(value: unknown, fallback = '') {
  const v = String(value ?? '').trim()
  return v || fallback
}

function parseCarousel(value: unknown, fallback: [string, string, string]): [string, string, string] {
  if (Array.isArray(value)) {
    const ids = value.map((item) => videoId(item)).filter(Boolean)
    if (ids.length >= 3) return [ids[0]!, ids[1]!, ids[2]!]
  }
  if (typeof value === 'string') {
    const ids = value.match(/\d+/g) ?? []
    if (ids.length >= 3) return [ids[0]!, ids[1]!, ids[2]!]
  }
  return fallback
}

/** Keep local image paths from current seed when WP has none. */
const PROJECT_IMAGE_FALLBACKS: Record<string, { image: string; images: string[] }> = {
  '251-station-st': {
    image: '/images/projects/251-station-st.jpg',
    images: ['/placeholdervid.mp4'],
  },
  '20-head-street': {
    image: '/images/projects/20-head-street.jpg',
    images: ['/placeholdervid.mp4'],
  },
  '85-commodore-drive': {
    image: '/images/projects/251-station-st.jpg',
    images: ['/placeholdervid.mp4'],
  },
  '813-clarendon-street': {
    image: '/images/projects/251-station-st.jpg',
    images: ['/placeholdervid.mp4'],
  },
  '31-mcilwain-drive': {
    image: '/images/projects/251-station-st.jpg',
    images: ['/placeholdervid.mp4'],
  },
  'nagambie-project': {
    image: '/images/projects/251-station-st.jpg',
    images: ['/placeholdervid.mp4'],
  },
}

async function syncProjects() {
  const posts = await fetchJson<WpProject[]>(`${WP_API}/site_project?per_page=100`)
  // Match previous seed order preference (station first historically); use WP order otherwise.
  const preferred = [
    '251-station-st',
    '20-head-street',
    '85-commodore-drive',
    '813-clarendon-street',
    '31-mcilwain-drive',
    'nagambie-project',
  ]
  const bySlug = new Map(posts.map((p) => [p.slug, p]))
  const ordered = [
    ...preferred.map((slug) => bySlug.get(slug)).filter(Boolean),
    ...posts.filter((p) => !preferred.includes(p.slug)),
  ] as WpProject[]

  const entries = ordered.map((pr) => {
    const a = pr.acf ?? {}
    const videos = a.videos ?? {}
    const media = PROJECT_IMAGE_FALLBACKS[pr.slug] ?? {
      image: '/images/projects/251-station-st.jpg',
      images: ['/placeholdervid.mp4'],
    }
    const carousel = parseCarousel(videos.carousel, ['1117005709', '1117005722', '1117005748'])
    const title = decode(a.title || pr.title?.rendered || pr.slug)
    const description = decode(a.description)
    const seoTitle = decode(pr.rank_math?.title) || `${title} | DX Living Project`
    const seoDescription = decode(pr.rank_math?.description)
    const link = decode(a.link) || `/projects/${pr.slug}`
    const center = boolVal(a.center_hero_on_mobile, false)
    const align = boolVal(a.align_technologies_end, false)

    const optionalFlags = [
      center ? '    centerHeroOnMobile: true,' : '',
      align ? '    alignTechnologiesEnd: true,' : '',
    ]
      .filter(Boolean)
      .join('\n')

    return `  {
    slug: '${pr.slug}',
    title: '${esc(title)}',
    description:
      '${esc(description)}',
    seoTitle: '${esc(seoTitle)}',
    seoDescription:
      '${esc(seoDescription)}',
    timeframe: '${esc(decode(a.timeframe))}',
    location: '${esc(decode(a.location))}',
    state: '${esc(decode(a.state))}',
    technologies: '${esc(decode(a.technologies))}',
    status: '${esc(decode(a.status) || 'Completed')}',
    video: '${esc(videoId(a.project_listing_video))}',
    videos: {
      hero: '${esc(videoId(videos.top_banner))}',
      primary: '${esc(videoId(videos.primary))}',
      galleryLeft: '${esc(videoId(videos.gallery_left))}',
      galleryRight: '${esc(videoId(videos.gallery_right))}',
      fullWidth: '${esc(videoId(videos.fullwidth))}',
      carousel: ['${carousel[0]}', '${carousel[1]}', '${carousel[2]}'],
    },
    featuredTitle: '${esc(decode(a.featured_title))}',
    link: '${esc(link)}',
    type: '${esc(decode(a.type) || 'Residential')}',
    image: '${media.image}',
    images: ${JSON.stringify(media.images)},${optionalFlags ? `\n${optionalFlags}` : ''}
  }`
  })

  const out = `export interface ProjectVideos {
  hero: string;
  primary: string;
  galleryLeft: string;
  galleryRight: string;
  fullWidth: string;
  carousel: [string, string, string];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  timeframe: string;
  location: string;
  state: string;
  technologies: string;
  status: string;
  /** Vimeo ID for the projects listing card preview */
  video: string;
  videos: ProjectVideos;
  featuredTitle: string;
  link: string;
  type: string;
  image: string;
  images: string[];
  /** Center hero title on mobile (reference layout for select projects) */
  centerHeroOnMobile?: boolean;
  /** Right-align long technologies list in meta block */
  alignTechnologiesEnd?: boolean;
}

export const projects: Project[] = [
${entries.join(',\n')}
];

export const getProjectBySlug = (slug: string) => projects.find((project) => project.slug === slug);

export const getProjectPath = (slug: string) => \`/projects/\${slug}\`;
`

  fs.writeFileSync(path.join(ROOT, 'src/data/projects.ts'), out)
  console.log(`updated projects: ${ordered.map((p) => p.slug).join(', ')}`)
}

async function syncPageSeo() {
  const pages = Object.fromEntries(
    await Promise.all(
      Object.entries(PAGE_IDS).map(async ([key, id]) => {
        const page = await fetchJson<WpPage>(`${WP_API}/pages/${id}`)
        return [key, page] as const
      }),
    ),
  ) as Record<string, WpPage>

  const seo = (key: string) => {
    const rm = pages[key]?.rank_math ?? {}
    return {
      title: decode(rm.title),
      description: decode(rm.description),
      focus: decode(rm.focus_keyword),
    }
  }

  // Home SEO lives in homepageSchema
  {
    const s = seo('home')
    setSeoConsts(path.join(ROOT, 'src/lib/seo/homepageSchema.ts'), {
      title: s.title,
      description: s.description,
      focus: s.focus,
      titleConst: 'HOMEPAGE_METADATA_TITLE',
      descConst: 'HOMEPAGE_METADATA_DESCRIPTION',
      focusConst: 'HOMEPAGE_FOCUS_KEYWORD',
    })
  }

  const pageMaps: Array<{
    key: string
    file: string
    titleConst: string
    descConst: string
    focusConst?: string
  }> = [
    { key: 'about', file: 'src/lib/about/defaults.ts', titleConst: 'ABOUT_METADATA_TITLE', descConst: 'ABOUT_METADATA_DESCRIPTION', focusConst: 'ABOUT_FOCUS_KEYWORD' },
    { key: 'modules', file: 'src/lib/modules/defaults.ts', titleConst: 'MODULES_METADATA_TITLE', descConst: 'MODULES_METADATA_DESCRIPTION', focusConst: 'MODULES_FOCUS_KEYWORD' },
    { key: 'studio', file: 'src/lib/studio/defaults.ts', titleConst: 'STUDIO_METADATA_TITLE', descConst: 'STUDIO_METADATA_DESCRIPTION', focusConst: 'STUDIO_FOCUS_KEYWORD' },
    { key: 'interiors', file: 'src/lib/interiors/defaults.ts', titleConst: 'INTERIORS_METADATA_TITLE', descConst: 'INTERIORS_METADATA_DESCRIPTION', focusConst: 'INTERIORS_FOCUS_KEYWORD' },
    { key: 'model', file: 'src/lib/model/defaults.ts', titleConst: 'MODEL_METADATA_TITLE', descConst: 'MODEL_METADATA_DESCRIPTION', focusConst: 'MODEL_FOCUS_KEYWORD' },
    { key: 'prestige', file: 'src/lib/prestige/defaults.ts', titleConst: 'PRESTIGE_METADATA_TITLE', descConst: 'PRESTIGE_METADATA_DESCRIPTION', focusConst: 'PRESTIGE_FOCUS_KEYWORD' },
    { key: 'suppliers', file: 'src/lib/suppliers/defaults.ts', titleConst: 'SUPPLIERS_METADATA_TITLE', descConst: 'SUPPLIERS_METADATA_DESCRIPTION', focusConst: 'SUPPLIERS_FOCUS_KEYWORD' },
    { key: 'apply', file: 'src/lib/apply/defaults.ts', titleConst: 'APPLY_METADATA_TITLE', descConst: 'APPLY_METADATA_DESCRIPTION', focusConst: 'APPLY_FOCUS_KEYWORD' },
    { key: 'contact', file: 'src/lib/contact/defaults.ts', titleConst: 'CONTACT_METADATA_TITLE', descConst: 'CONTACT_METADATA_DESCRIPTION', focusConst: 'CONTACT_FOCUS_KEYWORD' },
    { key: 'articles', file: 'src/lib/articles/defaults.ts', titleConst: 'ARTICLES_METADATA_TITLE', descConst: 'ARTICLES_METADATA_DESCRIPTION', focusConst: 'ARTICLES_FOCUS_KEYWORD' },
    { key: 'projects', file: 'src/lib/projects/defaults.ts', titleConst: 'PROJECTS_METADATA_TITLE', descConst: 'PROJECTS_METADATA_DESCRIPTION', focusConst: 'PROJECTS_FOCUS_KEYWORD' },
    { key: 'privacy', file: 'src/lib/privacy/defaults.ts', titleConst: 'PRIVACY_METADATA_TITLE', descConst: 'PRIVACY_METADATA_DESCRIPTION' },
    { key: 'terms', file: 'src/lib/terms/defaults.ts', titleConst: 'TERMS_METADATA_TITLE', descConst: 'TERMS_METADATA_DESCRIPTION' },
  ]

  for (const item of pageMaps) {
    const s = seo(item.key)
    if (!s.title || !s.description) {
      console.warn(`missing SEO for ${item.key}`)
      continue
    }
    setSeoConsts(path.join(ROOT, item.file), {
      title: s.title,
      description: s.description,
      focus: s.focus,
      titleConst: item.titleConst,
      descConst: item.descConst,
      focusConst: item.focusConst,
    })
  }

  return pages
}

function textField(value: unknown, fallback = '') {
  if (typeof value !== 'string') return fallback
  return decode(value) || fallback
}

function updateProjectsPageContent(page: WpPage) {
  const acf = page.acf ?? {}
  const banner = (acf.top_banner ?? {}) as Record<string, unknown>
  const cta = (acf.cta_banner ?? {}) as Record<string, unknown>
  const file = path.join(ROOT, 'src/lib/projects/defaults.ts')
  let src = fs.readFileSync(file, 'utf8')

  const title = textField(banner.title, 'PROJECTS')
  const video = textField(banner.vimeo_background_video ?? banner.vimeoBackgroundVideo, '1117308063')
  const introduction = textField(acf.introduction)
  const ctaHeading = textField(cta.heading)
  const ctaContent = textField(cta.content)
  const ctaButton = textField(cta.button)
  const ctaLink = textField(cta.button_link ?? cta.buttonLink, '/contact')
  const ctaVideo = textField(cta.video_background ?? cta.videoBackground, '1117308030')

  // Replace FALLBACK object fields carefully via regex on known strings only if WP provided values.
  if (title) {
    src = src.replace(
      /(banner:\s*\{\s*title:\s*)'[^']*'/,
      `$1'${esc(title)}'`,
    )
  }
  if (video) {
    src = src.replace(
      /(vimeoBackgroundVideo:\s*)'[^']*'/,
      `$1'${esc(video)}'`,
    )
  }
  if (introduction) {
    src = src.replace(
      /(introduction:\s*)'[^']*'/,
      `$1'${esc(introduction)}'`,
    )
    src = src.replace(
      /(introduction:\s*)`[^`]*`/,
      `$1'${esc(introduction)}'`,
    )
  }
  if (ctaHeading) {
    src = src.replace(
      /(cta:\s*\{[\s\S]*?heading:\s*)'[^']*'/,
      `$1'${esc(ctaHeading)}'`,
    )
  }
  if (ctaContent) {
    src = src.replace(
      /(cta:\s*\{[\s\S]*?content:\s*)'[^']*'/,
      `$1'${esc(ctaContent)}'`,
    )
    src = src.replace(
      /(cta:\s*\{[\s\S]*?content:\s*)`[^`]*`/,
      `$1'${esc(ctaContent)}'`,
    )
  }
  if (ctaButton) {
    src = src.replace(
      /(cta:\s*\{[\s\S]*?button:\s*)'[^']*'/,
      `$1'${esc(ctaButton)}'`,
    )
  }
  if (ctaLink) {
    src = src.replace(
      /(cta:\s*\{[\s\S]*?buttonLink:\s*)'[^']*'/,
      `$1'${esc(ctaLink)}'`,
    )
  }
  if (ctaVideo) {
    src = src.replace(
      /(cta:\s*\{[\s\S]*?videoBackground:\s*)'[^']*'/,
      `$1'${esc(ctaVideo)}'`,
    )
  }

  fs.writeFileSync(file, src)
  console.log('updated projects page content fields from WP ACF')
}

function updateArticlesPageContent(page: WpPage) {
  // Listing page chrome only — not article docs.
  const acf = page.acf ?? {}
  const banner = (acf.top_banner ?? {}) as Record<string, unknown>
  const cta = (acf.cta_banner ?? {}) as Record<string, unknown>
  const file = path.join(ROOT, 'src/lib/articles/defaults.ts')
  let src = fs.readFileSync(file, 'utf8')

  const title = textField(banner.title)
  const video = textField(banner.vimeo_background_video ?? banner.vimeoBackgroundVideo)
  const introduction = textField(acf.introduction)
  const ctaHeading = textField(cta.heading)
  const ctaContent = textField(cta.content)
  const ctaButton = textField(cta.button)
  const ctaLink = textField(cta.button_link ?? cta.buttonLink)
  const ctaVideo = textField(cta.video_background ?? cta.videoBackground)

  if (title) src = src.replace(/(banner:\s*\{\s*title:\s*)'[^']*'/, `$1'${esc(title)}'`)
  if (video) src = src.replace(/(vimeoBackgroundVideo:\s*)'[^']*'/, `$1'${esc(video)}'`)
  if (introduction) {
    src = src.replace(/(introduction:\s*)'[^']*'/, `$1'${esc(introduction)}'`)
    src = src.replace(/(introduction:\s*)`[^`]*`/, `$1'${esc(introduction)}'`)
  }
  if (ctaHeading) src = src.replace(/(cta:\s*\{[\s\S]*?heading:\s*)'[^']*'/, `$1'${esc(ctaHeading)}'`)
  if (ctaContent) {
    src = src.replace(/(cta:\s*\{[\s\S]*?content:\s*)'[^']*'/, `$1'${esc(ctaContent)}'`)
    src = src.replace(/(cta:\s*\{[\s\S]*?content:\s*)`[^`]*`/, `$1'${esc(ctaContent)}'`)
  }
  if (ctaButton) src = src.replace(/(cta:\s*\{[\s\S]*?button:\s*)'[^']*'/, `$1'${esc(ctaButton)}'`)
  if (ctaLink) src = src.replace(/(cta:\s*\{[\s\S]*?buttonLink:\s*)'[^']*'/, `$1'${esc(ctaLink)}'`)
  if (ctaVideo) src = src.replace(/(cta:\s*\{[\s\S]*?videoBackground:\s*)'[^']*'/, `$1'${esc(ctaVideo)}'`)

  fs.writeFileSync(file, src)
  console.log('updated articles page listing content from WP ACF (not article docs)')
}

async function main() {
  console.log('Fetching WordPress pages + projects…')
  const pages = await syncPageSeo()
  await syncProjects()
  updateProjectsPageContent(pages.projects)
  updateArticlesPageContent(pages.articles)
  console.log('Done. Articles collection seed left untouched.')
  console.log('Re-run: npm run seed:projects && page seeds as needed.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

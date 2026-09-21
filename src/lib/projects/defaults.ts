import { emptySeoData } from '@/lib/seo/types'
import { projects as fallbackProjects } from '@/data/projects'
import type { ProjectsPageCmsContent, ProjectsPageContentData } from './types'

/** Fixed Projects listing section targets — not editable in CMS. */
export const PROJECTS_ANCHOR_SECTION_IDS = [
  'intro',
  'section-1',
  'section-4',
  'contact-us',
] as const

export const FALLBACK_PROJECTS_PAGE_CONTENT: ProjectsPageContentData = {
  banner: {
    title: 'PROJECTS',
    vimeoBackgroundVideo: '1117308063',
  },
  anchorMenu: [
    { id: 'intro', label: 'Introduction' },
    { id: 'section-1', label: 'Our Projects' },
    { id: 'section-4', label: 'LinkedIn Stories' },
    { id: 'contact-us', label: 'Contact Us' },
  ],
  introduction:
    'Immerse yourself in our collection of beautifully crafted projects brought to life by <strong>DX</strong> LIVING.',
  cta: {
    heading: 'BRING YOUR DREAM HOME TO LIFE WITH OUR EXPERT TEAM TODAY',
    content:
      "Collaborate with our specialists to design, visualise, and experience your project before it's built.",
    button: 'Connect with DX LIVING',
    buttonLink: '/contact',
    videoBackground: '1117308030',
  },
}

export const PROJECTS_METADATA_TITLE =
  'Home Construction Projects Australia | DX Living Projects'
export const PROJECTS_METADATA_DESCRIPTION =
  'Explore home construction projects in Australia by DX Living. Discover luxury residential builds designed with precision, innovation and architectural clarity.'
export const PROJECTS_FOCUS_KEYWORD = 'home construction projects Australia'
export const projectsPageDefaults: ProjectsPageCmsContent = {
  ...FALLBACK_PROJECTS_PAGE_CONTENT,
  projects: fallbackProjects,
  seo: emptySeoData({
    title: PROJECTS_METADATA_TITLE,
    description: PROJECTS_METADATA_DESCRIPTION,
    focusKeyword: PROJECTS_FOCUS_KEYWORD,
    ogTitle: PROJECTS_METADATA_TITLE,
    ogDescription: PROJECTS_METADATA_DESCRIPTION,
    ogImageUrl: '/og/projects-og.jpg',
    twitterTitle: PROJECTS_METADATA_TITLE,
    twitterDescription: PROJECTS_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/projects-og.jpg',
  }),
}

export const PROJECT_SLUG_ALIASES: Record<string, string> = {
  '85-commodore-drive-surfers-paradise': '85-commodore-drive',
}

export function canonicalizeProjectSlug(slug: string): string {
  return PROJECT_SLUG_ALIASES[slug] ?? slug
}

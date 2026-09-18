import type { MetadataRoute } from 'next'
import { getApplyPageContent } from '@/lib/apply/getApplyPageContent'
import { getAboutPageContent } from '@/lib/about/getAboutPageContent'
import { getContactPageContent } from '@/lib/contact/getContactPageContent'
import { getHomePageContent } from '@/lib/home/getHomePageContent'
import { getInteriorsPageContent } from '@/lib/interiors/getInteriorsPageContent'
import { getModelPageContent } from '@/lib/model/getModelPageContent'
import { getModulesPageContent } from '@/lib/modules/getModulesPageContent'
import { getPrestigePageContent } from '@/lib/prestige/getPrestigePageContent'
import { getArticlesPageContent } from '@/lib/articles/getArticlesPageContent'
import { slugFromLink } from '@/data/articles'
import { getAllProjects } from '@/lib/projects/getProjects'
import { getProjectsPageContent } from '@/lib/projects/getProjectsPageContent'
import { getPrivacyPageContent } from '@/lib/privacy/getPrivacyPageContent'
import { getStudioPageContent } from '@/lib/studio/getStudioPageContent'
import { getSuppliersPageContent } from '@/lib/suppliers/getSuppliersPageContent'
import { getTermsPageContent } from '@/lib/terms/getTermsPageContent'
import { getFaqPageContent } from '@/lib/faq/getFaqPageContent'
import { getStartInteractivePageContent } from '@/lib/start-interactive/getStartInteractivePageContent'
import { getDxModelPageContent } from '@/lib/start-interactive/getDxModelPageContent'
import { getDxModelLitePageContent } from '@/lib/start-interactive/getDxModelLitePageContent'
import { getSiteUrl, isSearchIndexingEnabled } from '@/lib/siteUrl'

/** Soft cache; CMS saves also call revalidatePath('/sitemap.xml'). */
export const revalidate = 3600

type SitemapEntry = MetadataRoute.Sitemap[number]

type PageKey =
  | 'home'
  | 'about'
  | 'modules'
  | 'studio'
  | 'privacy'
  | 'terms'
  | 'interiors'
  | 'model'
  | 'prestige'
  | 'suppliers'
  | 'apply'
  | 'contact'
  | 'projects'
  | 'articles'
  | 'faq'
  | 'startInteractive'
  | 'dxModelInteractive'
  | 'dxModelLiteInteractive'

const PAGE_ROUTES: Array<{
  key: PageKey
  path: string
  changeFrequency: SitemapEntry['changeFrequency']
  priority: number
}> = [
  { key: 'home', path: '/', changeFrequency: 'weekly', priority: 1 },
  { key: 'about', path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { key: 'modules', path: '/modules', changeFrequency: 'monthly', priority: 0.8 },
  { key: 'studio', path: '/studio', changeFrequency: 'monthly', priority: 0.8 },
  { key: 'privacy', path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { key: 'terms', path: '/terms-of-service', changeFrequency: 'yearly', priority: 0.3 },
  { key: 'interiors', path: '/interiors', changeFrequency: 'monthly', priority: 0.8 },
  { key: 'model', path: '/model', changeFrequency: 'monthly', priority: 0.8 },
  { key: 'prestige', path: '/prestige', changeFrequency: 'monthly', priority: 0.8 },
  { key: 'suppliers', path: '/suppliers', changeFrequency: 'monthly', priority: 0.8 },
  { key: 'apply', path: '/apply', changeFrequency: 'monthly', priority: 0.7 },
  { key: 'contact', path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  { key: 'projects', path: '/projects', changeFrequency: 'monthly', priority: 0.8 },
  { key: 'articles', path: '/articles', changeFrequency: 'weekly', priority: 0.8 },
  { key: 'faq', path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
  { key: 'startInteractive', path: '/start-interactive', changeFrequency: 'monthly', priority: 0.6 },
  {
    key: 'dxModelInteractive',
    path: '/start-interactive/dx-model',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    key: 'dxModelLiteInteractive',
    path: '/start-interactive/dx-model-lite',
    changeFrequency: 'monthly',
    priority: 0.5,
  },
]

const EXTRA_ROUTES: Array<{
  path: string
  changeFrequency: SitemapEntry['changeFrequency']
  priority: number
}> = [
  { path: '/llms.txt', changeFrequency: 'weekly', priority: 0.5 },
  { path: '/llms-full.txt', changeFrequency: 'weekly', priority: 0.4 },
]

function isLocalPreviewHost(siteUrl: string): boolean {
  try {
    const host = new URL(siteUrl).hostname.toLowerCase()
    return host === 'localhost' || host === '127.0.0.1'
  } catch {
    return false
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()

  if (!isSearchIndexingEnabled() && !isLocalPreviewHost(siteUrl)) {
    return []
  }

  const lastModified = new Date()

  const indexable: Record<PageKey, boolean> = {
    home: true,
    about: true,
    modules: true,
    studio: true,
    privacy: true,
    terms: true,
    interiors: true,
    model: true,
    prestige: true,
    suppliers: true,
    apply: true,
    contact: true,
    projects: true,
    articles: true,
    faq: true,
    startInteractive: true,
    dxModelInteractive: true,
    dxModelLiteInteractive: true,
  }

  let projectEntries: MetadataRoute.Sitemap = []
  let articleEntries: MetadataRoute.Sitemap = []

  try {
    const [
      home,
      about,
      modules,
      studio,
      privacy,
      terms,
      interiors,
      model,
      prestige,
      suppliers,
      apply,
      contact,
      projectsPage,
      projects,
      articlesPage,
      faq,
      startInteractive,
      dxModelInteractive,
      dxModelLiteInteractive,
    ] = await Promise.all([
      getHomePageContent(),
      getAboutPageContent(),
      getModulesPageContent(),
      getStudioPageContent(),
      getPrivacyPageContent(),
      getTermsPageContent(),
      getInteriorsPageContent(),
      getModelPageContent(),
      getPrestigePageContent(),
      getSuppliersPageContent(),
      getApplyPageContent(),
      getContactPageContent(),
      getProjectsPageContent(),
      getAllProjects(),
      getArticlesPageContent(),
      getFaqPageContent(),
      getStartInteractivePageContent(),
      getDxModelPageContent(),
      getDxModelLitePageContent(),
    ])

    indexable.home = !home.seo.noIndex
    indexable.about = !about.seo.noIndex
    indexable.modules = !modules.seo.noIndex
    indexable.studio = !studio.seo.noIndex
    indexable.privacy = !privacy.seo.noIndex
    indexable.terms = !terms.seo.noIndex
    indexable.interiors = !interiors.seo.noIndex
    indexable.model = !model.seo.noIndex
    indexable.prestige = !prestige.seo.noIndex
    indexable.suppliers = !suppliers.seo.noIndex
    indexable.apply = !apply.seo.noIndex
    indexable.contact = !contact.seo.noIndex
    indexable.projects = !projectsPage.seo.noIndex
    indexable.articles = !articlesPage.seo.noIndex
    indexable.faq = !faq.seo.noIndex
    indexable.startInteractive = !startInteractive.seo.noIndex
    indexable.dxModelInteractive = !dxModelInteractive.seo.noIndex
    indexable.dxModelLiteInteractive = !dxModelLiteInteractive.seo.noIndex

    if (indexable.projects) {
      projectEntries = projects
        .filter((project) => !project.seo.noIndex)
        .map((project) => ({
          url: `${siteUrl}/projects/${project.slug}`,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
    }

    if (indexable.articles) {
      articleEntries = articlesPage.articles
        .filter((article) => !article.seo.noIndex)
        .map((article) => ({
          url: `${siteUrl}/articles/${slugFromLink(article.link)}`,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
    }
  } catch {
    // Keep core pages in sitemap when CMS is unreachable.
  }

  const pageEntries: MetadataRoute.Sitemap = PAGE_ROUTES.filter(
    (route) => indexable[route.key],
  ).map((route) => ({
    url: `${siteUrl}${route.path === '/' ? '' : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const extraEntries: MetadataRoute.Sitemap = EXTRA_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  return [...pageEntries, ...projectEntries, ...articleEntries, ...extraEntries]
}

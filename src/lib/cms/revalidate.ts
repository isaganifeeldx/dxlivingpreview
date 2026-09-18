import { revalidatePath } from 'next/cache'

/** Public URL + App Router path (rewrites map public → /pages/...). */
function revalidatePublicAndPages(publicPath: string) {
  const pagesPath = publicPath === '/' ? '/pages/home' : `/pages${publicPath}`

  revalidatePath(publicPath)
  revalidatePath(pagesPath)
}

export function revalidateHome() {
  revalidatePublicAndPages('/')
  revalidatePath('/sitemap.xml')
}

export function revalidateAbout() {
  revalidatePublicAndPages('/about')
  revalidatePath('/sitemap.xml')
}

export function revalidateModules() {
  revalidatePublicAndPages('/modules')
  revalidatePath('/sitemap.xml')
}

export function revalidateStudio() {
  revalidatePublicAndPages('/studio')
  revalidatePath('/sitemap.xml')
}

export function revalidatePrivacyPolicy() {
  revalidatePublicAndPages('/privacy-policy')
  revalidatePath('/sitemap.xml')
}

export function revalidateTermsOfService() {
  revalidatePublicAndPages('/terms-of-service')
  revalidatePath('/sitemap.xml')
}

export function revalidateFaq() {
  revalidatePublicAndPages('/faq')
  revalidatePath('/')
  revalidatePath('/pages/home')
  revalidatePath('/sitemap.xml')
}

export function revalidateNotFound() {
  // 404 UI is shared; layout refresh picks up CMS copy on next miss.
  revalidatePath('/', 'layout')
  revalidatePath('/pages/home', 'layout')
}

export function revalidateLogin() {
  revalidatePublicAndPages('/login')
  revalidatePath('/sitemap.xml')
}

export function revalidateRegister() {
  revalidatePublicAndPages('/register')
  revalidatePath('/sitemap.xml')
}

export function revalidateStartInteractive() {
  revalidatePublicAndPages('/start-interactive')
  revalidatePath('/sitemap.xml')
}

export function revalidateDxModelInteractive() {
  revalidatePublicAndPages('/start-interactive/dx-model')
  revalidatePath('/sitemap.xml')
}

export function revalidateDxModelLiteInteractive() {
  revalidatePublicAndPages('/start-interactive/dx-model-lite')
  revalidatePath('/sitemap.xml')
}

export function revalidateSiteSettings() {
  revalidatePath('/', 'layout')
  revalidatePath('/pages/home', 'layout')
  revalidatePublicAndPages('/about')
  revalidatePublicAndPages('/modules')
  revalidatePublicAndPages('/studio')
  revalidatePublicAndPages('/interiors')
  revalidatePublicAndPages('/model')
  revalidatePublicAndPages('/prestige')
  revalidatePublicAndPages('/suppliers')
  revalidatePublicAndPages('/apply')
  revalidatePublicAndPages('/contact')
  revalidatePublicAndPages('/projects')
  revalidatePublicAndPages('/articles')
  revalidatePublicAndPages('/privacy-policy')
  revalidatePublicAndPages('/terms-of-service')
  revalidatePublicAndPages('/faq')
  revalidatePublicAndPages('/login')
  revalidatePublicAndPages('/register')
  revalidatePublicAndPages('/start-interactive')
  revalidatePublicAndPages('/start-interactive/dx-model')
  revalidatePublicAndPages('/start-interactive/dx-model-lite')
  revalidatePath('/sitemap.xml')
}

export function revalidateInteriors() {
  revalidatePublicAndPages('/interiors')
  revalidatePath('/sitemap.xml')
}

export function revalidateModel() {
  revalidatePublicAndPages('/model')
  revalidatePath('/sitemap.xml')
}

export function revalidatePrestige() {
  revalidatePublicAndPages('/prestige')
  revalidatePath('/sitemap.xml')
}

export function revalidateSuppliers() {
  revalidatePublicAndPages('/suppliers')
  revalidatePath('/sitemap.xml')
}

export function revalidateApply() {
  revalidatePublicAndPages('/apply')
  revalidatePath('/sitemap.xml')
}

export function revalidateContact() {
  revalidatePublicAndPages('/contact')
  revalidatePath('/sitemap.xml')
}

export function revalidateArticlesListing() {
  revalidatePublicAndPages('/articles')
  revalidatePath('/')
  revalidatePath('/pages/home')
  revalidatePath('/sitemap.xml')
}

export function revalidateArticle(slug: string | null | undefined) {
  revalidateArticlesListing()
  if (!slug?.trim()) return
  const normalized = slug.trim()
  revalidatePath(`/articles/${normalized}`)
  revalidatePath(`/pages/articles/${normalized}`)
}

export function revalidateProjectsListing() {
  revalidatePublicAndPages('/projects')
  revalidatePath('/sitemap.xml')
}

export function revalidateProject(slug: string | null | undefined) {
  revalidateProjectsListing()
  if (!slug?.trim()) return
  const normalized = slug.trim()
  revalidatePath(`/projects/${normalized}`)
  revalidatePath(`/pages/projects/${normalized}`)
}

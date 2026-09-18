import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import {
  revalidateAbout,
  revalidateArticle,
  revalidateArticlesListing,
  revalidateApply,
  revalidateContact,
  revalidateHome,
  revalidateInteriors,
  revalidateModel,
  revalidateModules,
  revalidatePrestige,
  revalidateDxModelInteractive,
  revalidateDxModelLiteInteractive,
  revalidateFaq,
  revalidateNotFound,
  revalidateLogin,
  revalidatePrivacyPolicy,
  revalidateProject,
  revalidateProjectsListing,
  revalidateRegister,
  revalidateStartInteractive,
  revalidateStudio,
  revalidateSuppliers,
  revalidateTermsOfService,
  revalidateSiteSettings,
} from '@/lib/cms/revalidate'

function runSafe(label: string, fn: () => void) {
  try {
    fn()
  } catch (error) {
    console.error(`[cms] Failed to revalidate after ${label}:`, error)
  }
}

export const revalidateHomeGlobal: GlobalAfterChangeHook = () => {
  runSafe('home', revalidateHome)
}

export const revalidateAboutGlobal: GlobalAfterChangeHook = () => {
  runSafe('about', revalidateAbout)
}

export const revalidateModulesGlobal: GlobalAfterChangeHook = () => {
  runSafe('modules', revalidateModules)
}

export const revalidateStudioGlobal: GlobalAfterChangeHook = () => {
  runSafe('studio', revalidateStudio)
}

export const revalidatePrivacyPolicyGlobal: GlobalAfterChangeHook = () => {
  runSafe('privacy-policy', revalidatePrivacyPolicy)
}

export const revalidateTermsOfServiceGlobal: GlobalAfterChangeHook = () => {
  runSafe('terms-of-service', revalidateTermsOfService)
}

export const revalidateFaqGlobal: GlobalAfterChangeHook = () => {
  runSafe('faq', revalidateFaq)
}

export const revalidateNotFoundGlobal: GlobalAfterChangeHook = () => {
  runSafe('not-found', revalidateNotFound)
}

export const revalidateLoginGlobal: GlobalAfterChangeHook = () => {
  runSafe('login', revalidateLogin)
}

export const revalidateRegisterGlobal: GlobalAfterChangeHook = () => {
  runSafe('register', revalidateRegister)
}

export const revalidateStartInteractiveGlobal: GlobalAfterChangeHook = () => {
  runSafe('start-interactive', revalidateStartInteractive)
}

export const revalidateDxModelInteractiveGlobal: GlobalAfterChangeHook = () => {
  runSafe('dx-model', revalidateDxModelInteractive)
}

export const revalidateDxModelLiteInteractiveGlobal: GlobalAfterChangeHook = () => {
  runSafe('dx-model-lite', revalidateDxModelLiteInteractive)
}

export const revalidateSettingsGlobal: GlobalAfterChangeHook = () => {
  runSafe('settings', revalidateSiteSettings)
}

export const revalidateInteriorsGlobal: GlobalAfterChangeHook = () => {
  runSafe('interiors', revalidateInteriors)
}

export const revalidateModelGlobal: GlobalAfterChangeHook = () => {
  runSafe('model', revalidateModel)
}

export const revalidatePrestigeGlobal: GlobalAfterChangeHook = () => {
  runSafe('prestige', revalidatePrestige)
}

export const revalidateSuppliersGlobal: GlobalAfterChangeHook = () => {
  runSafe('suppliers', revalidateSuppliers)
}

export const revalidateApplyGlobal: GlobalAfterChangeHook = () => {
  runSafe('apply', revalidateApply)
}

export const revalidateContactGlobal: GlobalAfterChangeHook = () => {
  runSafe('contact', revalidateContact)
}

export const revalidateArticlesPageGlobal: GlobalAfterChangeHook = () => {
  runSafe('articles-page', revalidateArticlesListing)
}

export const revalidateArticleAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  const slug = typeof doc?.slug === 'string' ? doc.slug : null
  runSafe(`article:${slug ?? 'unknown'}`, () => revalidateArticle(slug))
}

export const revalidateArticleAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  const slug = typeof doc?.slug === 'string' ? doc.slug : null
  runSafe(`article-delete:${slug ?? 'unknown'}`, () => revalidateArticle(slug))
}

export const revalidateArticleCategoriesAfterChange: CollectionAfterChangeHook = () => {
  runSafe('article-categories', revalidateArticlesListing)
}

export const revalidateArticleCategoriesAfterDelete: CollectionAfterDeleteHook = () => {
  runSafe('article-categories-delete', revalidateArticlesListing)
}

export const revalidateProjectsPageGlobal: GlobalAfterChangeHook = () => {
  runSafe('projects-page', revalidateProjectsListing)
}

export const revalidateProjectAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  const slug = typeof doc?.slug === 'string' ? doc.slug : null
  runSafe(`project:${slug ?? 'unknown'}`, () => revalidateProject(slug))
}

export const revalidateProjectAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  const slug = typeof doc?.slug === 'string' ? doc.slug : null
  runSafe(`project-delete:${slug ?? 'unknown'}`, () => revalidateProject(slug))
}

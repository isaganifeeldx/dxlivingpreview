/**
 * Article category helpers.
 *
 * Public URLs use category slugs (`/articles?category=project-planning`).
 * Legacy numeric ids (`5`–`9`) still resolve for old links.
 */

export type ArticleCategory = {
  /** URL slug used in ?category= and article.category */
  id: string
  label: string
  sortOrder: number
}

/** Built-in categories (also seeded into CMS). */
export const FALLBACK_ARTICLE_CATEGORIES: ArticleCategory[] = [
  {
    id: 'homes-residential-guides',
    label: 'Homes & residential guides',
    sortOrder: 0,
  },
  {
    id: 'project-planning',
    label: 'Project planning',
    sortOrder: 1,
  },
  {
    id: 'bim-digital-construction',
    label: 'BIM & digital construction',
    sortOrder: 2,
  },
  {
    id: 'immersive-design-vr-technology',
    label: 'Immersive design & VR technology',
    sortOrder: 3,
  },
  {
    id: 'off-the-plan-sales',
    label: 'Off-the-plan sales',
    sortOrder: 4,
  },
]

/** Old select values from the WordPress / static library era. */
export const LEGACY_ARTICLE_CATEGORY_ID_TO_SLUG: Record<string, string> = {
  '5': 'homes-residential-guides',
  '6': 'project-planning',
  '7': 'bim-digital-construction',
  '8': 'immersive-design-vr-technology',
  '9': 'off-the-plan-sales',
}

const FALLBACK_BY_ID = Object.fromEntries(
  FALLBACK_ARTICLE_CATEGORIES.map((category) => [category.id, category]),
) as Record<string, ArticleCategory>

/** @deprecated Prefer ArticleCategory.id (slug). Kept for older call sites. */
export type ArticleCategoryId = string

export const ARTICLE_CATEGORY_ORDER: ArticleCategoryId[] =
  FALLBACK_ARTICLE_CATEGORIES.map((category) => category.id)

export const ARTICLE_CATEGORIES: Record<string, string> = Object.fromEntries(
  FALLBACK_ARTICLE_CATEGORIES.map((category) => [category.id, category.label]),
)

export const ARTICLE_CATEGORY_SLUGS: Record<string, string> = Object.fromEntries(
  FALLBACK_ARTICLE_CATEGORIES.map((category) => [category.id, category.id]),
)

export type ArticleCategorySlug = string

export function normalizeArticleCategoryId(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? ''
  if (!trimmed) return ''
  return LEGACY_ARTICLE_CATEGORY_ID_TO_SLUG[trimmed] ?? trimmed
}

export function getArticleCategoryLabel(
  categoryId: string,
  categories: ArticleCategory[] = FALLBACK_ARTICLE_CATEGORIES,
): string {
  const normalized = normalizeArticleCategoryId(categoryId)
  if (!normalized) return ''

  const fromList = categories.find((category) => category.id === normalized)
  if (fromList) return fromList.label

  return FALLBACK_BY_ID[normalized]?.label ?? normalized
}

export function getArticleCategorySlug(categoryId: ArticleCategoryId): string {
  return normalizeArticleCategoryId(categoryId) || categoryId
}

/** Accepts a slug or legacy numeric id from ?category= */
export function resolveArticleCategoryId(
  param: string | null,
  fallback: ArticleCategoryId,
  categories: ArticleCategory[] = FALLBACK_ARTICLE_CATEGORIES,
): ArticleCategoryId {
  if (!param) return fallback

  const normalized = normalizeArticleCategoryId(param)
  if (categories.some((category) => category.id === normalized)) {
    return normalized
  }
  if (FALLBACK_BY_ID[normalized]) return normalized

  return fallback
}

export function isLegacyArticleCategoryIdParam(
  param: string | null,
): param is keyof typeof LEGACY_ARTICLE_CATEGORY_ID_TO_SLUG {
  return Boolean(param && param in LEGACY_ARTICLE_CATEGORY_ID_TO_SLUG)
}

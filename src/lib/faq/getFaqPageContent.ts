import { cache } from 'react'
import type { FaqCategoryId, FaqItem } from '@/data/faqData'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
import { mapCmsSeo, type CmsSeo } from '@/lib/seo/mapCmsSeo'
import { faqPageDefaults, FALLBACK_FAQ_CONTENT } from './defaults'
import type { FaqPageContentData } from './types'

const CATEGORIES = new Set<FaqCategoryId>([
  'general',
  'studio',
  'interiors',
  'models',
  'prestige',
  'projects',
])

type CmsFaqRow = {
  id?: string | number | null
  question?: string | null
  answer?: string | null
  category?: string | null
}

type CmsFaq = {
  title?: string | null
  intro?: string | null
  items?: CmsFaqRow[] | null
  seo?: CmsSeo
}

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function mapCategory(value: string | null | undefined): FaqCategoryId {
  if (value && CATEGORIES.has(value as FaqCategoryId)) {
    return value as FaqCategoryId
  }
  return 'general'
}

function mapItems(rows: CmsFaqRow[] | null | undefined): FaqItem[] {
  if (!rows?.length) return faqPageDefaults.items

  const mapped = rows
    .map((row, index) => {
      const question = row.question?.trim()
      const answer = row.answer?.trim()
      if (!question || !answer) return null
      return {
        id: String(row.id ?? `faq-${index + 1}`),
        question,
        answer,
        category: mapCategory(row.category),
      } satisfies FaqItem
    })
    .filter((item): item is FaqItem => Boolean(item))

  return mapped.length > 0 ? mapped : faqPageDefaults.items
}

function mapFaqFromCms(doc: CmsFaq | null | undefined): FaqPageContentData {
  const defaults = faqPageDefaults
  if (!doc) return defaults

  return {
    title: text(doc.title, defaults.title),
    intro: text(doc.intro, defaults.intro),
    items: mapItems(doc.items),
    seo: mapCmsSeo(doc.seo, defaults.seo),
  }
}

/** Dedupes layout metadata + page within a single request. */
export const getFaqPageContent = cache(async (): Promise<FaqPageContentData> => {
  if (shouldSkipCmsAtBuild()) {
    return faqPageDefaults
  }

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'faq',
      depth: 1,
    })) as CmsFaq
    return mapFaqFromCms(doc)
  } catch (error) {
    console.error('[faq] Failed to load FAQ global from Payload — using defaults.', error)
    return FALLBACK_FAQ_CONTENT
  }
})

import { cache } from 'react'
import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import {
  siteSettingsDefaults,
  type FloatingCtaAction,
  type MenuLink,
  type SiteSettingsData,
} from './defaults'

type CmsLink = { label?: string | null; href?: string | null } | null

type CmsSettings = {
  header?: {
    navLinks?: CmsLink[] | null
    loginLabel?: string | null
    loginHref?: string | null
    applyLabel?: string | null
    applyHref?: string | null
    contactLabel?: string | null
    contactHref?: string | null
  } | null
  footer?: {
    tagline?: string | null
    linkColumnTitle?: string | null
    linkColumn?: CmsLink[] | null
    modulesColumnTitle?: string | null
    modulesColumn?: CmsLink[] | null
    contact?: {
      intro?: string | null
      email?: string | null
      phone?: string | null
      phoneHref?: string | null
      location?: string | null
      locationHref?: string | null
    } | null
    social?: Array<{
      platform?: 'facebook' | 'linkedin' | 'instagram' | 'youtube' | null
      href?: string | null
    } | null> | null
    legalLinks?: CmsLink[] | null
    copyright?: string | null
  } | null
  floatingCta?: {
    enabled?: boolean | null
    whatsappLabel?: string | null
    whatsappHref?: string | null
    messengerLabel?: string | null
    messengerHref?: string | null
    supportLabel?: string | null
    supportHref?: string | null
    submitFormLabel?: string | null
    submitFormHref?: string | null
    callLabel?: string | null
    callHref?: string | null
  } | null
  tracking?: {
    googleTagHead?: string | null
    googleTagBody?: string | null
    metaPixel?: string | null
    ahrefs?: string | null
  } | null
}

function text(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function optionalScript(value: string | null | undefined): string {
  return value?.trim() ?? ''
}

function mapLinks(rows: CmsLink[] | null | undefined, fallback: MenuLink[]): MenuLink[] {
  const mapped =
    rows
      ?.map((row) => {
        const label = row?.label?.trim()
        const href = row?.href?.trim()
        if (!label || !href) return null
        return { label, href }
      })
      .filter((row): row is MenuLink => Boolean(row)) ?? []

  return mapped.length > 0 ? mapped : fallback
}

function mapFloatingAction(
  label: string | null | undefined,
  href: string | null | undefined,
  fallback: FloatingCtaAction,
): FloatingCtaAction {
  return {
    label: text(label, fallback.label),
    href: text(href, fallback.href),
  }
}

function mapSettings(doc: CmsSettings | null | undefined): SiteSettingsData {
  const defaults = siteSettingsDefaults
  if (!doc) return defaults

  const social =
    doc.footer?.social
      ?.map((item) => {
        const platform = item?.platform
        const href = item?.href?.trim()
        if (!platform || !href) return null
        return { platform, href }
      })
      .filter(
        (
          item,
        ): item is {
          platform: 'facebook' | 'linkedin' | 'instagram' | 'youtube'
          href: string
        } => Boolean(item),
      ) ?? []

  const floating = doc.floatingCta

  return {
    header: {
      navLinks: mapLinks(doc.header?.navLinks, defaults.header.navLinks),
      login: {
        label: text(doc.header?.loginLabel, defaults.header.login.label),
        href: text(doc.header?.loginHref, defaults.header.login.href),
      },
      apply: {
        label: text(doc.header?.applyLabel, defaults.header.apply.label),
        href: text(doc.header?.applyHref, defaults.header.apply.href),
      },
      contact: {
        label: text(doc.header?.contactLabel, defaults.header.contact.label),
        href: text(doc.header?.contactHref, defaults.header.contact.href),
      },
    },
    footer: {
      tagline: text(doc.footer?.tagline, defaults.footer.tagline),
      linkColumnTitle: text(doc.footer?.linkColumnTitle, defaults.footer.linkColumnTitle),
      linkColumn: mapLinks(doc.footer?.linkColumn, defaults.footer.linkColumn),
      modulesColumnTitle: text(
        doc.footer?.modulesColumnTitle,
        defaults.footer.modulesColumnTitle,
      ),
      modulesColumn: mapLinks(doc.footer?.modulesColumn, defaults.footer.modulesColumn),
      contact: {
        intro: text(doc.footer?.contact?.intro, defaults.footer.contact.intro),
        email: text(doc.footer?.contact?.email, defaults.footer.contact.email),
        phone: text(doc.footer?.contact?.phone, defaults.footer.contact.phone),
        phoneHref: text(doc.footer?.contact?.phoneHref, defaults.footer.contact.phoneHref),
        location: text(doc.footer?.contact?.location, defaults.footer.contact.location),
        locationHref: text(
          doc.footer?.contact?.locationHref,
          defaults.footer.contact.locationHref,
        ),
      },
      social: social.length > 0 ? social : defaults.footer.social,
      legalLinks: mapLinks(doc.footer?.legalLinks, defaults.footer.legalLinks),
      copyright: text(doc.footer?.copyright, defaults.footer.copyright),
    },
    floatingCta: {
      enabled: floating?.enabled ?? defaults.floatingCta.enabled,
      whatsapp: mapFloatingAction(
        floating?.whatsappLabel,
        floating?.whatsappHref,
        defaults.floatingCta.whatsapp,
      ),
      messenger: mapFloatingAction(
        floating?.messengerLabel,
        floating?.messengerHref,
        defaults.floatingCta.messenger,
      ),
      support: mapFloatingAction(
        floating?.supportLabel,
        floating?.supportHref,
        defaults.floatingCta.support,
      ),
      submitForm: mapFloatingAction(
        floating?.submitFormLabel,
        floating?.submitFormHref,
        defaults.floatingCta.submitForm,
      ),
      call: mapFloatingAction(floating?.callLabel, floating?.callHref, defaults.floatingCta.call),
    },
    tracking: {
      googleTagHead: optionalScript(doc.tracking?.googleTagHead),
      googleTagBody: optionalScript(doc.tracking?.googleTagBody),
      metaPixel: optionalScript(doc.tracking?.metaPixel),
      ahrefs: optionalScript(doc.tracking?.ahrefs),
    },
  }
}

/** Dedupes layout + page requests within a single render. */
export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  if (shouldSkipCmsAtBuild()) return siteSettingsDefaults

  try {
    const { getPayloadClient } = await import('@/lib/payload')
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'settings',
      depth: 0,
      // Site shell needs tracking snippets; REST/GraphQL stay locked down via access.
      overrideAccess: true,
    })) as CmsSettings
    return mapSettings(doc)
  } catch (error) {
    console.error('[settings] Failed to load Settings global — using defaults.', error)
    return siteSettingsDefaults
  }
})

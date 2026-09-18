import { shouldSkipCmsAtBuild } from '@/lib/cms/buildTime'
import { getPayloadClient } from '@/lib/payload'
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
    productLabel?: string | null
    productLinks?: CmsLink[] | null
    resourcesLabel?: string | null
    resourceLinks?: CmsLink[] | null
    loginLabel?: string | null
    loginHref?: string | null
    demoLabel?: string | null
    demoHref?: string | null
    startFreeLabel?: string | null
    startFreeHref?: string | null
  } | null
  footer?: {
    linkColumnTitle?: string | null
    linkColumn?: CmsLink[] | null
    resourcesColumnTitle?: string | null
    resourcesColumn?: CmsLink[] | null
    companyColumnTitle?: string | null
    companyColumn?: CmsLink[] | null
    contact?: {
      email?: string | null
      phone?: string | null
      phoneHref?: string | null
      location?: string | null
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

/** Drop flat nav items that duplicate a dropdown label (e.g. legacy "Product" in navLinks). */
function excludeDropdownLabels(links: MenuLink[], ...dropdownLabels: string[]): MenuLink[] {
  const blocked = new Set(
    dropdownLabels.map((label) => label.trim().toLowerCase()).filter(Boolean),
  )
  if (blocked.size === 0) return links
  return links.filter((link) => !blocked.has(link.label.trim().toLowerCase()))
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

  const productLabel = text(doc.header?.productLabel, defaults.header.productLabel)
  const resourcesLabel = text(doc.header?.resourcesLabel, defaults.header.resourcesLabel)
  const navLinks = excludeDropdownLabels(
    mapLinks(doc.header?.navLinks, defaults.header.navLinks),
    productLabel,
    resourcesLabel,
  )

  return {
    header: {
      navLinks,
      productLabel,
      productLinks: mapLinks(doc.header?.productLinks, defaults.header.productLinks),
      resourcesLabel,
      resourceLinks: mapLinks(doc.header?.resourceLinks, defaults.header.resourceLinks),
      login: {
        label: text(doc.header?.loginLabel, defaults.header.login.label),
        href: text(doc.header?.loginHref, defaults.header.login.href),
      },
      demo: {
        label: text(doc.header?.demoLabel, defaults.header.demo.label),
        href: text(doc.header?.demoHref, defaults.header.demo.href),
      },
      startFree: {
        label: text(doc.header?.startFreeLabel, defaults.header.startFree.label),
        href: text(doc.header?.startFreeHref, defaults.header.startFree.href),
      },
    },
    footer: {
      linkColumnTitle: text(doc.footer?.linkColumnTitle, defaults.footer.linkColumnTitle),
      linkColumn: mapLinks(doc.footer?.linkColumn, defaults.footer.linkColumn),
      resourcesColumnTitle: text(
        doc.footer?.resourcesColumnTitle,
        defaults.footer.resourcesColumnTitle,
      ),
      resourcesColumn: mapLinks(doc.footer?.resourcesColumn, defaults.footer.resourcesColumn),
      companyColumnTitle: text(
        doc.footer?.companyColumnTitle,
        defaults.footer.companyColumnTitle,
      ),
      companyColumn: mapLinks(doc.footer?.companyColumn, defaults.footer.companyColumn),
      contact: {
        email: text(doc.footer?.contact?.email, defaults.footer.contact.email),
        phone: text(doc.footer?.contact?.phone, defaults.footer.contact.phone),
        phoneHref: text(doc.footer?.contact?.phoneHref, defaults.footer.contact.phoneHref),
        location: text(doc.footer?.contact?.location, defaults.footer.contact.location),
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

export async function getSiteSettings(): Promise<SiteSettingsData> {
  if (shouldSkipCmsAtBuild()) return siteSettingsDefaults

  try {
    const payload = await getPayloadClient()
    const doc = (await payload.findGlobal({
      slug: 'settings',
      depth: 0,
      // Site shell needs tracking snippets; REST/GraphQL stay locked down via access.
      overrideAccess: true,
    })) as CmsSettings
    return mapSettings(doc)
  } catch (error) {
    console.error('[settings] Failed to load Settings global â€” using defaults.', error)
    return siteSettingsDefaults
  }
}


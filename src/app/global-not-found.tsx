import type { Metadata } from 'next'
import SiteShell from '@/components/layout/SiteShell'
import NotFoundView from '@/components/pages/not-found/NotFoundView'
import { NOT_FOUND_METADATA_DESCRIPTION, NOT_FOUND_METADATA_TITLE } from '@/lib/not-found/defaults'
import { siteSettingsDefaults } from '@/lib/settings/defaults'
import { getSiteSettings } from '@/lib/settings/getSiteSettings'
import { DEFAULT_SOCIAL_LINKS, socialLinksFromSettings } from '@/lib/socialLinks'

/**
 * Global 404 for unmatched URLs when the app has multiple root layouts
 * (`(frontend)` + `(payload)`). Without this, Vercel serves Next’s default
 * black “This page could not be found” page.
 *
 * Must include its own <html>/<body> and styles — layouts are skipped.
 */
import './(frontend)/globals.css'
import '@/assets/css/custom.css'

export const metadata: Metadata = {
  title: NOT_FOUND_METADATA_TITLE,
  description: NOT_FOUND_METADATA_DESCRIPTION,
  robots: {
    index: false,
    follow: false,
  },
}

export default async function GlobalNotFound() {
  let socialLinks = DEFAULT_SOCIAL_LINKS
  let footer = siteSettingsDefaults.footer
  let floatingCta = siteSettingsDefaults.floatingCta

  try {
    const settings = await getSiteSettings()
    socialLinks = socialLinksFromSettings(settings.footer.social)
    footer = settings.footer
    floatingCta = settings.floatingCta
  } catch {
    // Keep defaults when CMS is unavailable.
  }

  return (
    <html lang="en-AU">
      <body>
        <SiteShell
          socialLinks={socialLinks}
          footer={footer}
          floatingCta={floatingCta}
          skipIntroForBot
        >
          <NotFoundView />
        </SiteShell>
      </body>
    </html>
  )
}

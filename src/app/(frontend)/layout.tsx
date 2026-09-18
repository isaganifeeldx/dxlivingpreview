import type { Metadata } from 'next'
import { headers } from 'next/headers'
import SiteShell from '@/components/layout/SiteShell'
import TrackingScripts from '@/components/layout/TrackingScripts'
import { defaultMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/lib/settings/getSiteSettings'
import { siteSettingsDefaults } from '@/lib/settings/defaults'
import { socialLinksFromSettings, DEFAULT_SOCIAL_LINKS } from '@/lib/socialLinks'
import { isSearchBot } from '@/lib/utils/isSearchBot'
import './globals.css'
import '@/assets/css/custom.css'

export const metadata: Metadata = defaultMetadata

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let socialLinks = DEFAULT_SOCIAL_LINKS
  let footer = siteSettingsDefaults.footer
  let floatingCta = siteSettingsDefaults.floatingCta
  let tracking = siteSettingsDefaults.tracking

  try {
    const settings = await getSiteSettings()
    socialLinks = socialLinksFromSettings(settings.footer.social)
    footer = settings.footer
    floatingCta = settings.floatingCta
    tracking = settings.tracking
  } catch {
    // Keep defaults when CMS is unavailable.
  }

  const headerStore = await headers()
  const skipIntroForBot = isSearchBot(headerStore.get('user-agent'))

  const headHtml = [tracking.googleTagHead, tracking.metaPixel, tracking.ahrefs]
    .filter(Boolean)
    .join('\n')
  const bodyHtml = tracking.googleTagBody

  return (
    <html lang="en-AU">
      <body>
        <TrackingScripts headHtml={headHtml} bodyHtml={bodyHtml} />
        <SiteShell
          socialLinks={socialLinks}
          footer={footer}
          floatingCta={floatingCta}
          skipIntroForBot={skipIntroForBot}
        >
          {children}
        </SiteShell>
      </body>
    </html>
  )
}

/**
 * Sync Payload Settings global with DX Living site defaults.
 *
 * Usage: npm run seed:settings
 */
import { createRequire } from 'node:module'
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

const require = createRequire(import.meta.url)

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { siteSettingsDefaults } = await import('../src/lib/settings/defaults')

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const d = siteSettingsDefaults

  await payload.updateGlobal({
    slug: 'settings',
    data: {
      header: {
        navLinks: d.header.navLinks,
        loginLabel: d.header.login.label,
        loginHref: d.header.login.href,
        applyLabel: d.header.apply.label,
        applyHref: d.header.apply.href,
        contactLabel: d.header.contact.label,
        contactHref: d.header.contact.href,
      },
      footer: {
        tagline: d.footer.tagline,
        linkColumnTitle: d.footer.linkColumnTitle,
        linkColumn: d.footer.linkColumn,
        modulesColumnTitle: d.footer.modulesColumnTitle,
        modulesColumn: d.footer.modulesColumn,
        contact: d.footer.contact,
        social: d.footer.social,
        legalLinks: d.footer.legalLinks,
        copyright: d.footer.copyright,
      },
      floatingCta: {
        enabled: d.floatingCta.enabled,
        whatsappLabel: d.floatingCta.whatsapp.label,
        whatsappHref: d.floatingCta.whatsapp.href,
        messengerLabel: d.floatingCta.messenger.label,
        messengerHref: d.floatingCta.messenger.href,
        supportLabel: d.floatingCta.support.label,
        supportHref: d.floatingCta.support.href,
        submitFormLabel: d.floatingCta.submitForm.label,
        submitFormHref: d.floatingCta.submitForm.href,
        callLabel: d.floatingCta.call.label,
        callHref: d.floatingCta.call.href,
      },
      tracking: d.tracking,
    },
    depth: 0,
    overrideAccess: true,
  })

  console.log('Settings global synced (Site > Settings).')
  void require
  process.exit(0)
}

main().catch((error) => {
  console.error('Failed to seed Settings global:', error)
  process.exit(1)
})

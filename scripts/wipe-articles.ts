/**
 * Delete every document in the Articles collection (including drafts).
 * For day-to-day admin use, select rows and use “Delete N selected” instead.
 *
 * Usage: npm run wipe:articles
 *
 * Does NOT delete Media or Article Categories.
 */
import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env.local', quiet: true })
loadDotenv({ path: '.env', quiet: true })

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  const { wipeAllArticles } = await import('../src/lib/cms/wipeArticles')

  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error('PAYLOAD_SECRET is missing. Check .env')
  }

  const payload = await getPayload({ config })
  const result = await wipeAllArticles({ payload, overrideAccess: true })

  console.log(
    `Done. Deleted ${result.deleted} article(s). Failed: ${result.failed}. Remaining: ${result.remaining}.`,
  )

  process.exit(result.remaining > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('Failed to wipe articles:', error)
  process.exit(1)
})

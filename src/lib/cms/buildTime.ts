/**
 * Vercel build machines (often US) frequently cannot open Neon (e.g. Sydney)
 * before Next's static-generation timeout. Skip live CMS reads during that
 * phase and render fallbacks; ISR/runtime will refresh from the DB.
 *
 * Set PAYLOAD_FETCH_AT_BUILD=true to force CMS reads during Vercel builds
 * (e.g. after colocating Neon with the build region).
 *
 * Detection is intentionally broader than NEXT_PHASE alone: some Next page-data
 * workers have historically omitted NEXT_PHASE, which caused accidental CMS
 * connects during `Collecting page data` and surface as ERR_INVALID_URL when
 * DATABASE_URI cannot be parsed by `pg`.
 */
export function shouldSkipCmsAtBuild(): boolean {
  if (process.env.PAYLOAD_FETCH_AT_BUILD === 'true') return false
  if (process.env.VERCEL !== '1') return false

  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.CI === '1' ||
    process.env.CI === 'true'
  )
}

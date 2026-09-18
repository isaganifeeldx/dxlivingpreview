/**
 * Vercel build machines (often US) frequently cannot open Neon (e.g. Sydney)
 * before Next's static-generation timeout. Skip live CMS reads during that
 * phase and render fallbacks; ISR/runtime will refresh from the DB.
 *
 * Set PAYLOAD_FETCH_AT_BUILD=true to force CMS reads during Vercel builds
 * (e.g. after colocating Neon with the build region).
 */
export function shouldSkipCmsAtBuild(): boolean {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' &&
    process.env.VERCEL === '1' &&
    process.env.PAYLOAD_FETCH_AT_BUILD !== 'true'
  )
}

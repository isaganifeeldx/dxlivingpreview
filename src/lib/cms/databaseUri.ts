/**
 * Normalize Postgres URIs for Node `pg` / Neon on Vercel.
 * Newer pg treats sslmode=require like verify-full; Neon works better with
 * libpq-compatible require (+ explicit rejectUnauthorized: false in clients).
 *
 * Neon’s dashboard often appends `channel_binding=require`, which breaks the
 * Node `pg` driver on Vercel and surfaces as admin "Connection closed".
 */
export function normalizeDatabaseUri(uri: string): string {
  const trimmed = uri.trim()
  if (!trimmed) return trimmed

  try {
    const url = new URL(trimmed.replace(/^postgresql:/i, 'http:'))
    const sslmode = (url.searchParams.get('sslmode') || '').toLowerCase()

    // Node pg does not reliably support SCRAM channel binding.
    url.searchParams.delete('channel_binding')

    if (sslmode === 'require' && !url.searchParams.has('uselibpqcompat')) {
      url.searchParams.set('uselibpqcompat', 'true')
    }

    return url.toString().replace(/^http:/i, 'postgresql:')
  } catch {
    return trimmed
  }
}

export function databaseHost(uri: string): string {
  try {
    return new URL(uri.replace(/^postgresql:/i, 'http:')).host || '(unknown)'
  } catch {
    return '(unparseable DATABASE_URI)'
  }
}

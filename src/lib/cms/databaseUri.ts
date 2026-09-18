/**
 * Normalize Postgres URIs for Node `pg` / Neon on Vercel.
 * Newer pg treats sslmode=require like verify-full; Neon works better with
 * libpq-compatible require (+ explicit rejectUnauthorized: false in clients).
 *
 * Neon’s dashboard often appends `channel_binding=require`, which breaks the
 * Node `pg` driver on Vercel and surfaces as admin "Connection closed".
 *
 * Passwords with `#`, `?`, or unescaped `%` also make `new URL()` / pg-connection-string
 * throw `ERR_INVALID_URL` (Vercel logs show `input: '[REDACTED]'`). We percent-encode
 * the userinfo when the first parse fails.
 */

function toHttpForm(uri: string): string {
  return uri.replace(/^postgres(ql)?:/i, 'http:')
}

function fromHttpForm(url: URL, original: string): string {
  const scheme = /^postgres:/i.test(original) ? 'postgres:' : 'postgresql:'
  return url.toString().replace(/^http:/i, scheme)
}

/** Encode user/password so `#` and similar chars do not break URL parsing. */
function encodeUserinfo(uri: string): string | null {
  // Authority is `user:pass@host...`. An unencoded `#` in the password makes the
  // standard URL parser treat the rest as a fragment, so match explicitly.
  const withPassword = uri.match(
    /^(postgres(?:ql)?:\/\/)([^:/?#\s]+):([^@\s]+)@(.+)$/i,
  )
  if (withPassword) {
    const [, scheme, username, password, rest] = withPassword
    if (!scheme || username == null || password == null || rest == null) return null

    let decodedUser = username
    let decodedPass = password
    try {
      decodedUser = decodeURIComponent(username)
      decodedPass = decodeURIComponent(password)
    } catch {
      // Keep raw values if they are not valid percent-encoding.
    }

    return `${scheme}${encodeURIComponent(decodedUser)}:${encodeURIComponent(decodedPass)}@${rest}`
  }

  const userOnly = uri.match(/^(postgres(?:ql)?:\/\/)([^:/?#\s]+)@(.+)$/i)
  if (!userOnly) return null

  const [, scheme, username, rest] = userOnly
  if (!scheme || username == null || rest == null) return null

  let decodedUser = username
  try {
    decodedUser = decodeURIComponent(username)
  } catch {
    // keep raw
  }

  return `${scheme}${encodeURIComponent(decodedUser)}@${rest}`
}

function applyPgCompatParams(url: URL): void {
  const sslmode = (url.searchParams.get('sslmode') || '').toLowerCase()

  // Node pg does not reliably support SCRAM channel binding.
  url.searchParams.delete('channel_binding')

  if (sslmode === 'require' && !url.searchParams.has('uselibpqcompat')) {
    url.searchParams.set('uselibpqcompat', 'true')
  }
}

export function normalizeDatabaseUri(uri: string): string {
  const trimmed = uri.trim()
  if (!trimmed) return trimmed

  const candidates = [trimmed, encodeUserinfo(trimmed)].filter(
    (value, index, arr): value is string =>
      Boolean(value) && arr.indexOf(value) === index,
  )

  for (const candidate of candidates) {
    try {
      const url = new URL(toHttpForm(candidate))
      applyPgCompatParams(url)
      return fromHttpForm(url, trimmed)
    } catch {
      // try next candidate
    }
  }

  return trimmed
}

/** True when `pg` / pg-connection-string can parse the URI. */
export function isDatabaseUriParsable(uri: string): boolean {
  const normalized = normalizeDatabaseUri(uri)
  if (!normalized) return false
  try {
    // Match how `pg` parses connection strings (base needed for relative forms).
    new URL(toHttpForm(normalized), 'postgres://base')
    return true
  } catch {
    return false
  }
}

export function databaseHost(uri: string): string {
  try {
    return new URL(toHttpForm(normalizeDatabaseUri(uri))).host || '(unknown)'
  } catch {
    return '(unparseable DATABASE_URI)'
  }
}

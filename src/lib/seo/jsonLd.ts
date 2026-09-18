/**
 * Parse editor-provided JSON-LD. Returns null if empty or invalid.
 * Only objects/arrays are accepted (not primitives).
 */
export function parseCustomJsonLd(raw: string | null | undefined): object | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null

  try {
    const parsed: unknown = JSON.parse(trimmed)
    if (parsed === null || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

/** Safe stringify for <script type="application/ld+json"> (escapes `<`). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

const ALLOWED_RETURN_PREFIXES = ['/start-interactive', '/login', '/register'] as const

/** Validates an internal return path from query params (open-redirect safe). */
export const getSafeReturnPath = (returnTo: string | null | undefined): string | null => {
  if (!returnTo) return null

  const path = returnTo.split('?')[0]?.split('#')[0]?.trim()
  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return null
  }

  const isAllowed = ALLOWED_RETURN_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  )

  return isAllowed ? path : null
}

export const buildPathWithReturnTo = (path: string, returnTo: string | null | undefined) => {
  const safeReturn = getSafeReturnPath(returnTo)
  if (!safeReturn) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}returnTo=${encodeURIComponent(safeReturn)}`
}

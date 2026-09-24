import { getApiBaseUrl } from '@/lib/interactive/config'

export const AUTH_TOKEN_KEY = 'dxliving_token'
export const AUTH_USER_KEY = 'dxliving_user'

/** Default destination after a successful site login. */
export const POST_LOGIN_PATH = '/start-interactive/dx-model'

export type AuthUser = {
  id?: number
  username?: string
  email?: string
  name?: string
  role?: string
  [key: string]: unknown
}

export type LoginResult =
  | { ok: true; token: string; user: AuthUser }
  | { ok: false; code: string; message: string; email?: string }

export type VerifyTokenResult =
  | { ok: true }
  | { ok: false; code: string; message: string; email?: string }

function readErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== 'object') return fallback
  const record = data as Record<string, unknown>
  if (typeof record.error === 'string') return record.error
  if (record.error && typeof record.error === 'object') {
    const err = record.error as Record<string, unknown>
    if (typeof err.message === 'string') return err.message
  }
  if (typeof record.message === 'string') return record.message
  return fallback
}

export function storeAuthSession(token: string, user: AuthUser): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(AUTH_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export async function loginWithPassword(
  usernameOrEmail: string,
  password: string,
): Promise<LoginResult> {
  const response = await fetch(`${getApiBaseUrl()}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usernameOrEmail: usernameOrEmail.trim(),
      password,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (response.ok) {
    const token =
      data && typeof data === 'object' && typeof (data as { token?: string }).token === 'string'
        ? (data as { token: string }).token
        : ''
    const user =
      data && typeof data === 'object' && (data as { user?: AuthUser }).user
        ? (data as { user: AuthUser }).user
        : {}

    if (!token) {
      return {
        ok: false,
        code: 'INVALID_RESPONSE',
        message: 'Login succeeded but no session token was returned.',
      }
    }

    return { ok: true, token, user }
  }

  if (response.status === 403) {
    const code =
      data && typeof data === 'object' && typeof (data as { code?: string }).code === 'string'
        ? (data as { code: string }).code
        : 'FORBIDDEN'
    const email =
      data && typeof data === 'object' && typeof (data as { email?: string }).email === 'string'
        ? (data as { email: string }).email
        : undefined

    return {
      ok: false,
      code,
      message: readErrorMessage(data, 'Please verify your email before logging in.'),
      email,
    }
  }

  return {
    ok: false,
    code: 'LOGIN_FAILED',
    message: readErrorMessage(
      data,
      'Login failed. Please check your credentials and try again.',
    ),
  }
}

export async function verifyAuthToken(token: string): Promise<VerifyTokenResult> {
  const response = await fetch(`${getApiBaseUrl()}/api/verify-token`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (response.ok) {
    return { ok: true }
  }

  const data = await response.json().catch(() => ({}))
  const code =
    data && typeof data === 'object' && typeof (data as { code?: string }).code === 'string'
      ? (data as { code: string }).code
      : 'TOKEN_INVALID'
  const email =
    data && typeof data === 'object' && typeof (data as { email?: string }).email === 'string'
      ? (data as { email: string }).email
      : undefined

  return {
    ok: false,
    code,
    message: readErrorMessage(data, 'Your session has expired. Please log in again.'),
    email,
  }
}

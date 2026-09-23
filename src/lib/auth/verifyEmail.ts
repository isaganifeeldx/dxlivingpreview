import { getApiBaseUrl } from '@/lib/interactive/config'

export type VerifyEmailConfirmResult =
  | { ok: true; message: string }
  | { ok: false; code: string; message: string }

function readErrorPayload(data: unknown): { code: string; message: string } {
  if (!data || typeof data !== 'object') {
    return { code: 'UNKNOWN', message: 'Could not verify email.' }
  }
  const record = data as Record<string, unknown>
  if (record.error && typeof record.error === 'object') {
    const err = record.error as Record<string, unknown>
    return {
      code: typeof err.code === 'string' ? err.code : 'UNKNOWN',
      message:
        typeof err.message === 'string' ? err.message : 'Could not verify email.',
    }
  }
  if (typeof record.error === 'string') {
    return { code: 'UNKNOWN', message: record.error }
  }
  return { code: 'UNKNOWN', message: 'Could not verify email.' }
}

export async function confirmEmailVerification(
  token: string,
): Promise<VerifyEmailConfirmResult> {
  const response = await fetch(`${getApiBaseUrl()}/api/verify-email/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const { code, message } = readErrorPayload(data)
    return { ok: false, code, message }
  }

  const message =
    data && typeof data === 'object' && typeof (data as { message?: string }).message === 'string'
      ? (data as { message: string }).message
      : 'Email verified successfully.'

  return { ok: true, message }
}

export async function requestEmailVerification(email: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/api/verify-email/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    throw new Error('Could not send verification email. Please try again.')
  }
}

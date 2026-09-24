import { getApiBaseUrl } from '@/lib/interactive/config'

export type PasswordResetResult =
  | { ok: true; message: string }
  | { ok: false; code: string; message: string }

function readErrorPayload(
  data: unknown,
  fallbackMessage: string,
): { code: string; message: string } {
  if (!data || typeof data !== 'object') {
    return { code: 'UNKNOWN', message: fallbackMessage }
  }
  const record = data as Record<string, unknown>
  if (record.error && typeof record.error === 'object') {
    const err = record.error as Record<string, unknown>
    return {
      code: typeof err.code === 'string' ? err.code : 'UNKNOWN',
      message: typeof err.message === 'string' ? err.message : fallbackMessage,
    }
  }
  if (typeof record.error === 'string') {
    return { code: 'UNKNOWN', message: record.error }
  }
  return { code: 'UNKNOWN', message: fallbackMessage }
}

export async function requestPasswordReset(email: string): Promise<PasswordResetResult> {
  const response = await fetch(`${getApiBaseUrl()}/api/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const { code, message } = readErrorPayload(
      data,
      'Could not send reset email. Please try again.',
    )
    return { ok: false, code, message }
  }

  const message =
    data && typeof data === 'object' && typeof (data as { message?: string }).message === 'string'
      ? (data as { message: string }).message
      : 'If an account exists for that email, a password reset link has been sent.'

  return { ok: true, message }
}

export async function confirmPasswordReset(
  token: string,
  newPassword: string,
): Promise<PasswordResetResult> {
  const response = await fetch(`${getApiBaseUrl()}/api/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const { code, message } = readErrorPayload(
      data,
      'Could not reset password. Please try again.',
    )
    return { ok: false, code, message }
  }

  const message =
    data && typeof data === 'object' && typeof (data as { message?: string }).message === 'string'
      ? (data as { message: string }).message
      : 'Password updated successfully.'

  return { ok: true, message }
}

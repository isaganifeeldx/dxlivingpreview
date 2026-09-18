import { getApiBaseUrl } from '@/lib/interactive/config'

export interface RegisterUserPayload {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface RegisterUserResponse {
  message?: string
  userId?: number
}

export async function registerUser(
  payload: RegisterUserPayload,
): Promise<RegisterUserResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => ({}))) as RegisterUserResponse & {
    error?: string
  }

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed. Please try again.')
  }

  return data
}

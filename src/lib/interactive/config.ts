export const getApiBaseUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend.dxliving.com').replace(/\/$/, '')

export const INTERACTIVE_LOGIN_API_URL =
  'https://63mb2zbmlh.execute-api.ap-southeast-2.amazonaws.com/dprod/login'

/** Fire-and-forget AWS warmup used before DX Model access (start-interactive / login). */
export async function warmupInteractiveLoginApi(context = 'interactive'): Promise<void> {
  try {
    const response = await fetch(INTERACTIVE_LOGIN_API_URL, { method: 'POST' })
    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `[${context}] Interactive login warmup failed: ${response.status} - ${errorText}`,
      )
    }
  } catch (error) {
    console.error(`[${context}] Interactive login warmup error:`, error)
  }
}

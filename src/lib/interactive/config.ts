export const getApiBaseUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend.dxliving.com').replace(/\/$/, '')

export const INTERACTIVE_LOGIN_API_URL =
  'https://63mb2zbmlh.execute-api.ap-southeast-2.amazonaws.com/dprod/login'

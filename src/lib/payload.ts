import config from '@payload-config'
import { getPayload } from 'payload'
import { isDatabaseUriParsable } from '@/lib/cms/databaseUri'

/**
 * Shared Payload client. Throws a clear error when required env is missing so
 * page loaders can fall back instead of failing the whole request obscurely.
 */
export async function getPayloadClient() {
  if (!(process.env.PAYLOAD_SECRET || '').trim()) {
    throw new Error(
      'PAYLOAD_SECRET is not set. Add it in Vercel → Settings → Environment Variables.',
    )
  }

  const databaseUri = (process.env.DATABASE_URI || '').trim()
  if (!databaseUri) {
    throw new Error(
      'DATABASE_URI is not set. Add the Neon pooler URI in Vercel → Environment Variables.',
    )
  }

  if (!isDatabaseUriParsable(databaseUri)) {
    throw new Error(
      'DATABASE_URI is not a valid Postgres URL (check password special characters are percent-encoded, e.g. # → %23).',
    )
  }

  return getPayload({ config })
}

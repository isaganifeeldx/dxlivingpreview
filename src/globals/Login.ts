import { revalidateLoginGlobal } from '@/hooks/revalidateCms'
import { seoOnlyPageGlobal } from '@/lib/cms/seoOnlyPageGlobal'
import {
  LOGIN_METADATA_DESCRIPTION,
  LOGIN_METADATA_TITLE,
} from '@/lib/login/defaults'

export const Login = seoOnlyPageGlobal({
  slug: 'login',
  label: 'Login',
  description: 'SEO for the public Login page. Page UI stays in code.',
  previewPath: '/login',
  titleDefault: LOGIN_METADATA_TITLE,
  descriptionDefault: LOGIN_METADATA_DESCRIPTION,
  afterChange: revalidateLoginGlobal,
})

import { revalidateRegisterGlobal } from '@/hooks/revalidateCms'
import { seoOnlyPageGlobal } from '@/lib/cms/seoOnlyPageGlobal'
import {
  REGISTER_METADATA_DESCRIPTION,
  REGISTER_METADATA_TITLE,
} from '@/lib/register/defaults'

export const Register = seoOnlyPageGlobal({
  slug: 'register',
  label: 'Registration',
  description: 'SEO for the public Registration page. Page UI stays in code.',
  previewPath: '/register',
  titleDefault: REGISTER_METADATA_TITLE,
  descriptionDefault: REGISTER_METADATA_DESCRIPTION,
  afterChange: revalidateRegisterGlobal,
})

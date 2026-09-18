import { revalidateStartInteractiveGlobal } from '@/hooks/revalidateCms'
import { seoOnlyPageGlobal } from '@/lib/cms/seoOnlyPageGlobal'
import {
  START_INTERACTIVE_METADATA_DESCRIPTION,
  START_INTERACTIVE_METADATA_TITLE,
} from '@/lib/start-interactive/defaults'

export const StartInteractive = seoOnlyPageGlobal({
  slug: 'start-interactive',
  label: 'Start Interactive',
  description: 'SEO for the Start Interactive hub page. Page UI stays in code.',
  previewPath: '/start-interactive',
  titleDefault: START_INTERACTIVE_METADATA_TITLE,
  descriptionDefault: START_INTERACTIVE_METADATA_DESCRIPTION,
  afterChange: revalidateStartInteractiveGlobal,
})

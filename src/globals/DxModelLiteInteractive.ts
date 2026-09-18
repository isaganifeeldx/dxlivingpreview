import { revalidateDxModelLiteInteractiveGlobal } from '@/hooks/revalidateCms'
import { seoOnlyPageGlobal } from '@/lib/cms/seoOnlyPageGlobal'
import {
  DX_MODEL_LITE_METADATA_DESCRIPTION,
  DX_MODEL_LITE_METADATA_TITLE,
} from '@/lib/start-interactive/defaults'

export const DxModelLiteInteractive = seoOnlyPageGlobal({
  slug: 'dx-model-lite',
  label: 'DX Model Lite (Interactive)',
  description: 'SEO for the DX Model Lite interactive experience. Page UI stays in code.',
  previewPath: '/start-interactive/dx-model-lite',
  titleDefault: DX_MODEL_LITE_METADATA_TITLE,
  descriptionDefault: DX_MODEL_LITE_METADATA_DESCRIPTION,
  afterChange: revalidateDxModelLiteInteractiveGlobal,
})

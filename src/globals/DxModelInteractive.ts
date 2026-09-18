import { revalidateDxModelInteractiveGlobal } from '@/hooks/revalidateCms'
import { seoOnlyPageGlobal } from '@/lib/cms/seoOnlyPageGlobal'
import {
  DX_MODEL_METADATA_DESCRIPTION,
  DX_MODEL_METADATA_TITLE,
} from '@/lib/start-interactive/defaults'

/** Interactive DX Model experience (`/start-interactive/dx-model`), not the marketing `/model` page. */
export const DxModelInteractive = seoOnlyPageGlobal({
  slug: 'dx-model',
  label: 'DX Model (Interactive)',
  description:
    'SEO for the DX Model interactive experience. Distinct from the marketing Model page.',
  previewPath: '/start-interactive/dx-model',
  titleDefault: DX_MODEL_METADATA_TITLE,
  descriptionDefault: DX_MODEL_METADATA_DESCRIPTION,
  afterChange: revalidateDxModelInteractiveGlobal,
})

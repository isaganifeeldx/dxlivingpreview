import { emptySeoData } from '@/lib/seo/types'

export const START_INTERACTIVE_METADATA_TITLE =
  'Start Interactive | Interactive Luxury Home Design Australia'

export const START_INTERACTIVE_METADATA_DESCRIPTION =
  "Luxury home design for modern families. Start Interactive creates personalized, sustainable spaces by Australia's leading architects."

export const DX_MODEL_METADATA_TITLE = 'DX Model | Residential 3D Visualisation Australia'

export const DX_MODEL_METADATA_DESCRIPTION =
  'Residential 3D visualisation Australia using interactive 3D and VR models to present unbuilt homes clearly and support confident decisions before construction.'

export const DX_MODEL_LITE_METADATA_TITLE =
  'DX Model Lite | Residential 3D Home Models Australia'

export const DX_MODEL_LITE_METADATA_DESCRIPTION =
  'A lightweight interactive 3D model for residential projects in Australia, helping teams showcase layouts and finishes clearly for early-stage sales.'

export const startInteractivePageDefaults = {
  seo: emptySeoData({
    title: START_INTERACTIVE_METADATA_TITLE,
    description: START_INTERACTIVE_METADATA_DESCRIPTION,
    focusKeyword: 'start interactive DX Living',
    keywords: 'interactive design, DX Model, luxury home design Australia',
    ogTitle: START_INTERACTIVE_METADATA_TITLE,
    ogDescription: START_INTERACTIVE_METADATA_DESCRIPTION,
    ogImageUrl: '/og/og.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: START_INTERACTIVE_METADATA_TITLE,
    twitterDescription: START_INTERACTIVE_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/og.jpg',
  }),
}

export const dxModelPageDefaults = {
  seo: emptySeoData({
    title: DX_MODEL_METADATA_TITLE,
    description: DX_MODEL_METADATA_DESCRIPTION,
    focusKeyword: 'DX Model 3D visualisation',
    keywords: 'DX Model, residential 3D visualisation, VR home Australia',
    ogTitle: DX_MODEL_METADATA_TITLE,
    ogDescription: DX_MODEL_METADATA_DESCRIPTION,
    ogImageUrl: '/og/og.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: DX_MODEL_METADATA_TITLE,
    twitterDescription: DX_MODEL_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/og.jpg',
  }),
}

export const dxModelLitePageDefaults = {
  seo: emptySeoData({
    title: DX_MODEL_LITE_METADATA_TITLE,
    description: DX_MODEL_LITE_METADATA_DESCRIPTION,
    focusKeyword: 'DX Model Lite',
    keywords: 'DX Model Lite, 3D home models Australia',
    ogTitle: DX_MODEL_LITE_METADATA_TITLE,
    ogDescription: DX_MODEL_LITE_METADATA_DESCRIPTION,
    ogImageUrl: '/og/og.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: DX_MODEL_LITE_METADATA_TITLE,
    twitterDescription: DX_MODEL_LITE_METADATA_DESCRIPTION,
    twitterImageUrl: '/og/og.jpg',
  }),
}

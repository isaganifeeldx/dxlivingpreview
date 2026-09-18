export interface InteractiveAppConfig {
  id: string
  name: string
  description: string
  benefits: string
  url: string
  apiEndpoint: string
  icon: string
}

export const INTERACTIVE_APPS: InteractiveAppConfig[] = [
  {
    id: 'interactive2',
    name: 'DX Model Lite',
    description:
      'Explore and experience your vision through immersive 4D rendering and fixed-perspective spatial visualization',
    benefits: '',
    url: 'https://vrasbuilt.s3.ap-southeast-2.amazonaws.com/251+Station+St/3DV_V1/index.htm',
    apiEndpoint: '',
    icon: '',
  },
  {
    id: 'interactive1',
    name: 'DX Model',
    description:
      'Interactive 4D orchestration featuring walk-through spatial navigation, real-time door controls, and advanced supplier material transitions.',
    benefits: '',
    url: 'https://d3u0z2dn86zx4j.cloudfront.net',
    apiEndpoint: 'https://63mb2zbmlh.execute-api.ap-southeast-2.amazonaws.com/dprod/app-1',
    icon: '',
  },
]

export const DX_MODEL_LITE_APP = INTERACTIVE_APPS.find((app) => app.id === 'interactive2')!

export const DX_MODEL_APP = INTERACTIVE_APPS.find((app) => app.id === 'interactive1')!

export const getInteractiveAppPath = (appId: string) => {
  if (appId === 'interactive1') return '/start-interactive/dx-model'
  if (appId === 'interactive2') return '/start-interactive/dx-model-lite'
  return '/start-interactive'
}

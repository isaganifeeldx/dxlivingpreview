'use client'

import React from 'react'
import { SeoCharCountDescription } from './SeoMetaTitleDescription'

/** Meta description: ~150–160 characters (SERP snippet under title). */
export default function SeoMetaDescriptionDescription(props: { path: string }) {
  return (
    <SeoCharCountDescription
      path={props.path}
      min={150}
      max={160}
      tip="Appears under the title in search results."
    />
  )
}

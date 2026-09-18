'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

type SeoCharCountDescriptionProps = {
  path: string
  min: number
  max: number
  tip: string
}

function statusForCount(count: number, min: number, max: number): {
  label: string
  color: string
} {
  if (count === 0) {
    return { label: 'Empty', color: 'var(--theme-elevation-500, #6b7280)' }
  }
  if (count < min) {
    return { label: 'A bit short', color: 'var(--theme-warning-500, #b45309)' }
  }
  if (count > max) {
    return {
      label: `${count - max} over recommended`,
      color: 'var(--theme-error-500, #dc2626)',
    }
  }
  return { label: 'Looks good', color: 'var(--theme-success-500, #15803d)' }
}

export function SeoCharCountDescription({
  path,
  min,
  max,
  tip,
}: SeoCharCountDescriptionProps) {
  const { value } = useField<string>({ path })
  const count = typeof value === 'string' ? value.length : 0
  const status = statusForCount(count, min, max)

  return (
    <div
      style={{
        marginTop: 6,
        fontSize: 12,
        lineHeight: 1.45,
        color: 'var(--theme-elevation-500, #6b7280)',
      }}
    >
      <div>{tip}</div>
      <div style={{ marginTop: 4 }}>
        Recommended: {min}–{max} characters.{' '}
        <span style={{ color: status.color, fontWeight: 600 }}>
          {count}/{max}
        </span>
        <span style={{ color: status.color }}> — {status.label}</span>
      </div>
    </div>
  )
}

/** Meta title: ~50–60 characters (SERP blue link). */
export default function SeoMetaTitleDescription(props: { path: string }) {
  return (
    <SeoCharCountDescription
      path={props.path}
      min={50}
      max={60}
      tip="Appears as the blue link in Google search results."
    />
  )
}

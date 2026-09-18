'use client'

import { useEffect } from 'react'
import { sanitizeTrackingSnippet } from '@/lib/sanitize/sanitizeTrackingSnippet'

type TrackingScriptsProps = {
  headHtml?: string
  bodyHtml?: string
}

function injectSnippet(html: string, target: ParentNode, marker: string): () => void {
  const trimmed = sanitizeTrackingSnippet(html)
  if (!trimmed) return () => undefined

  const template = document.createElement('template')
  template.innerHTML = trimmed

  const attached: ChildNode[] = []

  template.content.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) return

    if (node instanceof HTMLScriptElement) {
      const script = document.createElement('script')
      for (const { name, value } of Array.from(node.attributes)) {
        if (/^on/i.test(name)) continue
        if ((name === 'src' || name === 'href') && /^\s*javascript:/i.test(value)) continue
        script.setAttribute(name, value)
      }
      script.dataset.dxiTracking = marker
      if (node.textContent) script.text = node.textContent
      target.appendChild(script)
      attached.push(script)
      return
    }

    const clone = node.cloneNode(true) as ChildNode
    if (clone instanceof HTMLElement) {
      clone.dataset.dxiTracking = marker
    }
    target.appendChild(clone)
    attached.push(clone)
  })

  return () => {
    for (const node of attached) {
      node.parentNode?.removeChild(node)
    }
  }
}

/**
 * Injects CMS-pasted Google Tag / Meta Pixel / Ahrefs snippets so <script> tags execute.
 * Snippets are sanitized (allowlisted hosts, no event-handler attrs) before injection.
 */
export default function TrackingScripts({ headHtml = '', bodyHtml = '' }: TrackingScriptsProps) {
  useEffect(() => {
    const cleanups = [
      injectSnippet(headHtml, document.head, 'head'),
      injectSnippet(bodyHtml, document.body, 'body'),
    ]
    return () => {
      for (const cleanup of cleanups) cleanup()
    }
  }, [headHtml, bodyHtml])

  return null
}

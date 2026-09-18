/**
 * Harden CMS tracking snippets before client injection.
 * Scripts are intentional for GTM/Meta/Ahrefs — only allow known hosts for external src,
 * and strip event handlers / javascript: URLs from non-script markup.
 */

const ALLOWED_SCRIPT_HOSTS = new Set([
  'www.googletagmanager.com',
  'googletagmanager.com',
  'www.google-analytics.com',
  'google-analytics.com',
  'www.googleadservices.com',
  'googleadservices.com',
  'www.google.com',
  'google.com',
  'connect.facebook.net',
  'www.facebook.com',
  'facebook.com',
  'analytics.ahrefs.com',
  'script.ahrefs.com',
  'cdn.ahrefs.com',
])

const ALLOWED_IFRAME_HOSTS = new Set([
  'www.googletagmanager.com',
  'googletagmanager.com',
  'www.facebook.com',
  'facebook.com',
])

const EVENT_ATTR = /^on/i

function isAllowedHost(hostname: string, allowlist: Set<string>): boolean {
  const host = hostname.toLowerCase()
  if (allowlist.has(host)) return true
  for (const allowed of allowlist) {
    if (host.endsWith(`.${allowed}`)) return true
  }
  return false
}

function isAllowedSrc(src: string | null, allowlist: Set<string>): boolean {
  if (!src?.trim()) return false
  try {
    const url = new URL(src, 'https://example.invalid')
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false
    if (url.hostname === 'example.invalid') return false
    return isAllowedHost(url.hostname, allowlist)
  } catch {
    return false
  }
}

function stripDangerousAttributes(el: Element) {
  for (const attr of Array.from(el.attributes)) {
    if (EVENT_ATTR.test(attr.name)) {
      el.removeAttribute(attr.name)
      continue
    }
    if (
      (attr.name === 'href' || attr.name === 'src' || attr.name === 'xlink:href') &&
      /^\s*javascript:/i.test(attr.value)
    ) {
      el.removeAttribute(attr.name)
    }
  }
}

/**
 * Returns a cleaned HTML string safe enough to inject for analytics.
 * Drops unknown tags (except script/noscript/iframe), blocks non-allowlisted script/iframe hosts.
 */
export function sanitizeTrackingSnippet(html: string): string {
  const trimmed = html.trim()
  if (!trimmed) return ''

  // Server-safe path: strip obvious script injection vectors when DOM is unavailable.
  if (typeof document === 'undefined') {
    return trimmed
      .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
      .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
      .replace(/javascript:/gi, '')
  }

  const template = document.createElement('template')
  template.innerHTML = trimmed

  const keep: Node[] = []

  const visit = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent?.trim()) keep.push(node.cloneNode(true))
      return
    }
    if (!(node instanceof Element)) return

    const tag = node.tagName.toLowerCase()

    if (tag === 'script') {
      const src = node.getAttribute('src')
      if (src && !isAllowedSrc(src, ALLOWED_SCRIPT_HOSTS)) return
      const clone = node.cloneNode(true) as HTMLScriptElement
      stripDangerousAttributes(clone)
      keep.push(clone)
      return
    }

    if (tag === 'noscript') {
      const clone = node.cloneNode(true) as HTMLElement
      clone.querySelectorAll('*').forEach((child) => {
        stripDangerousAttributes(child)
        if (child.tagName.toLowerCase() === 'iframe') {
          const src = child.getAttribute('src')
          if (!isAllowedSrc(src, ALLOWED_IFRAME_HOSTS)) child.remove()
        } else if (child.tagName.toLowerCase() === 'script') {
          const src = child.getAttribute('src')
          if (src && !isAllowedSrc(src, ALLOWED_SCRIPT_HOSTS)) child.remove()
        }
      })
      keep.push(clone)
      return
    }

    if (tag === 'iframe') {
      const src = node.getAttribute('src')
      if (!isAllowedSrc(src, ALLOWED_IFRAME_HOSTS)) return
      const clone = node.cloneNode(false) as HTMLIFrameElement
      stripDangerousAttributes(clone)
      keep.push(clone)
      return
    }

    // Ignore other top-level tags (div wrappers etc.) but walk children.
    node.childNodes.forEach(visit)
  }

  template.content.childNodes.forEach(visit)

  const out = document.createElement('div')
  for (const node of keep) out.appendChild(node)
  return out.innerHTML
}

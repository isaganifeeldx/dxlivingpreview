import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { convertLexicalToHTMLAsync } from '@payloadcms/richtext-lexical/html-async'
import { getPayloadPopulateFn } from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Payload } from 'payload'
import { sanitizeArticleHtml } from '@/lib/cms/sanitizeHtml'

function isLexicalState(value: unknown): value is SerializedEditorState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'root' in value &&
    typeof (value as { root?: unknown }).root === 'object'
  )
}

function isEmptyLexical(data: SerializedEditorState): boolean {
  const children = data.root?.children
  if (!Array.isArray(children) || children.length === 0) return true

  const plain = convertLexicalToHTML({ data })
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()

  return plain.length === 0
}

function ensureHeadingClass(tag: 'h2' | 'h3' | 'h4', className: string, attrs = ''): string {
  if (/class\s*=/i.test(attrs)) {
    if (new RegExp(`\\b${className}\\b`).test(attrs)) {
      return `<${tag}${attrs}>`
    }
    return `<${tag}${attrs.replace(/class=(["'])(.*?)\1/i, (_m, q: string, existing: string) => `class=${q}${existing} ${className}${q}`)}>`
  }
  return `<${tag} class="${className}"${attrs}>`
}

/**
 * Match reference1 article body markup:
 * - h3 → content-bold, h4 → content-semibold (Lexical strips these classes)
 * - drop fixed img width/height so layout stays fluid
 * - prefer relative /api/media URLs over absolute host URLs
 */
export function normalizeArticleBodyHtml(html: string): string {
  if (!html) return html

  return html
    .replace(/<h2(\s[^>]*)?>/gi, (_full, attrs = '') =>
      ensureHeadingClass('h2', 'content-bold', attrs),
    )
    .replace(/<h3(\s[^>]*)?>/gi, (_full, attrs = '') =>
      ensureHeadingClass('h3', 'content-bold', attrs),
    )
    .replace(/<h4(\s[^>]*)?>/gi, (_full, attrs = '') =>
      ensureHeadingClass('h4', 'content-semibold', attrs),
    )
    .replace(/<img\b([^>]*)>/gi, (_full, attrs: string) => {
      let next = attrs
        .replace(/\s(?:width|height)=["'][^"']*["']/gi, '')
        .replace(
          /\bsrc=(["'])https?:\/\/[^/"']+(\/api\/media\/file\/[^"']+)\1/i,
          (_m, q: string, path: string) => `src=${q}${path}${q}`,
        )
      return `<img${next}>`
    })
}

function finalizeArticleHtml(html: string): string {
  return sanitizeArticleHtml(normalizeArticleBodyHtml(html))
}

/** Sync convert for static HTML fallbacks (no Media population needed). */
export function resolveRichTextHtml(value: unknown, fallbackHtml = ''): string {
  let html = fallbackHtml

  if (isLexicalState(value) && !isEmptyLexical(value)) {
    html = convertLexicalToHTML({ data: value, disableContainer: true })
  } else if (typeof value === 'string' && value.trim()) {
    html = value.trim()
  }

  return finalizeArticleHtml(html)
}

/**
 * Convert Lexical rich text to sanitized HTML, populating upload nodes so
 * inline images render. Falls back to static HTML when the body is empty.
 */
export async function resolveRichTextHtmlAsync(
  value: unknown,
  fallbackHtml: string,
  payload: Payload,
): Promise<string> {
  let html = fallbackHtml

  if (isLexicalState(value) && !isEmptyLexical(value)) {
    const populate = await getPayloadPopulateFn({
      currentDepth: 0,
      depth: 1,
      overrideAccess: true,
      payload,
    })
    html = await convertLexicalToHTMLAsync({
      data: value,
      disableContainer: true,
      populate,
    })
  } else if (typeof value === 'string' && value.trim()) {
    html = value.trim()
  }

  return finalizeArticleHtml(html)
}

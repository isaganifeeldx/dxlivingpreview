import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { prepareLegalContentHtml } from '@/lib/legal/formatLegalContent'

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

/**
 * Resolve CMS legal body (Lexical rich text, HTML string, or plain text) to
 * sanitized HTML ready for the legal page shell.
 */
export function resolveLegalBodyHtml(
  cmsBody: unknown,
  fallbackPlainOrHtml: string,
  options: { linkPrivacyPolicy?: boolean } = {},
): string {
  if (isLexicalState(cmsBody) && !isEmptyLexical(cmsBody)) {
    const html = convertLexicalToHTML({ data: cmsBody, disableContainer: true })
    return prepareLegalContentHtml(html, options)
  }

  if (typeof cmsBody === 'string' && cmsBody.trim()) {
    return prepareLegalContentHtml(cmsBody, options)
  }

  return prepareLegalContentHtml(fallbackPlainOrHtml, options)
}

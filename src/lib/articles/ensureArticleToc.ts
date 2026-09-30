/**
 * Build / refresh an EasyTOC-compatible table of contents from article headings.
 * Matches reference1 WP EasyTOC markup so existing `.ez-toc-*` CSS applies.
 *
 * Lexical often drops `#ez-toc-container` but leaves a plain "Table of Contents"
 * list behind — strip those remnants so we only render one styled TOC.
 */

function slugifyHeading(text: string, used: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') || 'section'

  const count = used.get(base) ?? 0
  used.set(base, count + 1)
  return count === 0 ? base : `${base}-${count}`
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isTocTitle(text: string): boolean {
  return /^table of contents$/i.test(text.trim())
}

type TocHeading = {
  level: 2 | 3
  id: string
  label: string
}

/** Remove EasyTOC blocks and Lexical leftovers that duplicate the TOC. */
export function stripArticleTocMarkup(html: string): string {
  let next = html

  // Full EasyTOC container (balanced-ish: non-greedy until closing div after nav/ul)
  next = next.replace(
    /<div\b[^>]*\bid=["']ez-toc-container["'][^>]*>[\s\S]*?<\/div>\s*(?:<\/div>)?/gi,
    '',
  )

  // Any remaining ez-toc wrappers Lexical may have partially kept
  next = next.replace(
    /<(div|nav|ul|p|span)\b[^>]*class=["'][^"']*ez-toc[^"']*["'][^>]*>[\s\S]*?<\/\1>/gi,
    '',
  )

  // Plain remnant: "Table of Contents" title + the following list of anchor links
  next = next.replace(
    /<(h[1-6]|p)\b[^>]*>\s*Table of Contents\s*<\/\1>\s*(?:<(?:ul|ol)\b[^>]*>[\s\S]*?<\/(?:ul|ol)>)?/gi,
    '',
  )

  // Orphan list that only links to #heading anchors near the top (common Lexical leftover)
  next = next.replace(
    /<(ul|ol)\b[^>]*>(?:\s*<li\b[^>]*>\s*<a\b[^>]*href=["']#[^"']+["'][^>]*>[\s\S]*?<\/a>\s*<\/li>)+\s*<\/\1>/i,
    (full, _tag, offset: number) => {
      // Only strip if this list appears in the first ~1500 chars (TOC position)
      if (offset > 1500) return full
      const linkCount = (full.match(/<a\b/gi) || []).length
      return linkCount >= 2 ? '' : full
    },
  )

  // EasyTOC accessibility label that relied on style="display:none"
  next = next.replace(
    /<(span|a)\b[^>]*(?:eztoc-hide|ez-toc-toggle|ez-toc-title-toggle)[^>]*>[\s\S]*?<\/\1>/gi,
    '',
  )
  next = next.replace(/>\s*Toggle\s*</gi, '><')
  next = next.replace(/(^|>)\s*Toggle\s*(<|$)/gi, '$1$2')

  return next.replace(/^\s+/, '')
}

/**
 * Ensures headings have ids and prepends a single `#ez-toc-container`.
 */
export function ensureArticleTableOfContents(html: string): string {
  if (!html?.trim()) return html

  const withoutOldToc = stripArticleTocMarkup(html)
  const usedIds = new Map<string, number>()
  const headings: TocHeading[] = []

  for (const match of withoutOldToc.matchAll(/\bid=["']([^"']+)["']/gi)) {
    const id = match[1]?.trim()
    if (id) usedIds.set(id, 1)
  }

  const withHeadingIds = withoutOldToc.replace(
    /<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (full, tag: string, attrs = '', inner: string) => {
      const level = tag.toLowerCase() === 'h2' ? 2 : 3
      const label = stripTags(inner)
      if (!label || isTocTitle(label)) return full

      const idMatch = attrs.match(/\bid=["']([^"']+)["']/i)
      let id = idMatch?.[1]?.trim() || ''
      if (!id) {
        id = slugifyHeading(label, usedIds)
        attrs = `${attrs} id="${id}"`
      } else if (!usedIds.has(id)) {
        usedIds.set(id, 1)
      }

      headings.push({ level: level as 2 | 3, id, label })
      return `<${tag}${attrs}>${inner}</${tag}>`
    },
  )

  if (headings.length < 2) {
    return withHeadingIds
  }

  const items = headings
    .map(
      (heading) =>
        `<li class="ez-toc-page-1 ez-toc-heading-level-${heading.level}"><a class="ez-toc-link ez-toc-heading-${heading.level}" href="#${heading.id}" title="${escapeAttr(heading.label)}">${escapeHtml(heading.label)}</a></li>`,
    )
    .join('')

  const toc = [
    '<div id="ez-toc-container" class="ez-toc-v2 ez-toc-counter ez-toc-grey ez-toc-container-direction">',
    '<div class="ez-toc-title-container"><p class="ez-toc-title">Table of Contents</p></div>',
    '<nav><ul class="ez-toc-list ez-toc-list-level-1 ez-toc-columns-2">',
    items,
    '</ul></nav>',
    '</div>',
  ].join('')

  return `${toc}${withHeadingIds}`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, '&#39;')
}

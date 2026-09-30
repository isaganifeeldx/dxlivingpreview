/**
 * Build / refresh an EasyTOC-compatible table of contents from article headings.
 * Matches reference1 WP EasyTOC markup so existing `.ez-toc-*` CSS applies.
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

type TocHeading = {
  level: 2 | 3
  id: string
  label: string
}

/**
 * Ensures headings have ids and prepends `#ez-toc-container` when missing.
 * If a TOC already exists, returns html unchanged (aside from heading id fill).
 */
export function ensureArticleTableOfContents(html: string): string {
  if (!html?.trim()) return html

  const hasToc = /id=["']ez-toc-container["']/i.test(html)
  const usedIds = new Map<string, number>()
  const headings: TocHeading[] = []

  // Collect existing ids so generated ones stay unique
  for (const match of html.matchAll(/\bid=["']([^"']+)["']/gi)) {
    const id = match[1]?.trim()
    if (id) usedIds.set(id, 1)
  }

  const withHeadingIds = html.replace(
    /<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (full, tag: string, attrs = '', inner: string) => {
      const level = tag.toLowerCase() === 'h2' ? 2 : 3
      const label = stripTags(inner)
      if (!label) return full

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

  if (hasToc || headings.length < 2) {
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
    '<div class="ez-toc-title-container"><p class="ez-toc-title" style="cursor:inherit">Table of Contents</p></div>',
    '<nav><ul class="ez-toc-list ez-toc-list-level-1 ez-toc-columns-2">',
    items,
    '</ul></nav>',
    '</div>',
  ].join('')

  // Drop inline style from title for sanitizer — use class only
  const tocSafe = toc.replace(
    '<p class="ez-toc-title" style="cursor:inherit">',
    '<p class="ez-toc-title">',
  )

  return `${tocSafe}${withHeadingIds}`
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

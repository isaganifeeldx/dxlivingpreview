import DOMPurify, {
  type Config,
  type UponSanitizeAttributeHookEvent,
} from 'isomorphic-dompurify';

const allowedCmsClasses = new Set([
  'legal-content',
  'block',
  'hidden',
  'inline',
  'inline-block',
  'font-bold',
  'font-semibold',
  'text-center',
  'text-left',
  'uppercase',
  'md:block',
  'md:hidden',
  'md:inline',
  'md:inline-block',
  'lg:block',
  'lg:hidden',
  'lg:inline',
  'lg:inline-block',
  'xl:block',
  'xl:hidden',
  'xl:inline',
  'xl:inline-block',
  'primary-color',
  // Article body (static library + Lexical HTML)
  'content-bold',
  'content-semibold',
  'article-content',
]);

const hookState = globalThis as typeof globalThis & {
  __dxlivingCmsSanitizerHookInstalled?: boolean;
};

if (!hookState.__dxlivingCmsSanitizerHookInstalled) {
  DOMPurify.addHook('uponSanitizeAttribute', (_node, data: UponSanitizeAttributeHookEvent) => {
    if (data.attrName !== 'class') return;

    const safeClasses = data.attrValue
      .split(/\s+/)
      .filter((className) => allowedCmsClasses.has(className));

    if (safeClasses.length === 0) {
      data.keepAttr = false;
      return;
    }

    data.attrValue = safeClasses.join(' ');
  });

  hookState.__dxlivingCmsSanitizerHookInstalled = true;
}

const sanitizeConfig: Config = {
  ALLOWED_TAGS: ['span', 'strong', 'b', 'em', 'i', 'br', 'p', 'small', 'sup', 'sub', 'a'],
  ALLOWED_ATTR: ['class', 'href', 'rel', 'target'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'svg', 'math', 'style', 'link', 'meta'],
  FORBID_ATTR: ['style'],
  RETURN_TRUSTED_TYPE: false,
};

const legalSanitizeConfig: Config = {
  ALLOWED_TAGS: [
    'div',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'ul',
    'ol',
    'li',
    'a',
    'strong',
    'b',
    'em',
    'i',
    'br',
    'span',
  ],
  ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'svg', 'math', 'style', 'link', 'meta'],
  FORBID_ATTR: ['style'],
  RETURN_TRUSTED_TYPE: false,
};

/** Safe subset for Lexical / article body HTML rendered via dangerouslySetInnerHTML. */
const articleSanitizeConfig: Config = {
  ALLOWED_TAGS: [
    'p',
    'br',
    'span',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'sub',
    'sup',
    'code',
    'pre',
    'blockquote',
    'hr',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'a',
    'img',
    'figure',
    'figcaption',
    'picture',
    'source',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    'colgroup',
    'col',
    'div',
  ],
  ALLOWED_ATTR: [
    'class',
    'id',
    'href',
    'rel',
    'target',
    'title',
    'src',
    'srcset',
    'alt',
    'width',
    'height',
    'loading',
    'media',
    'type',
    'colspan',
    'rowspan',
    'scope',
  ],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'svg', 'math', 'style', 'link', 'meta'],
  FORBID_ATTR: ['style'],
  RETURN_TRUSTED_TYPE: false,
};

export const normalizeCmsHtml = (value: string) =>
  value.replace(/\sclassName=(["'])/g, ' class=$1');

export const escapeCmsHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const sanitizeCmsHtml = (value: string) =>
  DOMPurify.sanitize(normalizeCmsHtml(value), sanitizeConfig) as string;

export const cmsHtml = (value: string) => ({
  __html: sanitizeCmsHtml(value),
});

export const sanitizeLegalHtml = (value: string) =>
  DOMPurify.sanitize(normalizeCmsHtml(value), legalSanitizeConfig) as string;

export const legalCmsHtml = (value: string) => ({
  __html: sanitizeLegalHtml(value),
});

export const sanitizeArticleHtml = (value: string) => {
  if (!value?.trim()) return ''
  return DOMPurify.sanitize(normalizeCmsHtml(value), articleSanitizeConfig) as string
}

export const articleCmsHtml = (value: string) => ({
  __html: sanitizeArticleHtml(value),
})

export const cmsPlainText = (value: string) =>
  sanitizeCmsHtml(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const cmsListItemHtml = (value: string) => {
  const normalizedValue = normalizeCmsHtml(value);
  if (/<[^>]+>/.test(normalizedValue)) {
    return cmsHtml(normalizedValue);
  }

  const [label, ...rest] = normalizedValue.split(':');
  if (rest.length === 0 || label.length > 60) {
    return { __html: escapeCmsHtml(normalizedValue) };
  }

  return cmsHtml(
    `<span class="font-bold">${escapeCmsHtml(label)}:</span>${escapeCmsHtml(` ${rest.join(':').trim()}`)}`,
  );
};

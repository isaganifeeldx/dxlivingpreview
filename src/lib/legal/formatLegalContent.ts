import { sanitizeLegalHtml } from '@/lib/cms/sanitizeHtml';
import { formatLegalPlainTextToHtml } from '@/lib/legal/formatLegalPlainText';

const HTML_CONTENT_PATTERN = /<\s*(p|h[1-6]|ul|ol|li|div|br|strong|em|a|span)\b/i;

export const isLegalHtmlContent = (value: string) => HTML_CONTENT_PATTERN.test(value);

const normalizeLegalWysiwygHtml = (html: string) => {
  let normalized = html
    .replace(/\sdata-[a-z0-9-]+="[^"]*"/gi, '')
    .replace(/\sdata-[a-z0-9-]+='[^']*'/gi, '')
    .replace(/https?:\/\/(?:stagewp\.)?dxliving\.com\//gi, '/')
    .replace(/https?:\/\/(?:www\.)?dxliving\.com\//gi, '/')
    .replace(
      /href="https?:\/\/(?:stagewp\.)?dxliving\.com\/privacy-policy\/?"/gi,
      'href="/privacy-policy"',
    );

  if (!/\blegal-content\b/.test(normalized)) {
    normalized = `<div class="legal-content">${normalized}</div>`;
  }

  return normalized;
};

/** Format ACF legal content — WYSIWYG HTML from WordPress or plain-text fallback. */
export const formatLegalContent = (
  raw: string,
  options: { linkPrivacyPolicy?: boolean } = {},
) => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return '<div class="legal-content"></div>';
  }

  if (isLegalHtmlContent(trimmed)) {
    return normalizeLegalWysiwygHtml(trimmed);
  }

  return formatLegalPlainTextToHtml(trimmed, options);
};

/** Format and sanitize on the server so client hydration uses an identical HTML string. */
export const prepareLegalContentHtml = (
  raw: string,
  options: { linkPrivacyPolicy?: boolean } = {},
) => sanitizeLegalHtml(formatLegalContent(raw, options));

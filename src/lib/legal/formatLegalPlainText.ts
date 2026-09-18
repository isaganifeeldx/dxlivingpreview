import { escapeCmsHtml } from '@/lib/cms/sanitizeHtml';

const formatInline = (text: string, linkPrivacyPolicy = false) => {
  let value = escapeCmsHtml(text);

  value = value.replace(/\bDX LIVING\b/g, '<strong>DX</strong> LIVING');
  value = value.replace(/\bDX Studio\b/g, '<strong>DX</strong> Studio');
  value = value.replace(/\bDX Interior\b/g, '<strong>DX</strong> Interior');
  value = value.replace(/\bDX Model\b/g, '<strong>DX</strong> Model');
  value = value.replace(/\bDX Prestige\b/g, '<strong>DX</strong> Prestige');

  value = value.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  value = value.replace(
    /hello@dxliving\.com\.au/g,
    '<a href="mailto:hello@dxliving.com.au">hello@dxliving.com.au</a>',
  );

  if (linkPrivacyPolicy) {
    value = value.replace(
      /Privacy Policy/g,
      '<a href="/privacy-policy">Privacy Policy</a>',
    );
  }

  return value;
};

const isNumberedSectionHeading = (line: string) =>
  /^\d+\.\s/.test(line) && !/^\d+\.\d+/.test(line);

const isNumberedSubsection = (line: string) => /^\d+\.\d+/.test(line);

const isSectionHeading = (line: string, nextLine: string) => {
  if (isNumberedSectionHeading(line)) {
    return true;
  }

  if (line.endsWith('?')) {
    return true;
  }

  if (line.includes('.') || line.length > 100) {
    return false;
  }

  if (!/^[A-Z0-9]/.test(line)) {
    return false;
  }

  if (!nextLine) {
    return line.length < 70;
  }

  if (isNumberedSubsection(nextLine) || isNumberedSectionHeading(nextLine)) {
    return true;
  }

  return nextLine.length > 60;
};

const isSubheading = (line: string, nextLine: string) => {
  if (isNumberedSectionHeading(line) || isNumberedSubsection(line)) {
    return false;
  }

  if (line.endsWith(':')) {
    return false;
  }

  if (line.includes('.') || line.length > 80) {
    return false;
  }

  if (!nextLine) {
    return true;
  }

  return isNumberedSubsection(nextLine) || nextLine.length > 40;
};

const isBulletLike = (line: string) => {
  if (line.includes('–') || line.includes(' - ')) {
    return true;
  }

  if (/^(For |With |Uploading|Violating|Using|Attempting|Introducing)/.test(line)) {
    return true;
  }

  return !line.endsWith('.') && line.length < 120;
};

const isLikelyListItem = (line: string, nextLine: string) => {
  if (!line || isSectionHeading(line, nextLine) || isSubheading(line, nextLine)) {
    return false;
  }

  if (isNumberedSubsection(line) || isNumberedSectionHeading(line)) {
    return false;
  }

  return isBulletLike(line) || line.length < 160;
};

export const formatLegalPlainTextToHtml = (
  raw: string,
  options: { linkPrivacyPolicy?: boolean } = {},
) => {
  const linkPrivacyPolicy = options.linkPrivacyPolicy ?? false;
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const blocks: string[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let listMode = false;

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    const text = paragraphLines.join(' ').trim();
    paragraphLines = [];

    if (!text) {
      return;
    }

    blocks.push(`<p>${formatInline(text, linkPrivacyPolicy)}</p>`);
  };

  const flushList = () => {
    if (listItems.length === 0) {
      listMode = false;
      return;
    }

    blocks.push(
      `<ul>${listItems.map((item) => `<li>${formatInline(item, linkPrivacyPolicy)}</li>`).join('')}</ul>`,
    );
    listItems = [];
    listMode = false;
  };

  const flushAll = () => {
    flushList();
    flushParagraph();
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    const nextLine = lines[index + 1]?.trim() ?? '';

    if (!line) {
      flushAll();
      continue;
    }

    if (isSectionHeading(line, nextLine)) {
      flushAll();
      blocks.push(`<h2>${formatInline(line, linkPrivacyPolicy)}</h2>`);
      continue;
    }

    if (isSubheading(line, nextLine)) {
      flushAll();
      blocks.push(`<h3>${formatInline(line, linkPrivacyPolicy)}</h3>`);
      continue;
    }

    if (line.endsWith(':') && line.length < 140 && !line.startsWith('http')) {
      flushAll();
      blocks.push(`<h3>${formatInline(line, linkPrivacyPolicy)}</h3>`);
      listMode = true;
      continue;
    }

    if (listMode && isLikelyListItem(line, nextLine)) {
      flushParagraph();
      listItems.push(line);
      continue;
    }

    if (listMode) {
      flushList();
    }

    if (isNumberedSubsection(line)) {
      flushAll();
      blocks.push(`<p>${formatInline(line, linkPrivacyPolicy)}</p>`);
      continue;
    }

    paragraphLines.push(line);
  }

  flushAll();

  return `<div class="legal-content">${blocks.join('')}</div>`;
};

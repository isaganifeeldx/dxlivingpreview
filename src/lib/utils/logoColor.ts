import { gsap } from 'gsap';

export const LOGO_FILL_DARK = '#1F1F1F';
export const LOGO_FILL_LIGHT = '#F5F5F5';

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/thank-you']

const INTERACTIVE_PATHS = [
  '/start-interactive',
  '/start-interactive/dx-model',
  '/start-interactive/dx-model-lite',
]

function isAuthPath(pathname: string): boolean {
  const path = pathname.startsWith('/pages/') ? pathname.slice('/pages'.length) : pathname
  return (
    AUTH_PATHS.some((authPath) => path === authPath || path.startsWith(`${authPath}/`)) ||
    INTERACTIVE_PATHS.some(
      (interactivePath) => path === interactivePath || path.startsWith(`${interactivePath}/`),
    )
  )
}

function getLogoPaths(): SVGPathElement[] {
  const logoElement = document.getElementById('dxl-logo');
  const svg = logoElement?.querySelector('svg');
  if (!svg) return [];

  const svgGroups = svg.querySelectorAll('g > g > g');
  const paths: SVGPathElement[] = [];

  if (svgGroups.length > 0) {
    for (let i = 0; i < Math.min(13, svgGroups.length); i++) {
      svgGroups[i].querySelectorAll('path').forEach((path) => paths.push(path));
    }
  } else {
    svg.querySelectorAll('path').forEach((path) => paths.push(path));
  }

  return paths;
}

export function setLogoFill(fill: string) {
  const paths = getLogoPaths();
  if (paths.length === 0) return;

  gsap.to(paths, {
    fill,
    duration: 0.3,
    ease: 'power2.out',
  });
}

/** Sync logo fill to page sections under the fixed header (ignores header's own white bg). */
export function syncLogoColorWithBackground() {
  if (typeof window !== 'undefined' && isAuthPath(window.location.pathname)) {
    setLogoFill(LOGO_FILL_DARK);
    return;
  }

  const whiteBgSections = document.querySelectorAll('.white-bg-section');
  let isWhiteBgBehindHeader = false;

  whiteBgSections.forEach((section) => {
    if (section.closest('header')) return;

    const rect = section.getBoundingClientRect();
    const headerHeight = 80;
    const isBehindHeader = rect.top <= headerHeight && rect.bottom > 0;
    if (isBehindHeader) {
      isWhiteBgBehindHeader = true;
    }
  });

  setLogoFill(isWhiteBgBehindHeader ? LOGO_FILL_DARK : LOGO_FILL_LIGHT);
}

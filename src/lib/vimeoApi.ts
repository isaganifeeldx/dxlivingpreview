const VIMEO_PLAYER_SCRIPT = 'https://player.vimeo.com/api/player.js';

let vimeoApiPromise: Promise<void> | null = null;

/**
 * Loads the Vimeo Player API once and reuses it across embeds.
 * Does not remove the script on unmount (shared global).
 */
export function loadVimeoApi(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if ((window as Window & { Vimeo?: unknown }).Vimeo) {
    return Promise.resolve();
  }

  if (vimeoApiPromise) {
    return vimeoApiPromise;
  }

  vimeoApiPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${VIMEO_PLAYER_SCRIPT}"]`,
    );

    if (existing) {
      if ((window as Window & { Vimeo?: unknown }).Vimeo) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => {
          vimeoApiPromise = null;
          reject(new Error('Failed to load Vimeo Player API'));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.src = VIMEO_PLAYER_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      vimeoApiPromise = null;
      reject(new Error('Failed to load Vimeo Player API'));
    };
    document.head.appendChild(script);
  });

  return vimeoApiPromise;
}

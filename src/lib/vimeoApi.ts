const VIMEO_PLAYER_SCRIPT = 'https://player.vimeo.com/api/player.js';

let vimeoApiPromise: Promise<void> | null = null;

/** Limit concurrent `new Vimeo.Player()` calls — burst init hangs some embeds. */
const MAX_CONCURRENT_PLAYER_INITS = 2;
let activePlayerInits = 0;
const playerInitWaiters: Array<() => void> = [];

function releasePlayerInitSlot() {
  activePlayerInits = Math.max(0, activePlayerInits - 1);
  const next = playerInitWaiters.shift();
  if (next) next();
}

/**
 * Runs Player construction with a small concurrency limit so multi-embed
 * pages (About, Projects) don't race Vimeo's postMessage handshake.
 */
export async function withVimeoPlayerInitSlot<T>(fn: () => Promise<T> | T): Promise<T> {
  while (activePlayerInits >= MAX_CONCURRENT_PLAYER_INITS) {
    await new Promise<void>((resolve) => {
      playerInitWaiters.push(resolve);
    });
  }

  activePlayerInits += 1;
  try {
    return await fn();
  } finally {
    releasePlayerInitSlot();
  }
}

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

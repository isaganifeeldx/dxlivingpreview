'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseNearViewportOnceOptions {
  /** How far before the element enters the viewport to trigger. Default: 200px. */
  rootMargin?: string;
  /** Skip observation and load immediately. */
  eager?: boolean;
}

/**
 * Becomes true once the element is near (or in) the viewport, then stays true.
 * Used to defer third-party iframes/scripts until they are about to be seen.
 */
export function useNearViewportOnce(
  options: UseNearViewportOnceOptions = {},
): {
  ref: RefObject<HTMLDivElement | null>;
  shouldLoad: boolean;
} {
  const { rootMargin = '200px 0px', eager = false } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (eager || shouldLoad) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [eager, rootMargin, shouldLoad]);

  return { ref, shouldLoad };
}

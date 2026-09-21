'use client';

import { useCallback, useEffect, useState, type RefCallback } from 'react';

interface UseNearViewportOnceOptions {
  /** How far before the element enters the viewport to trigger. Default: 200px. */
  rootMargin?: string;
  /** Skip observation and load immediately. */
  eager?: boolean;
}

/**
 * Becomes true once the element is near (or in) the viewport, then stays true.
 * Used to defer third-party iframes/scripts until they are about to be seen.
 *
 * Uses a callback ref so the observer attaches after the DOM node exists
 * (plain useRef + effect can miss the node and never load).
 */
export function useNearViewportOnce(
  options: UseNearViewportOnceOptions = {},
): {
  ref: RefCallback<HTMLDivElement | null>;
  shouldLoad: boolean;
} {
  const { rootMargin = '200px 0px', eager = false } = options;
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  const ref = useCallback<RefCallback<HTMLDivElement | null>>((node) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (eager) {
      setShouldLoad(true);
      return;
    }
    if (shouldLoad || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [eager, element, rootMargin, shouldLoad]);

  return { ref, shouldLoad };
}

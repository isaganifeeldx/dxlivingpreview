'use client';

import { useCallback, useEffect, useState, type RefCallback } from 'react';

interface UseViewportAutoplayOptions {
  /**
   * Fraction of the embed that must be visible to play.
   * At or below this amount the video pauses (e.g. 0.7 = pause at 70% visible).
   */
  threshold?: number;
  rootMargin?: string;
}

/**
 * Tracks whether a target element is sufficiently in the viewport for autoplay.
 * Uses a stable callback ref so the IntersectionObserver attaches after mount.
 *
 * Plays when more than `threshold` of the element is visible; pauses at/below that
 * (same rule scrolling up or down).
 */
export const useViewportAutoplay = (options: UseViewportAutoplayOptions = {}) => {
  const { threshold = 0.5, rootMargin = '0px' } = options;
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const elementRef = useCallback<RefCallback<HTMLDivElement>>((node) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) {
      setIsVisible(false);
      return;
    }

    // Dense steps around the threshold so we catch ~70% crossings while scrolling.
    const steps = Array.from(
      new Set(
        [0, 0.25, 0.5, threshold - 0.05, threshold, threshold + 0.05, 0.85, 1]
          .map((value) => Math.min(1, Math.max(0, Number(value.toFixed(3)))))
          .sort((a, b) => a - b),
      ),
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        // Prefer height visibility: scaled embeds inside overflow:hidden can
        // cap area-based intersectionRatio below 0.7 even when mostly on screen.
        const boundsHeight = entry.boundingClientRect.height;
        const heightRatio =
          boundsHeight > 0 ? entry.intersectionRect.height / boundsHeight : 0;

        // Play only while more than `threshold` of the video height is visible.
        // At 70% (threshold 0.7) or less — including scrolling away — pause.
        const shouldPlay = entry.isIntersecting && heightRatio > threshold;

        setIsVisible(shouldPlay);
      },
      {
        threshold: steps,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [element, threshold, rootMargin]);

  return { elementRef, isVisible };
};

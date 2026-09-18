'use client';

import { useCallback, useEffect, useState } from 'react';
import { isSearchBot } from '@/lib/utils/isSearchBot';

export const INTRO_SEEN_KEY = 'dxliving_intro_seen';

const isIntroSkippedPath = (pathname: string): boolean => {
  if (pathname === '/articles' || pathname === '/pages/articles') {
    return true;
  }

  return (
    /^\/articles\/[^/]+$/.test(pathname) ||
    /^\/pages\/articles\/[^/]+$/.test(pathname)
  );
};

interface UsePreloadOptions {
  /** When true (e.g. Googlebot), skip intro + preload on first paint. */
  skipIntroForBot?: boolean;
}

export const usePreload = ({ skipIntroForBot = false }: UsePreloadOptions = {}) => {
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [hasPreloaded, setHasPreloaded] = useState(skipIntroForBot);
  const [isHydrated, setIsHydrated] = useState(skipIntroForBot);

  useEffect(() => {
    if (skipIntroForBot || isSearchBot(navigator.userAgent)) {
      setIsIntroPlaying(false);
      setIsPreloading(false);
      setHasPreloaded(true);
      setIsHydrated(true);
      return;
    }

    const landingPath = window.location.pathname;
    const hasSeenIntro = window.localStorage.getItem(INTRO_SEEN_KEY) === 'true';
    const skipIntroForPath = isIntroSkippedPath(landingPath);

    if (hasSeenIntro || skipIntroForPath) {
      setIsIntroPlaying(false);
      setIsPreloading(true);
    } else {
      setIsIntroPlaying(true);
      setIsPreloading(false);
    }

    setIsHydrated(true);
  }, [skipIntroForBot]);

  const completeIntro = useCallback(() => {
    window.localStorage.setItem(INTRO_SEEN_KEY, 'true');
    setIsIntroPlaying(false);
    setIsPreloading(true);
  }, []);

  const skipIntro = useCallback(() => {
    window.localStorage.setItem(INTRO_SEEN_KEY, 'true');
    setIsIntroPlaying(false);
    setIsPreloading(true);
  }, []);

  const completePreload = useCallback(() => {
    window.setTimeout(() => {
      setIsPreloading(false);
      setHasPreloaded(true);
    }, 150);
  }, []);

  const resetIntro = useCallback(() => {
    window.localStorage.removeItem(INTRO_SEEN_KEY);
    setIsIntroPlaying(true);
    setIsPreloading(false);
    setHasPreloaded(false);
  }, []);

  return {
    isHydrated,
    isIntroPlaying,
    isPreloading,
    hasPreloaded,
    completeIntro,
    skipIntro,
    completePreload,
    resetIntro,
  };
};

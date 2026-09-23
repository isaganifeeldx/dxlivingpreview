'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { animationPresets } from '@/lib/utils/animations';
import SEOHeader from '@/components/layout/SEOHeader';
import FloatingNav from '@/components/layout/FloatingNav';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/layout/PageTransition';
import PreloadLogo from '@/components/layout/PreloadLogo';
import IntroVideo from '@/components/layout/IntroVideo';
import dynamic from 'next/dynamic';
import { INTRO_SEEN_KEY, usePreload } from '@/hooks/usePreload';
import {
  getHeroVideoReadyState,
  resetHeroVideoGate,
  subscribeHeroVideoReady,
} from '@/lib/heroVideoGate'
import { setShellReady } from '@/lib/shellReadyGate';
import { resetPageScroll } from '@/lib/utils/scrollToTop';
import { LOGO_FILL_DARK, LOGO_FILL_LIGHT, setLogoFill } from '@/lib/utils/logoColor';
import type { SocialLinks } from '@/lib/socialLinks';
import type { SiteSettingsData } from '@/lib/settings/defaults';

const ChatBox = dynamic(() => import('@/components/chat/ChatBox'), {
  ssr: false,
});

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/thank-you', '/verify-email'];

const HIDE_NAV_PATHS = [
  ...AUTH_PATHS,
  '/start-interactive',
  '/start-interactive/dx-model',
  '/start-interactive/dx-model-lite',
  '/pixel-streaming-test',
  '/multi-pixel-streaming',
];

/** App routes live under `/pages/...` with public rewrites; normalize for shell checks. */
function normalizePublicPath(pathname: string): string {
  return pathname.startsWith('/pages/') ? pathname.slice('/pages'.length) || '/' : pathname;
}

interface SiteShellProps {
  children: React.ReactNode;
  socialLinks: SocialLinks;
  footer: SiteSettingsData['footer'];
  floatingCta: SiteSettingsData['floatingCta'];
  /** Skip intro video + preload for search crawlers (set from server User-Agent). */
  skipIntroForBot?: boolean;
}

interface PreloadState {
  active: boolean;
  key: number;
  targetPath: string | null;
  animationDone: boolean;
}

export default function SiteShell({
  children,
  socialLinks,
  footer,
  floatingCta,
  skipIntroForBot = false,
}: SiteShellProps) {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const {
    isHydrated,
    isIntroPlaying,
    isPreloading: isIntroPreloading,
    hasPreloaded: hasCompletedIntroSequence,
    completeIntro,
    skipIntro,
    completePreload: completeIntroPreload,
    resetIntro,
  } = usePreload({ skipIntroForBot });

  const [preload, setPreload] = useState<PreloadState>({
    active: false,
    key: 0,
    targetPath: pathname,
    animationDone: false,
  });
  const [heroVideoReady, setHeroVideoReady] = useState(false);

  const publicPath = normalizePublicPath(pathname);
  const isAuthPage = AUTH_PATHS.includes(publicPath);
  const isInteractivePage = HIDE_NAV_PATHS.some(
    (path) => publicPath === path || publicPath.startsWith(`${path}/`),
  );
  const showNav = !isInteractivePage;
  const showFooter = !isAuthPage && !isInteractivePage;

  const shellReady =
    isHydrated && !isIntroPlaying && !isIntroPreloading && hasCompletedIntroSequence;

  const hasSeenIntro =
    typeof window !== 'undefined'
      ? window.localStorage.getItem(INTRO_SEEN_KEY) === 'true'
      : false;

  const startPreload = useCallback((targetPath: string | null = null) => {
    resetPageScroll();
    resetHeroVideoGate();
    setHeroVideoReady(false);
    try {
      // Lets usePageTransition run its entrance wipe only on client navigations.
      sessionStorage.setItem('dx_page_entrance', '1');
    } catch {
      // sessionStorage may be unavailable (private mode / blocked).
    }
    setPreload((currentPreload) => ({
      active: true,
      key: currentPreload.key + 1,
      targetPath,
      animationDone: false,
    }));
  }, []);

  const completePreload = useCallback(() => {
    setPreload((currentPreload) => {
      const targetHasLoaded =
        !currentPreload.targetPath || currentPreload.targetPath === pathname;

      if (!targetHasLoaded) {
        return {
          ...currentPreload,
          animationDone: true,
        };
      }

      return {
        ...currentPreload,
        active: false,
        animationDone: true,
      };
    });
  }, [pathname]);

  useEffect(() => {
    setShellReady(shellReady)
  }, [shellReady])

  useEffect(() => {
    const win = window as Window & {
      startPagePreload?: (targetPath?: string) => void
      resetIntro?: () => void
    }

    win.startPagePreload = (targetPath) => startPreload(targetPath ?? null);
    win.resetIntro = resetIntro;

    return () => {
      delete win.startPagePreload;
      delete win.resetIntro;
    };
  }, [startPreload, resetIntro]);

  const isPreloadOverlayActive =
    (isHydrated && !isIntroPlaying && isIntroPreloading) ||
    (shellReady && preload.active);

  useEffect(() => {
    if (!isPreloadOverlayActive) return;

    const unsubscribe = subscribeHeroVideoReady(() => {
      setHeroVideoReady(true);
    });

    const shortFallbackTimeout = window.setTimeout(() => {
      if (!getHeroVideoReadyState().hasHeroVideoCandidate) {
        setHeroVideoReady(true);
      }
    }, 600);

    const longFallbackTimeout = window.setTimeout(() => {
      setHeroVideoReady(true);
    }, 2500);

    return () => {
      unsubscribe();
      window.clearTimeout(shortFallbackTimeout);
      window.clearTimeout(longFallbackTimeout);
    };
  }, [isPreloadOverlayActive, preload.key]);

  useLayoutEffect(() => {
    if (!hasCompletedIntroSequence) return;
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;
    resetPageScroll();
    try {
      sessionStorage.setItem('dx_page_entrance', '1');
    } catch {
      // sessionStorage may be unavailable (private mode / blocked).
    }
    setPreload((currentPreload) => {
      if (currentPreload.active) {
        const targetHasLoaded =
          !currentPreload.targetPath || currentPreload.targetPath === pathname;

        if (targetHasLoaded && currentPreload.animationDone) {
          return {
            ...currentPreload,
            active: false,
          };
        }

        return currentPreload;
      }

      return {
        active: true,
        key: currentPreload.key + 1,
        targetPath: pathname,
        animationDone: false,
      };
    });
  }, [pathname, hasCompletedIntroSequence]);

  // FloatingNav mounts with opacity-0 and relies on GSAP entrance animations.
  // If it mounts after playPageAnimations already ran (intro delay), it stays hidden.
  useEffect(() => {
    if (!shellReady || !showNav) return;

    const timer = window.setTimeout(() => {
      const nav = document.querySelector<HTMLElement>(
        'nav[aria-label="Main navigation"]',
      );
      if (!nav) return;

      const opacity = Number(gsap.getProperty(nav, 'opacity') ?? 0);
      if (opacity > 0.01) return;

      animationPresets.animateWithDataAttributes(nav);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [shellReady, showNav]);

  useEffect(() => {
    if (!shellReady || !isAuthPage) return;

    const timer = window.setTimeout(() => setLogoFill(LOGO_FILL_DARK), 300);

    return () => {
      window.clearTimeout(timer);
      setLogoFill(LOGO_FILL_LIGHT);
    };
  }, [isAuthPage, shellReady]);

  useEffect(() => {
    if (!shellReady) return;

    const contentElement = document.getElementById('site-shell-content');
    if (!contentElement) return;

    const timeoutId = window.setTimeout(() => {
      gsap.to(contentElement, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      });
    }, 100);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [shellReady]);

  useEffect(() => {
    if (!shellReady || preload.active) return;

    // Safety: ensure scroll is unlocked after intro/preload finishes.
    // Prevents leftover overflow:hidden from PreloadLogo / page entrance locks.
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, [shellReady, preload.active]);

  useEffect(() => {
    if (!shellReady || preload.active) return;

    const isContactPath = pathname === '/contact' || pathname === '/pages/contact';
    if (!isContactPath) {
      resetPageScroll();
      return;
    }

    const scrollToContactInformation = () => {
      const contactInfoSection = document.getElementById('contact-information');
      if (!contactInfoSection) return;
      contactInfoSection.scrollIntoView({ behavior: 'auto', block: 'start' });
    };

    scrollToContactInformation();
    const rafId = window.requestAnimationFrame(scrollToContactInformation);
    const timeoutId = window.setTimeout(scrollToContactInformation, 120);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [pathname, preload.active, shellReady]);

  return (
    <>
      {!isHydrated && (
        <div className="fixed inset-0 z-[10000] bg-white" aria-hidden="true" />
      )}

      {isIntroPlaying && (
        <IntroVideo
          videoId="1121801459"
          mobileVideoId="1136689525"
          onVideoComplete={completeIntro}
          onSkip={skipIntro}
          showSkipImmediately={hasSeenIntro}
        />
      )}

      {isHydrated && !isIntroPlaying && isIntroPreloading && (
        <PreloadLogo
          key="intro-preload"
          canExit={heroVideoReady}
          onAnimationComplete={completeIntroPreload}
        />
      )}

      {shellReady && preload.active && (
        <PreloadLogo
          key={preload.key}
          canExit={
            heroVideoReady &&
            (!preload.targetPath || preload.targetPath === pathname)
          }
          onAnimationComplete={completePreload}
        />
      )}

      <div
        id="site-shell-content"
        style={{
          opacity: shellReady ? undefined : 0,
          pointerEvents: shellReady ? undefined : 'none',
        }}
      >
        <SEOHeader />
        {showNav && <FloatingNav socialLinks={socialLinks} />}
        <main id="main-content">
          <PageTransition transitionType="fade">{children}</PageTransition>
        </main>
        {showFooter && <Footer socialLinks={socialLinks} footer={footer} />}
        {shellReady && showNav && <ChatBox settings={floatingCta} />}
      </div>
    </>
  );
}

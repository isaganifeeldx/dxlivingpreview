'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: 'slide' | 'fade';
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transitionType = 'slide',
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoad = useRef(true);
  const hasNavigated = useRef(false);

  const navigateWithTransition = useCallback(
    (path: string) => {
      if (path === pathname) return;

      const startPagePreload = (
        window as Window & { startPagePreload?: (targetPath?: string) => void }
      ).startPagePreload;
      const preloadStarted = Boolean(startPagePreload);
      startPagePreload?.(path);

      const isHomePage = path === '/';
      const wasHomePage = sessionStorage.getItem('wasHomePage');

      if (isInitialLoad.current && isHomePage) {
        sessionStorage.setItem('wasHomePage', 'true');
        isInitialLoad.current = false;
        router.push(path);
        return;
      }

      if (!hasNavigated.current && isHomePage) {
        sessionStorage.setItem('wasHomePage', 'true');
        hasNavigated.current = true;
        router.push(path);
        return;
      }

      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      }
      if (!hasNavigated.current) {
        hasNavigated.current = true;
      }

      if (!wasHomePage) {
        sessionStorage.setItem('wasHomePage', isHomePage.toString());
        router.push(path);
        return;
      }

      if (preloadStarted) {
        sessionStorage.setItem('wasHomePage', isHomePage.toString());

        const navigationHistory = sessionStorage.getItem('navigationHistory') || '[]';
        const history = JSON.parse(navigationHistory) as string[];
        history.push(pathname);
        if (history.length > 5) history.shift();
        sessionStorage.setItem('navigationHistory', JSON.stringify(history));

        router.push(path);
        return;
      }

      setIsTransitioning(true);

      const existingOverlay = document.querySelector('.page-transition-overlay');
      if (existingOverlay?.parentNode) {
        existingOverlay.parentNode.removeChild(existingOverlay);
      }

      const overlay = document.createElement('div');
      overlay.className = 'page-transition-overlay';
      overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
    `;
      document.body.appendChild(overlay);
      overlayRef.current = overlay;

      let transitionDirection = 'right-left';

      if (isHomePage) {
        transitionDirection = 'top-bottom';
      } else if (!isHomePage && wasHomePage === 'true') {
        transitionDirection = 'bottom-top';
      }

      let fromProps: gsap.TweenVars = {};
      let toProps: gsap.TweenVars = {};
      let exitProps: gsap.TweenVars = {};

      if (transitionType === 'fade') {
        fromProps = { opacity: 0 };
        toProps = { opacity: 1 };
        exitProps = { opacity: 0 };
      } else {
        switch (transitionDirection) {
          case 'bottom-top':
            fromProps = { y: '100%', opacity: 0 };
            toProps = { y: '0%', opacity: 1 };
            exitProps = { y: '-100%', opacity: 0 };
            break;
          case 'top-bottom':
            fromProps = { y: '-100%', opacity: 0 };
            toProps = { y: '0%', opacity: 1 };
            exitProps = { y: '100%', opacity: 0 };
            break;
          case 'right-left':
          default:
            fromProps = { x: '100%', opacity: 0 };
            toProps = { x: '0%', opacity: 1 };
            exitProps = { x: '-100%', opacity: 0 };
            break;
        }
      }

      gsap.fromTo(overlay, fromProps, {
        ...toProps,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          sessionStorage.setItem('wasHomePage', isHomePage.toString());

          const navigationHistory = sessionStorage.getItem('navigationHistory') || '[]';
          const history = JSON.parse(navigationHistory) as string[];
          history.push(pathname);
          if (history.length > 5) history.shift();
          sessionStorage.setItem('navigationHistory', JSON.stringify(history));

          router.push(path);

          setTimeout(() => {
            gsap.to(overlay, {
              ...exitProps,
              duration: 0.4,
              ease: 'power2.inOut',
              onComplete: () => {
                overlay.parentNode?.removeChild(overlay);
                overlayRef.current = null;
                setIsTransitioning(false);
              },
            });
          }, 200);
        },
      });
    },
    [pathname, router, transitionType]
  );

  useEffect(() => {
    const isHomePage = pathname === '/';
    const wasHomePage = sessionStorage.getItem('wasHomePage');

    if (isInitialLoad.current && isHomePage) {
      sessionStorage.setItem('wasHomePage', 'true');
      isInitialLoad.current = false;
      return;
    }

    if (!hasNavigated.current && isHomePage) {
      sessionStorage.setItem('wasHomePage', 'true');
      hasNavigated.current = true;
      return;
    }

    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
    if (!hasNavigated.current) {
      hasNavigated.current = true;
    }

    if (!wasHomePage) {
      sessionStorage.setItem('wasHomePage', isHomePage.toString());
      return;
    }

    sessionStorage.setItem('wasHomePage', isHomePage.toString());
  }, [pathname]);

  useEffect(() => {
    (window as Window & { navigateWithTransition?: (path: string) => void }).navigateWithTransition =
      navigateWithTransition;

    return () => {
      delete (window as Window & { navigateWithTransition?: (path: string) => void })
        .navigateWithTransition;
    };
  }, [navigateWithTransition]);

  return (
    <div className={`page-transition-container ${isTransitioning ? 'transitioning' : ''}`}>
      {children}
    </div>
  );
};

export default PageTransition;

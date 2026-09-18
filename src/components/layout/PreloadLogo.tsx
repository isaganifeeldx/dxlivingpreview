'use client';

import { useCallback, useEffect, useRef } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';
import { gsap } from 'gsap';
import logoAnimationData from '../../../public/logo-animation.json';

interface PreloadLogoProps {
  onAnimationComplete?: () => void;
  className?: string;
  canExit?: boolean;
}

const PreloadLogo: React.FC<PreloadLogoProps> = ({
  onAnimationComplete,
  className = '',
  canExit = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const animationFinishedRef = useRef(false);
  const exitingRef = useRef(false);
  const canExitRef = useRef(canExit);
  const onAnimationCompleteRef = useRef(onAnimationComplete);

  useEffect(() => {
    canExitRef.current = canExit;
    onAnimationCompleteRef.current = onAnimationComplete;
  }, [canExit, onAnimationComplete]);

  // Always clear overflow — do not restore a previous inline value.
  // Other code (e.g. homepage entrance lock) may have set overflow:hidden
  // before this overlay mounted; restoring that value leaves the page stuck.
  const restorePageScroll = useCallback(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, []);

  const exitPreloader = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay || exitingRef.current) return;

    exitingRef.current = true;
    overlay.style.pointerEvents = 'none';

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(overlay, {
          y: '100vh',
          duration: 0.45,
          ease: 'power2.inOut',
          onComplete: () => {
            restorePageScroll();
            onAnimationCompleteRef.current?.();
          },
        });
      },
    });
  }, [restorePageScroll]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const logoContainer = logoContainerRef.current;
    if (!overlay || !logoContainer) return;

    animationFinishedRef.current = false;
    exitingRef.current = false;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const complete = () => {
      if (animationFinishedRef.current) return;
      animationFinishedRef.current = true;

      if (canExitRef.current) {
        exitPreloader();
      }
    };

    const animation = lottie.loadAnimation({
      container: logoContainer,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: logoAnimationData,
    });
    animationRef.current = animation;

    animation.addEventListener('complete', complete);
    animation.goToAndStop(89, true);
    animation.setDirection(-1);
    animation.play();
    // Cap logo wait so preload cannot hold LCP for the full Lottie duration.
    const fallbackTimeout = window.setTimeout(complete, 2200);

    return () => {
      window.clearTimeout(fallbackTimeout);
      restorePageScroll();
      if (animationRef.current) {
        animationRef.current.removeEventListener('complete', complete);
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [exitPreloader, restorePageScroll]);

  useEffect(() => {
    if (canExit && animationFinishedRef.current) {
      exitPreloader();
    }
  }, [canExit, exitPreloader]);

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 flex items-center justify-center bg-white ${className}`}
      style={{ opacity: 1, zIndex: 99999, isolation: 'isolate' }}
      role="status"
      aria-label="Loading DX Living"
    >
      <div
        ref={logoContainerRef}
        className="h-screen w-[300px]"
        aria-hidden="true"
      />
    </div>
  );
};

export default PreloadLogo;

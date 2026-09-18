import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';

export const resetPageScroll = () => {
  gsap.killTweensOf(window);
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

export const useScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    resetPageScroll();
  }, [pathname]);

  useEffect(() => {
    const handleRouteChange = () => {
      resetPageScroll();
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
};

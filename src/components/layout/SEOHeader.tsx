'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LottieLogo from '@/components/layout/LottieLogo';

const SEOHeader: React.FC = () => {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [isBannerInViewport, setIsBannerInViewport] = useState(false);

  // Observe banner-section elements to detect when they're in viewport
  useEffect(() => {
    const bannerSections = document.querySelectorAll('.banner-section');
    
    if (bannerSections.length === 0) {
      setIsBannerInViewport(false);
      return;
    }

    const observers: IntersectionObserver[] = [];
    const visibleBanners = new Set<Element>();

    bannerSections.forEach((banner) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleBanners.add(entry.target);
            } else {
              visibleBanners.delete(entry.target);
            }
          });
          // Update immediately while scrolling
          setIsBannerInViewport(visibleBanners.size > 0);
        },
        {
          threshold: 0.1, // Trigger when 10% of the banner is visible
          rootMargin: '0px',
        }
      );

      observer.observe(banner);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
      visibleBanners.clear();
    };
  }, [pathname]);

  const handleLogoClick = () => {
    const win = window as Window & {
      isInteractiveSectionVisible?: boolean;
      handleBackToHomepage?: () => void;
      navigateWithTransition?: (path: string) => void;
    };

    if (win.isInteractiveSectionVisible && win.handleBackToHomepage) {
      win.handleBackToHomepage();
    } else if (win.navigateWithTransition) {
      win.navigateWithTransition('/');
    } else {
      window.location.href = '/';
    }
  };

  // Determine if white background should be applied (only on mobile, not on homepage, and not when banner is in viewport)
  const shouldShowWhiteBg = !isHomepage && !isBannerInViewport;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 md:bg-transparent transition-colors duration-300 ${shouldShowWhiteBg ? 'bg-white white-bg-section' : 'bg-transparent'}`}
      aria-label="Site"
    >
      <div className="mx-auto p-8 py-6 md:py-8">
        <div
          data-animation="slide"
          data-direction="left"
          data-delay="2.0"
          data-duration="0.8"
          className="flex justify-between items-center">
          {/* Logo — real href so crawlers and no-JS users can reach the homepage. */}
          <Link
            href="/"
            onClick={(event) => {
              event.preventDefault();
              handleLogoClick();
            }}
            className="inline-block"
            aria-label="DX Living home"
          >
            <LottieLogo className="logo transition-all bg-transparent border-none cursor-pointer" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SEOHeader; 
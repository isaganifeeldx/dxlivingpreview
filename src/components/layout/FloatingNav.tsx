'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SocialLinks from '@/components/ui/SocialLinks';
import type { SocialLinks as SocialLinksData } from '@/lib/socialLinks';

gsap.registerPlugin(ScrollTrigger);

const MOBILE_MENU_FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface FloatingNavProps {
  socialLinks: SocialLinksData;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ socialLinks }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null);
  const mobileMenuItemsRef = useRef<HTMLDivElement>(null);
  const socialIconsRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isClosingRef = useRef(false);

  const isActive = (path: string) => pathname === path;
  const isHomePage = pathname === '/';

  const getMobileMenuFocusables = useCallback(() => {
    if (!mobileMenuPanelRef.current) return [];
    return Array.from(
      mobileMenuPanelRef.current.querySelectorAll<HTMLElement>(MOBILE_MENU_FOCUSABLE),
    ).filter((el) => !el.hasAttribute('disabled'));
  }, []);

  const closeMobileMenu = useCallback((options: { animated?: boolean; restoreFocus?: boolean } = {}) => {
    const { animated = true, restoreFocus = true } = options;

    if (!isMenuOpen || isClosingRef.current) return;

    const finishClose = () => {
      isClosingRef.current = false;
      setIsMenuOpen(false);
      if (restoreFocus) {
        menuButtonRef.current?.focus();
      }
    };

    if (!animated) {
      finishClose();
      return;
    }

    isClosingRef.current = true;

    if (closeButtonRef.current) {
      gsap.to(closeButtonRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      });
    }

    if (socialIconsRef.current) {
      gsap.to(socialIconsRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
      });
    }

    if (mobileMenuItemsRef.current) {
      gsap.to(mobileMenuItemsRef.current.children, {
        x: 50,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.in',
        delay: 0.1,
      });
    }

    if (mobileMenuPanelRef.current) {
      gsap.to(mobileMenuPanelRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power2.in',
        delay: 0.2,
      });
    }

    if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        delay: 0.3,
      });
    }

    window.setTimeout(finishClose, 800);
  }, [isMenuOpen]);

  const openMobileMenu = () => {
    isClosingRef.current = false;
    setIsMenuOpen(true);
  };

  const toggleMobileMenu = () => {
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const handleNavigation = (path: string) => {
    if (path === pathname) return;

    const win = window as Window & { navigateWithTransition?: (path: string) => void };
    if (win.navigateWithTransition) {
      win.navigateWithTransition(path);
    } else {
      window.location.href = path;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, path: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(path);
    }
  };

  // Monitor white background sections and change individual menu item colors accordingly
  useEffect(() => {
    const checkWhiteBgSections = () => {
      const whiteBgSections = document.querySelectorAll('.white-bg-section');

      if (navRef.current) {
        const navLinks = navRef.current.querySelectorAll('a, button');

        navLinks.forEach(link => {
          const linkRect = link.getBoundingClientRect();
          let isWhiteBgBehindLink = false;

          // Check if any white section overlaps with this specific link
          whiteBgSections.forEach(section => {
            const rect = section.getBoundingClientRect();

            // Check if white section overlaps with this specific link area
            const isOverlapping = rect.top <= linkRect.bottom && rect.bottom >= linkRect.top &&
              rect.left <= linkRect.right && rect.right >= linkRect.left;

            if (isOverlapping) {
              isWhiteBgBehindLink = true;
            }
          });

          // Update this specific link's color based on its background
          const newTextColor = isWhiteBgBehindLink ? '#1F1F1F' : '#FFFFFF';

          gsap.to(link, {
            color: newTextColor,
            duration: 0.3,
            ease: "power2.out"
          });

          // Update spans within this link
          const spans = link.querySelectorAll('span');
          spans.forEach(span => {
            gsap.to(span, {
              color: newTextColor,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        });
      }
    };

    // Initial check
    checkWhiteBgSections();

    // Add scroll event listener for color changes
    window.addEventListener('scroll', checkWhiteBgSections, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkWhiteBgSections);
    };
  }, [pathname]);

  // GSAP animation for mobile menu
  useEffect(() => {
    if (isMenuOpen && mobileMenuRef.current && mobileMenuPanelRef.current && mobileMenuItemsRef.current && socialIconsRef.current) {
      // Reset initial state
      gsap.set(mobileMenuRef.current, { opacity: 0 });
      gsap.set(mobileMenuPanelRef.current, { x: '100%' });
      gsap.set(mobileMenuItemsRef.current.children, { x: 50, opacity: 0 });
      gsap.set(socialIconsRef.current.children, { y: 30, opacity: 0 });

      // Animate background overlay fade in
      gsap.to(mobileMenuRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Animate menu panel sliding in
      gsap.to(mobileMenuPanelRef.current, {
        x: 0,
        duration: 0.6,
        ease: 'power2.out'
      });

      // Animate menu items with stagger
      gsap.to(mobileMenuItemsRef.current.children, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
      });

      // Animate social icons
      gsap.to(socialIconsRef.current.children, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.4
      });

      // Animate close button
      if (closeButtonRef.current) {
        gsap.fromTo(closeButtonRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)', delay: 0.3 }
        );
      }
    }
  }, [isMenuOpen]);

  // Scroll lock while mobile menu is open
  useEffect(() => {
    if (!isMenuOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isMenuOpen]);

  // Focus into menu, trap Tab, Escape to close
  useEffect(() => {
    if (!isMenuOpen) return;

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileMenu();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getMobileMenuFocusables();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, closeMobileMenu, getMobileMenuFocusables]);

  // Close menu when navigating to a new page
  useEffect(() => {
    isClosingRef.current = false;
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Floating Navigation - Right side */}
      <nav ref={navRef}
        data-animation="slide"
        data-direction="right"
        data-delay="2.0"
        data-duration="0.8"
        aria-label="Main navigation"
        className={`hidden xl:block fixed right-8 z-50 opacity-0 ${isHomePage
          ? 'top-[50px]'
          : 'top-[50px]'
          } `}
      >
        <div
          className="flex flex-col space-y-6 transition-all group/nav"
        >

          <button
            onClick={(e) => {
              e.preventDefault();
              // Trigger intro video instead of navigation
              if ((window as any).resetIntro) {
                (window as any).resetIntro();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Trigger intro video instead of navigation
                if ((window as any).resetIntro) {
                  (window as any).resetIntro();
                }
              }
            }}
            className={`group relative flex items-center justify-end transition-all tracking-[3px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#BFB6AD] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded`}
            style={{ color: '#BFB6AD' }}
            //tabIndex={1}
            aria-label="Show intro video"
          >
            <span className={`transition-all border-b-[1px] group-hover:border-[#BFB6AD] text-[16px] ${isHomePage
              ? 'opacity-100'
              : 'opacity-0 group-hover/nav:opacity-100'
              } border-transparent`}
              style={{ color: '#BFB6AD' }}>
              INTRO
            </span>
            {!isHomePage && (
              <div className="p-[14px] rounded-full border-[1px] ml-3 border-transparent">
                <div className="w-3 h-3 rounded-full border-2 border-[#BFB6AD] transition-all tracking-[3px] bg-white"></div>
              </div>
            )}
          </button>

          <Link
            href="/start-interactive"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/start-interactive');
            }}
            onKeyDown={(e) => handleKeyDown(e, '/start-interactive')}
            className={`group relative flex items-center justify-end transition-all tracking-[3px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#BFB6AD] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded`}
            style={{ color: '#BFB6AD' }}
            //tabIndex={1}
            aria-label="Navigate to Start Interactive page"
          >
            <span className={`transition-all border-b-[1px] group-hover:border-[#BFB6AD] text-[16px] ${isHomePage
              ? 'opacity-100'
              : 'opacity-0 group-hover/nav:opacity-100'
              }
              ${isActive('/start-interactive') ? 'border-[#BFB6AD] opacity-100' : 'border-transparent'}
              `}
              style={{ color: '#BFB6AD' }}>
              START INTERACTIVE
            </span>
            {!isHomePage && (
              <div className={`p-[14px] rounded-full border-[1px] ml-3 ${isActive('/start-interactive') ? 'border-[#BFB6AD]' : 'border-transparent'
                }`}>
                <div className={`w-3 h-3 rounded-full border-2 border-[#BFB6AD] transition-all tracking-[3px] ${isActive('/start-interactive') ? 'bg-[#BFB6AD]' : 'bg-white'
                  }`}></div>
              </div>
            )}
          </Link>

          <Link
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/about');
            }}
            onKeyDown={(e) => handleKeyDown(e, '/about')}
            className={`group relative flex items-center justify-end transition-all tracking-[3px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#BFB6AD] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded`}
            style={{ color: '#BFB6AD' }}
            //tabIndex={1}
            aria-label="Navigate to About page"
          >
            <span className={`transition-all border-b-[1px] group-hover:border-[#BFB6AD] text-[16px] ${isHomePage
              ? 'opacity-100'
              : 'opacity-0 group-hover/nav:opacity-100'
              }
              ${isActive('/about') ? 'border-[#BFB6AD] opacity-100' : 'border-transparent'}
              `}
              style={{ color: '#BFB6AD' }}>
              ABOUT
            </span>
            {!isHomePage && (
              <div className={`p-[14px] rounded-full border-[1px] ml-3 ${isActive('/about') ? 'border-[#BFB6AD]' : 'border-transparent'
                }`}>
                <div className={`w-3 h-3 rounded-full border-2 border-[#BFB6AD] transition-all tracking-[3px] ${isActive('/about') ? 'bg-[#BFB6AD]' : 'bg-white'
                  }`}></div>
              </div>
            )}
          </Link>

          <Link
            href="/modules"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/modules');
            }}
            onKeyDown={(e) => handleKeyDown(e, '/modules')}
            className={`group relative flex items-center justify-end transition-all tracking-[3px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#BFB6AD] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded`}
            style={{ color: '#BFB6AD' }}
            //tabIndex={1}
            aria-label="Navigate to Modules page"
          >
            <span className={`transition-all border-b-[1px] group-hover:border-[#BFB6AD] text-[16px] ${isHomePage
              ? 'opacity-100'
              : 'opacity-0 group-hover/nav:opacity-100'
              }
              ${isActive('/modules') ? 'border-[#BFB6AD] opacity-100' : 'border-transparent'}
              `}
              style={{ color: '#BFB6AD' }}>
              MODULES
            </span>
            {!isHomePage && (
              <div className={`p-[14px] rounded-full border-[1px] ml-3 ${isActive('/modules') ? 'border-[#BFB6AD]' : 'border-transparent'
                }`}>
                <div className={`w-3 h-3 rounded-full border-2 border-[#BFB6AD] transition-all tracking-[3px] ${isActive('/modules') ? 'bg-[#BFB6AD]' : 'bg-white'
                  }`}></div>
              </div>
            )}
          </Link>

          <Link
            href="/projects"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/projects');
            }}
            onKeyDown={(e) => handleKeyDown(e, '/projects')}
            className={`group relative flex items-center justify-end transition-all tracking-[3px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#BFB6AD] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded`}
            style={{ color: '#BFB6AD' }}
            //tabIndex={1}
            aria-label="Navigate to Projects page"
          >
            <span className={`transition-all border-b-[1px] group-hover:border-[#BFB6AD] text-[16px] ${isHomePage
              ? 'opacity-100'
              : 'opacity-0 group-hover/nav:opacity-100'
              }
              ${isActive('/projects') ? 'border-[#BFB6AD] opacity-100' : 'border-transparent'}
              `}
              style={{ color: '#BFB6AD' }}>
              PROJECTS
            </span>
            {!isHomePage && (
              <div className={`p-[14px] rounded-full border-[1px] ml-3 ${isActive('/projects') ? 'border-[#BFB6AD]' : 'border-transparent'
                }`}>
                <div className={`w-3 h-3 rounded-full border-2 border-[#BFB6AD] transition-all tracking-[3px] ${isActive('/projects') ? 'bg-[#BFB6AD]' : 'bg-white'
                  }`}></div>
              </div>
            )}
          </Link>

          <Link
            href="/suppliers"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/suppliers');
            }}
            onKeyDown={(e) => handleKeyDown(e, '/suppliers')}
            className={`group relative flex items-center justify-end transition-all tracking-[3px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#BFB6AD] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded`}
            style={{ color: '#BFB6AD' }}
            //tabIndex={1}
            aria-label="Navigate to Suppliers page"
          >
            <span className={`transition-all border-b-[1px] group-hover:border-[#BFB6AD] text-[16px] ${isHomePage
              ? 'opacity-100'
              : 'opacity-0 group-hover/nav:opacity-100'
              }
              ${isActive('/suppliers') ? 'border-[#BFB6AD] opacity-100' : 'border-transparent'}
              `}
              style={{ color: '#BFB6AD' }}>
              SUPPLIERS
            </span>
            {!isHomePage && (
              <div className={`p-[14px] rounded-full border-[1px] ml-3 ${isActive('/suppliers') ? 'border-[#BFB6AD]' : 'border-transparent'
                }`}>
                <div className={`w-3 h-3 rounded-full border-2 border-[#BFB6AD] transition-all tracking-[3px] ${isActive('/suppliers') ? 'bg-[#BFB6AD]' : 'bg-white'
                  }`}></div>
              </div>
            )}
          </Link>

          <Link
            href="/apply"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/apply');
            }}
            onKeyDown={(e) => handleKeyDown(e, '/apply')}
            className={`group relative flex items-center justify-end transition-all tracking-[3px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#BFB6AD] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded`}
            style={{ color: '#BFB6AD' }}
            //tabIndex={1}
            aria-label="Navigate to Apply page"
          >
            <span className={`transition-all border-b-[1px] group-hover:border-[#BFB6AD] text-[16px] ${isHomePage
              ? 'opacity-100'
              : 'opacity-0 group-hover/nav:opacity-100'
              }
              ${isActive('/apply') ? 'border-[#BFB6AD] opacity-100' : 'border-transparent'}
              `}
              style={{ color: '#BFB6AD' }}>
              APPLY NOW
            </span>
            {!isHomePage && (
              <div className={`p-[14px] rounded-full border-[1px] ml-3 ${isActive('/apply') ? 'border-[#BFB6AD]' : 'border-transparent'
                }`}>
                <div className={`w-3 h-3 rounded-full border-2 border-[#BFB6AD] transition-all tracking-[3px] ${isActive('/apply') ? 'bg-[#BFB6AD]' : 'bg-white'
                  }`}></div>
              </div>
            )}
          </Link>

          <Link
            href="/articles"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/articles');
            }}
            onKeyDown={(e) => handleKeyDown(e, '/articles')}
            className={`group relative flex items-center justify-end transition-all tracking-[3px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#BFB6AD] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded`}
            style={{ color: '#BFB6AD' }}
            //tabIndex={1}
            aria-label="Navigate to Articles page"
          >
            <span className={`transition-all border-b-[1px] group-hover:border-[#BFB6AD] text-[16px] ${isHomePage
              ? 'opacity-100'
              : 'opacity-0 group-hover/nav:opacity-100'
              }
              ${isActive('/articles') ? 'border-[#BFB6AD] opacity-100' : 'border-transparent'}
              `}
              style={{ color: '#BFB6AD' }}>
              ARTICLES
            </span>
            {!isHomePage && (
              <div className={`p-[14px] rounded-full border-[1px] ml-3 ${isActive('/articles') ? 'border-[#BFB6AD]' : 'border-transparent'
                }`}>
                <div className={`w-3 h-3 rounded-full border-2 border-[#BFB6AD] transition-all tracking-[3px] ${isActive('/articles') ? 'bg-[#BFB6AD]' : 'bg-white'
                  }`}></div>
              </div>
            )}
          </Link>

          <Link
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/contact');
            }}
            onKeyDown={(e) => handleKeyDown(e, '/contact')}
            className={`group relative flex items-center justify-end transition-all tracking-[3px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#BFB6AD] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded`}
            style={{ color: '#BFB6AD' }}
            //tabIndex={1}
            aria-label="Navigate to Contact page"
          >
            <span className={`transition-all border-b-[1px] group-hover:border-[#BFB6AD] text-[16px] ${isHomePage
              ? 'opacity-100'
              : 'opacity-0 group-hover/nav:opacity-100'
              }
              ${isActive('/contact') ? 'border-[#BFB6AD] opacity-100' : 'border-transparent'}
              `}
              style={{ color: '#BFB6AD' }}>
              CONTACT
            </span>
            {!isHomePage && (
              <div className={`p-[14px] rounded-full border-[1px] ml-3 ${isActive('/contact') ? 'border-[#BFB6AD]' : 'border-transparent'
                }`}>
                <div className={`w-3 h-3 rounded-full border-2 border-[#BFB6AD] transition-all tracking-[3px] ${isActive('/contact') ? 'bg-[#BFB6AD]' : 'bg-white'
                  }`}></div>
              </div>
            )}
          </Link>

          <Link
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/login');
            }}
            onKeyDown={(e) => handleKeyDown(e, '/login')}
            className={`group relative flex items-center justify-end transition-all tracking-[3px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#BFB6AD] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded`}
            style={{ color: '#BFB6AD'}}
            tabIndex={1}
            aria-label="Navigate to Login page"
          >
            <span className={`transition-all border-b-[1px] group-hover:border-[#BFB6AD] text-[16px] ${isHomePage
              ? 'opacity-100'
              : 'opacity-0 group-hover/nav:opacity-100'
              }
              ${isActive('/login') ? 'border-[#BFB6AD] opacity-100' : 'border-transparent'}
              `}
              style={{ color: '#BFB6AD' }}>
              LOGIN
            </span>
            {!isHomePage && (
              <div className={`p-[14px] rounded-full border-[1px] ml-3 ${isActive('/login') ? 'border-[#BFB6AD]' : 'border-transparent'
                }`}>
                <div className={`w-3 h-3 rounded-full border-2 border-[#BFB6AD] transition-all tracking-[3px] ${isActive('/login') ? 'bg-[#BFB6AD]' : 'bg-white'
                  }`}></div>
              </div>
            )}
          </Link>

        </div>
      </nav>

      {/* Mobile Floating Menu Button */}
      <button
        ref={menuButtonRef}
        type="button"
        onClick={toggleMobileMenu}
        className="xl:hidden fixed top-[23px] sm:top-7 right-8 text-white z-50 focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded border-[1px] border-[#BFB6AD] p-[5px]"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation-menu"
      >
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#BFB6AD"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="xl:hidden fixed inset-0 bg-black/50 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-navigation-title"
          onClick={(event) => {
            if (event.target === mobileMenuRef.current) {
              closeMobileMenu();
            }
          }}
        >
          <div ref={mobileMenuPanelRef} id="mobile-navigation-menu" className="fixed top-0 right-0 h-full w-64 bg-gray-900/95 backdrop-blur-sm p-8">
            <h2 id="mobile-navigation-title" className="sr-only">
              Navigation menu
            </h2>
            <div className="flex justify-end items-center mb-8 ">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => closeMobileMenu()}
                className="text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded"
                aria-label="Close navigation menu"
              >
                ✕
              </button>
            </div>
            <nav aria-label="Mobile navigation">
              <div ref={mobileMenuItemsRef} className="flex flex-col space-y-6">

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Trigger intro video instead of navigation
                    if ((window as any).resetIntro) {
                      (window as any).resetIntro();
                    }
                  }}
                  className="text-white font-medium hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded"
                  aria-label="Navigate to Intro page"
                >
                  INTRO
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/start-interactive');
                  }}
                  className="text-white font-medium hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded"
                  aria-label="Navigate to Start Interactive page"
                >
                  START INTERACTIVE
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleNavigation('/about');
                    closeMobileMenu({ animated: false, restoreFocus: false });
                  }}
                  className="text-white font-medium hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded"
                  aria-label="Navigate to About page"
                >
                  ABOUT
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleNavigation('/modules');
                    closeMobileMenu({ animated: false, restoreFocus: false });
                  }}
                  className="text-white font-medium hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded"
                  aria-label="Navigate to Modules page"
                >
                  MODULES
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleNavigation('/projects');
                    closeMobileMenu({ animated: false, restoreFocus: false });
                  }}
                  className="text-white font-medium hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded"
                  aria-label="Navigate to Projects page"
                >
                  PROJECTS
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleNavigation('/suppliers');
                    closeMobileMenu({ animated: false, restoreFocus: false });
                  }}
                  className="text-white font-medium hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded"
                  aria-label="Navigate to Suppliers page"
                >
                  SUPPLIERS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleNavigation('/apply');
                    closeMobileMenu({ animated: false, restoreFocus: false });
                  }}
                  className="text-white font-medium hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded"
                  aria-label="Navigate to Apply page"
                >
                  APPLY NOW
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleNavigation('/articles');
                    closeMobileMenu({ animated: false, restoreFocus: false });
                  }}
                  className="text-white font-medium hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded"
                  aria-label="Navigate to Resources page"
                >
                  ARTICLES
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleNavigation('/contact');
                    closeMobileMenu({ animated: false, restoreFocus: false });
                  }}
                  className="text-white font-medium hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded"
                  aria-label="Navigate to Contact page"
                >
                  CONTACT
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleNavigation('/login');
                    closeMobileMenu({ animated: false, restoreFocus: false });
                  }}
                  className="text-white font-medium hover:text-blue-300 text-left focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-opacity-50 rounded"
                  aria-label="Navigate to Login page"
                >
                  LOGIN
                </button>
              </div>
            </nav>

            <SocialLinks
              links={socialLinks}
              variant="light"
              containerRef={socialIconsRef}
              className="flex space-x-2 social-icons-container absolute bottom-8"
            />

          </div>
        </div>
      )}
    </>
  );
};

export default FloatingNav; 
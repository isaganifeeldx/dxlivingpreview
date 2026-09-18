'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnchorMenuProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
}

const AnchorMenu: React.FC<AnchorMenuProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const [showIconOnly, setShowIconOnly] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuShowTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iconShowTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSetMenuTimeoutRef = useRef<boolean>(false);
  const hasSetIconTimeoutRef = useRef<boolean>(false);
  const menuJustAppearedRef = useRef<boolean>(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState<boolean>(false);
  const [isMenuReady, setIsMenuReady] = useState<boolean>(false);
  const [menuJustAppeared, setMenuJustAppeared] = useState<boolean>(false);
  const [isIconReady, setIsIconReady] = useState<boolean>(false);
  const [isManuallyToggled, setIsManuallyToggled] = useState<boolean>(false);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Handle icon click to toggle menu
  const handleIconClick = () => {
    // Clear any existing auto-hide timeout when manually toggling
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    if (isVisible) {
      // Menu is visible, hide it
      setIsManuallyToggled(true);
      animateMenuOut();
      setTimeout(() => {
        setIsVisible(false);
        setIsMenuReady(false);
        setIsManuallyToggled(false);
      }, 400); // Match the animation duration
    } else {
      // Menu is hidden, show it
      setIsManuallyToggled(true);
      setShowIconOnly(false);
      setIsVisible(true);
      setIsIconReady(false);
      
      // Animate the icon sliding in
      setTimeout(() => {
        setIsIconReady(true);
        animateIconIn();
      }, 10);
      
      // Set initial state and then show menu
      setTimeout(() => {
        if (menuRef.current) {
          gsap.set(menuRef.current, {
            x: -300,
            opacity: 0,
            scale: 0.8,
            immediateRender: true
          });
          // Now make menu ready and animate in
          setIsMenuReady(true);
          setTimeout(() => {
            animateMenuIn();
          }, 10);
        }
      }, 10);
      
      // Reset manual toggle flag after animation
      setTimeout(() => {
        setIsManuallyToggled(false);
      }, 600); // Slightly longer than animation duration
    }
  };

  // Animate icon sliding in from the left
  const animateIconIn = () => {
    if (iconRef.current) {
      // Set initial state (off-screen to the left)
      gsap.set(iconRef.current, {
        x: -60,
        opacity: 0,
        immediateRender: true
      });
      
      // Animate sliding in
      gsap.to(iconRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  };

  // Animate menu appearance with sliding effect
  const animateMenuIn = () => {
    if (menuRef.current) {
      setIsMenuAnimating(true);
      
      // Animate in from the pre-set initial state
      gsap.to(menuRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          setIsMenuAnimating(false);
        }
      });
    }
  };

  // Animate menu disappearance
  const animateMenuOut = () => {
    if (menuRef.current) {
      setIsMenuAnimating(true);
      
      gsap.to(menuRef.current, {
        x: -300,
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setIsMenuAnimating(false);
        }
      });
    }
  };

  // Monitor white background sections and change individual menu item colors accordingly
  useEffect(() => {
    const checkWhiteBgSections = () => {
      const whiteBgSections = document.querySelectorAll('.white-bg-section');
      
      if (menuRef.current && isVisible) { // Only run when menu is visible
        const menuButtons = menuRef.current.querySelectorAll('button');
        
        menuButtons.forEach(button => {
          const buttonRect = button.getBoundingClientRect();
          let isWhiteBgBehindButton = false;
          
          // Check if any white section overlaps with this specific button
          whiteBgSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            
            // Check if white section overlaps with this specific button area
            const isOverlapping = rect.top <= buttonRect.bottom && rect.bottom >= buttonRect.top &&
                                 rect.left <= buttonRect.right && rect.right >= buttonRect.left;
            
            if (isOverlapping) {
              isWhiteBgBehindButton = true;
            }
          });
          
          // Update this specific button's color based on its background
          const newTextColor = isWhiteBgBehindButton ? '#1F1F1F' : '#FFFFFF';
          
          // Check if this button is the active section
          const isActiveButton = button.getAttribute('data-section-id') === activeSection;
          
          gsap.to(button, {
            color: newTextColor,
            duration: 0.3,
            ease: "power2.out"
          });
          
          // Update border color for active state using CSS classes
          if (isActiveButton) {
            button.classList.remove('border-transparent');
            button.classList.add('border-[#BFB6AD]');
          } else {
            button.classList.remove('border-[#BFB6AD]');
            button.classList.add('border-transparent');
          }
        });
      }
    };

    // Only run color check when menu becomes visible or when scrolling
    if (isVisible) {
      checkWhiteBgSections();
    }

    // Add scroll event listener for color changes
    window.addEventListener('scroll', checkWhiteBgSections, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkWhiteBgSections);
    };
  }, [activeSection, isVisible]); // Add isVisible as dependency

  // Monitor when join-us-now section is in the center of the viewport and keep visible until bottom
  useEffect(() => {
    const checkJoinUsNowVisibility = () => {
      const joinUsNowSection = document.getElementById('intro');
      
      if (joinUsNowSection) {
        const rect = joinUsNowSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight / 2;
        
        // Check if the section is in the center area of the viewport
        const isInCenter = rect.top <= viewportCenter && rect.bottom >= viewportCenter;
        
        // Check if we've scrolled past the join-us-now section (keep visible until bottom)
        // The section is considered "passed" when its top is above the viewport
        const hasPassedJoinUsNow = rect.top < 0;
        
        // Check if section is in center OR if we've scrolled past it
        const shouldShowIcon = isInCenter || hasPassedJoinUsNow;
        
        // Only manage the icon state when we first enter the section
        if (shouldShowIcon && !hasSetIconTimeoutRef.current) {
          hasSetIconTimeoutRef.current = true;
          
          // Add 10-second delay before showing the icon
          iconShowTimeoutRef.current = setTimeout(() => {
            // Now set shouldShow to true to make the icon visible
            setShouldShow(true);
            setShowIconOnly(true);
            setIsVisible(false);
            setIsMenuReady(false);
            setIsIconReady(false);
            
            // Animate the icon sliding in
            setTimeout(() => {
              setIsIconReady(true);
              animateIconIn();
            }, 10);
            
            // Then after showing icon, set up the menu timeout
            if (!hasSetMenuTimeoutRef.current) {
              hasSetMenuTimeoutRef.current = true;
              
              menuShowTimeoutRef.current = setTimeout(() => {
                setShowIconOnly(false);
                setIsVisible(true);
                setMenuJustAppeared(true);
                // First set the menu as not ready (hidden)
                setIsMenuReady(false);
                // Set initial state and then show menu
                setTimeout(() => {
                  if (menuRef.current) {
                    gsap.set(menuRef.current, {
                      x: -300,
                      opacity: 0,
                      scale: 0.8,
                      immediateRender: true
                    });
                    // Now make menu ready and animate in
                    setIsMenuReady(true);
                    setTimeout(() => {
                      animateMenuIn();
                    }, 10);
                  }
                }, 10);
                // Reset the flag after a short delay to allow auto-hide to work
                setTimeout(() => {
                  setMenuJustAppeared(false);
                }, 2000); // Give users 2 seconds to see the menu before auto-hide kicks in
              }, 5000);
            }
          }, 2000); // 10-second delay before showing icon
        }
        
        // Only hide when we've completely left the section (not during scrolling within it)
        if (!shouldShowIcon && (hasSetMenuTimeoutRef.current || hasSetIconTimeoutRef.current)) {
          // Clear any auto-hide timeout when leaving section
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
          }
          setShowIconOnly(false);
          setIsVisible(false);
          setIsMenuReady(false);
          setIsIconReady(false);
          setMenuJustAppeared(false);
          hasSetMenuTimeoutRef.current = false;
          hasSetIconTimeoutRef.current = false;
          if (menuShowTimeoutRef.current) {
            clearTimeout(menuShowTimeoutRef.current);
            menuShowTimeoutRef.current = null;
          }
          if (iconShowTimeoutRef.current) {
            clearTimeout(iconShowTimeoutRef.current);
            iconShowTimeoutRef.current = null;
          }
        }
      } else {
        setShouldShow(false);
        setShowIconOnly(false);
        setIsVisible(false);
        setIsMenuReady(false);
        setIsIconReady(false);
        setMenuJustAppeared(false);
        hasSetMenuTimeoutRef.current = false;
        hasSetIconTimeoutRef.current = false;
        if (menuShowTimeoutRef.current) {
          clearTimeout(menuShowTimeoutRef.current);
          menuShowTimeoutRef.current = null;
        }
        if (iconShowTimeoutRef.current) {
          clearTimeout(iconShowTimeoutRef.current);
          iconShowTimeoutRef.current = null;
        }
      }
    };

    // Initial check
    checkJoinUsNowVisibility();

    // Add scroll event listener
    window.addEventListener('scroll', checkJoinUsNowVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkJoinUsNowVisibility);
      if (menuShowTimeoutRef.current) {
        clearTimeout(menuShowTimeoutRef.current);
      }
      if (iconShowTimeoutRef.current) {
        clearTimeout(iconShowTimeoutRef.current);
      }
    };
  }, []);

  // Handle hover state changes
  useEffect(() => {
    if (isHovered && hideTimeoutRef.current) {
      // Clear any existing timeout when hovering
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, [isHovered]);

  // Handle auto-hide functionality
  useEffect(() => {
    //console.log('Auto-hide effect - isVisible:', isVisible, 'isHovered:', isHovered, 'menuJustAppeared:', menuJustAppeared, 'isManuallyToggled:', isManuallyToggled); // Debug log
    if (isVisible && !isHovered && !menuJustAppeared && !isManuallyToggled) {
      // Only start auto-hide timeout if all conditions are met (including not manually toggled)
      if (!hideTimeoutRef.current) {
        //console.log('Starting auto-hide timer'); // Debug log
        hideTimeoutRef.current = setTimeout(() => {
          //console.log('Auto-hide timer triggered'); // Debug log
          animateMenuOut();
          // Hide after animation completes
          setTimeout(() => {
            setIsVisible(false);
            setIsMenuReady(false);
          }, 400); // Match the animation duration
        }, 5000);
      }
    } else if (!isVisible) {
      // Clear timeout if menu is not visible
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isVisible, isHovered, menuJustAppeared, isManuallyToggled]);

  // Handle mouse enter/leave for the floating icon and menu
  const handleMouseEnter = () => {
    console.log('Mouse entered, showIconOnly:', showIconOnly, 'isVisible:', isVisible); // Debug log
    setIsHovered(true);
    // Show the full menu immediately on hover (works on entire page)
    if (!isVisible) {
      console.log('Showing menu on hover'); // Debug log
      setShouldShow(true);
      setShowIconOnly(false);
      setIsVisible(true);
      setIsIconReady(false);
      
      // Animate the icon sliding in on hover
      setTimeout(() => {
        setIsIconReady(true);
        animateIconIn();
      }, 10);
      // Clear the timeouts since we're showing it now
      if (menuShowTimeoutRef.current) {
        clearTimeout(menuShowTimeoutRef.current);
        menuShowTimeoutRef.current = null;
      }
      if (iconShowTimeoutRef.current) {
        clearTimeout(iconShowTimeoutRef.current);
        iconShowTimeoutRef.current = null;
      }
      // Mark that menu just appeared so auto-hide doesn't kick in immediately
      setMenuJustAppeared(true);
      // First set the menu as not ready (hidden)
      setIsMenuReady(false);
      // Set initial state and then show menu
      setTimeout(() => {
        if (menuRef.current) {
          gsap.set(menuRef.current, {
            x: -300,
            opacity: 0,
            scale: 0.8,
            immediateRender: true
          });
          // Now make menu ready and animate in
          setIsMenuReady(true);
          setTimeout(() => {
            animateMenuIn();
          }, 10);
        }
      }, 10);
      setTimeout(() => {
        setMenuJustAppeared(false);
      }, 2000);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Track which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section) {
          const sectionTop = section.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <>
      {/* Show the floating icon only when shouldShow is true */}
      {shouldShow && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-row items-center justify-center gap-4">
          {/* Floating Icon - Only visible when shouldShow is true */}
          <div
            ref={iconRef}
            className={`w-12 h-12 bg-[#BFB6AD] rounded-tr-full rounded-br-full flex items-center justify-center cursor-pointer mb-4 transition-all duration-300 hover:bg-[#A69B8F] hover:scale-110 ${!isIconReady ? 'opacity-0' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleIconClick}
          >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          </div>

          {/* Anchor Menu - Only show when not in icon-only mode and isVisible is true */}
          {!showIconOnly && isVisible && (
            <div
              ref={menuRef}
              className={`will-change-transform ${!isMenuReady ? 'opacity-0' : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <nav className="space-y-4 min-w-[200px] backdrop-blur-sm rounded-lg p-4 border border-[#BFB6AD]/20">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    data-section-id={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-fit text-left text-sm uppercase tracking-[3px] border-b-[1px] border-transparent hover:border-[#BFB6AD] text-opacity-0"
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AnchorMenu;

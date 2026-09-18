'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import React, { useEffect, useRef, useState } from 'react';
import { subscribeShellReady } from '@/lib/shellReadyGate';
export interface ModuleColumnOverlayData {
  title: string;
  content: string;
  link: string;
}

// Register GSAP plugins (ScrollToPlugin required for gsap.to(window, { scrollTo: ... }))
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * If entrance animations never fire, force in-view content visible after this delay.
 * Must clear max banner `data-delay` (3s) + duration + init overhead (~1s).
 */
export const ANIMATION_FAILSAFE_MS = 7000;

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/** Force an animated element into its final visible state (fail-safe / reduced motion). */
export const revealAnimatedElement = (element: Element) => {
  gsap.killTweensOf(element);
  gsap.set(element, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    clipPath: 'inset(0 0% 0 0)',
    immediateRender: true,
    overwrite: true,
  });

  const htmlEl = element as HTMLElement;
  if (htmlEl.style) {
    htmlEl.style.opacity = '';
    htmlEl.style.clipPath = '';
  }
};

export const revealAllAnimatedElements = (root: ParentNode = document) => {
  root.querySelectorAll('[data-animation]').forEach(revealAnimatedElement);
};

const isAnimatedElementHidden = (element: Element): boolean => {
  const opacity = Number(gsap.getProperty(element, 'opacity'));
  if (Number.isFinite(opacity) && opacity < 0.05) return true;

  const clipPath = getComputedStyle(element as HTMLElement).clipPath || '';
  if (clipPath.includes('inset') && /100%/.test(clipPath)) return true;

  return false;
};

const isElementInViewport = (element: Element): boolean => {
  const rect = (element as HTMLElement).getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight * 0.98;
};

/**
 * Unstick only in-view elements that never started animating.
 * Skips pending/running tweens (e.g. data-delay="3.0") and below-fold
 * ScrollTrigger targets so scroll fades still work.
 */
export const revealStuckAnimatedElements = (root: ParentNode = document) => {
  root.querySelectorAll('[data-animation]').forEach((element) => {
    if (gsap.getTweensOf(element).length > 0) return;
    if (!isElementInViewport(element)) return;
    if (isAnimatedElementHidden(element)) {
      revealAnimatedElement(element);
    }
  });
};

/**
 * Hide element for entrance animation only when motion is allowed.
 * With prefers-reduced-motion, content stays visible (progressive enhancement).
 */
export const hideAnimatedElementForEntrance = (
  element: Element,
  options: { immediateRender?: boolean; overwrite?: boolean } = {},
) => {
  if (prefersReducedMotion()) {
    revealAnimatedElement(element);
    return;
  }

  const animationType = element.getAttribute('data-animation') || 'fade';
  const direction = element.getAttribute('data-direction') || 'left';
  const renderOpts = {
    immediateRender: options.immediateRender ?? true,
    overwrite: options.overwrite ?? false,
  };

  if (animationType === 'fade' || animationType === 'text-split') {
    gsap.set(element, { opacity: 0, ...renderOpts });
  } else if (animationType === 'slide') {
    gsap.set(element, {
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'top' ? -100 : direction === 'bottom' ? 100 : 0,
      opacity: 0,
      ...renderOpts,
    });
  } else if (animationType === 'scale') {
    gsap.set(element, { scale: 0, opacity: 0, ...renderOpts });
  } else if (animationType === 'rotate') {
    gsap.set(element, { rotation: -180, opacity: 0, ...renderOpts });
  } else if (animationType === 'text-reveal') {
    gsap.set(element, { clipPath: 'inset(0 100% 0 0)', ...renderOpts });
  } else if (animationType === 'zoom-in') {
    gsap.set(element, { scale: 1.3, opacity: 0, ...renderOpts });
  }
};

/** Shared prepare step for page mounts — prefer this over ad-hoc gsap.set opacity:0. */
export const preparePageAnimationElements = (root: ParentNode = document) => {
  const elements = root.querySelectorAll('[data-animation]');
  if (prefersReducedMotion()) {
    elements.forEach(revealAnimatedElement);
    return;
  }
  elements.forEach((element) => hideAnimatedElementForEntrance(element));
};

// Animation presets for common effects
export const animationPresets = {
  // Fade animations
  fadeIn: (element: any, duration = 0.6, delay = 0) => {
    gsap.fromTo(element, 
      { opacity: 0 },
      { opacity: 1, duration, delay, ease: "power2.out" }
    );
  },

  fadeOut: (element: any, duration = 0.6, delay = 0) => {
    gsap.to(element, { opacity: 0, duration, delay, ease: "power2.out" });
  },

  // Text reveal animations
  textReveal: (element: any, duration = 1, delay = 0) => {
    gsap.fromTo(element,
      { 
        clipPath: "inset(0 100% 0 0)",
        opacity: 1
      },
      { 
        clipPath: "inset(0 0% 0 0)", 
        duration, 
        delay, 
        ease: "expo.out" 
      }
    );
  },

  textRevealStagger: (elements: any[], duration = 1, stagger = 0.2, delay = 0) => {
    const timeline = gsap.timeline();
    
    elements.forEach((element, index) => {
      timeline.fromTo(element,
        { 
          clipPath: "inset(0 100% 0 0)",
          opacity: 1
        },
        { 
          clipPath: "inset(0 0% 0 0)", 
          duration, 
          ease: "expo.out" 
        },
        delay + (index * stagger)
      );
    });
    
    return timeline;
  },

  // Zoom in entrance animation
  zoomInEntrance: (element: any, duration = 1.2, delay = 0) => {
    gsap.fromTo(element,
      { 
        scale: 1.3,
        opacity: 0
      },
      { 
        scale: 1,
        opacity: 1,
        duration, 
        delay, 
        ease: "power2.out" 
      }
    );
  },

  // Scroll-based slide out animation (reverse of slide in)
  scrollSlideOut: (element: any, direction: 'left' | 'right' | 'top' | 'bottom' = 'left', duration = 0.8) => {
    const animations = {
      'left': { x: -100, opacity: 0 },
      'right': { x: 100, opacity: 0 },
      'top': { y: -100, opacity: 0 },
      'bottom': { y: 100, opacity: 0 }
    };

    return gsap.to(element, {
      ...animations[direction],
      duration,
      ease: "power2.out"
    });
  },

  // Scroll-based slide in animation (return to original position)
  scrollSlideIn: (element: any, duration = 0.8) => {
    // Get current position to start from
    const currentX = gsap.getProperty(element, "x") || 0;
    const currentY = gsap.getProperty(element, "y") || 0;
    const currentOpacity = gsap.getProperty(element, "opacity") || 0;
    
    return gsap.fromTo(element, {
      x: currentX,
      y: currentY,
      opacity: currentOpacity
    }, {
      x: 0,
      y: 0,
      opacity: 1,
      duration,
      ease: "power2.out"
    });
  },

  // Slide animations
  slideInFromLeft: (element: any, duration = 0.8, delay = 0) => {
    gsap.fromTo(element,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration, delay, ease: "power2.out" }
    );
  },

  slideInFromRight: (element: any, duration = 0.8, delay = 0) => {
    gsap.fromTo(element,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration, delay, ease: "power2.out" }
    );
  },

  slideInFromTop: (element: any, duration = 0.8, delay = 0) => {
    gsap.fromTo(element,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration, delay, ease: "power2.out" }
    );
  },

  slideInFromBottom: (element: any, duration = 0.8, delay = 0) => {
    gsap.fromTo(element,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration, delay, ease: "power2.out" }
    );
  },

  // Scale animations
  scaleIn: (element: any, duration = 0.6, delay = 0) => {
    gsap.fromTo(element,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration, delay, ease: "back.out(1.7)" }
    );
  },

  scaleOut: (element: any, duration = 0.6, delay = 0) => {
    gsap.to(element, { scale: 0, opacity: 0, duration, delay, ease: "back.in(1.7)" });
  },

  // Rotation animations
  rotateIn: (element: any, duration = 0.8, delay = 0) => {
    gsap.fromTo(element,
      { rotation: -180, opacity: 0 },
      { rotation: 0, opacity: 1, duration, delay, ease: "back.out(1.7)" }
    );
  },

  // Stagger animations for multiple elements
  staggerFadeIn: (elements: any[], duration = 0.6, stagger = 0.1, delay = 0) => {
    gsap.fromTo(elements,
      { opacity: 0 },
      { opacity: 1, duration, delay, stagger, ease: "power2.out" }
    );
  },

  staggerSlideInFromLeft: (elements: any[], duration = 0.8, stagger = 0.1, delay = 0) => {
    gsap.fromTo(elements,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration, delay, stagger, ease: "power2.out" }
    );
  },

  staggerSlideInFromRight: (elements: any[], duration = 0.8, stagger = 0.1, delay = 0) => {
    gsap.fromTo(elements,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration, delay, stagger, ease: "power2.out" }
    );
  },

  staggerSlideInFromBottom: (elements: any[], duration = 0.8, stagger = 0.1, delay = 0) => {
    gsap.fromTo(elements,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration, delay, stagger, ease: "power2.out" }
    );
  },

  // Data attribute based animation
  animateWithDataAttributes: (element: any) => {
    if (prefersReducedMotion()) {
      revealAnimatedElement(element);
      return;
    }

    const animationType = element.dataset.animation || 'fade';
    const duration = parseFloat(element.dataset.duration) || 0.8;
    const delay = parseFloat(element.dataset.delay) || 0;
    const direction = element.dataset.direction || 'left';

    // Handle text reveal animation separately
    if (animationType === 'text-reveal') {
      gsap.fromTo(element,
        { 
          clipPath: "inset(0 100% 0 0)",
          padding: "5px",
          opacity: 1
        },
        { 
          clipPath: "inset(0 0% 0 0)",
          padding: "5px",
          duration, 
          delay, 
          ease: "expo.out" 
        }
      );
      return;
    }

    // Handle zoom-in animation separately
    if (animationType === 'zoom-in') {
      gsap.fromTo(element,
        { 
          scale: 1.3,
          opacity: 0
        },
        { 
          scale: 1,
          opacity: 1,
          duration, 
          delay, 
          ease: "power2.out" 
        }
      );
      return;
    }

    // Handle text-split animation separately
    if (animationType === 'text-split') {
      textSplitWithDataAttributes(element);
      return;
    }

    // Set initial state based on animation type
    const initialStates = {
      'fade': { opacity: 0 },
      'slide': { 
        x: direction === 'left' ? -200 : direction === 'right' ? 200 : 0,
        y: direction === 'top' ? -200 : direction === 'bottom' ? 200 : 0,
        opacity: 0 
      },
      'scale': { scale: 0, opacity: 0 },
      'rotate': { rotation: -180, opacity: 0 },
      'zoom-in': { scale: 1.3, opacity: 0 }
    };

    const finalStates = {
      'fade': { opacity: 1 },
      'slide': { x: 0, y: 0, opacity: 1 },
      'scale': { scale: 1, opacity: 1 },
      'rotate': { rotation: 0, opacity: 1 },
      'zoom-in': { scale: 1, opacity: 1 }
    };

    gsap.fromTo(element,
      initialStates[animationType as keyof typeof initialStates],
      { 
        ...finalStates[animationType as keyof typeof finalStates],
        duration,
        delay,
        ease: "power2.out"
      }
    );
  },

  // Entrance animations for homepage
  homepageEntrance: () => {
    const tl = gsap.timeline();

    if (prefersReducedMotion()) {
      tl.add(() => revealAllAnimatedElements());
      return tl;
    }

    // Set initial states - hide everything
    tl.add(() => {
      const animatedElements = document.querySelectorAll('[data-animation]');
      animatedElements.forEach((element) => hideAnimatedElementForEntrance(element));
    });

    // Animate all elements with data attributes
    tl.add(() => {
      const animatedElements = document.querySelectorAll('[data-animation]');
      animatedElements.forEach(element => {
        animationPresets.animateWithDataAttributes(element);
      });
    });

    return tl;
  },

  // Page entrance animation
  pageEntrance: (direction: 'left' | 'right' | 'top' | 'bottom' = 'left') => {
    const tl = gsap.timeline();
    
    const slideFunction = direction === 'left' ? animationPresets.slideInFromLeft :
                         direction === 'right' ? animationPresets.slideInFromRight :
                         direction === 'top' ? animationPresets.slideInFromTop :
                         animationPresets.slideInFromBottom;

    tl.add(() => {
      const pageContent = document.querySelector('.page-content');
      if (pageContent) slideFunction(pageContent, 0.8, 0);
    });

    return tl;
  },

  // Component entrance animation
  componentEntrance: (element: any, type: 'fade' | 'slide-left' | 'slide-right' | 'slide-top' | 'slide-bottom' | 'scale' = 'fade', delay = 0) => {
    const animations = {
      'fade': () => animationPresets.fadeIn(element, 0.6, delay),
      'slide-left': () => animationPresets.slideInFromLeft(element, 0.8, delay),
      'slide-right': () => animationPresets.slideInFromRight(element, 0.8, delay),
      'slide-top': () => animationPresets.slideInFromTop(element, 0.8, delay),
      'slide-bottom': () => animationPresets.slideInFromBottom(element, 0.8, delay),
      'scale': () => animationPresets.scaleIn(element, 0.6, delay)
    };

    return animations[type]();
  },

  // Video scroll animation with pin and scrub
  videoScroll: (videoElement: HTMLVideoElement, containerElement: HTMLElement, options: {
    start?: string;
    end?: string;
    pin?: boolean;
    scrub?: boolean;
    duration?: number;
  } = {}) => {
    const {
      start = "top top",
      end = "bottom top",
      pin = true,
      scrub = true,
      duration = 1
    } = options;

    // Ensure video is ready
    const setupVideoScroll = () => {
      if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA
        createScrollTrigger();
      } else {
        videoElement.addEventListener('loadedmetadata', createScrollTrigger);
      }
    };

    const createScrollTrigger = () => {
      const videoDuration = videoElement.duration || 1;
      const scrollDistance = videoDuration * 300; // Adjust multiplier as needed

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerElement,
          start: start,
          end: `+=${scrollDistance}`,
          pin: pin,
          scrub: scrub,
          onUpdate: (self) => {
            // Calculate video time based on scroll progress
            const progress = self.progress;
            const currentTime = progress * videoDuration;
            videoElement.currentTime = currentTime;
          }
        }
      });

      // Initial setup
      timeline.fromTo(videoElement, 
        { currentTime: 0 }, 
        { currentTime: videoDuration, duration: videoDuration }
      );

      return timeline;
    };

    setupVideoScroll();
  },

  // Video play animation with pin and scroll distance limit
  videoPlay: (videoElement: HTMLVideoElement, containerElement: HTMLElement, options: {
    start?: string;
    scrollDistance?: number;
    pin?: boolean;
    uniqueId?: string;
  } = {}) => {
    const {
      start = "top center",
      scrollDistance = 100,
      pin = true,
      uniqueId = `video-play-${Math.random().toString(36).substr(2, 9)}`
    } = options;

    // Ensure video is ready
    const setupVideoPlay = () => {
      if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA
        createScrollTrigger();
      } else {
        videoElement.addEventListener('loadedmetadata', createScrollTrigger);
      }
    };

    const createScrollTrigger = () => {
      ScrollTrigger.create({
        trigger: containerElement,
        start: start,
        end: `+=${scrollDistance}`,
        pin: pin,
        id: uniqueId, // Add unique ID to prevent conflicts
        onEnter: () => {
          videoElement.play().catch(e => console.log('Video play error:', e));
        },
        onEnterBack: () => {
          videoElement.play().catch(e => console.log('Video play error:', e));
        },
        onLeave: () => {
          videoElement.pause();
        },
        onLeaveBack: () => {
          videoElement.pause();
        }
      });
    };

    setupVideoPlay();
  },

  // Gallery animation with left/right slide effects
  galleryAnimation: (containerElement: HTMLElement, options: {
    start?: string;
    end?: string;
    scrub?: boolean;
  } = {}) => {
    const {
      start = "top 700",
      end = "top 200",
      scrub = true
    } = options;

    // Check if container element exists
    if (!containerElement) {
      return;
    }

    // Get all gallery animation elements
    const itemLeft = gsap.utils.toArray('.gallery__left .gallery__anim', containerElement);
    const itemRight = gsap.utils.toArray('.gallery__right .gallery__anim', containerElement);

    // Check if we found any elements
    if (itemLeft.length === 0 && itemRight.length === 0) {
      return;
    }

    // Set initial positions for left items
    itemLeft.forEach((item: any) => {
      gsap.set(item, { opacity: 0, x: '-100' });
    });

    // Set initial positions for right items
    itemRight.forEach((item: any) => {
      gsap.set(item, { opacity: 0, x: '100' });
    });

    // Animate left items (slide from left)
    itemLeft.forEach((item: any) => {
      gsap.fromTo(item, 
        { opacity: 0, x: '-100' }, 
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: item,
            start: start,
            end: end,
            scrub: scrub,
            //markers: true // Add markers for debugging
          }
        }
      );
    });

    // Animate right items (slide from right)
    itemRight.forEach((item: any) => {
      gsap.fromTo(item, 
        { opacity: 0, x: '100' }, 
        {
          opacity: 1,
          x: 0,
          scrollTrigger: {
            trigger: item,
            start: start,
            end: end,
            scrub: scrub,
            //markers: true // Add markers for debugging
          }
        }
      );
    });
  },

  // Service list animation with mouse following image
  serviceList: (containerElement: HTMLElement, options: {
    start?: string;
    end?: string;
    scrub?: boolean;
    mouseSensitivity?: number;
    imageScale?: number;
    imageRotation?: number;
  } = {}) => {
    const {
      start = "top center",
      end = "bottom center",
      scrub = true,
      mouseSensitivity = 20,
      imageScale = 1.05,
      imageRotation = 0.5
    } = options;

    // Set initial state for services - white color with reduced opacity
    const allServices = containerElement.querySelectorAll(".list");
    gsap.set(allServices, {
      color: "#ffffff",
      opacity: 0.15
    });

    // Pre-activate the first step
    if (allServices.length > 0) {
      gsap.set(allServices[0], {
        color: "#ffffff",
        opacity: 1
      });
    }

    gsap.set(containerElement.querySelectorAll(".list h1, .list h3, .list h4"), {
      color: "#ffffff"
    });

    gsap.set(containerElement.querySelectorAll(".list p"), {
      color: "#ffffff"
    });

    // Mouse following effect for the single image
    const image = containerElement.querySelector('.img-list img');
    const imageContainer = containerElement.querySelector('.img-list');

    if (image && imageContainer) {
      // Add smooth mouse following effect
      let mouseX = 0;
      let mouseY = 0;
      let currentX = 0;
      let currentY = 0;

      // Track mouse movement
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * mouseSensitivity;
        mouseY = (e.clientY / window.innerHeight - 0.5) * mouseSensitivity;
      };

      document.addEventListener('mousemove', handleMouseMove);

      // Smooth animation loop
      const animate = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        gsap.set(image, {
          x: currentX,
          y: currentY,
          scale: imageScale,
          rotation: currentX * imageRotation
        });
        
        requestAnimationFrame(animate);
      };

      // Start the animation loop
      animate();
    }

    // Function to update service colors based on scroll progress
    const updateServiceColors = (progress: number) => {
      const services = containerElement.querySelectorAll('.list');
      const totalServices = services.length;
      
      // Calculate which service should be active
      let activeIndex: number;
      
      // Handle edge cases for first and last services
      if (progress <= 0) {
        activeIndex = 0;
      } else if (progress >= 1) {
        activeIndex = totalServices - 1;
      } else {
        // Calculate the exact position within the service range
        const exactPosition = progress * (totalServices - 1);
        activeIndex = Math.floor(exactPosition);
        
        // Ensure we don't exceed bounds
        if (activeIndex >= totalServices - 1) {
          activeIndex = totalServices - 1;
        }
      }
      
      services.forEach((service: any, index: number) => {
        if (index === activeIndex) {
          // Current service - full opacity (no fade effect)
          gsap.set(service, { 
            color: "#ffffff",
            opacity: 1
          });
        } else {
          // All other services - inactive state
          gsap.set(service, { 
            color: "#ffffff",
            opacity: 0.15
          });
        }
      });
    };

    // Calculate extended end point for more controlled scrolling
    const extendedEnd = `+=${allServices.length * 300}`; // Increased to 300px per service for smoother transitions

    /*// Pin the right side (image) while services scroll
    const rightElement = containerElement.querySelector('.right');
    ScrollTrigger.create({
      trigger: containerElement,
      start: start,
      end: extendedEnd,
      pin: rightElement,
      scrub: false,
      pinSpacing: true, // Prevent pinning from affecting layout
    });*/

    // Create ScrollTrigger for service animations with progress tracking
    ScrollTrigger.create({
      trigger: containerElement,
      start: start,
      end: extendedEnd,
      scrub: scrub,
      invalidateOnRefresh: true, // Ensure proper recalculation on refresh
      onUpdate: (self) => {
        // Update colors based on scroll progress (0 to 1)
        updateServiceColors(self.progress);
      },
      onRefresh: (self) => {
        // Ensure correct state on refresh
        updateServiceColors(self.progress);
      },
      onEnter: () => {
        // Ensure first service is active when entering
        updateServiceColors(0);
      },
      onLeave: () => {
        // Keep last service active when leaving
        updateServiceColors(1);
      },
      onEnterBack: () => {
        // Keep last service active when scrolling back from below
        updateServiceColors(1);
      },
      onLeaveBack: () => {
        // Keep first service active when leaving back to above
        updateServiceColors(0);
      }
    });
  },

  // Custom text split animation (no premium plugin required)
  textSplit: (element: any, options: {
    splitBy?: 'words' | 'lines' | 'chars';
    stagger?: number;
    duration?: number;
    delay?: number;
    y?: number;
    opacity?: number;
    ease?: string;
  } = {}) => {
    const {
      splitBy = 'words',
      stagger = 0.05,
      duration = 1,
      delay = 0,
      y = 100,
      opacity = 0,
      ease = "power2.out"
    } = options;

    // Store original text
    const originalText = element.textContent;
    const originalHTML = element.innerHTML;

    // Clear the element and ensure it's hidden initially
    element.innerHTML = '';
    gsap.set(element, { opacity: 0 });

    let textElements: HTMLElement[] = [];

    if (splitBy === 'words') {
      // Parse HTML to preserve inline tags like <strong>
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = originalHTML;
      
      // Function to check if a node is inside a strong/b tag
      const isInsideStrongTag = (node: Node): boolean => {
        let current: Node | null = node;
        while (current && current.nodeType !== Node.ELEMENT_NODE) {
          current = current.parentNode;
        }
        let element = current as HTMLElement | null;
        while (element) {
          if (element.tagName === 'STRONG' || element.tagName === 'B') {
            return true;
          }
          element = element.parentElement;
        }
        return false;
      };
      
      // Function to recursively extract words with their HTML context
      const extractWordsWithTags = (node: Node, words: Array<{ text: string; isStrong: boolean }> = []): Array<{ text: string; isStrong: boolean }> => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent || '';
          const textWords = text.trim().split(/\s+/).filter((word: string) => word.length > 0);
          const isStrong = isInsideStrongTag(node);
          textWords.forEach((word: string) => {
            words.push({ text: word, isStrong });
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          Array.from(node.childNodes).forEach((child) => {
            extractWordsWithTags(child, words);
          });
        }
        return words;
      };
      
      const wordsWithTags = extractWordsWithTags(tempDiv);
      
      wordsWithTags.forEach((wordData: { text: string; isStrong: boolean }, index: number) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.overflow = 'hidden';
        wordSpan.style.whiteSpace = 'nowrap';
        
        if (wordData.isStrong) {
          const strongTag = document.createElement('strong');
          strongTag.textContent = wordData.text;
          wordSpan.appendChild(strongTag);
        } else {
          wordSpan.textContent = wordData.text;
        }
        
        element.appendChild(wordSpan);
        textElements.push(wordSpan);
        
        // Add space after each word except the last one
        if (index < wordsWithTags.length - 1) {
          const spaceSpan = document.createElement('span');
          spaceSpan.textContent = ' '; // Regular space
          spaceSpan.style.display = 'inline-block';
          spaceSpan.style.overflow = 'hidden';
          spaceSpan.style.whiteSpace = 'nowrap';
          spaceSpan.style.minWidth = '0.25em'; // Ensure minimum width for space
          element.appendChild(spaceSpan);
          textElements.push(spaceSpan);
        }
      });
    } else if (splitBy === 'lines') {
      // Split by lines (using <br> tags or line breaks)
      const lines = originalHTML.split(/<br\s*\/?>/i);
      lines.forEach((line: string, index: number) => {
        const lineDiv = document.createElement('div');
        lineDiv.innerHTML = line;
        lineDiv.style.overflow = 'hidden';
        element.appendChild(lineDiv);
        textElements.push(lineDiv);
      });
    } else if (splitBy === 'chars') {
      // Split by characters
      const chars = originalText.split('');
      chars.forEach((char: string, index: number) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space
        charSpan.style.display = 'inline-block';
        charSpan.style.overflow = 'hidden';
        element.appendChild(charSpan);
        textElements.push(charSpan);
      });
    }

    // Set initial state for all elements
    gsap.set(textElements, {
      y: y,
      opacity: opacity,
      overflow: 'hidden'
    });

    // Create timeline to show element and animate text
    const tl = gsap.timeline();
    
    // First show the element
    tl.to(element, { opacity: 1, duration: 0.1, delay: delay });
    
    // Then animate the text elements
    tl.to(textElements, {
      y: 0,
      opacity: 1,
      duration: duration,
      stagger: stagger,
      ease: ease
    }, delay + 0.1);

    return tl;
  }
};

// Video scroll animation with data attributes
export const videoScrollWithDataAttributes = (element: any) => {
  const videoElement = element.querySelector('video');
  const containerElement = element;
  
  if (!videoElement) {
    //console.warn('No video element found in container');
    return;
  }

  const start = element.dataset.start || "top top";
  const end = element.dataset.end || "bottom top";
  const pin = element.dataset.pin !== 'false'; // Default to true
  const scrub = element.dataset.scrub !== 'false'; // Default to true
  const duration = parseFloat(element.dataset.duration) || 1;
  
  // Get custom video length and scroll distance from data attributes
  const videoLength = parseFloat(element.dataset.videoLength) || undefined;
  const scrollDistance = parseFloat(element.dataset.scrollDistance) || undefined;

  // Use the improved video scroll function
  createVideoScrollAnimation(videoElement, containerElement, {
    start,
    end,
    pin,
    scrub,
    duration,
    videoLength,
    scrollDistance
  });
};

// Improved video scroll animation function
const createVideoScrollAnimation = (videoElement: HTMLVideoElement, containerElement: HTMLElement, options: {
  start?: string;
  end?: string;
  pin?: boolean;
  scrub?: boolean;
  duration?: number;
  videoLength?: number;
  scrollDistance?: number;
}) => {
  const {
    start = "top top",
    end = "bottom top",
    pin = true,
    scrub = true,
    duration = 1,
    videoLength = null,
    scrollDistance = null
  } = options;

  // Ensure video is ready
  const setupVideoScroll = () => {
    if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA
      createScrollTrigger();
    } else {
      videoElement.addEventListener('loadedmetadata', createScrollTrigger);
    }
  };

  const createScrollTrigger = () => {
    // Use provided video length or get from video element
    const videoDuration = videoLength || videoElement.duration || 1;
    
    // Use provided scroll distance or calculate based on video duration
    const finalScrollDistance = scrollDistance || (videoDuration * 200); // Reduced multiplier for smoother scrolling

    // Create ScrollTrigger directly for better performance
    ScrollTrigger.create({
      trigger: containerElement,
      start: start,
      end: `+=${finalScrollDistance}`,
      pin: pin,
      scrub: scrub ? 1 : false, // Ensure scrub is a number for smooth performance
      onUpdate: (self) => {
        // Throttle updates for better performance
        if (self.progress !== undefined) {
          const progress = self.progress;
          const currentTime = progress * videoDuration;
          
          // Only update if time difference is significant enough
          if (Math.abs(videoElement.currentTime - currentTime) > 0.05) {
            videoElement.currentTime = currentTime;
          }
        }
      },
      onRefresh: () => {
        // Ensure video starts at beginning
        videoElement.currentTime = 0;
      }
    });
  };

  setupVideoScroll();
};

// Video play animation with data attributes
export const videoPlayWithDataAttributes = (element: any) => {
  const videoElement = element.querySelector('video');
  const containerElement = element;
  
  if (!videoElement) {
    //console.warn('No video element found in container');
    return;
  }

  // Generate unique ID for this video section
  const uniqueId = `video-play-${Math.random().toString(36).substr(2, 9)}`;
  containerElement.setAttribute('data-video-id', uniqueId);

  const start = element.dataset.start || "top center";
  const scrollDistance = parseFloat(element.dataset.scrollDistance) || 100;
  const pin = element.dataset.pin !== 'false'; // Default to true

  animationPresets.videoPlay(videoElement, containerElement, {
    start,
    scrollDistance,
    pin,
    uniqueId
  });
};

// Gallery animation with data attributes
export const galleryAnimationWithDataAttributes = (element: any) => {
  const start = element.dataset.start || "top 700";
  const end = element.dataset.end || "top 200";
  const scrub = element.dataset.scrub !== 'false'; // Default to true

  animationPresets.galleryAnimation(element, {
    start,
    end,
    scrub
  });
};

// Image carousel animation with data attributes
export const imageCarouselWithDataAttributes = (element: any) => {
  const start = element.dataset.start || "center center";
  const end = element.dataset.end || "+=100%";
  const scrub = element.dataset.scrub !== 'false'; // Default to true
  const pin = element.dataset.pin !== 'false'; // Default to true
  const gap = parseFloat(element.dataset.gap) || 16;

  // Get the container and all carousel items
  const container = element;
  const allItems = container.querySelectorAll('.carousel-item');
  
  console.log('Image carousel - Total items found:', allItems.length);
  
  if (allItems.length === 0) return;

  // Set up the carousel layout
  gsap.set(container, {
    display: 'flex',
    flexDirection: 'row',
    gap: gap
  });

  // Create the scroll-triggered animation
  gsap.to(allItems, {
    ease: "none",
    x: () => -(container.scrollWidth - window.innerWidth),
    scrollTrigger: {
      trigger: container,
      pin: pin,
      start: start,
      end: () => "+=" + (container.scrollWidth - window.innerWidth),
      scrub: scrub,
      invalidateOnRefresh: true,
      markers: false,
    }
  });
};

// Client slider animation with data attributes
export const clientSliderWithDataAttributes = (element: any) => {
  const duration = parseFloat(element.dataset.duration) || 120;
  const gap = parseFloat(element.dataset.gap) || 200;
  const delay = parseFloat(element.dataset.delay) || 100;

  const initSlider = () => {
    const slider = element;
    const slides = slider.querySelectorAll('.client-slide');
    
    //console.log('Client slider init - slides found:', slides.length);
    
    if (slides.length === 0) {
      console.warn('No client slides found');
      return false;
    }
    
    // Check if slider is already initialized
    if ((slider as any).sliderTimeline) {
      (slider as any).sliderTimeline.kill();
    }
    
    const images = slider.querySelectorAll('img');
    //console.log('Client slider init - images found:', images.length);
    
    if (images.length === 0) {
      console.warn('No images found in client slider');
      return false;
    }
    
    // Wait for images to load
    return Promise.all(Array.from(images as NodeListOf<HTMLImageElement>).map((img: HTMLImageElement) => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }
      console.log('Waiting for image to load:', img.src);
      return new Promise<void>(resolve => {
        img.onload = () => {
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
      });
    })).then(() => {
      
      // Double-check dimensions after images load
      const slideWidth = (slides[0] as HTMLElement).offsetWidth;
      
      if (slideWidth === 0) {
        console.warn('Slide width is 0, cannot initialize slider');
        return false;
      }
      
      const totalWidth = slideWidth + gap;
      const originalSlidesWidth = totalWidth * 8; // Width of first 8 slides
      
      if (originalSlidesWidth <= 0) {
        console.warn('Original slides width is 0 or negative');
        return false;
      }
      
      const tl = gsap.timeline({ repeat: -1 });
      
      tl.to(slider, {
        x: -originalSlidesWidth * 2, // Move through 2 complete sets (16 slides)
        duration: duration, // Configurable duration
        ease: "none" // Linear easing for consistent speed
      });
      
      (slider as any).sliderTimeline = tl;
      //console.log('Client slider initialized successfully');
      return true;
    }).catch((error) => {
      console.error('Error initializing client slider:', error);
      return false;
    });
  };
  
  // Initial attempt with delay to ensure DOM is ready
  setTimeout(() => {
    const result = initSlider();
    if (result instanceof Promise) {
      result.then((success: boolean) => {
        if (!success) {
          console.log('First attempt failed, retrying...');
          // Retry after a longer delay if first attempt fails
          setTimeout(() => {
            const retryResult = initSlider();
            if (retryResult instanceof Promise) {
              retryResult.then((retrySuccess: boolean) => {
                if (!retrySuccess) {
                  console.warn('Client slider failed to initialize after retries');
                }
              });
            }
          }, 1000);
        }
      });
    }
  }, delay);
};

// Service list animation with data attributes
export const serviceListWithDataAttributes = (element: any) => {
  const start = element.dataset.start || "top top";
  const end = element.dataset.end || "bottom bottom";
  const scrub = element.dataset.scrub !== 'false'; // Default to true
  const mouseSensitivity = parseFloat(element.dataset.mouseSensitivity) || 20;
  const imageScale = parseFloat(element.dataset.imageScale) || 1.05;
  const imageRotation = parseFloat(element.dataset.imageRotation) || 0.5;

  animationPresets.serviceList(element, {
    start,
    end,
    scrub,
    mouseSensitivity,
    imageScale,
    imageRotation
  });
};

// Text split animation with data attributes
export const textSplitWithDataAttributes = (element: any) => {
  const splitBy = element.dataset.splitBy || 'words';
  const stagger = parseFloat(element.dataset.stagger) || 0.05;
  const duration = parseFloat(element.dataset.duration) || 1;
  const delay = parseFloat(element.dataset.delay) || 0;
  const y = parseFloat(element.dataset.y) || 100;
  const opacity = parseFloat(element.dataset.opacity) || 0;
  const ease = element.dataset.ease || "power2.out";

  animationPresets.textSplit(element, {
    splitBy: splitBy as 'words' | 'lines' | 'chars',
    stagger,
    duration,
    delay,
    y,
    opacity,
    ease
  });
};

// Stagger animation for multiple elements
export const staggerAnimation = (elements: any[], animation: string, stagger = 0.1, delay = 0) => {
  const animations = {
    'fadeIn': () => animationPresets.staggerFadeIn(elements, 0.6, stagger, delay),
    'slideLeft': () => animationPresets.staggerSlideInFromLeft(elements, 0.8, stagger, delay),
    'slideRight': () => animationPresets.staggerSlideInFromRight(elements, 0.8, stagger, delay),
    'slideBottom': () => animationPresets.staggerSlideInFromBottom(elements, 0.8, stagger, delay)
  };

  const selectedAnimation = animations[animation as keyof typeof animations];
  if (selectedAnimation) {
    return selectedAnimation();
  }
  return animations.fadeIn();
};

// Hover animations
export const hoverAnimations = {
  scale: (element: any, scale = 1.1, duration = 0.3) => {
    gsap.to(element, { scale, duration, ease: "power2.out" });
  },

  lift: (element: any, y = -10, duration = 0.3) => {
    gsap.to(element, { y, duration, ease: "power2.out" });
  },

  glow: (element: any, intensity = 0.3, duration = 0.3) => {
    gsap.to(element, { 
      boxShadow: `0 0 ${intensity * 20}px rgba(255, 255, 255, ${intensity})`,
      duration,
      ease: "power2.out"
    });
  },

  color: (element: any, color = '#3B82F6', duration = 0.3) => {
    gsap.to(element, { color, duration, ease: "power2.out" });
  }
};

// Reset animations
export const resetAnimation = (element: any) => {
  gsap.set(element, { clearProps: "all" });
};

// Global animation controller
export class AnimationController {
  private static instance: AnimationController;
  private timelines: Map<string, gsap.core.Timeline> = new Map();

  static getInstance(): AnimationController {
    if (!AnimationController.instance) {
      AnimationController.instance = new AnimationController();
    }
    return AnimationController.instance;
  }

  // Play entrance animation
  playEntrance(animationType: 'homepage' | 'page' = 'homepage', direction?: 'left' | 'right' | 'top' | 'bottom') {
    const timeline = animationType === 'homepage' 
      ? animationPresets.homepageEntrance()
      : animationPresets.pageEntrance(direction || 'left');
    
    this.timelines.set(animationType, timeline);
    return timeline;
  }

  // Play page animations (works for both homepage and other pages)
  playPageAnimations(isHomePage: boolean = false) {
    if (prefersReducedMotion()) {
      revealAllAnimatedElements();
      return gsap.timeline();
    }

    const timeline = gsap.timeline();
    
    // Set initial states - hide all animated elements
    timeline.add(() => {
      const animatedElements = document.querySelectorAll('[data-animation]');
      animatedElements.forEach((element) => hideAnimatedElementForEntrance(element));
    });

      // Animate all elements with data attributes
  timeline.add(() => {
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach(element => {
      animationPresets.animateWithDataAttributes(element);
    });
  });

  this.timelines.set('pageAnimations', timeline);
  return timeline;
}

  // Initialize scroll-triggered animations
  initScrollAnimations() {
    // Kill existing ScrollTriggers to prevent conflicts
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    if (prefersReducedMotion()) {
      revealAllAnimatedElements();
      return;
    }
    
    // Initialize background color changes
    this.initBackgroundColorChanges();
    
    // Wait for DOM to be ready
    setTimeout(() => {
      const animatedElements = document.querySelectorAll('[data-animation]');
      
      animatedElements.forEach((element, index) => {
        const animationType = element.getAttribute('data-animation') || 'fade';
        const delay = parseFloat(element.getAttribute('data-delay') || '0');
        const duration = parseFloat(element.getAttribute('data-duration') || '0.8');
        const direction = element.getAttribute('data-direction') || 'left';
      
      // Handle video scroll animation separately
      if (animationType === 'video-scroll') {
        videoScrollWithDataAttributes(element);
        return; // Skip regular animation handling for video scroll
      }

      // Handle video play animation separately
      if (animationType === 'video-play') {
        videoPlayWithDataAttributes(element);
        return; // Skip regular animation handling for video play
      }

      // Handle gallery animation separately
      if (animationType === 'gallery') {
        // Add a longer delay to ensure DOM is fully ready
        setTimeout(() => {
          galleryAnimationWithDataAttributes(element);
        }, 500);
        return; // Skip regular animation handling for gallery
      }

      // Handle service list animation separately
      if (animationType === 'service-list') {
        setTimeout(() => {
          serviceListWithDataAttributes(element);
        }, 500);
        return; // Skip regular animation handling for service list
      }

      // Handle image carousel animation separately
      if (animationType === 'image-carousel') {
        setTimeout(() => {
          imageCarouselWithDataAttributes(element);
        }, 500);
        return; // Skip regular animation handling for image carousel
      }

      // Handle client slider animation separately
      if (animationType === 'client-slider') {
        setTimeout(() => {
          clientSliderWithDataAttributes(element);
        }, 500);
        return; // Skip regular animation handling for client slider
      }

      
      // Check if this is in the hero section (first section)
      const isInHeroSection = element.closest('section') === document.querySelector('section');
      
      // Set initial hidden states (no-ops when reduced motion)
      hideAnimatedElementForEntrance(element);
      
      // If in hero section, animate immediately
      if (isInHeroSection) {
        setTimeout(() => {
          if (animationType === 'fade') {
            gsap.to(element, { opacity: 1, duration, delay, ease: "power2.out" });
          } else if (animationType === 'slide') {
            gsap.to(element, { 
              x: 0, 
              y: 0, 
              opacity: 1, 
              duration, 
              delay, 
              ease: "power2.out" 
            });
          } else if (animationType === 'scale') {
            gsap.to(element, { scale: 1, opacity: 1, duration, delay, ease: "power2.out" });
          } else if (animationType === 'rotate') {
            gsap.to(element, { rotation: 0, opacity: 1, duration, delay, ease: "power2.out" });
          } else if (animationType === 'text-reveal') {
            gsap.to(element, { 
              clipPath: "inset(0 0% 0 0)", 
              duration, 
              delay, 
              ease: "expo.out" 
            });
          } else if (animationType === 'zoom-in') {
            gsap.to(element, { 
              scale: 1, 
              opacity: 1, 
              duration, 
              delay, 
              ease: "power2.out" 
            });
          } else if (animationType === 'text-split') {
            textSplitWithDataAttributes(element);
          }
        }, 500); // Small delay to ensure page is ready
      } else {
        // Create scroll trigger for non-hero elements
        const customStart = element.getAttribute('data-start');
        ScrollTrigger.create({
          trigger: element,
          start: customStart || "top 80%", // Use custom start point or default to 80%
          onEnter: () => {
            // Animate the element when it enters viewport
            if (animationType === 'fade') {
              gsap.to(element, { opacity: 1, duration, delay, ease: "power2.out" });
            } else if (animationType === 'slide') {
              gsap.to(element, { 
                x: 0, 
                y: 0, 
                opacity: 1, 
                duration, 
                delay, 
                ease: "power2.out" 
              });
            } else if (animationType === 'scale') {
              gsap.to(element, { scale: 1, opacity: 1, duration, delay, ease: "power2.out" });
            } else if (animationType === 'rotate') {
              gsap.to(element, { rotation: 0, opacity: 1, duration, delay, ease: "power2.out" });
            } else if (animationType === 'text-reveal') {
              gsap.to(element, { 
                clipPath: "inset(0 0% 0 0)", 
                duration, 
                delay, 
                ease: "expo.out" 
              });
            } else if (animationType === 'zoom-in') {
              gsap.to(element, { 
                scale: 1, 
                opacity: 1, 
                duration, 
                delay, 
                ease: "power2.out" 
              });
            } else if (animationType === 'text-split') {
              textSplitWithDataAttributes(element);
            }
          },
          once: true // Only trigger once
        });
      }
    });
    }, 100); // Close setTimeout
  }

  // Play component animation
  playComponent(element: any, type: string, delay = 0) {
    return animationPresets.componentEntrance(element, type as any, delay);
  }

  // Kill all animations
  killAll() {
    this.timelines.forEach(timeline => timeline.kill());
    this.timelines.clear();
    
    // Also kill all ScrollTriggers to prevent conflicts
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  // Kill specific video play ScrollTriggers
  killVideoPlayTriggers() {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id && trigger.vars.id.toString().startsWith('video-play-')) {
        trigger.kill();
      }
    });
  }

  // Pause all animations
  pauseAll() {
    this.timelines.forEach(timeline => timeline.pause());
  }

  // Resume all animations
  resumeAll() {
    this.timelines.forEach(timeline => timeline.resume());
  }

  // Initialize parallax effects
  initParallax() {
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initParallaxAfterLoad();
      });
    } else {
      this.initParallaxAfterLoad();
    }
  }

  // Initialize parallax after page is loaded
  initParallaxAfterLoad() {
    // Wait for images to load to prevent jumping
    const images = document.querySelectorAll('img');
    const promises = Array.from(images).map(img => {
      if (img.complete) {
        return Promise.resolve();
      }
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    Promise.all(promises).then(() => {
      // Small additional delay to ensure everything is ready
      setTimeout(() => {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
          parallaxWithDataAttributes(element);
        });
      }, 100);
    });
  }

  // Kill all parallax effects
  killParallax() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }

  // Initialize background color changes based on scroll position
  initBackgroundColorChanges() {
    const coloredBgSection = document.querySelector('.colored-bg');
    const pageContent = document.querySelector('.page-content');
    
    if (coloredBgSection && pageContent) {
      // Wait a bit to ensure video scroll is set up first
      setTimeout(() => {
        // Responsive ScrollTrigger with different values for different screen sizes
        ScrollTrigger.matchMedia({
          // For medium screens and below (768px and below)
          "(max-width: 768px)": function() {
            ScrollTrigger.create({
              trigger: coloredBgSection,
              start: "top 50%", // Trigger earlier on smaller screens
              end: "bottom 5%", // Different end point for mobile
              onEnter: () => {
                console.log('Colored-bg section entered viewport (mobile)');
                gsap.to(pageContent, {
                  backgroundColor: '#6A758C',
                  duration: 0.5,
                  ease: "power2.out"
                });
              },
              onLeave: () => {
                console.log('Colored-bg section left viewport (mobile)');
                gsap.to(pageContent, {
                  backgroundColor: '#ffffff',
                  duration: 0.5,
                  ease: "power2.out"
                });
              },
              onEnterBack: () => {
                console.log('Colored-bg section entered viewport (scrolling back up - mobile)');
                gsap.to(pageContent, {
                  backgroundColor: '#6A758C',
                  duration: 0.5,
                  ease: "power2.out"
                });
              },
              onLeaveBack: () => {
                console.log('Colored-bg section left viewport (scrolling back up - mobile)');
                gsap.to(pageContent, {
                  backgroundColor: '#ffffff',
                  duration: 0.5,
                  ease: "power2.out"
                });
              }
            });
          },
          
          // For larger screens (769px and above)
          "(min-width: 769px)": function() {
            ScrollTrigger.create({
              trigger: coloredBgSection,
              start: "top 90%", // Original values for larger screens
              end: "bottom -8%",
              onEnter: () => {
                //console.log('Colored-bg section entered viewport (desktop)');
                gsap.to(pageContent, {
                  backgroundColor: '#6A758C',
                  duration: 0.5,
                  ease: "power2.out"
                });
              },
              onLeave: () => {
                //console.log('Colored-bg section left viewport (desktop)');
                gsap.to(pageContent, {
                  backgroundColor: '#ffffff',
                  duration: 0.5,
                  ease: "power2.out"
                });
              },
              onEnterBack: () => {
                //console.log('Colored-bg section entered viewport (scrolling back up - desktop)');
                gsap.to(pageContent, {
                  backgroundColor: '#6A758C',
                  duration: 0.5,
                  ease: "power2.out"
                });
              },
              onLeaveBack: () => {
                //console.log('Colored-bg section left viewport (scrolling back up - desktop)');
                gsap.to(pageContent, {
                  backgroundColor: '#ffffff',
                  duration: 0.5,
                  ease: "power2.out"
                });
              }
            });
          }
        });
      }, 1000); // Wait 1 second for video scroll to be set up
    }
  }
}

// Export a singleton instance
export const animationController = AnimationController.getInstance();

// Auto-scroll functionality with user interaction detection
export const autoScrollWithUserDetection = (
  scrollDistance: number = 0.5, // Default to 50% of viewport height
  delay: number = 5000, // Default to 5 seconds
  threshold: number = 10, // Default to 10px threshold for user scroll detection
  duration: number = 1.5, // Default animation duration
  ease: string = "power2.out", // Default easing
  onScrollComplete?: () => void // Callback when auto-scroll completes
) => {
  let hasUserScrolled = false;
  let initialScrollY = window.scrollY;
  let autoScrollTimer: NodeJS.Timeout;
  let callbackExecuted = false; // Flag to prevent double execution
  let scrollTween: gsap.core.Tween | null = null;
  
  // Track user scroll activity
  const handleUserScroll = () => {
    const currentScrollY = window.scrollY;
    // If user has scrolled more than threshold from initial position, mark as user-scrolled
    if (Math.abs(currentScrollY - initialScrollY) > threshold) {
      hasUserScrolled = true;
    }
  };
  
  // Add scroll listener to detect user interaction
  window.addEventListener('scroll', handleUserScroll, { passive: true });
  
  autoScrollTimer = setTimeout(() => {
    // Only auto-scroll if user hasn't manually scrolled and callback hasn't been executed
    if (!hasUserScrolled && !callbackExecuted) {
      const distance = typeof scrollDistance === 'number' && scrollDistance <= 1 
        ? window.innerHeight * scrollDistance // If <= 1, treat as percentage of viewport
        : scrollDistance; // Otherwise treat as absolute pixels
      
      const currentScrollY = window.scrollY;
      const targetScrollY = currentScrollY + distance;
      
      // Smooth scroll to the target position
      scrollTween = gsap.to(window, {
        scrollTo: { y: targetScrollY, autoKill: false },
        duration,
        ease,
        onComplete: () => {
          scrollTween = null;
          // Call the callback when scroll completes, but only once
          if (onScrollComplete && !callbackExecuted) {
            callbackExecuted = true;
            onScrollComplete();
          }
        }
      });
    }
  }, delay);

  // Return cleanup function
  return () => {
    clearTimeout(autoScrollTimer);
    window.removeEventListener('scroll', handleUserScroll);
    scrollTween?.kill();
    gsap.killTweensOf(window);
  };
};

// Custom hook for auto-scroll with user detection and scroll arrow
export const useAutoScroll = (
  scrollDistance: number = 0.5,
  delay: number = 5000,
  threshold: number = 10,
  duration: number = 1.5,
  ease: string = "power2.out",
  options: {
    showScrollArrow?: boolean;
    onScrollComplete?: () => void;
  } = {}
) => {
  const { showScrollArrow: initialShowScrollArrow = false, onScrollComplete } = options;
  
  // State for scroll arrow visibility and control
  const [showScrollArrow, setShowScrollArrow] = useState(initialShowScrollArrow);
  const [arrowState, setArrowState] = useState({
    isVisible: false,
    hasShown: false,
    userHasScrolled: false,
    isAnimatingOut: false
  });
  
  // Track if auto-scroll has completed
  const [autoScrollCompleted, setAutoScrollCompleted] = useState(false);

  // Use ref to store the latest callback to avoid dependency issues
  const callbackRef = useRef(onScrollComplete);
  callbackRef.current = onScrollComplete;

  // Ref to store the inactivity timeout
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to check if footer is in viewport
  const isFooterInViewport = () => {
    const footer = document.querySelector('footer');
    if (!footer) return false;
    
    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check if footer is visible in viewport (at least partially)
    return footerRect.top < viewportHeight && footerRect.bottom > 0;
  };

  // Handle scroll arrow visibility and inactivity timer
  useEffect(() => {
    if (!showScrollArrow) return;

    const handleUserScroll = () => {
      // Clear existing timeout
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
        inactivityTimeoutRef.current = null;
      }

      // If arrow is visible and user scrolls, hide it
      if (!arrowState.userHasScrolled && arrowState.isVisible && !arrowState.isAnimatingOut) {
        setArrowState(prev => ({
          ...prev,
          userHasScrolled: true,
          isAnimatingOut: true,
          isVisible: false
        }));
      }

      // Only set timeout to show arrow again if footer is not in viewport and auto-scroll has completed
      if (!isFooterInViewport() && autoScrollCompleted) {
        inactivityTimeoutRef.current = setTimeout(() => {
          setArrowState(prev => ({
            ...prev,
            userHasScrolled: false,
            isVisible: true,
            isAnimatingOut: false
          }));
        }, 5000);
      }
    };

    window.addEventListener('scroll', handleUserScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleUserScroll);
      // Clear timeout on cleanup
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
        inactivityTimeoutRef.current = null;
      }
    };
  }, [arrowState.userHasScrolled, arrowState.isVisible, arrowState.isAnimatingOut, showScrollArrow, autoScrollCompleted]);

  // Auto-scroll effect — wait until SiteShell reveals the page.
  // Starting during intro/preload often fires while overflow is locked, or gets
  // killed by resetPageScroll() when the shell becomes ready.
  useEffect(() => {
    let cancelled = false
    let started = false
    let cleanupAutoScroll: (() => void) | undefined
    let startTimeoutId: number | undefined

    const startAutoScroll = () => {
      if (cancelled || started) return
      started = true
      // Let SiteShell finish unlock + resetPageScroll before arming the timer.
      startTimeoutId = window.setTimeout(() => {
        if (cancelled) return
        cleanupAutoScroll = autoScrollWithUserDetection(
          scrollDistance,
          delay,
          threshold,
          duration,
          ease,
          () => {
            if (callbackRef.current) {
              callbackRef.current()
            }

            setAutoScrollCompleted(true)

            if (initialShowScrollArrow && !arrowState.hasShown && !isFooterInViewport()) {
              window.setTimeout(() => {
                setArrowState((prev) => ({
                  ...prev,
                  isVisible: true,
                  hasShown: true,
                }))
              }, 3000)
            }
          },
        )
      }, 300)
    }

    const unsubscribe = subscribeShellReady((ready) => {
      if (ready) startAutoScroll()
    })

    return () => {
      cancelled = true
      unsubscribe()
      if (startTimeoutId !== undefined) window.clearTimeout(startTimeoutId)
      cleanupAutoScroll?.()
    }
  }, [scrollDistance, delay, threshold, duration, ease, showScrollArrow, initialShowScrollArrow]);

  // Scroll arrow click handler
  const handleArrowClick = () => {
    // Clear any existing timeout
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }

    // Find all elements with IDs on the page
    const elementsWithIds = Array.from(document.querySelectorAll('[id]'))
      .filter(element => element.id.trim() !== '') // Filter out empty IDs
      .map(element => ({
        element,
        id: element.id,
        top: element.getBoundingClientRect().top + window.pageYOffset
      }))
      .sort((a, b) => a.top - b.top); // Sort by position from top

    // Find the next section after current scroll position
    const currentScrollY = window.pageYOffset;
    const nextSection = elementsWithIds.find(section => section.top > currentScrollY + 100); // 100px threshold

    let targetY: number;

    if (nextSection) {
      // Scroll to the next section
      targetY = nextSection.top;
    } else {
      // If no next section found, scroll down by viewport height
      const startY = window.pageYOffset;
      const targetYByViewport = startY + window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetY = Math.min(targetYByViewport, maxScroll);
    }
    
    // Use GSAP for smoother scrolling animation
    gsap.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: 1.2,
      ease: "power2.out",
      onComplete: () => {
        // Ensure we're at the exact target position
        window.scrollTo({ top: targetY, left: 0 });
      }
    });
    
    setArrowState(prev => ({
      ...prev,
      isAnimatingOut: true,
      isVisible: false,
      userHasScrolled: true
    }));
  };

  // Scroll arrow hide complete handler
  const handleArrowHideComplete = () => {
    setArrowState(prev => ({
      ...prev,
      isAnimatingOut: false
    }));
  };

  // Auto-render ScrollArrow component when needed
  useEffect(() => {
    if (!showScrollArrow) return;

    const arrowRef = { current: null as HTMLDivElement | null };
    let shouldRender = false;

    const createScrollArrow = () => {
      if (shouldRender) return;

      shouldRender = true;
      const arrowElement = document.createElement('div');
      arrowElement.className = "fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 cursor-pointer group";
      arrowElement.style.pointerEvents = 'auto';
      arrowElement.setAttribute('role', 'button');
      arrowElement.setAttribute('aria-label', 'Scroll down');
      arrowElement.setAttribute('tabindex', '0');

      arrowElement.innerHTML = `
        <div class="flex flex-col items-center space-y-2">
          <div class="w-12 h-12 rounded-full border-2 border-white/80 bg-black/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
            <svg class="w-6 h-6 text-white group-hover:text-[#BFB6AD] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
          <span class="text-white/80 text-xs uppercase tracking-[2px] group-hover:text-[#BFB6AD] transition-colors duration-300">Scroll</span>
        </div>
      `;

      arrowElement.addEventListener('click', handleArrowClick);
      arrowElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleArrowClick();
        }
      });

      document.body.appendChild(arrowElement);
      arrowRef.current = arrowElement;

      // Animate in
      gsap.fromTo(arrowElement, 
        { 
          opacity: 0, 
          y: 20, 
          scale: 0.8 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)"
        }
      );
    };

    const removeScrollArrow = () => {
      if (!shouldRender || !arrowRef.current) return;

      const element = arrowRef.current;
      gsap.to(element, {
        opacity: 0,
        y: 20,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          if (element && element.parentNode) {
            element.parentNode.removeChild(element);
          }
          shouldRender = false;
          handleArrowHideComplete();
        }
      });
    };

    // Show arrow when needed (only if footer is not in viewport)
    if (arrowState.isVisible && !arrowState.userHasScrolled && !isFooterInViewport()) {
      createScrollArrow();
    } else if (arrowState.userHasScrolled || arrowState.isAnimatingOut || isFooterInViewport()) {
      removeScrollArrow();
    }

    // Cleanup on unmount
    return () => {
      if (arrowRef.current && arrowRef.current.parentNode) {
        arrowRef.current.parentNode.removeChild(arrowRef.current);
      }
    };
  }, [arrowState.isVisible, arrowState.userHasScrolled, arrowState.isAnimatingOut, handleArrowClick, handleArrowHideComplete]);

  return {
    arrowState,
    handleArrowClick,
    handleArrowHideComplete,
    showScrollArrow,
    setShowScrollArrow
  };
}; 

// Custom hook for page animations
export const usePageAnimations = (isHomePage: boolean = false) => {
  useEffect(() => {
    let cancelled = false;

    const applyReducedMotion = () => {
      revealAllAnimatedElements();
    };

    // Progressive enhancement: hide only when motion is allowed; stay visible otherwise.
    preparePageAnimationElements();

    if (prefersReducedMotion()) {
      applyReducedMotion();
      return;
    }

    // Fail-safe: unstick in-view content only — do not kill delayed banner
    // reveals or force-show below-fold scroll animations.
    const failsafeId = window.setTimeout(() => {
      if (cancelled) return;
      revealStuckAnimatedElements();
    }, ANIMATION_FAILSAFE_MS);

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      if (prefersReducedMotion()) {
        applyReducedMotion();
        return;
      }

      if (isHomePage) {
        animationController.playPageAnimations(isHomePage);
      } else {
        animationController.initScrollAnimations();
      }
      animationController.initParallax();
    }, 200);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionPreferenceChange = () => {
      if (motionQuery.matches) {
        applyReducedMotion();
      }
    };
    motionQuery.addEventListener('change', onMotionPreferenceChange);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearTimeout(failsafeId);
      motionQuery.removeEventListener('change', onMotionPreferenceChange);
      animationController.killParallax();
    };
  }, [isHomePage]);
};

// Custom hook for parallax effects
export const useParallax = () => {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      animationController.initParallax();
    }, 100);

    return () => {
      clearTimeout(timer);
      animationController.killParallax();
    };
  }, []);
}; 

// Parallax presets for different effects
export const parallaxPresets = {
  // Basic parallax effect (GSAP-based)
  basic: (element: any, speed = 0.5, scrub = 1) => {
    return gsap.to(element, {
      yPercent: -(100 * speed),
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: scrub
      }
    });
  },

  // Fixed background parallax effect (CSS-based with image movement)
  fix: (element: any, speed = 100, scrub = 1) => {
    // Set CSS background-attachment: fixed
    gsap.set(element, {
      backgroundAttachment: "fixed"
    });
    
    // Add subtle image parallax movement
    return gsap.to(element, {
      backgroundPosition: `center ${50 - (speed * 50)}%`, // Move from center 50% to center 0%
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: scrub
      }
    });
  },

  // Video parallax effect (fixed container with moving video content)
  video: (element: any, speed = 0.5, scrub = 1) => {
    const iframe = element.querySelector('iframe');
    if (!iframe) return null;

    // Set initial scale to allow for parallax movement
    gsap.set(iframe, {
      scale: 1.1,
      transformOrigin: 'center center'
    });

    return gsap.to(iframe, {
      yPercent: -(20 * speed), // Reduced from 100 to 10 for gentler movement
      scale: 1.1 + (speed * 0.00), // Slight scale change for depth
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: scrub
      }
    });
  },

  // Parallax with custom movement
  custom: (element: any, yPercent = -20, scrub = 10) => {
    return gsap.to(element, {
      yPercent: yPercent,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: scrub
      }
    });
  },

  // Horizontal parallax
  horizontal: (element: any, xPercent = -20, scrub = 1) => {
    return gsap.to(element, {
      xPercent: xPercent,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: scrub
      }
    });
  },

  // Scale parallax effect
  scale: (element: any, scale = 1.2, scrub = 1) => {
    return gsap.to(element, {
      scale: scale,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: scrub
      }
    });
  },

  // Multi-axis parallax
  multiAxis: (element: any, xPercent = -10, yPercent = -20, scrub = 1) => {
    return gsap.to(element, {
      xPercent: xPercent,
      yPercent: yPercent,
      ease: "none",
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: scrub
      }
    });
  }
};

// Data attribute based parallax
export const parallaxWithDataAttributes = (element: any) => {
  const parallaxType = (element.dataset.parallax || 'basic').toLowerCase()
  const speed = parseFloat(element.dataset.speed) || 0.5
  const scrub = parseFloat(element.dataset.scrub) || 1
  const yPercent = parseFloat(element.dataset.yPercent) || -20
  const xPercent = parseFloat(element.dataset.xPercent) || -10
  const scale = parseFloat(element.dataset.scale) || 1.2

  // Explicit opt-out — do not fall through to basic (that crops banner videos).
  if (parallaxType === 'false' || parallaxType === 'none' || parallaxType === 'off') {
    return null
  }

  // Set initial state to prevent jumping
  gsap.set(element, {
    clearProps: 'transform',
    yPercent: 0,
    xPercent: 0,
    scale: 1,
  })

  const parallaxFunctions = {
    basic: () => parallaxPresets.basic(element, speed, scrub),
    fix: () => parallaxPresets.fix(element, speed, scrub),
    video: () => parallaxPresets.video(element, speed, scrub),
    custom: () => parallaxPresets.custom(element, yPercent, scrub),
    horizontal: () => parallaxPresets.horizontal(element, xPercent, scrub),
    scale: () => parallaxPresets.scale(element, scale, scrub),
    'multi-axis': () => parallaxPresets.multiAxis(element, xPercent, yPercent, scrub),
  }

  const selectedParallax = parallaxFunctions[parallaxType as keyof typeof parallaxFunctions]
  if (selectedParallax) {
    return selectedParallax()
  }
  return parallaxFunctions.basic()
} 

// Page transition with slide effect
export const pageTransition = {
  // Create slide transition with dynamic direction support.
  // Uses a solid color wipe (no image) so the overlay cannot become a late LCP image.
  createSlideTransition: (
    direction: 'top' | 'bottom' | 'left' | 'right' | 'dynamic' = 'bottom',
    /** @deprecated Ignored — overlay uses a solid color to avoid LCP image discovery delay. */
    _backgroundImage?: string,
    options: {
      slideDuration?: number;
      slideDelay?: number;
      fadeDelay?: number;
      fadeDuration?: number;
      backgroundPosition?: string;
      /** Solid overlay color. Defaults to white. */
      backgroundColor?: string;
      skipOnInitialLoad?: boolean;
      transitionType?: 'slide' | 'fade';
      dynamicDirections?: {
        fromHomepage?: 'top' | 'bottom' | 'left' | 'right';
        toHomepage?: 'top' | 'bottom' | 'left' | 'right';
        betweenPages?: 'top' | 'bottom' | 'left' | 'right';
      };
    } = {}
  ) => {
    const {
      slideDuration = 1,
      slideDelay = 0,
      fadeDelay = 0.5,
      fadeDuration = 0.8,
      backgroundColor = '#ffffff',
      skipOnInitialLoad = false,
      transitionType = 'slide',
      dynamicDirections = {
        fromHomepage: 'bottom',
        toHomepage: 'top'
      }
    } = options;

    // Skip entrance wipe on cold/direct loads. Client navigations set
    // `dx_page_entrance` via startPagePreload / navigateWithTransition.
    if (skipOnInitialLoad) {
      const isClientEntrance = sessionStorage.getItem('dx_page_entrance') === '1';
      sessionStorage.removeItem('dx_page_entrance');
      sessionStorage.setItem('hasNavigated', 'true');

      if (!isClientEntrance) {
        return null;
      }
    }

    // Determine actual direction if using dynamic mode
    let actualDirection = direction;
    if (direction === 'dynamic') {
      const currentPath = window.location.pathname;
      const wasHomePage = sessionStorage.getItem('wasHomePage');
      const isCurrentHomepage = currentPath === '/';
      
      // Get the previous path from the navigation history to determine the actual flow
      const navigationHistory = sessionStorage.getItem('navigationHistory') || '[]';
      const history = JSON.parse(navigationHistory);
      const previousPath = history.length > 0 ? history[history.length - 1] : '/';
      const wasPreviousHomepage = previousPath === '/';
      
      // Use the same logic as white page transition
      if (isCurrentHomepage) {
        // Going TO homepage (from any other page) - slide top to bottom
        actualDirection = dynamicDirections.toHomepage || 'top';
      } else if (!isCurrentHomepage && wasPreviousHomepage) {
        // Going FROM homepage to other page - slide bottom to top
        actualDirection = dynamicDirections.fromHomepage || 'bottom';
      } else if (!isCurrentHomepage && !wasPreviousHomepage && dynamicDirections.betweenPages) {
        // Between other pages - only if betweenPages is defined
        actualDirection = dynamicDirections.betweenPages;
      } else if (!isCurrentHomepage && !wasPreviousHomepage) {
        // Between other pages but no betweenPages defined - use right as default
        actualDirection = 'right';
      } else {
        // Fallback - this shouldn't happen
        actualDirection = 'right';
      }
    }

    // Set initial position based on actual direction and transition type
    const getInitialPosition = () => {
      if (transitionType === 'fade') {
        return { x: '0vw', y: '0vh', opacity: 0 };
      }
      
      switch (actualDirection) {
        case 'top': return { y: '-100vh', x: '0', opacity: 1 };
        case 'bottom': return { y: '100vh', x: '0', opacity: 1 };
        case 'left': return { x: '-100vw', y: '0', opacity: 1 };
        case 'right': return { x: '100vw', y: '0', opacity: 1 };
        default: return { y: '100vh', x: '0', opacity: 1 };
      }
    };

    const getFinalPosition = () => {
      if (transitionType === 'fade') {
        return { x: '0vw', y: '0vh', opacity: 1 };
      }
      return { x: '0vw', y: '0vh', opacity: 1 };
    };

    // Solid-color wipe overlay (no background-image — avoids late LCP discovery)
    const duplicateImage = document.createElement('div');
    duplicateImage.className = 'page-transition-overlay';
    duplicateImage.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 100;
      background: ${backgroundColor};
      pointer-events: none;
    `;
    document.body.appendChild(duplicateImage);

    // Create content container reference
    const contentContainer = document.querySelector('.page-content') || document.body;

    // Animation timeline
    const timeline = gsap.timeline();
    const initialPos = getInitialPosition();
    const finalPos = getFinalPosition();

    // Set initial states
    timeline.set(contentContainer, { opacity: 0 }) // Hide content
            .set(duplicateImage, initialPos) // Start from direction/opacity
            
    if (transitionType === 'fade') {
      // Fade transition
      timeline.to(duplicateImage, {
        opacity: 1,
        duration: slideDuration,
        ease: 'power2.inOut',
        delay: slideDelay
      })
      // Show content behind
      .to(contentContainer, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        delay: fadeDelay
      }, '-=0.8')
      // Fade out duplicate
      .to(duplicateImage, {
        opacity: 0,
        duration: fadeDuration,
        ease: 'power2.out',
        onComplete: () => {
          // Remove duplicate element
          try {
            if (duplicateImage && duplicateImage.parentNode) {
              duplicateImage.parentNode.removeChild(duplicateImage);
            }
          } catch (error) {
            console.warn('Could not remove duplicate image element:', error);
          }
        }
      }, '-=0.2');
    } else {
      // Slide transition
      timeline.to(duplicateImage, {
        ...finalPos,
        duration: slideDuration,
        ease: 'power2.inOut',
        delay: slideDelay
      })
      // Show content behind
      .to(contentContainer, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        delay: fadeDelay
      }, '-=0.8')
      // Fade out duplicate
      .to(duplicateImage, {
        opacity: 0,
        duration: fadeDuration,
        ease: 'power2.out',
        onComplete: () => {
          // Remove duplicate element
          try {
            if (duplicateImage && duplicateImage.parentNode) {
              duplicateImage.parentNode.removeChild(duplicateImage);
            }
          } catch (error) {
            console.warn('Could not remove duplicate image element:', error);
          }
        }
      }, '-=0.2');
    }

    // Fallback cleanup - remove element after total animation time + buffer
    const totalDuration = slideDuration + slideDelay + fadeDuration + 1; // 1s buffer
    setTimeout(() => {
      try {
        if (duplicateImage && duplicateImage.parentNode) {
          duplicateImage.parentNode.removeChild(duplicateImage);
        }
      } catch (error) {
        // Silent fallback cleanup
      }
    }, totalDuration * 1000);

    return timeline;
  }
};

// Custom hook for page transitions
// Module columns staggered height animation with data attributes
export const moduleColumnsWithDataAttributes = (
  element: HTMLElement,
  modules: ModuleColumnOverlayData[] = [],
) => {
  const staggerAmount = parseFloat(element.dataset.stagger ?? '') || 50;
  const triggerId = element.dataset.trigger || '#modules-section';
  const maxDistance = parseFloat(element.dataset.maxDistance ?? '') || 0.5;
  
  // Check if screen size is below md breakpoint
  const isBelowMd = () => window.innerWidth < 768; // md breakpoint is 768px
  
  // Find all module columns within this element
  const moduleColumns = element.querySelectorAll('.module-column');
  
  if (moduleColumns.length === 0) return;
  
  // Set initial positions based on screen size
  if (isBelowMd()) {
    // On small screens, align all columns without stagger
    gsap.set(moduleColumns, {
      y: 0,
      opacity: 1
    });
  } else {
    // On medium+ screens, set staggered heights
    gsap.set(moduleColumns, {
      y: (i: number) => i * staggerAmount,
      opacity: 0.6
    });
    
    // Force immediate update to ensure staggered positioning
    gsap.set(moduleColumns[0], { y: 0 });
    gsap.set(moduleColumns[1], { y: staggerAmount });
    gsap.set(moduleColumns[2], { y: staggerAmount * 2 });
    gsap.set(moduleColumns[3], { y: staggerAmount * 3 });
  }
  
  // Set initial hidden state for all titles
  moduleColumns.forEach((column: any) => {
    const title = column.querySelector('h3');
    if (title) {
      gsap.set(title, {
        opacity: 0,
        y: 16 // translate-y-4 = 16px
      });
    }
  });
  
  // Throttled scroll handler for smooth scrub animation
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const triggerSection = document.querySelector(triggerId);
        if (!triggerSection) return;
        
        const rect = triggerSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionHeight = rect.height;
        
        // Calculate when section center reaches viewport center
        const sectionCenter = rect.top + sectionHeight / 2;
        const viewportCenter = windowHeight / 2;
        
        // Calculate distance from center (0 = perfectly centered, larger = further from center)
        const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
        const maxDistancePx = windowHeight * maxDistance; // Convert to pixels
        
        // Convert to progress (0 = far from center, 1 = perfectly centered)
        // Add 200px delay before exit animation starts
        const exitDelayPx = 250;
        const adjustedDistance = Math.max(0, distanceFromCenter - exitDelayPx);
        const progress = Math.max(0, 1 - (adjustedDistance / maxDistancePx));
        
        // Use progress to smoothly animate columns with better scrub performance
        if (isBelowMd()) {
          // On small screens, keep all columns aligned and at full opacity
          moduleColumns.forEach((column: any) => {
            gsap.to(column, {
              y: 0,
              opacity: 1,
              duration: 0.00005,
              ease: 'none',
              overwrite: 'auto'
            });
          });
        } else {
          // On medium+ screens, animate staggered movement
          moduleColumns.forEach((column: any, index: number) => {
            const startY = index * staggerAmount; // Staggered starting position
            const endY = 0; // Aligned position
            
            // Smooth interpolation between start and end positions
            const currentY = startY + (endY - startY) * progress;
            
            // Animate opacity from 0.6 to 1
            const currentOpacity = 0.6 + (1 - 0.6) * progress;
            
            // Use gsap.to with very short duration for smooth scrubbing
            gsap.to(column, {
              y: currentY,
              opacity: currentOpacity,
              duration: 0.00005, // Faster duration for quicker staggered movement
              ease: 'none', // No easing for consistent performance
              overwrite: 'auto' // Automatically kill previous tweens
            });
          });
        }
        
        // Add elastic effect when columns are perfectly centered (progress = 1)
        // Only on medium+ screens where staggered animation is active
        if (!isBelowMd() && progress >= 0.98 && !element.dataset.elasticTriggered) {
          element.dataset.elasticTriggered = 'true';
          console.log('Columns perfectly centered - scroll elastic effect triggered!');
          
          // Elastic bounce effect for each column
          moduleColumns.forEach((column: any, index: number) => {
            gsap.to(column, {
              y: -25, // Bounce up slightly
              duration: 0.25,
              ease: 'power2.out',
              onComplete: () => {
                gsap.to(column, {
                  y: 0, // Return to aligned position
                  duration: 0.5,
                  ease: 'elastic(1, 0.5)' // Elastic bounce back
                });
              }
            });
          });
        }
        
        // Reset elastic trigger when moving away from center
        if (progress < 0.85) {
          element.dataset.elasticTriggered = 'false';
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  };
  
  // Add scroll listener
  window.addEventListener('scroll', handleScroll);
  
    // Add hover overlay effects
  const addHoverOverlayEffect = () => {
    moduleColumns.forEach((column: any, index: number) => {
      let overlay: HTMLElement | null = null;
      let isHovering = false;
      
      // Check if screen size is below xl breakpoint
      const isBelowXl = () => window.innerWidth < 1280; // xl breakpoint is 1280px
      
      // Mouse enter - show overlay (only on xl screens and above)
      column.addEventListener('mouseenter', () => {
        // Don't show overlay on screens below xl
        if (isBelowXl()) {
          return;
        }
        
        isHovering = true;
        
        // Check if overlay already exists in the DOM
        const existingOverlay = column.querySelector('.module-overlay');
        if (existingOverlay) {
          overlay = existingOverlay;
          gsap.killTweensOf(overlay);
          // Always animate the opacity for a smooth effect
          gsap.set(overlay, { x: 0, opacity: 0 });
          gsap.to(overlay, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          });
          return;
        }
        
        // Create new overlay
        overlay = document.createElement('div');
        overlay.className = 'module-overlay';
        
        // Customize overlay content based on data-module attribute
        const moduleIndex = parseInt(column.dataset.module, 10) - 1;
        const currentModule = modules[moduleIndex] ?? modules[0];
        if (!currentModule) return;
        
        // Check if title contains "DX" and format accordingly
        let formattedTitle = currentModule.title;
        if (currentModule.title.includes('DX')) {
          const words = currentModule.title.split(' ');
          const dxIndex = words.findIndex(word => word.includes('DX'));
          if (dxIndex !== -1 && dxIndex + 1 < words.length) {
            // Put DX on first line, next word on second line
            formattedTitle = `${words[dxIndex]}<br>${words[dxIndex + 1]}`;
            // Add remaining words if any
            if (dxIndex + 2 < words.length) {
              formattedTitle += ` ${words.slice(dxIndex + 2).join(' ')}`;
            }
          }
        }
        
        overlay.innerHTML = `
          <div class="overlay-content">
            <h3 class="heading-small text-white mb-4 whitespace-normal" style="line-height: 1.5;">${formattedTitle}</h3>
            <div class="divider" style="background-color: #fff; height: 1px; width: 50px; padding: 0px; margin: auto;"></div>
            <p class="text-white mt-4 whitespace-normal text-[18px]">${currentModule.content}</p>
          </div>
        `;
        
        column.appendChild(overlay);
        
        // Add click handler to the entire module container (only once)
        if (!column.hasAttribute('data-click-handler-added')) {
          column.style.cursor = 'pointer';
          column.addEventListener('click', () => {
            // Navigate to the specific module page using CMS link
            if ((window as any).navigateWithTransition) {
              (window as any).navigateWithTransition(currentModule.link);
            } else {
              window.location.href = currentModule.link;
            }
          });
          column.setAttribute('data-click-handler-added', 'true');
        }
        
        // Animate overlay in
        gsap.set(overlay, { opacity: 0, x: -50 });
        gsap.to(overlay, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
      
      // Mouse leave - hide overlay
      column.addEventListener('mouseleave', () => {
        // Don't hide overlay on screens below xl (since it was never shown)
        if (isBelowXl()) {
          return;
        }
        
        isHovering = false;
        
        // Get the current overlay from DOM to ensure we have the right reference
        const currentOverlay = column.querySelector('.module-overlay');
        if (currentOverlay) {
          overlay = currentOverlay;
          
          // Kill any existing animations to prevent conflicts
          gsap.killTweensOf(overlay);
          
          // Animate out
          gsap.to(overlay, {
            opacity: 0,
            x: 50,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
              if (overlay && overlay.parentNode && !isHovering) {
                overlay.parentNode.removeChild(overlay);
                overlay = null;
              }
            }
          });
        }
      });
    });
  };
  
  // Initialize hover overlay effects
  addHoverOverlayEffect();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
    
    // Clean up any remaining overlays
    moduleColumns.forEach((column: any) => {
      const existingOverlay = column.querySelector('.module-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      // Remove click handler attribute
      column.removeAttribute('data-click-handler-added');
    });
  };
};

export const usePageTransition = (
  direction: 'top' | 'bottom' | 'left' | 'right' | 'dynamic' = 'bottom',
  /** @deprecated Ignored — overlay uses a solid color to avoid LCP image discovery delay. */
  backgroundImage?: string,
  options: {
    slideDuration?: number;
    slideDelay?: number;
    fadeDelay?: number;
    fadeDuration?: number;
    backgroundPosition?: string;
    backgroundColor?: string;
    skipOnInitialLoad?: boolean;
    transitionType?: 'slide' | 'fade';
    dynamicDirections?: {
      fromHomepage?: 'top' | 'bottom' | 'left' | 'right';
      toHomepage?: 'top' | 'bottom' | 'left' | 'right';
      betweenPages?: 'top' | 'bottom' | 'left' | 'right';
    };
  } = {}
) => {
  useEffect(() => {
    // Run transition immediately to avoid timing issues with sessionStorage updates
    const transition = pageTransition.createSlideTransition(direction, backgroundImage, options);
    
    return () => {
      // Only cleanup if component unmounts during transition and manually remove any leftover elements
      const leftoverElements = document.querySelectorAll('.page-transition-overlay');
      leftoverElements.forEach(element => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      
      if (transition) {
        transition.kill();
      }
    };
    // Mount-only: page transitions must not re-fire when props identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional once-per-mount
  }, []);
}; 

/* Text Slider functionality */
export const initTextSlider = () => {
  const slider = document.getElementById('textSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.text-slider-item');
  const dots = slider.querySelectorAll('.slider-dot');
  const progressFill = document.getElementById('sliderProgress');
  
  if (slides.length === 0 || !progressFill) return;

  let currentSlide = 0;
  let isPaused = false;
  const slideDuration = 5000; // 5 seconds per slide
  let progressInterval: NodeJS.Timeout | null = null;
  let slideTimeout: NodeJS.Timeout | null = null;

  // Function to update progress bar
  const updateProgress = (progress: number) => {
    progressFill.style.width = `${progress}%`;
  };

  // Function to start progress animation
  const startProgress = () => {
    if (progressInterval) clearInterval(progressInterval);
    
    let progress = 0;
    const increment = 100 / (slideDuration / 50); // Update every 50ms
    
    progressInterval = setInterval(() => {
      if (!isPaused) {
        progress += increment;
        updateProgress(Math.min(progress, 100));
        
        if (progress >= 100) {
          clearInterval(progressInterval!);
        }
      }
    }, 50);
  };

  // Function to go to specific slide
  const goToSlide = (slideIndex: number) => {
    if (slideIndex < 0 || slideIndex >= slides.length) return;

    // Clear existing timeouts
    if (slideTimeout) clearTimeout(slideTimeout);
    if (progressInterval) clearInterval(progressInterval);

    // Remove active classes
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active classes
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');

    currentSlide = slideIndex;

    // Reset and start progress
    updateProgress(0);
    startProgress();

    // Set timeout for next slide
    slideTimeout = setTimeout(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, slideDuration);
  };

  // Add click handlers to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  slider.addEventListener('mouseleave', () => {
    isPaused = false;
    if (progressInterval) {
      clearInterval(progressInterval);
      startProgress();
    }
  });

  // Start the slider
  goToSlide(0);

  // Cleanup function
  return () => {
    if (slideTimeout) clearTimeout(slideTimeout);
    if (progressInterval) clearInterval(progressInterval);
  };
};

/* Logo animation */



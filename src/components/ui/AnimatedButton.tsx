'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  /** When set, renders a real crawlable <a href> while keeping the same design/animation. */
  href?: string;
  className?: string;
  dataAnimation?: string;
  dataDelay?: string;
  dataDuration?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  /** When true, omits data-animation attrs so GSAP entrance does not hide the button. */
  skipEntranceAnimation?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  'aria-label'?: string;
}

const isInternalPath = (href: string) =>
  href.startsWith('/') && !href.startsWith('//');

const navigateWithSiteTransition = (path: string) => {
  const win = window as Window & { navigateWithTransition?: (path: string) => void };
  if (win.navigateWithTransition) {
    win.navigateWithTransition(path);
    return;
  }
  window.location.href = path;
};

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  dataAnimation = 'fade',
  dataDelay = '0',
  dataDuration = '0.8',
  type = 'button',
  disabled = false,
  skipEntranceAnimation = false,
  target,
  rel,
  'aria-label': ariaLabel,
}) => {
  const elementRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const borderTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const circleTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (disabled && borderTimelineRef.current) {
      borderTimelineRef.current.pause(0);
    }
  }, [disabled]);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    // Create border animation timeline
    const borderTl = gsap.timeline({ paused: true });

    borderTl
      .to(element.querySelector('.line-top'), {
        width: '100%',
        duration: 0.7,
        ease: 'power4.inOut',
      })
      .to(
        element.querySelector('.line-left'),
        {
          height: '100%',
          duration: 0.7,
          ease: 'power4.inOut',
        },
        '-=0.7',
      )
      .to(
        element.querySelector('.line-right'),
        {
          height: '100%',
          duration: 0.7,
          ease: 'power4.inOut',
        },
        '-=0.4',
      )
      .to(
        element.querySelector('.line-bottom'),
        {
          width: '100%',
          duration: 0.7,
          ease: 'power4.inOut',
        },
        '-=0.7',
      );

    borderTimelineRef.current = borderTl;

    // Create circle animation timeline
    const circleTl = gsap.timeline({ paused: true });
    circleTl
      .set(element.querySelector('.circle'), { scale: 1, opacity: 0.3 })
      .to(element.querySelector('.circle'), {
        scale: 16,
        opacity: 0,
        duration: 1.5,
      });

    circleTimelineRef.current = circleTl;

    return () => {
      borderTl.kill();
      circleTl.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (disabled) return;
    if (borderTimelineRef.current) {
      borderTimelineRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    if (borderTimelineRef.current) {
      borderTimelineRef.current.reverse();
    }
  };

  const playClickRipple = (e: React.MouseEvent<HTMLElement>) => {
    if (!elementRef.current || disabled) return;

    const element = elementRef.current;
    const circle = element.querySelector('.circle') as HTMLElement | null;

    if (circle && circleTimelineRef.current) {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - 7.5;
      const y = e.clientY - rect.top - 7.5;

      gsap.set(circle, { left: x, top: y });
      circleTimelineRef.current.restart();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    playClickRipple(e);

    // Real <a href> for crawlers; keep site page transition for internal paths.
    if (href && isInternalPath(href)) {
      e.preventDefault();
      if (onClick) {
        onClick();
      } else {
        navigateWithSiteTransition(href);
      }
      return;
    }

    if (onClick) {
      onClick();
    }
  };

  const animationAttrs = skipEntranceAnimation
    ? {}
    : {
        'data-animation': dataAnimation,
        'data-delay': dataDelay,
        'data-duration': dataDuration,
      };

  const sharedClassName = `button ${className}${disabled ? ' pointer-events-none opacity-50' : ''}`;
  const sharedProps = {
    ...animationAttrs,
    className: sharedClassName,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    'aria-disabled': disabled || undefined,
    'aria-label': ariaLabel,
  };

  const content = (
    <>
      <span tabIndex={2}>{children}</span>

      <div className="line line-left"></div>
      <div className="line line-right"></div>
      <div className="line line-top"></div>
      <div className="line line-bottom"></div>

      <div className="circle"></div>
    </>
  );

  if (href) {
    return (
      <a
        ref={elementRef as React.RefObject<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        role={disabled ? 'link' : undefined}
        {...sharedProps}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={elementRef as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      {...sharedProps}
    >
      {content}
    </button>
  );
};

export default AnimatedButton;

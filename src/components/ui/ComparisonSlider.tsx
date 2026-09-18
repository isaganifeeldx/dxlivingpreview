'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface ComparisonSliderProps {
  leftImage?: string;
  rightImage?: string;
  leftCaption?: string;
  rightCaption?: string;
  className?: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  leftImage = 'https://is1-ssl.mzstatic.com/image/thumb/Music3/v4/96/80/22/9680225c-0564-0463-15c6-ff99e1252956/881034111432_Cover.jpg/1200x630bb.jpg',
  rightImage = 'https://is2-ssl.mzstatic.com/image/thumb/Music69/v4/80/ef/4f/80ef4fc2-4e68-c447-0427-c9adf018266e/889326467960_Cover.jpg/1200x630bb.jpg',
  leftCaption = 'Left caption',
  rightCaption = 'Right caption',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderLeftRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const captionLeftRef = useRef<HTMLParagraphElement>(null);
  const captionRightRef = useRef<HTMLParagraphElement>(null);
  const draggableInstanceRef = useRef<Draggable | null>(null);

  useEffect(() => {
    if (!containerRef.current || !sliderLeftRef.current || !handleRef.current) return;

    const container = containerRef.current;
    const sliderLeft = sliderLeftRef.current;
    const handle = handleRef.current;
    const captionLeft = captionLeftRef.current;
    const captionRight = captionRightRef.current;

    const syncBackgroundWidths = (containerWidth: number) => {
      container.querySelectorAll<HTMLElement>('.slider-bg').forEach((bg) => {
        bg.style.width = `${containerWidth}px`;
      });
    };

    const updateBounds = () => {
      if (!container) return;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      syncBackgroundWidths(containerWidth);

      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.update();
        draggableInstanceRef.current.applyBounds({
          minX: 0,
          minY: 0,
          maxX: containerWidth,
          maxY: containerHeight,
        });
      }

      return { containerWidth, containerHeight };
    };

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    syncBackgroundWidths(containerWidth);
    const startPosition = (containerWidth / 100) * 50;

    gsap.set([captionLeft, captionRight], { autoAlpha: 0, yPercent: -100 });
    gsap.set(sliderLeft, { width: 0 });
    gsap.set(handle, { x: 0 });

    const tl = gsap.timeline({ delay: 1 });
    tl.to(sliderLeft, {
      duration: 0.7,
      width: startPosition,
      ease: 'back.out(1.7)',
    });
    tl.to(
      handle,
      {
        duration: 0.7,
        x: startPosition,
        ease: 'back.out(1.7)',
      },
      0,
    );
    tl.to(
      [captionLeft, captionRight],
      {
        duration: 0.7,
        autoAlpha: 1,
        yPercent: 0,
        ease: 'back.inOut(3)',
        stagger: -0.3,
      },
      0,
    );

    let previousX = startPosition;

    const showLeftCaption = () => {
      if (captionLeft && captionRight) {
        gsap.to(captionLeft, { duration: 0.3, autoAlpha: 1, yPercent: 0 });
        gsap.to(captionRight, { duration: 0.3, autoAlpha: 0, yPercent: -100 });
      }
    };

    const showRightCaption = () => {
      if (captionLeft && captionRight) {
        gsap.to(captionLeft, { duration: 0.3, autoAlpha: 0, yPercent: -100 });
        gsap.to(captionRight, { duration: 0.3, autoAlpha: 1, yPercent: 0 });
      }
    };

    const onHandleDrag = function (this: Draggable) {
      const currentX = this.x;
      gsap.set(sliderLeft, { width: currentX });

      const direction = currentX > previousX ? 'right' : currentX < previousX ? 'left' : null;
      previousX = currentX;

      if (currentX >= this.maxX / 2 && direction === 'right') {
        showLeftCaption();
      }
      if (currentX <= this.maxX / 2 && direction === 'left') {
        showRightCaption();
      }
    };

    try {
      draggableInstanceRef.current = Draggable.create(handle, {
        bounds: {
          minX: 0,
          minY: 0,
          maxX: containerWidth,
          maxY: containerHeight,
        },
        type: 'x',
        edgeResistance: 1,
        onDrag: onHandleDrag,
      })[0];
    } catch (error) {
      console.warn('GSAP Draggable plugin may not be available:', error);
    }

    const handleResize = () => {
      updateBounds();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.kill();
      }
    };
  }, [leftImage, rightImage]);

  return (
    <>
      <style>{`
        .comparison-slider-container {
          max-width: 800px;
          max-height: 100%;
          width: 100%;
          height: 100%;
          margin: auto;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          position: absolute;
          z-index: 999;
          overflow: hidden;
        }

        .slider-col {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: absolute;
        }

        .slider-col .slider-bg {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }

        .slider-col .slider-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        .slider-col .slider-caption {
          position: absolute;
          top: 0;
          padding: 10px 16px;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          margin: 12px;
          font-size: 13px;
          max-width: calc(100% - 24px);
        }

        .slider-right .slider-bg {
          background-color: #783939;
        }

        .slider-right .slider-caption-right {
          right: 0;
        }

        .slider-left {
          width: 0px;
          left: 0px;
        }

        .slider-left .slider-bg {
          background-color: #535353;
        }

        .slider-left .slider-caption-left {
          left: 0;
        }

        .handle {
          background-color: #2a3040;
          width: 3px;
          height: 100%;
          margin-left: -1px;
          position: absolute;
          cursor: col-resize !important;
          z-index: 10;
        }

        .handle:after {
          content: "";
          width: 30px;
          height: 30px;
          background-color: #bfb6ad;
          border: 3px solid #2a3040;
          border-radius: 100%;
          top: 50%;
          left: 0px;
          margin: -13px;
          position: absolute;
        }
      `}</style>
      <div className={`comparison-slider-container ${className}`} ref={containerRef}>
        <div className="slider-right slider-col">
          <div className="slider-bg slider-bg-right">
            <img src={rightImage} alt={rightCaption} loading="lazy" decoding="async" />
            <p className="slider-caption slider-caption-right" ref={captionRightRef}>
              {rightCaption}
            </p>
          </div>
        </div>

        <div className="slider-left slider-col" ref={sliderLeftRef}>
          <div className="slider-bg slider-bg-left">
            <img src={leftImage} alt={leftCaption} loading="lazy" decoding="async" />
            <p className="slider-caption slider-caption-left" ref={captionLeftRef}>
              {leftCaption}
            </p>
          </div>
        </div>

        <div className="handle" ref={handleRef} />
      </div>
    </>
  );
};

export default ComparisonSlider;

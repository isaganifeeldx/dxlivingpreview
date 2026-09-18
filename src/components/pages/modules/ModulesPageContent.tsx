'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnchorMenu from '@/components/ui/AnchorMenu';
import AnimatedButton from '@/components/ui/AnimatedButton';
import VimeoEmbed from '@/components/ui/VimeoEmbed';
import type { ModulesPageContentData } from '@/lib/modules/types';
import {
  cmsHtml as html,
  cmsPlainText as plainText,
} from '@/lib/cms/sanitizeHtml';
import {
  moduleColumnsWithDataAttributes,
  useAutoScroll,
  usePageAnimations,
  usePageTransition,
  hideAnimatedElementForEntrance,
  prefersReducedMotion,
  revealAllAnimatedElements
} from '@/lib/utils/animations';
import { useScrollToTop } from '@/lib/utils/scrollToTop';

gsap.registerPlugin(ScrollTrigger);

export type { ModulesPageContentData, ModulesPageModuleCard } from '@/lib/modules/types';

interface ModulesPageContentProps {
  content: ModulesPageContentData;
}

const ModulesPageContent: React.FC<ModulesPageContentProps> = ({ content }) => {
  const pathname = usePathname();
  const router = useRouter();
  const sections =
    content.anchorMenu?.length > 0
      ? content.anchorMenu
      : [
          { id: 'intro', label: 'Introduction' },
          { id: 'section-1', label: 'Modules' },
          { id: 'book-a-call', label: 'Book a Call' },
        ];

  const handleNavigation = (path: string) => {
    if (path === pathname) return;

    const win = window as Window & { navigateWithTransition?: (path: string) => void };
    if (/^https?:\/\//i.test(path)) {
      window.location.href = path;
      return;
    }

    if (win.navigateWithTransition) {
      win.navigateWithTransition(path);
    } else {
      router.push(path);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, path: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(path);
    }
  };

  useScrollToTop();

  usePageTransition('dynamic', '/images/whiteBanner.jpg', {
    slideDuration: 1.8,
    slideDelay: 0,
    fadeDelay: 0.8,
    fadeDuration: 1.8,
    backgroundPosition: 'center 11.5%',
    skipOnInitialLoad: true,
    transitionType: 'fade',
    dynamicDirections: {
      toHomepage: 'top',
      fromHomepage: 'bottom',
      betweenPages: 'right',
    },
  });

  useAutoScroll(0.65, 8000, 10, 1.5, 'power2.out', {
    showScrollArrow: true,
  });

  usePageAnimations(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      revealAllAnimatedElements();
      return;
    }

    const animatedElements = document.querySelectorAll('[data-animation]');
    const triggers: ScrollTrigger[] = [];

    animatedElements.forEach((element) => {
      const animationType = element.getAttribute('data-animation') || 'fade';
      const delay = parseFloat(element.getAttribute('data-delay') || '0');
      const duration = parseFloat(element.getAttribute('data-duration') || '0.8');
      const direction = element.getAttribute('data-direction') || 'left';
      const start = element.getAttribute('data-start') || 'top 80%';

      hideAnimatedElementForEntrance(element);

      const trigger = ScrollTrigger.create({
        trigger: element,
        start,
        onEnter: () => {
          if (animationType === 'fade') {
            gsap.to(element, { opacity: 1, duration, delay, ease: 'power2.out' });
          } else if (animationType === 'slide') {
            gsap.to(element, {
              x: 0,
              y: 0,
              opacity: 1,
              duration,
              delay,
              ease: 'power2.out',
            });
          }
        },
        once: true,
      });

      triggers.push(trigger);
    });

    const modulesContainer = document.querySelector('#modules-section');
    const cleanupModuleColumns = modulesContainer
      ? moduleColumnsWithDataAttributes(
          modulesContainer as HTMLElement,
          content.moduleCards,
        )
      : undefined;

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      cleanupModuleColumns?.();
    };
  }, [content.moduleCards]);

  return (
    <div className="min-h-screen page-content">
      <AnchorMenu sections={sections} />

      <section className="mx-auto px-4 py-16 lg:h-screen h-[calc(65vh)] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden banner-section">
        <div
          className="absolute inset-0 w-full lg:h-full h-[calc(65vh)] -z-10 overflow-hidden md:scale-200 scale-100 lg:scale-110"
          data-parallax="fix"
          data-speed="0.5"
        >
          <VimeoEmbed
            videoId={content.banner.vimeoBackgroundVideo}
            title="Luxury Home Design Services | DX LIVING"
            className="w-full lg:h-full h-[calc(65vh)]"
            autoplay={true}
            loop={true}
            controls={false}
            muted={true}
            parallax={true}
            signalPageReady
          />
        </div>

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden"
          data-parallax="fix"
          style={{
            backgroundImage: "url('/images/moduleBanner.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div
          className="absolute inset-0 bg-black bg-opacity-30 z-10"
          data-animation="fade"
          data-delay="0.2"
          data-duration="1.0"
        />

        <div
          className="absolute z-20 text-white top-50 bottom-50 m-auto left-50 md:bottom-10 md:left-8 mb-4"
          tabIndex={1}
          aria-label={plainText(content.banner.title)}
        >
          <h1
            className="text-reveal heading-large"
            data-animation="text-reveal"
            data-delay="3.0"
            data-duration="1.0"
            dangerouslySetInnerHTML={html(content.banner.title)}
          />
        </div>
      </section>

      <section className="white-bg-section mx-auto py-[100px] md:py-[150px] xl:py-[200px] px-8" id="intro">
        <div className="max-w-[1200px] mx-auto text-center">
          <p
            className="mb-[30px] black font-semibold leading-[38px]"
            data-animation="fade"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
            dangerouslySetInnerHTML={html(content.introduction)}
          />
        </div>
      </section>

      <section
        id="modules-section"
        className="bg-white"
        data-animation="fade"
        data-delay="0.0"
        data-duration="1.5"
        style={{ paddingTop: '0px' }}
      >
        <div>
          <div
            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-8 mx-auto scroll-m-[100px]"
            tabIndex={1}
            aria-label="Modules"
            id="section-1"
          >
            {content.moduleCards.map((moduleCard, index) => (
              <div
                key={`${moduleCard.title}-${index}`}
                className="p-8 primary-bg-color h-[300px] sm:h-[calc(100vh-200px)] module-column rounded-[20px] cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-offset-2 group"
                style={{
                  backgroundImage: `url(${moduleCard.image})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
                data-module={index + 1}
                tabIndex={1}
                aria-label={moduleCard.title}
                onClick={(event) => {
                  event.preventDefault();
                  if (window.innerWidth <= 1024) {
                    handleNavigation(moduleCard.link);
                  }
                }}
                onKeyDown={(event) => handleKeyDown(event, moduleCard.link)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 z-9 xl:hidden flex flex-col items-center justify-center group-focus-within:flex focus-visible:flex">
                  <h4
                    className="heading-small font-bold mb-3 text-white text-center"
                    dangerouslySetInnerHTML={html(moduleCard.title)}
                  />
                  <div className="w-[30px] h-[1px] bg-white" />
                  <p
                    className="text-white mt-2 whitespace-normal px-12 text-center"
                    dangerouslySetInnerHTML={html(moduleCard.content)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="md:px-16 px-8 pt-[100px] pb-[100px] md:pt-[300px] md:pb-[200px] bg-white white-bg-section"
        id="book-a-call"
      >
        <div className="max-w-[1400px] mx-auto px-4 text-center flex lg:flex-row flex-col justify-center items-center gap-[50px] md:gap-[100px]">
          <div
            className="flex flex-col items-center"
            data-animation="fade"
            data-delay="0.0"
            data-duration="0.5"
          >
            <h2
              className="heading-medium black mb-6 font-semibold"
              tabIndex={1}
              dangerouslySetInnerHTML={html(content.cta.heading)}
            />
            <p
              className="black text-center md:text-left"
              tabIndex={1}
              dangerouslySetInnerHTML={html(content.cta.content)}
            />
          </div>
          <div data-animation="fade" data-delay="1" data-duration="1">
            <AnimatedButton
              onClick={() => handleNavigation(content.cta.buttonLink)}
              className="white-bg whitespace-nowrap uppercase relative text-[14px] md:text-[16px]"
            >
              <b dangerouslySetInnerHTML={html(content.cta.button)} />
            </AnimatedButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModulesPageContent;

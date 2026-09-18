'use client';

import React, { useEffect, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import AnimatedButton from '@/components/ui/AnimatedButton';
import FaqAccordion from '@/components/ui/FaqAccordion';
import SocialLinks from '@/components/ui/SocialLinks';
import VideoSeekBar from '@/components/ui/VideoSeekBar';
import VimeoEmbed from '@/components/ui/VimeoEmbed';
import RecentArticles from '@/components/pages/articles/RecentArticles';
import { getLatestArticles } from '@/data/articles';
import { faqIntro } from '@/data/faqData';
import {
  type HomePageContentData,
} from '@/data/homeContent';
import { HOMEPAGE_FAQ_SCHEMA_LIMIT } from '@/lib/seo/homepageSchema';
import {
  animationController,
  hideAnimatedElementForEntrance,
  preparePageAnimationElements,
  prefersReducedMotion,
  usePageAnimations,
} from '@/lib/utils/animations';
import { HOMEPAGE_VIMEO_ID } from '@/lib/vimeoThumbnail';

const HOMEPAGE_FAQ_LIMIT = HOMEPAGE_FAQ_SCHEMA_LIMIT;
const HOMEPAGE_ARTICLES_LIMIT = 6;

const ComparisonSlider = dynamic(() => import('@/components/ui/ComparisonSlider'), {
  ssr: false,
});

const LinkedInStoriesEmbed = dynamic(
  () => import('@/components/ui/LinkedInStoriesEmbed'),
  { ssr: false },
);

export type { HomePageContentData } from '@/data/homeContent';

interface HomePageContentProps {
  content: HomePageContentData;
}

/** Bold standalone "DX" for brand emphasis in CMS plain-text copy. */
const renderWithDxBrand = (text: string) =>
  text.split(/(DX)/g).map((part, index) =>
    part === 'DX' ? <strong key={index}>DX</strong> : part,
  );

const HomePageContent: React.FC<HomePageContentProps> = ({ content }) => {
  const router = useRouter();
  const {
    sliderItems,
    socialLinks,
    interactiveButton,
    redefiningHome,
    bringYourDesigns,
    exploreLimitless,
    ourProject,
    spaceRealisation,
    optimizeDesign,
    heroPosterUrl,
    faqItems = [],
    articles = [],
  } = content;
  const homepageFaqs = faqItems.slice(0, HOMEPAGE_FAQ_LIMIT);
  const homepageArticles = getLatestArticles(articles, HOMEPAGE_ARTICLES_LIMIT);

  const navigateToPath = (path: string) => {
    const win = window as Window & { navigateWithTransition?: (path: string) => void };

    if (win.navigateWithTransition) {
      win.navigateWithTransition(path);
    } else {
      router.push(path);
    }
  };

  useLayoutEffect(() => {
    preparePageAnimationElements();
  }, []);

  usePageAnimations(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const heroSection = document.querySelector('.homepage-section');

    const resetTimer = setTimeout(() => {
      const textSplitElements = document.querySelectorAll('[data-animation="text-split"]');
      textSplitElements.forEach((element) => {
        const isInHeroSection = heroSection && heroSection.contains(element);
        if (!isInHeroSection) {
          hideAnimatedElementForEntrance(element, { overwrite: true });
        }
      });

      const fadeElements = document.querySelectorAll('[data-animation="fade"]');
      fadeElements.forEach((element) => {
        const isInHeroSection = heroSection && heroSection.contains(element);
        if (!isInHeroSection) {
          hideAnimatedElementForEntrance(element, { overwrite: true });
        }
      });
    }, 500);

    return () => clearTimeout(resetTimer);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const animatedElements = document.querySelectorAll('[data-animation]');
    const heroSection = document.querySelector('.homepage-section');

    animatedElements.forEach((element) => {
      const animationType = element.getAttribute('data-animation') || 'fade';
      const isInHeroSection = heroSection && heroSection.contains(element);

      if ((animationType === 'text-split' || animationType === 'fade') && !isInHeroSection) {
        hideAnimatedElementForEntrance(element, { overwrite: true });
      } else {
        hideAnimatedElementForEntrance(element);
      }
    });

    const timer = setTimeout(() => {
      animationController.initScrollAnimations();
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Homepage return navigation is covered by SiteShell PreloadLogo.
  // Do not run usePageTransition here — a second white wipe caused the
  // banner/Vimeo flash after the preload logo exited.

  // Brief scroll lock during homepage entrance animations.
  // PreloadLogo always clears overflow on exit (does not restore a prior
  // overflow:hidden), so this cannot leave the page permanently unscrollable.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const showScrollbarTimeout = window.setTimeout(() => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }, 2800);

    return () => {
      window.clearTimeout(showScrollbarTimeout);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const sliderItems = document.querySelectorAll('.text-slider-item');
    const dots = document.querySelectorAll('.slider-dot');
    const progressFill = document.getElementById('sliderProgress');
    let currentSlide = 0;
    let slideTimeout: ReturnType<typeof setTimeout>;
    let progressInterval: ReturnType<typeof setInterval>;
    let isAnimating = false;
    const slideDuration = 6000;

    if (sliderItems.length === 0) return;

    gsap.set(sliderItems, { opacity: 0, x: -50, zIndex: 40 });
    gsap.set(sliderItems[0], { opacity: 1, x: 0, zIndex: 50 });

    const updateProgress = (progress: number) => {
      if (progressFill) {
        progressFill.style.width = `${progress}%`;
      }
    };

    const startProgress = () => {
      if (progressInterval) clearInterval(progressInterval);

      let progress = 0;
      const increment = 100 / (slideDuration / 50);

      progressInterval = setInterval(() => {
        progress += increment;
        updateProgress(Math.min(progress, 100));

        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 50);
    };

    const resetProgress = () => {
      if (progressInterval) clearInterval(progressInterval);
      updateProgress(0);
    };

    const goToSlide = (index: number) => {
      if (isAnimating) return;

      isAnimating = true;
      resetProgress();

      gsap.to(sliderItems[currentSlide], {
        opacity: 0,
        x: 50,
        zIndex: 40,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.set(sliderItems[index], { x: -50, opacity: 0, zIndex: 40 });

      gsap.to(sliderItems[index], {
        zIndex: 50,
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.3,
        onComplete: () => {
          isAnimating = false;
        },
      });

      startProgress();

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      currentSlide = index;
    };

    const scheduleNextSlide = () => {
      clearTimeout(slideTimeout);
      slideTimeout = setTimeout(() => {
        if (!document.hidden && !isAnimating) {
          const nextSlide = (currentSlide + 1) % sliderItems.length;
          goToSlide(nextSlide);
          scheduleNextSlide();
        }
      }, slideDuration);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(slideTimeout);
        if (progressInterval) clearInterval(progressInterval);
      } else {
        scheduleNextSlide();
        startProgress();
      }
    };

    const handleFocus = () => {
      if (!document.hidden) {
        scheduleNextSlide();
        startProgress();
      }
    };

    const handleBlur = () => {
      clearTimeout(slideTimeout);
      if (progressInterval) clearInterval(progressInterval);
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearTimeout(slideTimeout);
        goToSlide(index);
        scheduleNextSlide();
      });
    });

    scheduleNextSlide();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    startProgress();

    return () => {
      clearTimeout(slideTimeout);
      if (progressInterval) clearInterval(progressInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const trackLocalAnalytics = () => {
    try {
      const analyticsData = {
        timestamp: new Date().toISOString(),
        action: 'pixel_streaming_accessed',
        source: 'dxliving_website',
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      const existingAnalytics = JSON.parse(localStorage.getItem('dxliving_analytics') || '[]');
      existingAnalytics.push(analyticsData);

      if (existingAnalytics.length > 100) {
        existingAnalytics.splice(0, existingAnalytics.length - 100);
      }

      localStorage.setItem('dxliving_analytics', JSON.stringify(existingAnalytics));
    } catch {
      // Silent fail for local tracking
    }
  };

  const sendPixelStreamingAnalytics = async () => {
    trackLocalAnalytics();

    try {
      const response = await fetch(
        'https://0scqwj8066.execute-api.ap-southeast-2.amazonaws.com/dprod/send-message',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            action: 'pixel_streaming_accessed',
            source: 'dxliving_website',
          }),
        },
      );

      if (!response.ok) {
        await fetch(
          'https://corsproxy.io/?https://0scqwj8066.execute-api.ap-southeast-2.amazonaws.com/dprod/send-message',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              action: 'pixel_streaming_accessed',
              source: 'dxliving_website',
            }),
          },
        );
      }
    } catch {
      // Analytics failure is non-blocking
    }
  };

  const handleStartInteractive = () => {
    sendPixelStreamingAnalytics();
    navigateToPath(interactiveButton.link);
  };

  return (
    <div className="text-white relative page-content overflow-x-hidden">
      <section className="homepage-section min-h-screen relative z-20 overflow-x-hidden">
        <VimeoEmbed
          videoId={HOMEPAGE_VIMEO_ID}
          title="DX Living homepage background"
          className="absolute inset-0 z-0 scale-[4] lg:scale-[1]"
          autoplay
          loop
          muted
          controls={false}
          backgroundCover
          iframeId="mainVideo"
          registerMainVideoPlayer
          signalPageReady
          poster={heroPosterUrl}
          posterClassName="homepage-hero-poster"
          deferEmbedMs={2500}
          quality="auto"
        />

        <VideoSeekBar
          className="absolute inset-0 z-50"
          data-animation="fade"
          data-delay="3"
          data-duration="0.8"
        />

        <div
          data-animation="fade"
          data-delay="2"
          data-duration="0.8"
          className="absolute inset-0 opacity-0 z-10"
          style={{
            background:
              'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.75) 100%)',
          }}
        />

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="sr-only">
              DX Living — Immersive Home Design Australia
            </h1>
          </div>
        </div>

        <div
          className="text-slider m-auto left-4 right-4 top-[40%] lg:left-[30px] lg:right-auto lg:top-auto lg:bottom-[150px] lg:transform-none h-[300px] lg:h-[280px] w-auto max-w-[min(540px,calc(100vw-4rem))] lg:w-[540px] hidden lg:flex z-[11]"
          id="textSlider"
          data-animation="slide"
          data-direction="left"
          data-delay="2.0"
          data-duration="1.0"
        >
          {sliderItems.map((slide, index) => (
            <div key={slide.heading} className="text-slider-item" data-slide={index}>
              <h2
                className={`text-reveal heading-large${index === 0 ? ' max-w-[300px]' : ''}`}
                data-animation="text-reveal"
                data-delay="0.5"
                data-duration="1.0"
              >
                {slide.heading}
              </h2>
              <p
                className="text-reveal text-sm"
                data-animation="text-reveal"
                data-delay="0.5"
                data-duration="1.0"
              >
                {slide.content}
              </p>
              <AnimatedButton
                href={slide.buttonLink}
                dataAnimation="fade"
                dataDelay="0.1"
                dataDuration="0.8"
                className="small-btn text-white text-sm w-fit uppercase relative ml-1"
              >
                {slide.button}
              </AnimatedButton>
            </div>
          ))}

          <div className="slider-progress-container hidden lg:block">
            <div className="slider-progress-bar">
              <div className="slider-progress-fill" id="sliderProgress" />
            </div>
          </div>

          <div className="slider-dots hidden lg:flex">
            {sliderItems.map((_, index) => (
              <div
                key={index}
                className={`slider-dot${index === 0 ? ' active' : ''}`}
                data-dot={index}
              />
            ))}
          </div>
        </div>

        <div className="z-30 absolute bottom-[30px] md:bottom-12 px-4 sm:px-8 flex items-center md:justify-between justify-center w-full max-w-full">
          <div
            data-animation="slide"
            data-direction="left"
            data-delay="2.0"
            data-duration="0.8"
            aria-label="Follow Us on Our Social Media"
          >
            <SocialLinks
              links={socialLinks}
              variant="light"
              className="md:flex hidden space-x-4 social-icons-container"
            />
          </div>

          <div
            data-animation="slide"
            data-direction="right"
            data-delay="2.0"
            data-duration="0.8"
            className="text-white sm:text-sm text-xs tracking-[3px] copyright-text flex md:flex-row flex-col items-center justify-center flex-wrap"
          >
            <span>
              © {new Date().getFullYear()} <strong>DX</strong> LIVING.
            </span>{' '}
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>

        <AnimatedButton
          href={interactiveButton.link}
          onClick={handleStartInteractive}
          dataAnimation="fade"
          dataDelay="4.0"
          dataDuration="0.8"
          className="text-white text-sm absolute m-auto left-0 right-0 bottom-[110px] md:bottom-[120px] xl:bottom-[50px] z-40 w-fit"
        >
          {interactiveButton.label}
        </AnimatedButton>
      </section>

      <section className="relative z-20 py-[100px] md:py-[150px] xl:py-[200px] px-4 white-bg-section bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2
            className="heading-small overflow-hidden text-center opacity-0 secondary-color"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.0"
            data-duration="0.5"
          >
            {redefiningHome.heading}
          </h2>
          <p
            className="mb-[30px] mt-[15px] overflow-hidden text-center opacity-0 secondary-color"
            data-animation="fade"
            data-delay="0.3"
            data-duration="0.5"
          >
            {renderWithDxBrand(redefiningHome.content)}
          </p>
          <AnimatedButton
            href={redefiningHome.buttonLink}
            dataAnimation="fade"
            dataDelay="0.3"
            dataDuration="0.5"
            className="mt-[30px] text-[14px] md:text-[16px] m-auto z-50 uppercase relative white-bg w-fit"
          >
            {redefiningHome.buttonText}
          </AnimatedButton>
        </div>
      </section>

      <section className="relative z-20 px-4 white-bg-section bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2
            className="heading-small overflow-hidden text-center opacity-0 secondary-color"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.03"
            data-delay="0.0"
            data-duration="0.3"
          >
            {bringYourDesigns.heading}
          </h2>
          <p
            className="mb-[30px] mt-[15px] overflow-hidden text-center opacity-0 secondary-color"
            data-animation="fade"
            data-delay="0.3"
            data-duration="0.5"
          >
            {bringYourDesigns.content}
          </p>

          <div
            className="h-[320px] sm:h-[400px] md:h-[500px] relative overflow-hidden"
            data-animation="fade"
            data-delay="0.5"
            data-duration="1.5"
          >
            <ComparisonSlider
              leftImage={bringYourDesigns.leftImage}
              rightImage={bringYourDesigns.rightImage}
              leftCaption={bringYourDesigns.leftCaption}
              rightCaption={bringYourDesigns.rightCaption}
            />
          </div>

          <AnimatedButton
            href={bringYourDesigns.buttonLink}
            dataAnimation="fade"
            dataDelay="0.3"
            dataDuration="0.5"
            className="mt-[50px] text-[14px] md:text-[16px] m-auto z-50 uppercase relative white-bg w-fit"
          >
            {bringYourDesigns.buttonText}
          </AnimatedButton>
        </div>
      </section>

      <section className="relative z-20 py-[100px] md:py-[150px] xl:py-[200px] px-4 white-bg-section bg-white">
        <div className="max-w-[1200px] mx-auto mb-[50px]">
          <h2
            className="heading-small overflow-hidden text-center opacity-0 secondary-color"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.03"
            data-delay="0.0"
            data-duration="0.5"
          >
            {exploreLimitless.heading}
          </h2>
          <p
            className="mb-[30px] mt-[15px] overflow-hidden text-center opacity-0 secondary-color"
            data-animation="fade"
            data-delay="0.3"
            data-duration="0.5"
          >
            {exploreLimitless.content}
          </p>
        </div>

        <div
          className="max-w-[1200px] mx-auto"
          data-animation="fade"
          data-delay="0.5"
          data-duration="0.8"
          aria-label="Design potential modules"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {exploreLimitless.modules.map((module) => (
              <div
                key={`${module.subTitle}-${module.title}`}
                className="bg-[#F5F5F5] p-8 rounded-[10px] potential-box"
              >
                <p className="text-[#bfb6ad] text-[16px] uppercase">{module.subTitle}</p>
                <p className="text-[24px] secondary-color mb-4">{module.title}</p>
                <p className="secondary-color text-sm">{module.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-20 px-4 white-bg-section bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2
            className="heading-small overflow-hidden text-center opacity-0 secondary-color"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.03"
            data-delay="0.0"
            data-duration="0.5"
          >
            {ourProject.heading}
          </h2>
          <p
            className="mb-[30px] mt-[15px] overflow-hidden text-center opacity-0 secondary-color"
            data-animation="fade"
            data-delay="0.3"
            data-duration="0.5"
          >
            {ourProject.content}
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-[1200px] mx-auto"
          data-animation="fade"
          data-delay="0.5"
          data-duration="0.8"
        >
          {ourProject.videos.map((video) => (
            <VimeoEmbed
              key={video.id}
              videoId={video.id}
              title={video.title}
              className="w-auto h-auto rounded-[10px] overflow-hidden"
              lazy
            />
          ))}
        </div>
        <AnimatedButton
          href={ourProject.buttonLink}
          dataAnimation="fade"
          dataDelay="1.0"
          dataDuration="0.8"
          className="mt-[30px] text-[14px] md:text-[16px] m-auto z-50 uppercase relative white-bg w-fit"
        >
          {ourProject.buttonText}
        </AnimatedButton>
      </section>

      <section className="relative z-20 py-[100px] md:py-[150px] xl:py-[200px] px-4 white-bg-section bg-white">
        <div className="max-w-[1200px] mx-auto">
          <h2
            className="heading-small overflow-hidden text-center opacity-0 secondary-color"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.03"
            data-delay="0.0"
            data-duration="0.5"
          >
            {spaceRealisation.heading}
          </h2>
          <p
            className="mb-[30px] mt-[15px] overflow-hidden text-center opacity-0 secondary-color"
            data-animation="fade"
            data-delay="0.3"
            data-duration="0.5"
          >
            {spaceRealisation.content}
          </p>

          <div
            className="h-[320px] sm:h-[400px] md:h-[500px] relative overflow-hidden"
            data-animation="fade"
            data-delay="0.5"
            data-duration="1.5"
          >
            <ComparisonSlider
              leftImage={spaceRealisation.leftImage}
              rightImage={spaceRealisation.rightImage}
              leftCaption={spaceRealisation.leftCaption}
              rightCaption={spaceRealisation.rightCaption}
            />
          </div>

          <AnimatedButton
            href={spaceRealisation.buttonLink}
            dataAnimation="fade"
            dataDelay="0.3"
            dataDuration="0.5"
            className="mt-[30px] text-[14px] md:text-[16px] m-auto z-50 uppercase relative white-bg w-fit"
          >
            {spaceRealisation.buttonText}
          </AnimatedButton>
        </div>
      </section>

      <section className="relative z-20 px-4 white-bg-section bg-white">
        <div
          className="max-w-[1200px] mx-auto border-2 border-[#BFB6AD] rounded-[10px] overflow-hidden"
          data-animation="fade"
          data-delay="0.0"
          data-duration="0.5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[10px] overflow-hidden">
            <div className="relative bg-[#F5F5F5] min-h-[300px] md:min-h-[500px]">
              <img
                src={optimizeDesign.image}
                alt={optimizeDesign.heading}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="bg-[#F5F5F5] md:p-[60px] p-[30px]">
              <h2
                className="heading-small overflow-hidden text-center opacity-0 secondary-color"
                data-animation="text-split"
                data-split-by="words"
                data-stagger="0.03"
                data-delay="0.0"
                data-duration="0.5"
              >
                {optimizeDesign.heading}
              </h2>
              <p
                className="mb-[30px] mt-[15px] overflow-hidden text-center opacity-0 secondary-color"
                data-animation="fade"
                data-delay="0.3"
                data-duration="0.5"
              >
                {optimizeDesign.content}
              </p>

              <ul
                className="workflow-list ml-[30px] mb-[20px]"
                data-animation="fade"
                data-delay="0.5"
                data-duration="0.5"
              >
                {optimizeDesign.items.map((item) => (
                  <li key={item.title}>
                    <p className="black mx-auto md:leading-[38px] leading-[26px]">
                      <span className="font-bold">{item.title}</span> <br />
                      {item.content}
                    </p>
                  </li>
                ))}
              </ul>

              <AnimatedButton
                href={optimizeDesign.buttonLink}
                dataAnimation="fade"
                dataDelay="0.3"
                dataDuration="0.5"
                className="mt-[30px] text-[14px] md:text-[16px] m-auto z-50 uppercase relative white-bg w-fit"
              >
                {optimizeDesign.buttonText}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      {homepageFaqs.length > 0 ? (
        <section
          className="relative z-20 bg-white pt-[50px] md:pt-[200px] pb-[50px] white-bg-section overflow-hidden scroll-m-[150px]"
          id="section-faq"
          aria-labelledby="homepage-faq-heading"
        >
          <div
            className="max-w-[920px] mx-auto px-8 text-center"
            data-animation="fade"
            data-delay="0.0"
            data-duration="0.5"
          >
            <h2
              id="homepage-faq-heading"
              className="heading-small mb-8 md:mb-10 secondary-color"
              data-animation="fade"
              data-delay="0.2"
              data-duration="0.5"
            >
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <p
              className="text-[#6A758C] leading-relaxed max-w-[720px] mx-auto mb-10 md:mb-12"
              data-animation="fade"
              data-delay="0.3"
              data-duration="0.5"
            >
              {faqIntro}
            </p>

            <div data-animation="fade" data-delay="0.4" data-duration="0.5">
              <FaqAccordion items={homepageFaqs} openFirst />
            </div>

            <AnimatedButton
              href="/faq"
              dataAnimation="fade"
              dataDelay="0.5"
              dataDuration="0.5"
              className="mt-10 md:mt-12 text-[14px] md:text-[16px] m-auto z-50 uppercase relative white-bg w-fit"
            >
              Learn More
            </AnimatedButton>
          </div>
        </section>
      ) : null}

      {homepageArticles.length > 0 ? (
        <section
          className="relative z-20 bg-white pt-[50px] md:pt-[150px] pb-[50px] white-bg-section overflow-hidden scroll-m-[150px] px-8"
          id="section-articles"
          aria-label="Recent articles"
        >
          <div className="max-w-[1200px] mx-auto">
            <RecentArticles
              articles={homepageArticles}
              onNavigate={navigateToPath}
              slidesPerView={2}
              className=""
              headingClassName="heading-small text-center mb-12 uppercase secondary-color"
            />
            <div className="flex justify-center">
              <AnimatedButton
                href="/articles"
                dataAnimation="fade"
                dataDelay="0.5"
                dataDuration="0.5"
                className="mt-4 md:mt-8 text-[14px] md:text-[16px] z-50 uppercase relative white-bg w-fit"
              >
                View All Articles
              </AnimatedButton>
            </div>
          </div>
        </section>
      ) : null}

      <section
        className="relative z-20 bg-white py-[50px] md:py-[150px] white-bg-section overflow-hidden scroll-m-[150px]"
        id="section-4"
      >
        <div
          className="max-w-[1200px] mx-auto text-center"
          data-animation="fade"
          data-delay="0.0"
          data-duration="0.5"
        >
          <h2
            className="heading-small mb-[50px] secondary-color"
            data-animation="fade"
            data-delay="0.3"
            data-duration="0.5"
          >
            Our LinkedIn Stories
          </h2>
          <LinkedInStoriesEmbed />
        </div>
      </section>
    </div>
  );
};

export default HomePageContent;

'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedButton from '@/components/ui/AnimatedButton';
import VimeoEmbed from '@/components/ui/VimeoEmbed';
import type { Project } from '@/data/projects';
import { getProjectPath } from '@/data/projects';
import {
  useAutoScroll,
  usePageAnimations,
  usePageTransition,
  hideAnimatedElementForEntrance,
  prefersReducedMotion,
  revealAllAnimatedElements
} from '@/lib/utils/animations';
import { useScrollToTop } from '@/lib/utils/scrollToTop';

gsap.registerPlugin(ScrollTrigger);

interface ProjectDetailPageContentProps {
  project: Project;
  projects: Project[];
}

const ProjectDetailPageContent: React.FC<ProjectDetailPageContentProps> = ({
  project,
  projects,
}) => {
  const { videos } = project;
  const pathname = usePathname();
  const router = useRouter();

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

  useScrollToTop();

  usePageAnimations(false);

  usePageTransition('dynamic', '/images/whiteBanner.jpg', {
    slideDuration: 1.8,
    slideDelay: 0,
    fadeDelay: 0.8,
    fadeDuration: 1.8,
    backgroundPosition: 'center 11.5%',
    // Direct URL loads skip the wipe — it fights intro/preload and breaks Vimeo autoplay.
    skipOnInitialLoad: true,
    transitionType: 'fade',
    dynamicDirections: {
      toHomepage: 'top',
      fromHomepage: 'bottom',
      betweenPages: 'right',
    },
  })

  useAutoScroll(0.5, 8000, 10, 1.5, 'power2.out', {
    showScrollArrow: true,
  });

  useEffect(() => {
    if (prefersReducedMotion()) {
      revealAllAnimatedElements();
      return;
    }

    const animatedElements = document.querySelectorAll('[data-animation]');

    animatedElements.forEach((element) => {
      const animationType = element.getAttribute('data-animation') || 'fade';
      const delay = parseFloat(element.getAttribute('data-delay') || '0');
      const duration = parseFloat(element.getAttribute('data-duration') || '0.8');
      const direction = element.getAttribute('data-direction') || 'left';
      const start = element.getAttribute('data-start') || 'top 80%';

      hideAnimatedElementForEntrance(element);

      ScrollTrigger.create({
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
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [project.slug]);

  const otherProjects = projects.filter((item) => item.slug !== project.slug);

  const technologiesClassName = project.alignTechnologiesEnd ? 'max-w-[400px] text-right' : '';
  const heroTitleClassName = project.centerHeroOnMobile ? 'md:text-left text-center' : '';

  return (
    <div className="min-h-screen page-content">
      <section className="mx-auto px-4 py-16 lg:h-screen h-[calc(65vh)] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden banner-section">
        <div
          className="absolute inset-0 w-full lg:h-full h-[calc(65vh)] -z-10 overflow-hidden md:scale-200 scale-100 lg:scale-110"
          data-parallax="fix"
          data-speed="0.5"
        >
          <VimeoEmbed
            videoId={videos.hero}
            title="Walk Through Your Custom Home | DX LIVING"
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
            backgroundImage: `url(${project.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="absolute inset-0 bg-black bg-opacity-30 z-10" />

        <div
          className={`absolute z-20 text-white top-50 bottom-50 m-auto left-50 md:bottom-10 md:left-8 mb-4 ${heroTitleClassName}`}
          tabIndex={1}
          aria-label={project.title}
        >
          <h1
            className={`text-reveal heading-large ${heroTitleClassName}`}
            data-animation="text-reveal"
            data-delay="0.5"
            data-duration="1.0"
          >
            {project.title}
          </h1>
        </div>
      </section>

      <section
        className="max-w-[1700px] mx-auto py-[100px] md:py-[150px] xl:py-[200px] px-8 flex xl:items-center justify-center overflow-hidden banner-section white-bg-section"
        data-animation="fade"
        data-delay="0.2"
        data-duration="1.0"
      >
        <div className="text__block gallery__anim w-full max-w-[600px]">
          <div className="flex divider-b mt-[-35px]">
            <div
              className="flex flex-row justify-between w-full"
              tabIndex={1}
              aria-label={`Location: ${project.location}, ${project.state}`}
            >
              <h3 className="primary-color">Location</h3>
              <h4>
                {project.location}, {project.state}
              </h4>
            </div>
          </div>
          <div className="flex divider-b">
            <div
              className="flex flex-row justify-between w-full"
              tabIndex={1}
              aria-label={`Timeframe: ${project.timeframe}`}
            >
              <h3 className="primary-color">Timeframe</h3>
              <h4>{project.timeframe}</h4>
            </div>
          </div>
          <div className="flex divider-b">
            <div
              className="flex flex-row justify-between w-full"
              tabIndex={1}
              aria-label={`Technologies: ${project.technologies}`}
            >
              <h3 className="primary-color">Technologies</h3>
              <h4 className={technologiesClassName}>{project.technologies}</h4>
            </div>
          </div>
        </div>
      </section>

      <section
        className="video-scroll-container p-8 py-0 white-bg-section"
        data-animation="video-play"
        data-start="top center"
        data-pin="false"
        data-scroll-distance="1000"
      >
        <div
          className="text-center rounded-[20px] overflow-hidden h-auto max-w-[1400px] aspect-[16/8]"
          data-animation="fade"
          data-delay="0.2"
          data-duration="1.0"
          tabIndex={1}
          aria-label="video"
        >
          <VimeoEmbed
            videoId={videos.primary}
            title="Choose Materials & Finishes Confidently | DX LIVING"
            className="w-auto h-auto overflow-hidden"
            stretch
            lazy
          />
        </div>
      </section>

      <section
        className="bg-white p-16 py-[100px] md:py-[150px] xl:py-[200px] white-bg-section"
        data-animation="fade"
        data-delay="0.2"
        data-duration="1.0"
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p
            className="mb-[30px] black max-w-[1000px] mx-auto font-semibold leading-[38px]"
            data-animation="fade"
            data-delay="0.6"
            data-duration="1.0"
            tabIndex={1}
            aria-label={`Description: ${project.description}`}
          >
            {project.description}
          </p>
        </div>
      </section>

      <section
        className="gallery scroll-trigger white-bg-section pb-[100px] lg:pb-[200px]"
        data-animation="gallery"
        data-start="top 700"
        data-end="top 200"
        data-scrub="true"
      >
        <div className="gallery__grid px-8 flex-col xl:flex-row">
          <div className="gallery__left" data-speed=".9" style={{ flex: '0 0 35%' }}>
            <div className="gallery__item">
              <div className="w-full h-full gallery__anim">
                <VimeoEmbed
                  videoId={videos.galleryLeft}
                  title="Smarter Sleep with Better Design | DX LIVING"
                  className="w-auto h-auto rounded-[20px] overflow-hidden"
                  lazy
                />
              </div>
            </div>
          </div>
          <div className="gallery__right" data-speed="1.1" style={{ flex: '0 0 63%' }}>
            <div className="gallery__item">
              <div className="w-full h-full gallery__anim">
                <VimeoEmbed
                  videoId={videos.galleryRight}
                  title="Better Design, Better Living | DX Living"
                  className="w-auto h-auto rounded-[20px] overflow-hidden"
                  lazy
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="video-scroll-container py-[200px] px-0 md:px-8 pt-0 pb-[120px] white-bg-section"
        data-animation="video-play"
        data-start="top center"
        data-pin="false"
        data-scroll-distance="1000"
      >
        <div className="mx-auto text-center rounded-[0px] md:rounded-[20px] overflow-hidden h-auto aspect-[16/9] lg:aspect-[16/7]">
          <VimeoEmbed
            videoId={videos.fullWidth}
            title="Bright, Light-Filled Luxury Homes | DX LIVING"
            className="w-auto h-auto overflow-hidden"
            lazy
          />
        </div>
      </section>

      <section className="hidden xl:block">
        <div
          className="img-carousel my-[80px] white-bg-section overflow-hidden gap-10"
          data-animation="image-carousel"
          data-start="center center"
          data-pin="true"
          data-scrub="true"
          data-gap="16"
        >
          {videos.carousel.map((videoId) => (
            <div
              key={videoId}
              className="h-[calc(100vh-100px)] overflow-hidden flex-shrink-0 carousel-item ml-[40px]"
              style={{ width: 'auto', minWidth: '81%', maxWidth: '500px' }}
            >
              <VimeoEmbed
                videoId={videoId}
                title="See Your Future Home Clearly | DX LIVING"
                className="w-full h-full rounded-[20px] overflow-hidden"
                autoplay
                loop
                controls={false}
                muted
                stretch
                lazy
              />
            </div>
          ))}
        </div>
      </section>

      <section
        className="gallery scroll-trigger white-bg-section md:pb-[100px] lg:pb-[200px] xl:hidden"
        data-animation="gallery"
        data-start="top 700"
        data-end="top 200"
        data-scrub="true"
      >
        <div className="gallery__grid px-8 flex-col xl:flex-row">
          <div className="gallery__left" data-speed=".9" style={{ flex: '0 0 35%' }}>
            <div className="gallery__item">
              <div className="w-full h-full gallery__anim mb-[40px]">
                <VimeoEmbed
                  videoId={videos.carousel[0]}
                  title="See Your Future Home Clearly | DX LIVING"
                  className="w-auto h-auto rounded-[20px] overflow-hidden"
                  lazy
                />
              </div>
              <div className="w-full h-full gallery__anim">
                <VimeoEmbed
                  videoId={videos.carousel[1]}
                  title="Master Your Off-Plan Decision | DX LIVING"
                  className="w-auto h-auto rounded-[20px] overflow-hidden"
                  lazy
                />
              </div>
            </div>
          </div>
          <div className="gallery__right" data-speed="1.1" style={{ flex: '0 0 63%' }}>
            <div className="gallery__item">
              <div className="w-full h-full gallery__anim">
                <VimeoEmbed
                  videoId={videos.carousel[2]}
                  title="Perfect Materials, Perfect Lighting | DX LIVING"
                  className="w-auto h-auto rounded-[20px] overflow-hidden"
                  lazy
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pt-[100px] pb-[100px] lg:pb-[200px]">
        <div className="px-8">
          <h2
            className="heading-small secondary-color mb-8 text-center md:text-left"
            tabIndex={1}
            aria-label="Related projects"
          >
            Related projects
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {otherProjects.map((otherProject) => {
              const href = getProjectPath(otherProject.slug);

              return (
                <a
                  key={otherProject.slug}
                  href={href}
                  className="block cursor-pointer"
                  aria-label={`${otherProject.title}, ${otherProject.location}, ${otherProject.state}`}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    handleNavigation(href);
                  }}
                >
                  <VimeoEmbed
                    videoId={otherProject.video}
                    title={otherProject.featuredTitle || otherProject.title}
                    className="w-auto h-auto overflow-hidden rounded-[20px] pointer-events-none"
                    lazy
                  />
                  <h3 className="heading-small secondary-color mt-4 text-center lg:text-left">
                    {otherProject.title}
                  </h3>
                  <h4 className="primary-color font-semibold uppercase text-center lg:text-left">
                    {otherProject.location}
                  </h4>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto px-4 py-16 md:h-[600px] h-[450px] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden cta-section z-30">
        <div className="absolute inset-0 w-full md:h-[100vh] h-[450px] -z-10 overflow-hidden scale-110 md:top-[-40%] top-[0%]">
          <VimeoEmbed
            videoId="1117308030"
            title="Get Expert Design Guidance | DX LIVING"
            className="w-full h-full"
            autoplay
            loop
            controls={false}
            muted
            parallax
            stretch
            lazy
          />
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

        <div className="relative z-20 flex flex-col items-center justify-center">
          <div className="max-w-[1200px] mx-auto text-center">
            <h2
              className="heading-small text-white overflow-hidden text-center opacity-0"
              data-animation="text-split"
              data-split-by="words"
              data-stagger="0.05"
              data-delay="0.5"
              data-duration="0.5"
            >
              BRING YOUR DREAM HOME TO LIFE WITH OUR EXPERT TEAM TODAY
            </h2>
            <p
              className="text-white mb-[30px] mt-[15px] overflow-hidden text-center opacity-0"
              data-animation="text-split"
              data-split-by="words"
              data-stagger="0.02"
              data-delay="1.5"
              data-duration="0.5"
            >
              Collaborate with our specialists to design, visualise, and experience your project
              before it&apos;s built.
            </p>
          </div>
          <AnimatedButton
            onClick={() => handleNavigation('/contact')}
            dataAnimation="fade"
            dataDelay="3.0"
            dataDuration="0.8"
            className="mt-[30px] text-sm m-auto z-50 uppercase relative"
          >
            CONNECT WITH DX LIVING
          </AnimatedButton>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPageContent;

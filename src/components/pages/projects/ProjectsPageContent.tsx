'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import AnchorMenu from '@/components/ui/AnchorMenu';
import AnimatedButton from '@/components/ui/AnimatedButton';
import LinkedInStoriesEmbed from '@/components/ui/LinkedInStoriesEmbed';
import VimeoEmbed from '@/components/ui/VimeoEmbed';
import { cmsHtml as html, cmsPlainText as plainText } from '@/lib/cms/sanitizeHtml'
import type { Project } from '@/data/projects'
import { getProjectPath } from '@/data/projects'
import type { ProjectsPageContentData } from '@/lib/projects/types'
import { useAutoScroll, usePageAnimations, usePageTransition } from '@/lib/utils/animations'
import { useScrollToTop } from '@/lib/utils/scrollToTop'

const INITIAL_VISIBLE_COUNT = 6

interface ProjectsPageContentProps {
  content: ProjectsPageContentData
  projects: Project[]
}

const ProjectsPageContent: React.FC<ProjectsPageContentProps> = ({ content, projects }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [visibleProjectCount, setVisibleProjectCount] = useState(INITIAL_VISIBLE_COUNT)

  const sections =
    content.anchorMenu?.length > 0
      ? content.anchorMenu
      : [
          { id: 'intro', label: 'Introduction' },
          { id: 'section-1', label: 'Our Projects' },
          { id: 'section-4', label: 'LinkedIn Stories' },
          { id: 'contact-us', label: 'Contact Us' },
        ]

  const handleNavigation = (path: string) => {
    if (path === pathname) return

    const win = window as Window & { navigateWithTransition?: (targetPath: string) => void }
    if (/^https?:\/\//i.test(path)) {
      window.location.href = path
      return
    }

    if (win.navigateWithTransition) {
      win.navigateWithTransition(path)
    } else {
      router.push(path)
    }
  }

  useScrollToTop()

  useAutoScroll(0.65, 8000, 10, 1.5, 'power2.out', {
    showScrollArrow: true,
  })

  usePageAnimations(false)

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

  const displayedProjects = projects.slice(0, visibleProjectCount);
  const hasMoreProjects = projects.length > visibleProjectCount;

  useEffect(() => {
    if (visibleProjectCount <= INITIAL_VISIBLE_COUNT) return;

    const timer = setTimeout(() => {
      const allProjectCards = document.querySelectorAll('[data-animation="fade"]');
      const previousCount = Math.max(INITIAL_VISIBLE_COUNT, visibleProjectCount - 3);
      const newProjectCards = Array.from(allProjectCards).slice(previousCount);

      gsap.to(newProjectCards, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [visibleProjectCount]);

  const renderProjectCard = (project: Project, index: number, isFullWidth: boolean) => {
    const href = getProjectPath(project.slug);

    return (
    <a
      key={project.slug}
      href={href}
      className="block bg-white/10 backdrop-blur-sm rounded-[20px] overflow-hidden opacity-0 cursor-pointer hover:bg-white/20"
      aria-label={project.title}
      data-animation="fade"
      data-delay={0.2 + index * 0.2}
      data-duration="0.8"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        handleNavigation(href);
      }}
    >
      <div className="relative aspect-video bg-gray-800 rounded-t-[15px] h-[300px] sm:h-[400px] lg:h-[calc(100vh-200px)] w-[100%] mb-6 overflow-hidden">
        {project.video ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none hover:scale-105 transition-all duration-300">
            <VimeoEmbed
              videoId={project.video}
              title={project.featuredTitle || project.title}
              className="w-full h-full scale-110 pointer-events-none"
              autoplay
              loop
              controls={false}
              muted
              parallax
              stretch
              lazy
            />
          </div>
        ) : (
          <Image
            className={`w-full h-full object-cover ${isFullWidth ? 'h-[300px] sm:h-[400px] lg:h-[calc(100vh-200px)]' : 'h-[300px] sm:h-[400px] lg:h-[calc(100vh-200px)]'}`}
            src={project.image}
            alt={`${project.title} Project`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}
        <div
          className={`${isFullWidth ? 'bottom-0 h-[100px] via-white/80' : 'bottom-[0px] h-[120px] via-white/95'} absolute left-0 right-0 bg-gradient-to-t from-white to-transparent backdrop-blur-sm backdrop-opacity-60`}
        />
      </div>
      <div className="flex flex-col relative z-10 mt-[-75px] px-4">
        <div className="overflow-hidden" tabIndex={1} aria-label={project.title}>
          <h3
            className={`scroll-trigger heading-small secondary-color mb-1 tracking-[2px] ${isFullWidth ? 'text-center lg:text-left' : 'text-center'}`}
            data-animation="slide"
            data-direction="bottom"
            data-delay="0.2"
            data-duration="0.8"
            data-start="top 99%"
          >
            {project.title}
          </h3>
        </div>

        <div
          className={`${isFullWidth ? 'flex justify-between items-center flex-col lg:flex-row' : 'mb-4'}`}
          data-animation="slide"
          data-direction="bottom"
          data-delay="0.5"
          data-duration="0.8"
          data-start="top 100%"
        >
          <div className="mb-4">
            <h4
              className={`primary-color uppercase flex flex-row items-center justify-center ${isFullWidth ? 'text-left' : 'text-center'}`}
              tabIndex={1}
            >
              {isFullWidth ? (
                `${project.location}, ${project.state}`
              ) : (
                <>
                  {project.location}
                  <span className="block lg:hidden">, {project.state}</span>
                </>
              )}
            </h4>
          </div>

          {isFullWidth ? (
            <div className="flex flex-row gap-[100px] mb-6">
              <div
                className="flex flex-col lg:flex-row gap-[0px] lg:gap-2 text-[10px] lg:text-base"
                tabIndex={1}
                aria-label={`Timeframe: ${project.timeframe}`}
              >
                <span className="primary-color">Timeframe:</span>
                <p className="black">{project.timeframe}</p>
              </div>
              <div
                className="flex flex-col lg:flex-row gap-[0px] lg:gap-2 text-[10px] lg:text-base"
                tabIndex={1}
                aria-label={`Technologies: ${project.technologies}`}
              >
                <span className="primary-color">Technologies:</span>
                <p className="black">{project.technologies}</p>
              </div>
            </div>
          ) : (
            <div className="flex lg:hidden flex-row gap-[100px] mb-6 md:items-center md:justify-center">
              <div
                className="flex flex-col lg:flex-row gap-[0px] lg:gap-2 text-[10px] lg:text-base"
                tabIndex={1}
                aria-label={`Timeframe: ${project.timeframe}`}
              >
                <span className="primary-color">Timeframe:</span>
                <p className="black">{project.timeframe}</p>
              </div>
              <div
                className="flex flex-col lg:flex-row gap-[0px] lg:gap-2 text-[10px] lg:text-base"
                tabIndex={1}
                aria-label={`Technologies: ${project.technologies}`}
              >
                <span className="primary-color">Technologies:</span>
                <p className="black">{project.technologies}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </a>
    );
  };

  const buildProjectLayout = () => {
    const layoutElements: React.ReactNode[] = [];

    for (let i = 0; i < displayedProjects.length; i++) {
      const project = displayedProjects[i];
      const isFullWidth = i % 3 === 0;

      if (isFullWidth) {
        layoutElements.push(
          <div key={project.title} className="w-full">
            {renderProjectCard(project, i, true)}
          </div>,
        );
      } else {
        const nextProject = displayedProjects[i + 1];
        const isFirstInPair = i % 3 === 1;

        if (isFirstInPair && nextProject) {
          layoutElements.push(
            <div key={`pair-${i}`} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {renderProjectCard(project, i, false)}
              {renderProjectCard(nextProject, i + 1, false)}
            </div>,
          );
          i += 1;
        } else if (isFirstInPair && !nextProject) {
          layoutElements.push(
            <div key={project.title} className="w-full">
              {renderProjectCard(project, i, true)}
            </div>,
          );
        }
      }
    }

    return layoutElements;
  };

  return (
    <div className="min-h-screen page-content">
      <AnchorMenu sections={sections} />

      <section className="mx-auto px-4 py-16 lg:h-screen h-[calc(65vh)] z-40 bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden banner-section">
        <div
          className="absolute inset-0 w-full lg:h-full h-[calc(65vh)] -z-10 overflow-hidden md:scale-200 scale-100 lg:scale-110"
          data-parallax="fix"
          data-speed="0.5"
        >
          <VimeoEmbed
            videoId={content.banner.vimeoBackgroundVideo}
            title="Designing with Certainty | DX LIVING"
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
            backgroundImage: "url('/images/projectBanner.jpg')",
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

      <section
        className="bg-white p-8 py-[100px] lg:py-[200px] white-bg-section" id="intro"
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p
            className="mb-[30px] black max-w-[1000px] mx-auto font-semibold leading-[38px]"
            data-animation="fade"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
            aria-label={plainText(content.introduction)}
            dangerouslySetInnerHTML={html(content.introduction)}
          />
        </div>
      </section>

      <section className="scroll-trigger scroll-m-[80px]" id="section-1">
        <div>
          <div className="space-y-8 px-8" data-animation="fade" data-delay="0.5" data-duration="0.5">
            {displayedProjects.length > 0 ? (
              buildProjectLayout()
            ) : (
              <div className="text-center text-white">
                <p>No projects available at the moment.</p>
              </div>
            )}
          </div>

          {hasMoreProjects && (
            <div className="text-center mt-12" data-animation="fade" data-delay="0.8" data-duration="0.8">
              <AnimatedButton
                onClick={() => {
                  setVisibleProjectCount(Math.min(visibleProjectCount + 3, projects.length));
                }}
                dataAnimation="fade"
                dataDelay="0.0"
                dataDuration="0.5"
                className="white-bg text-sm uppercase m-auto relative"
              >
                View More
              </AnimatedButton>
            </div>
          )}
        </div>
      </section>

      <section
        className="bg-white pb-[50px] md:pb-[150px] white-bg-section overflow-hidden scroll-m-[150px] mt-[100px] lg:mt-[200px]"
        data-animation="fade"
        data-delay="1.0"
        data-duration="1.0"
        id="section-4"
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <h2
            className="heading-small mb-[50px] secondary-color"
            data-animation="fade"
            data-delay="0.6"
            data-duration="1.2"
            tabIndex={1}
          >
            Our LinkedIn Stories
          </h2>
          <LinkedInStoriesEmbed />
        </div>
      </section>

      <section
        className="mx-auto px-4 py-16 md:h-[600px] h-[450px] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden cta-section z-30"
        id="contact-us"
      >
        <div className="absolute inset-0 w-full md:h-[100vh] h-[450px] -z-10 overflow-hidden md:scale-110 scale-100 md:top-[-40%] top-[0%]">
          <VimeoEmbed
            videoId={content.cta.videoBackground}
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
              data-delay="0.0"
              data-duration="0.5"
              dangerouslySetInnerHTML={html(content.cta.heading)}
            />
            <p
              className="text-white mb-[30px] mt-[15px] overflow-hidden text-center opacity-0"
              data-animation="text-split"
              data-split-by="words"
              data-stagger="0.02"
              data-delay="0.5"
              data-duration="0.5"
              dangerouslySetInnerHTML={html(content.cta.content)}
            />
          </div>
          <AnimatedButton
            onClick={() => handleNavigation(content.cta.buttonLink)}
            dataAnimation="fade"
            dataDelay="1.0"
            dataDuration="0.5"
            className="mt-[30px] text-sm m-auto z-50 uppercase relative"
          >
            <b dangerouslySetInnerHTML={html(content.cta.button)} />
          </AnimatedButton>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPageContent;

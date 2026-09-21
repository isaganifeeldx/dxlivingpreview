'use client'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnchorMenu from '@/components/ui/AnchorMenu'
import AnimatedButton from '@/components/ui/AnimatedButton'
import VimeoEmbed from '@/components/ui/VimeoEmbed'
import {
  cmsHtml as html,
  cmsPlainText as plainText,
} from '@/lib/cms/sanitizeHtml'
import type { ModulesPageModuleCard } from '@/lib/modules/types'
import type { ModelPageContentData } from '@/lib/model/types'
import {
  moduleColumnsWithDataAttributes,
  useAutoScroll,
  usePageAnimations,
  usePageTransition,
  hideAnimatedElementForEntrance,
  prefersReducedMotion,
  revealAllAnimatedElements,
} from '@/lib/utils/animations'
import { useScrollToTop } from '@/lib/utils/scrollToTop'

gsap.registerPlugin(ScrollTrigger)

interface ModelPageContentProps {
  content: ModelPageContentData
  moduleCards: ModulesPageModuleCard[]
}

const ModelPageContent: React.FC<ModelPageContentProps> = ({ content, moduleCards }) => {
  const pathname = usePathname()
  const router = useRouter()

  const sections =
    content.anchorMenu?.length > 0
      ? content.anchorMenu
      : [
          { id: 'intro', label: 'Introduction' },
          { id: 'section-1', label: 'Video' },
          { id: 'section-2', label: 'Features' },
          { id: 'section-6', label: 'Other Modules' },
          { id: 'section-7', label: 'Book a Call' },
          { id: 'contact-us', label: 'Contact Us' },
        ]

  const handleNavigation = (path: string) => {
    if (path === pathname) return
    const win = window as Window & { navigateWithTransition?: (targetPath: string) => void }
    if (win.navigateWithTransition) {
      win.navigateWithTransition(path)
    } else {
      router.push(path)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, path: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleNavigation(path)
    }
  }

  useScrollToTop()
  useAutoScroll(0.65, 10000, 10, 1.5, 'power2.out', { showScrollArrow: true })
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
    dynamicDirections: { toHomepage: 'top', fromHomepage: 'bottom', betweenPages: 'right' },
  })

  useEffect(() => {
    if (prefersReducedMotion()) {
      revealAllAnimatedElements()
      return
    }

    const animatedElements = document.querySelectorAll('[data-animation]')
    const triggers: ScrollTrigger[] = []

    animatedElements.forEach((element) => {
      const animationType = element.getAttribute('data-animation') || 'fade'
      const delay = parseFloat(element.getAttribute('data-delay') || '0')
      const duration = parseFloat(element.getAttribute('data-duration') || '0.8')
      const start = element.getAttribute('data-start') || 'top 80%'

      hideAnimatedElementForEntrance(element)

      const trigger = ScrollTrigger.create({
        trigger: element,
        start,
        once: true,
        onEnter: () => {
          if (animationType === 'fade') {
            gsap.to(element, { opacity: 1, duration, delay, ease: 'power2.out' })
          } else if (animationType === 'slide') {
            gsap.to(element, { x: 0, y: 0, opacity: 1, duration, delay, ease: 'power2.out' })
          }
        },
      })

      triggers.push(trigger)
    })

    const modulesContainer = document.querySelector('#modules-section')
    const cleanupModuleColumns = modulesContainer
      ? moduleColumnsWithDataAttributes(modulesContainer as HTMLElement, moduleCards)
      : undefined

    return () => {
      triggers.forEach((trigger) => trigger.kill())
      cleanupModuleColumns?.()
    }
  }, [moduleCards])

  return (
    <div className="min-h-screen page-content">
      <AnchorMenu sections={sections} />

      <section className="mx-auto px-4 py-16 lg:h-screen h-[calc(65vh)] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden banner-section">
        <div
          className="absolute inset-0 w-full lg:h-full h-[calc(65vh)] -z-10 overflow-hidden md:scale-200 scale-100 lg:scale-110"
          data-parallax="false"
          data-speed="0.5"
        >
          <VimeoEmbed
            videoId={content.banner.vimeoBackgroundVideo}
            title="Experience Your Dream Home | DX Model"
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
          data-parallax="false"
          style={{
            backgroundImage: "url('/images/whiteBanner.jpg')",
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
        className="scroll-trigger pt-[100px] md:pt-[150px] xl:pt-[200px] pb-[50px] md:pb-[100px] px-8 white-bg-section"
        id="intro"
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <p
            className="mb-[100px] md:mb-[200px] black font-semibold leading-[38px]"
            data-animation="fade"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
            dangerouslySetInnerHTML={html(content.introduction.heading)}
          />
        </div>
        <div className="max-w-[1200px] mx-auto text-center">
          <h2
            className="heading-small mb-8 black overflow-hidden text-center opacity-0"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
            dangerouslySetInnerHTML={html(content.introduction.introVideo.heading)}
          />
          <p
            className="black"
            data-animation="fade"
            data-delay="0.5"
            data-duration="0.5"
            tabIndex={1}
            dangerouslySetInnerHTML={html(content.introduction.introVideo.content)}
          />
        </div>
      </section>

      <section
        className="video-scroll-container px-8 scroll-m-[40px]"
        data-animation="video-play"
        data-start="top center"
        data-pin="false"
        data-scroll-distance="1000"
        id="section-1"
      >
        <div
          className="mx-auto text-center rounded-[10px] border-2 border-gray-200 overflow-hidden h-[240px] md:h-[400px] lg:h-[calc(100vh-20px)]"
          data-animation="fade"
          data-delay="0.5"
          data-duration="0.5"
        >
          <VimeoEmbed
            videoId={content.introduction.introVideo.vimeoVideo}
            title="DX Model video"
            autoplay={false}
            loop
            controls={false}
            className="w-full h-full scale-[1.2]"
            viewportAutoplay
            viewportThreshold={0.7}
            lazy
          />
        </div>
      </section>

      <section
        className="scroll-trigger pt-[100px] md:pt-[150px] xl:pt-[200px] px-8 white-bg-section scroll-m-[-50px]"
        id="section-2"
      >
        <div className="max-w-[1200px] mx-auto text-center scroll-m-[100px]">
          <h2
            className="heading-small mb-8 black overflow-hidden text-center opacity-0"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
            dangerouslySetInnerHTML={html(content.features.heading)}
          />
        </div>
        <div
          className="max-w-[1200px] mx-auto"
          data-animation="fade"
          data-delay="0.5"
          data-duration="0.8"
          tabIndex={1}
          aria-label={plainText(content.features.heading)}
        >
          {content.features.list.map((item) => (
            <div key={item.heading} className="grid sm:grid-cols-5 gap-4 divider-l">
              <p
                className="font-semibold sm:col-span-2 sm:text-left text-center"
                dangerouslySetInnerHTML={html(item.heading)}
              />
              <p
                className="sm:col-span-3 sm:text-left text-center"
                dangerouslySetInnerHTML={html(item.content)}
              />
            </div>
          ))}
        </div>
        <AnimatedButton
          onClick={() => handleNavigation(content.features.buttonLink)}
          dataAnimation="fade"
          dataDelay="0.0"
          dataDuration="0.5"
          className="mt-[100px] text-sm m-auto z-50 uppercase relative white-bg"
        >
          <b className="hidden lg:block" dangerouslySetInnerHTML={html(content.features.button)} />
          <b
            className="block lg:hidden"
            dangerouslySetInnerHTML={html(content.features.buttonMobile)}
          />
        </AnimatedButton>
      </section>

      <section
        className="scroll-trigger py-[150px] md:py-[200px] pb-0 md:pb-[50px] xl:pb-[50px] px-8 white-bg-section scroll-m-[-100px]"
        id="section-6"
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <h2
            className="heading-small black overflow-hidden text-center opacity-0 mb-8"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
          >
            {content.otherModulesHeading}
          </h2>
        </div>
      </section>

      <section
        id="modules-section"
        className="bg-white"
        style={{ paddingTop: '0px' }}
        data-animation="fade"
        data-delay="0.5"
        data-duration="0.5"
      >
        <div className="sm:pb-[100px] scroll-m-[-150px]">
          <div
            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-8 mx-auto"
            tabIndex={1}
            aria-label="Modules"
          >
            {moduleCards.map((card, index) => (
              <div
                key={card.title}
                className="p-8 primary-bg-color h-[300px] sm:h-[calc(100vh-200px)] module-column rounded-[20px] cursor-pointer relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#BFB6AD] focus:ring-offset-2 group"
                style={{
                  backgroundImage: `url(${card.image})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
                data-module={index + 1}
                tabIndex={1}
                aria-label={card.title}
                onClick={(event) => {
                  event.preventDefault()
                  if (window.innerWidth <= 1024) {
                    handleNavigation(card.link)
                  }
                }}
                onKeyDown={(event) => handleKeyDown(event, card.link)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40 z-9 xl:hidden flex flex-col items-center justify-center group-focus-within:flex focus-visible:flex">
                  <h4
                    className="heading-small font-bold mb-3 text-white text-center"
                    dangerouslySetInnerHTML={html(card.title)}
                  />
                  <div className="w-[30px] h-[1px] bg-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="md:px-16 px-8 pt-[100px] pb-[100px] md:pt-[200px] md:pb-[200px] bg-white white-bg-section scroll-m-[80px]"
        id="section-7"
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
              dangerouslySetInnerHTML={html(content.book.heading)}
            />
            <p
              className="black text-center md:text-left"
              tabIndex={1}
              dangerouslySetInnerHTML={html(content.book.content)}
            />
          </div>
          <div data-animation="fade" data-delay="0.5" data-duration="0.5">
            <AnimatedButton
              onClick={() => handleNavigation(content.book.buttonLink)}
              className="white-bg whitespace-nowrap uppercase relative text-[14px] md:text-[16px]"
            >
              {content.book.button}
            </AnimatedButton>
          </div>
        </div>
      </section>

      <section
        className="mx-auto px-4 py-16 md:h-[600px] h-[450px] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden cta-section z-30"
        id="contact-us"
      >
        <div className="absolute inset-0 w-full md:h-[100vh] h-[450px] -z-10 overflow-hidden md:scale-110 scale-100 md:top-[-40%] top-[0%]">
          <VimeoEmbed
            videoId={content.cta.videoBackground}
            title="Contact DX LIVING | Get in Touch"
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

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden"
          data-parallax="basic"
          data-speed="0.2"
          data-scrub="1"
          data-delay="0.2"
          data-duration="1.2"
          style={{
            backgroundImage: "url('/placeholder-cta-img.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            height: '150%',
            top: '0%',
          }}
        />

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
            {content.cta.button}
          </AnimatedButton>
        </div>
      </section>
    </div>
  )
}

export default ModelPageContent

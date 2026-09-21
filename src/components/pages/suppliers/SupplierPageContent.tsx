'use client'

import { useRouter } from 'next/navigation'
import AnchorMenu from '@/components/ui/AnchorMenu'
import AnimatedButton from '@/components/ui/AnimatedButton'
import VimeoEmbed from '@/components/ui/VimeoEmbed'
import {
  cmsHtml as html,
  cmsPlainText as plainText,
} from '@/lib/cms/sanitizeHtml'
import type { SuppliersPageContentData } from '@/lib/suppliers/types'
import { useAutoScroll, usePageAnimations, usePageTransition } from '@/lib/utils/animations'
import { useScrollToTop } from '@/lib/utils/scrollToTop'

interface SupplierPageContentProps {
  content: SuppliersPageContentData
}

const SupplierPageContent: React.FC<SupplierPageContentProps> = ({ content }) => {
  const router = useRouter()
  const { banner } = content

  const sections =
    content.anchorMenu?.length > 0
      ? content.anchorMenu
      : [
          { id: 'intro', label: 'Introduction' },
          { id: 'what-we-offer', label: 'What We Offer' },
          { id: 'supplier-material', label: 'Material Integration' },
          { id: 'our-process', label: 'Our Process' },
          { id: 'our-supplier-tiers', label: 'Supplier Tiers' },
          { id: 'apply-now', label: 'Apply Now' },
        ]

  const navigateToPath = (path: string) => {
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

  const navigateToApply = () => navigateToPath('/apply')
  const navigateToCta = () => navigateToPath(content.cta.buttonLink)

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
    dynamicDirections: {
      toHomepage: 'top',
      fromHomepage: 'bottom',
      betweenPages: 'right',
    },
  })

  return (
    <div className="min-h-screen page-content">
      <AnchorMenu sections={sections} />

      <section className="mx-auto px-4 py-16 lg:h-screen h-[calc(65vh)] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden banner-section z-40">
        <div
          className="absolute inset-0 w-full lg:h-full h-[calc(65vh)] -z-10 overflow-hidden md:scale-110 scale-100"
          data-parallax="false"
          data-speed="0.5"
        >
          <VimeoEmbed
            videoId={banner.vimeoBackgroundVideo}
            title={banner.title}
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
            backgroundImage: 'url(/images/supplierBanner.jpg)',
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
          aria-label="Be Our Partner"
        >
          <h1
            className="text-reveal heading-large text-center md:text-left"
            data-animation="text-reveal"
            data-delay="5.0"
            data-duration="1.0"
            dangerouslySetInnerHTML={html(banner.title)}
          />
        </div>
      </section>

      <section
        className="px-8 pt-[100px] md:pt-[150px] xl:pt-[200px] md:pb-[150px] xl:pb-[200px] white-bg-section"
        data-animation="fade"
        data-delay="0.2"
        data-duration="1.0"
        id="intro"
      >
        <div className="max-w-[1400px] mx-auto text-center">
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
        className="video-scroll-container mb-0 md:mb-[80px] p-8 py-5"
        data-animation="video-scroll"
        data-start="center center"
        data-pin="true"
        data-scroll-distance="0"
        data-video-length="7.9"
        data-scrub="1"
        tabIndex={1}
        aria-label="Be Our Partner Video"
      >
        <div
          className="mx-auto text-center rounded-[20px] overflow-hidden h-[200px] md:h-[400px] lg:h-[calc(100vh-150px)]"
          data-animation="fade"
          data-delay="0.0"
          data-duration="0.5"
        >
          <VimeoEmbed
            videoId={content.fullWidthVideo}
            title="Premium Products, Smart Choices | DX LIVING"
            className="w-full h-full"
            autoplay={true}
            loop={true}
            controls={false}
            muted={true}
            parallax={true}
            stretch={true}
            lazy
          />
        </div>
      </section>

      <section className="scroll-trigger px-8 pt-[100px] lg:pt-[200px] colored-bg" id="what-we-offer">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2
            className="heading-small mb-8 primary-color overflow-hidden opacity-0"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
            dangerouslySetInnerHTML={html(content.whatWeOffer.heading)}
          />
          {content.whatWeOffer.items.map((item, index) => {
            const delay = (0.0 + index * 0.5).toFixed(1)

            return (
              <div
                key={item.title}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 divider text-center md:text-left"
                data-animation="fade"
                data-delay={index === 0 ? '1.0' : delay}
                data-duration="0.5"
                tabIndex={1}
                aria-label={`${plainText(item.title)} - ${plainText(item.content)}`}
              >
                <h3
                  className="white overflow-hidden opacity-0 font-semibold tracking-[3px]"
                  data-animation="text-split"
                  data-split-by="words"
                  data-stagger="0.05"
                  data-delay={delay}
                  data-duration="0.5"
                  dangerouslySetInnerHTML={html(item.title)}
                />
                <p
                  className="white col-span-2 overflow-hidden opacity-0"
                  data-animation="text-split"
                  data-split-by="words"
                  data-stagger="0.05"
                  data-delay={delay}
                  data-duration="0.5"
                  dangerouslySetInnerHTML={html(item.content)}
                />
              </div>
            )
          })}
        </div>
      </section>

      <section
        className="scroll-trigger px-8 pt-[100px] lg:pt-[200px] white-bg-section scroll-m-[-80px]"
        id="supplier-material"
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <h2
            className="heading-small mb-8 black overflow-hidden text-center opacity-0"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.5"
            data-duration="0.5"
            dangerouslySetInnerHTML={html(content.materialIntegration.heading)}
          />
        </div>
      </section>

      <section
        className="video-scroll-container md:mb-[80px] sm:px-8 pt-0 white-bg-section"
        data-animation="video-play"
        data-start="top center"
        data-pin="false"
        data-scroll-distance="1000"
      >
        <div
          className="mx-auto text-center rounded-0 md:rounded-[20px] overflow-hidden h-auto aspect-[16/7] lg:aspect-[16/9] max-w-[1400px]"
          data-animation="fade"
          data-delay="0.2"
          data-duration="1.0"
        >
          <VimeoEmbed
            videoId={content.materialIntegration.vimeoVideo}
            title={content.materialIntegration.heading}
            className="w-full h-full"
            autoplay={true}
            loop={true}
            controls={false}
            muted={true}
            lazy
          />
        </div>
      </section>

      <section className="scroll-trigger white-bg-section lg:pt-[100px] pt-[50px]">
        <div className="max-w-[1200px] mx-auto text-center pt-[50px] white-bg-section" id="our-process">
          <h2
            className="heading-small mb-8 black overflow-hidden text-center opacity-0"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.5"
            data-duration="0.5"
            dangerouslySetInnerHTML={html(content.process.heading)}
          />
        </div>
      </section>

      <section className="scroll-trigger" data-animation="fade" data-delay="0.0" data-duration="0.9">
        <div
          className="list-container flex-col-reverse xl:flex-row"
          data-animation="service-list"
          data-start="top center"
          data-end="bottom center"
          data-scrub="0.2"
          data-mouse-sensitivity="15"
          data-image-scale="1.1"
          data-image-rotation="0.0001"
        >
          <div className="left tertiary-bg">
            <div className="list-wrapper py-[50px] xl:py-[200px]">
              {content.process.steps.map((step, index) => (
                <div key={`${index}-${step.title}`} className="list gap-[10px] md:gap-[100px]">
                  <h3 className="step-number">STEP {index + 1}</h3>
                  <div>
                    <h4 className="uppercase" dangerouslySetInnerHTML={html(step.title)} />
                    <p dangerouslySetInnerHTML={html(step.content)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="right"
            style={{
              backgroundImage: 'url(/placeholder-float-blur.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="list-img-wrapper">
              <div className="img-list">
                <div className="absolute inset-0 w-full max-h-[680px] -z-10 overflow-hidden scale-110 top-[10%] left-[-5%]">
                  <VimeoEmbed
                    videoId={content.process.rightSideVideo}
                    title={content.process.heading}
                    className="w-full h-full rounded-[20px] overflow-hidden"
                    autoplay={true}
                    loop={true}
                    controls={false}
                    muted={true}
                    parallax={true}
                    stretch={true}
                    lazy
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-trigger pt-[0px] lg:pt-[100px] lg:pb-[200px] pb-[100px] px-8 white-bg-section">
        <div className="max-w-[1200px] mx-auto text-center pt-[100px]" id="our-supplier-tiers">
          <h2
            className="heading-small md:mb-8 black overflow-hidden text-center opacity-0"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.5"
            data-duration="0.5"
            dangerouslySetInnerHTML={html(content.tiers.heading)}
          />
        </div>
        <div
          className="max-w-[1200px] mx-auto mb-[50px]"
          data-animation="fade"
          data-delay="1.0"
          data-duration="0.8"
        >
          <div className="md:grid grid-cols-6 gap-4 divider-l text-center hidden">
            <h2 className="font-semibold uppercase">Tier</h2>
            <h2 className="font-semibold uppercase col-span-3">Description</h2>
            <h2 className="font-semibold uppercase col-span-2">Visibility</h2>
          </div>
          {content.tiers.rows.map((row) => (
            <div
              key={row.level}
              className="grid sm:grid-cols-6 grid-cols-3 gap-4 divider-l text-center"
            >
              <h3
                className="font-semibold tracking-[3px] col-span-3 md:col-span-1"
                suppressHydrationWarning
                dangerouslySetInnerHTML={html(row.level)}
              />
              <h4
                className="col-span-3"
                suppressHydrationWarning
                dangerouslySetInnerHTML={html(row.description)}
              />
              <h4
                className="col-span-3 md:col-span-2"
                suppressHydrationWarning
                dangerouslySetInnerHTML={html(row.visibility)}
              />
            </div>
          ))}
        </div>

        <AnimatedButton
          onClick={navigateToApply}
          dataAnimation="fade"
          dataDelay="0.0"
          dataDuration="0.5"
          className="white-bg text-sm m-auto z-50 uppercase"
        >
          <b className="hidden lg:block">{content.tiers.buttonDesktop}</b>
          <b className="block lg:hidden">{content.tiers.buttonMobile}</b>
        </AnimatedButton>
      </section>

      <section
        className="mx-auto px-4 py-16 md:h-[600px] h-[450px] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden cta-section z-30"
        id="apply-now"
      >
        <div className="absolute inset-0 w-full md:h-[100vh] h-[450px] -z-10 overflow-hidden scale-110 md:top-[-40%] top-[0%]">
          <VimeoEmbed
            videoId={content.cta.videoBackground}
            title={content.cta.heading}
            className="w-full h-full"
            autoplay={true}
            loop={true}
            controls={false}
            muted={true}
            parallax={true}
            stretch={true}
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
              data-delay="0.5"
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
            onClick={navigateToCta}
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

export default SupplierPageContent

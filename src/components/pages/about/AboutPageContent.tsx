'use client';

import { useRouter } from 'next/navigation';
import AnchorMenu from '@/components/ui/AnchorMenu';
import AnimatedButton from '@/components/ui/AnimatedButton';
import LinkedInStoriesEmbed from '@/components/ui/LinkedInStoriesEmbed';
import VimeoEmbed from '@/components/ui/VimeoEmbed';
import type { AboutPageContentData } from '@/lib/about/types';
import {
  cmsHtml as html,
  cmsListItemHtml as listItemHtml,
  cmsPlainText as plainText,
} from '@/lib/cms/sanitizeHtml';
import { useAutoScroll, usePageAnimations, usePageTransition } from '@/lib/utils/animations';
import { useScrollToTop } from '@/lib/utils/scrollToTop';

export type { AboutPageContentData } from '@/lib/about/types';

interface AboutPageContentProps {
  content: AboutPageContentData;
}

const AboutPageContent: React.FC<AboutPageContentProps> = ({ content }) => {
  const router = useRouter();
  const sections =
    content.anchorMenu?.length > 0
      ? content.anchorMenu
      : [
          { id: 'intro', label: 'Introduction' },
          { id: 'section-2', label: 'Why DX LIVING?' },
          { id: 'section-4', label: 'LinkedIn Stories' },
          { id: 'get-in-touch', label: 'Get in Touch' },
        ];

  const navigateToCta = () => {
    const win = window as Window & { navigateWithTransition?: (path: string) => void };
    const buttonLink = content.cta.buttonLink;

    if (/^https?:\/\//i.test(buttonLink)) {
      window.location.href = buttonLink;
      return;
    }

    if (win.navigateWithTransition) {
      win.navigateWithTransition(buttonLink);
    } else {
      router.push(buttonLink);
    }
  };

  useScrollToTop();

  useAutoScroll(0.65, 8000, 10, 1.5, 'power2.out', {
    showScrollArrow: true,
  });

  usePageAnimations(false);

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
            title="Luxury Home Design Visualized | DX LIVING"
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
            backgroundImage: "url('/images/supplierBanner.jpg')",
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
            data-duration="1.1"
            dangerouslySetInnerHTML={html(content.banner.title)}
          />
        </div>
      </section>

      <section
        className="gallery scroll-trigger white-bg-section mx-auto py-[100px] md:py-[150px] xl:py-[200px] pointer-events-none max-w-[1600px]"
        data-animation="gallery"
        data-start="top 1000"
        data-end="top 200"
        data-scrub="true"
        id="intro"
      >
        <div className="max-w-[1200px] mx-auto text-center mb-[100px] md:mb-[150px] xl:mb-[200px] px-8">
          <p
            className="mb-[30px] black font-semibold leading-[38px]"
            data-animation="fade"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
            dangerouslySetInnerHTML={html(content.introduction)}
          />
        </div>

        <div
          className="gallery__grid px-9 flex flex-col xl:flex-row"
          data-animation="fade"
          data-delay="0.0"
          data-duration="0.5"
        >
          <div className="gallery__left pointer-events-none" data-speed=".9" style={{ flex: '0 0 63%' }}>
            <div className="gallery__item">
              <div className="w-full h-full gallery__anim">
                <VimeoEmbed
                  videoId={content.videoLeft}
                  title="Personalized Home Design Made Real | DX LIVING"
                  className="w-auto h-auto rounded-[20px] overflow-hidden"
                />
              </div>
            </div>
          </div>
          <div className="gallery__right" data-speed="1.1" style={{ flex: '0 0 35%' }}>
            <div className="gallery__item">
              <div className="text__block gallery__anim">
                <p
                  className="black max-w-[1400px] mx-auto md:leading-[38px] leading-[26px] text-center md:text-left"
                  tabIndex={1}
                  dangerouslySetInnerHTML={html(content.contentRight)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="video-scroll-container p-0 md:p-8"
        data-animation="video-play"
        data-start="top center"
        data-pin="false"
        data-scroll-distance="1000"
        id="section-1"
      >
        <div
          className="mx-auto text-center overflow-hidden rounded-0 md:rounded-[20px] xl:h-[calc(100vh-80px)]"
          data-animation="fade"
          data-delay="0.0"
          data-duration="0.5"
        >
          <VimeoEmbed
            videoId={content.fullWidthVideo}
            title="See Your Dream Home Before Building | DX LIVING"
            className="w-auto h-auto overflow-hidden"
          />
        </div>
      </section>

      <section
        className="gallery scroll-trigger mx-auto py-0 md:py-8 py-[100px] md:py-[150px] xl:py-[200px] scroll-m-[30px] white-bg-section"
        data-animation="gallery"
        data-start="top 700"
        data-end="top 200"
        data-scrub="true"
        id="section-2"
      >
        <div className="gallery__grid px-9 flex flex-col-reverse xl:flex-row max-w-[1400px] mx-auto">
          <div className="gallery__left" data-speed=".9" style={{ flex: '0 0 100%' }}>
            <div className="gallery__item">
              <div className="text__block gallery__anim">
                <h2
                  className="heading-small mb-[20px] secondary-color text-center"
                  data-animation="fade"
                  data-delay="0.0"
                  data-duration="0.5"
                  tabIndex={1}
                  dangerouslySetInnerHTML={html(content.whyDxLiving.heading)}
                />
                <p
                  className="black mx-auto md:leading-[38px] leading-[26px] mb-[20px] text-center md:text-left"
                  data-animation="fade"
                  data-delay="0.3"
                  data-duration="0.5"
                  tabIndex={1}
                  dangerouslySetInnerHTML={html(content.whyDxLiving.content)}
                />
                <ul
                  className="about-list ml-[30px] mb-[20px]"
                  data-animation="fade"
                  data-delay="0.3"
                  data-duration="0.5"
                >
                  {content.whyDxLiving.contentList.map((item) => (
                    <li key={item}>
                      <p
                        className="black mx-auto md:leading-[38px] leading-[26px]"
                        tabIndex={1}
                        dangerouslySetInnerHTML={listItemHtml(item)}
                      />
                    </li>
                  ))}
                </ul>
                <p
                  className="black mx-auto md:leading-[38px] leading-[26px] mb-[20px]"
                  data-animation="fade"
                  data-delay="0.3"
                  data-duration="0.5"
                  tabIndex={1}
                  dangerouslySetInnerHTML={html(content.whyDxLiving.lastContent)}
                />
              </div>
            </div>
          </div>
          <div className="gallery__right" data-speed="1.1" style={{ flex: '0 0 0%' }}>
            <div className="gallery__item" />
          </div>
        </div>
      </section>

      <section
        className="bg-white pb-[50px] md:pb-[150px] white-bg-section overflow-hidden scroll-m-[150px]"
        data-animation="fade"
        data-delay="0.0"
        data-duration="1.5"
        id="section-4"
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <h2
            className="heading-small mb-[50px] secondary-color"
            data-animation="fade"
            data-delay="0.0"
            data-duration="0.0"
            tabIndex={1}
          >
            Our LinkedIn Stories
          </h2>
          <LinkedInStoriesEmbed />
        </div>
      </section>

      <section
        className="mx-auto px-4 py-16 md:h-[600px] h-[450px] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden cta-section z-30"
        id="get-in-touch"
      >
        <div className="absolute inset-0 w-full md:h-[100vh] h-[450px] -z-10 overflow-hidden scale-110 md:top-[-40%] top-[0%]">
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
              data-stagger="0.03"
              data-delay="0.0"
              data-duration="0.5"
              tabIndex={1}
              dangerouslySetInnerHTML={html(content.cta.heading)}
            />
            <p
              className="text-white mb-[30px] mt-[15px] overflow-hidden text-center opacity-0"
              data-animation="text-split"
              data-split-by="words"
              data-stagger="0.02"
              data-delay="0.3"
              data-duration="0.5"
              dangerouslySetInnerHTML={html(content.cta.content)}
            />
          </div>
          <AnimatedButton
            onClick={navigateToCta}
            dataAnimation="fade"
            dataDelay="1.0"
            dataDuration="0.5"
            className="mt-[30px] text-[14px] md:text-[16px] m-auto z-50 uppercase relative"
          >
            <b dangerouslySetInnerHTML={html(content.cta.button)} />
          </AnimatedButton>
        </div>
      </section>
    </div>
  );
};

export default AboutPageContent;

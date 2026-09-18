'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedButton from '@/components/ui/AnimatedButton';
import VimeoEmbed from '@/components/ui/VimeoEmbed';
import type { ArticleData } from '@/data/articles';
import { getArticleCategoryLabel } from '@/data/articles';
import { formatDate } from '@/lib/utils/dateFormatter';
import { useAutoScroll, usePageAnimations, usePageTransition } from '@/lib/utils/animations';
import { useScrollToTop } from '@/lib/utils/scrollToTop';
import RecentArticles from '@/components/pages/articles/RecentArticles';

interface ArticlePageContentProps {
  article: ArticleData;
  recentArticles: ArticleData[];
  bannerVideoId?: string;
  cta?: {
    heading: string;
    button: string;
    buttonLink: string;
    videoBackground: string;
  };
}

const ArticlePageContent: React.FC<ArticlePageContentProps> = ({
  article,
  recentArticles,
  bannerVideoId = '1118934520',
  cta = {
    heading: "Shaping your build starts with the right solution, let's make it happen.",
    button: 'Contact us today',
    buttonLink: '/contact',
    videoBackground: '1117308030',
  },
}) => {
  const router = useRouter();
  const categoryLabel =
    article.categoryLabel ?? getArticleCategoryLabel(article.category);

  const handleNavigation = (path: string) => {
    const win = window as Window & { navigateWithTransition?: (path: string) => void };
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
    skipOnInitialLoad: true,
    transitionType: 'fade',
    dynamicDirections: {
      toHomepage: 'top',
      fromHomepage: 'bottom',
      betweenPages: 'right',
    },
  });

  useAutoScroll(0.5, 8000, 10, 1.5, 'power2.out', {
    showScrollArrow: true,
  });

  useEffect(() => {
    const animatedElements = document.querySelectorAll('[data-animation]');

    animatedElements.forEach((element) => {
      const animationType = element.getAttribute('data-animation') || 'fade';
      const delay = parseFloat(element.getAttribute('data-delay') || '0');
      const duration = parseFloat(element.getAttribute('data-duration') || '1');

      if (animationType === 'fade') {
        element.classList.add('opacity-0');
        setTimeout(() => {
          element.classList.remove('opacity-0');
          element.classList.add('opacity-100', 'transition-opacity');
        }, delay * 1000);
      }

      if (animationType === 'text-reveal') {
        setTimeout(() => {
          element.classList.add('opacity-100');
        }, delay * 1000 + duration * 100);
      }
    });
  }, [article]);

  return (
    <div className="min-h-screen page-content article-content">
      <section className="mx-auto px-4 py-16 lg:h-screen h-[calc(65vh)] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden banner-section">
        <div
          className="absolute inset-0 w-full lg:h-full h-[calc(65vh)] -z-10 overflow-hidden md:scale-200 scale-100 lg:scale-110"
          data-parallax="fix"
          data-speed="0.5"
        >
          <VimeoEmbed
            videoId={bannerVideoId}
            title="Latest Luxury Home Trends | DX LIVING"
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
            backgroundImage: 'url(/images/resourcesBanner.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div
          className="absolute inset-0 bg-black bg-opacity-20 z-10"
          data-animation="fade"
          data-delay="0.2"
          data-duration="1.0"
        />

        <div className="absolute z-20 text-white top-50 bottom-50 m-auto left-50 md:bottom-10 md:left-8 mb-4 text-center md:text-left w-[90%] md:w-auto">
          <h2
            className="mb-4 text-reveal heading-large !text-[50px] lg:!text-[64px]"
            data-animation="text-reveal"
            data-delay="0.8"
            data-duration="1.0"
          >
            ARTICLES
          </h2>
        </div>
      </section>

      <section
        className="bg-white p-8 pt-[100px] md:pt-[150px] xl:pt-[200px] white-bg-section"
        data-animation="fade"
        data-delay="0.0"
        data-duration="0.5"
      >
        <div className="text-center">
          <div className="resource-content">
            <h1
              className="heading-small mb-8 max-w-[1400px] mx-auto"
              style={{ lineHeight: '1.5' }}
              data-animation="fade"
              data-delay="0.0"
              data-duration="0.5"
            >
              {article.title}
            </h1>

            <div
              className="flex flex-wrap items-center justify-center text-gray-600 text-lg mb-12 gap-x-3"
            >
              <span>{formatDate(article.datePublished, { includeDay: true })}</span>
              {categoryLabel ? (
                <>
                  <span>•</span>
                  <span>{categoryLabel}</span>
                </>
              ) : null}
              {article.readTime ? (
                <>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {article.featuredImage ? (
        <section className="relative overflow-hidden rounded-[10px] px-8">
          <img
            src={article.featuredImage}
            alt={article.title}
            loading="lazy"
            decoding="async"
            className="h-[400px] lg:h-[700px] w-full rounded-[10px] object-cover object-center"
          />
        </section>
      ) : null}

      <section
        className="bg-white p-8 py-[50px] pb-[100px] md:py-[100px] xl:py-[200px] white-bg-section"
        data-animation="fade"
        data-delay="0.0"
        data-duration="0.5"
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="resource-content" data-animation="fade" data-delay="0.0" data-duration="0.5">
            <div className="prose prose-lg max-w-none">
              <div
                className="article-content black leading-relaxed flex flex-col"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            <div className="text-center mt-16 pt-8 border-t border-gray-200">
              <AnimatedButton
                onClick={() => handleNavigation('/articles')}
                dataAnimation="fade"
                dataDelay="0.5"
                dataDuration="0.5"
                className="text-sm uppercase relative white-bg"
              >
                ← Back to Articles
              </AnimatedButton>
            </div>
          </div>
        </div>
        
        <RecentArticles articles={recentArticles} onNavigate={handleNavigation} />
      </section>

      <section className="mx-auto px-4 py-16 md:h-[600px] h-[450px] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden cta-section z-30">
        <div className="absolute inset-0 w-full md:h-[100vh] h-[450px] -z-10 overflow-hidden md:scale-110 scale-100 md:top-[-40%] top-[0%]">
          <VimeoEmbed
            videoId={cta.videoBackground}
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
            >
              {cta.heading}
            </h2>
          </div>
          <AnimatedButton
            onClick={() => handleNavigation(cta.buttonLink)}
            dataAnimation="fade"
            dataDelay="0.5"
            dataDuration="0.5"
            className="mt-[50px] text-sm m-auto z-50 uppercase relative"
          >
            {cta.button}
          </AnimatedButton>
        </div>
      </section>
    </div>
  );
};

export default ArticlePageContent;

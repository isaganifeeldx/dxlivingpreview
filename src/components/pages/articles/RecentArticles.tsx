'use client';

import { useCallback, useMemo, useState } from 'react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import type { ArticleData } from '@/data/articles';
import { getArticleCategoryLabel } from '@/data/articles';
import { formatDate } from '@/lib/utils/dateFormatter';

interface RecentArticlesProps {
  articles: ArticleData[];
  onNavigate: (path: string) => void;
  /** Defaults to detail-page spacing; pass e.g. "" on standalone sections. */
  className?: string;
  headingClassName?: string;
  /** When set, enables a slider showing this many articles per slide. */
  slidesPerView?: number;
}

const navigateToArticle = (
  event: React.MouseEvent<HTMLAnchorElement>,
  link: string,
  onNavigate: (path: string) => void,
) => {
  event.preventDefault();
  onNavigate(link);
};

const chunkArticles = (articles: ArticleData[], size: number) => {
  const chunks: ArticleData[][] = [];
  for (let index = 0; index < articles.length; index += size) {
    chunks.push(articles.slice(index, index + size));
  }
  return chunks;
};

interface ArticleCardProps {
  article: ArticleData;
  index: number;
  onNavigate: (path: string) => void;
}

const ArticleCard = ({ article, index, onNavigate }: ArticleCardProps) => {
  const categoryLabel =
    article.categoryLabel ?? getArticleCategoryLabel(article.category);

  return (
    <article
      className="article-card"
      data-animation="fade"
      data-delay={0.0 + index * 0.1}
      data-duration="1.0"
    >
      <a
        href={article.link}
        onClick={(event) => navigateToArticle(event, article.link, onNavigate)}
        className="block relative overflow-hidden h-[200px] sm:h-[280px] rounded-[10px] cursor-pointer group"
        aria-label={`Read article: ${article.title}`}
      >
        {article.featuredImage ? (
          <img
            src={article.featuredImage}
            alt={article.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </a>
      <div className="py-6">
        <h3
          className="heading-xsmall mb-3 line-clamp-2 uppercase secondary-color"
          style={{ lineHeight: '40px' }}
        >
          <a
            href={article.link}
            onClick={(event) => navigateToArticle(event, article.link, onNavigate)}
            className="hover:text-[#BFB6AD] transition-colors"
          >
            {article.title}
          </a>
        </h3>
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-x-3">
          <span>{formatDate(article.datePublished, { includeDay: true })}</span>
          {categoryLabel ? (
            <>
              <span>•</span>
              <span>{categoryLabel}</span>
            </>
          ) : null}
        </div>
        <AnimatedButton
          href={article.link}
          dataAnimation="fade"
          dataDelay="0.5"
          dataDuration="0.5"
          className="text-sm uppercase relative white-bg w-fit"
        >
          Read More
        </AnimatedButton>
      </div>
    </article>
  );
};

const RecentArticles: React.FC<RecentArticlesProps> = ({
  articles,
  onNavigate,
  className = 'mt-16 pt-12',
  headingClassName = 'text-center heading-small mb-4 secondary-color',
  slidesPerView,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = useMemo(
    () => (slidesPerView ? chunkArticles(articles, slidesPerView) : []),
    [articles, slidesPerView],
  );

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  if (articles.length === 0) {
    return null;
  }

  const isSlider = Boolean(slidesPerView) && slides.length > 0;

  return (
    <div className={className}>
      <h2
        className={headingClassName}
        data-animation="fade"
        data-delay="0.0"
        data-duration="0.5"
        tabIndex={1}
      >
        Recent Articles
      </h2>

      {isSlider ? (
        <div className="relative">
          <div
            className="overflow-hidden"
            aria-roledescription="carousel"
            aria-label="Recent articles"
          >
            <div
              className="flex transition-transform duration-500 ease-in-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {slides.map((slideArticles, slideIndex) => (
                <div
                  key={slideArticles.map((article) => article.link).join('-')}
                  className="min-w-full w-full shrink-0 basis-full grid grid-cols-1 md:grid-cols-2 gap-8"
                  aria-hidden={slideIndex !== activeSlide}
                >
                  {slideArticles.map((article, index) => (
                    <ArticleCard
                      key={article.link}
                      article={article}
                      index={slideIndex * slidesPerView! + index}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {slides.length > 1 ? (
            <div className="mt-10 flex items-center justify-center">
              <div className="flex items-center gap-2" role="tablist" aria-label="Article slides">
                {slides.map((slide, index) => (
                  <button
                    key={slide.map((article) => article.link).join('-')}
                    type="button"
                    role="tab"
                    aria-selected={index === activeSlide}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => goToSlide(index)}
                    className={`h-1 transition-all duration-300 ${
                      index === activeSlide
                        ? 'w-8 bg-[#1a1a1a]'
                        : 'w-4 bg-[#BFB6AD] hover:bg-[#1a1a1a]'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-8 ${
            articles.length <= 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {articles.map((article, index) => (
            <ArticleCard
              key={article.link}
              article={article}
              index={index}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentArticles;

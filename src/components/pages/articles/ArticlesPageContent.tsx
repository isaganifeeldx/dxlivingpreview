'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import AnchorMenu from '@/components/ui/AnchorMenu';
import AnimatedButton from '@/components/ui/AnimatedButton';
import LinkedInStoriesEmbed from '@/components/ui/LinkedInStoriesEmbed';
import VimeoEmbed from '@/components/ui/VimeoEmbed';
import { cmsHtml as html, cmsPlainText as plainText } from '@/lib/cms/sanitizeHtml';
import {
  ALL_ARTICLES_PAGE_SIZE,
  type ArticleCategoryId,
  type ArticleData,
  LATEST_ARTICLES_COUNT,
  getArticleCategoryLabel,
  getArticleCategorySections,
  getArticleCategorySlug,
  getArticlesByCategory,
  getLatestArticles,
  isLegacyArticleCategoryIdParam,
  paginateItems,
  resolveArticleCategoryId,
  searchArticles,
} from '@/data/articles';
import type { ArticleCategory } from '@/lib/articles/categoryDefs';
import type { ArticlesPageCmsContent } from '@/lib/articles/types';
import { formatDate } from '@/lib/utils/dateFormatter';
import { useAutoScroll, usePageAnimations, usePageTransition } from '@/lib/utils/animations';
import { useScrollToTop } from '@/lib/utils/scrollToTop';

type ArticleLayout = 'list' | 'grid';

const ALL_ARTICLES_SECTION_ID = 'all-articles';

const ARTICLE_PILL_ACTIVE_CLASS =
  'border-[#2A3040] bg-white text-black';
const ARTICLE_PILL_INACTIVE_CLASS =
  'border-[#e5e7eb] bg-white text-gray-600 hover:border-[#2A3040] hover:text-black';

const articlePillClass = (isActive: boolean) =>
  [
    'rounded-full border transition-colors',
    isActive ? ARTICLE_PILL_ACTIVE_CLASS : ARTICLE_PILL_INACTIVE_CLASS,
  ].join(' ');

interface ArticlesPageContentProps {
  content: ArticlesPageCmsContent;
  articles: ArticleData[];
}

interface ArticleCardProps {
  article: ArticleData;
  layout: ArticleLayout;
  onNavigate: (path: string) => void;
  animationDelay: number;
  categories: ArticleCategory[];
  className?: string;
}

const parsePageParam = (value: string | null): number => {
  const parsed = Number.parseInt(value ?? '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const ArticleMeta: React.FC<{
  article: ArticleData;
  categories: ArticleCategory[];
}> = ({ article, categories }) => {
  const categoryLabel =
    article.categoryLabel ?? getArticleCategoryLabel(article.category, categories);

  return (
    <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2 gap-x-3">
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
  );
};

const navigateToArticle = (
  event: React.MouseEvent<HTMLAnchorElement>,
  link: string,
  onNavigate: (path: string) => void,
) => {
  event.preventDefault();
  onNavigate(link);
};

const ArticleThumbnail: React.FC<{
  article: ArticleData;
  onNavigate: (path: string) => void;
  className?: string;
}> = ({ article, onNavigate, className = '' }) => (
  <a
    href={article.link}
    onClick={(event) => navigateToArticle(event, article.link, onNavigate)}
    className={`block relative overflow-hidden cursor-pointer group ${className}`}
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
);

const ArticleTitleLink: React.FC<{
  article: ArticleData;
  onNavigate: (path: string) => void;
  className?: string;
}> = ({ article, onNavigate, className }) => (
  <h3 className={className} style={{ lineHeight: '40px' }}>
    <a
      href={article.link}
      onClick={(event) => navigateToArticle(event, article.link, onNavigate)}
      className="hover:text-[#BFB6AD] transition-colors"
    >
      {article.title}
    </a>
  </h3>
);

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  layout,
  onNavigate,
  animationDelay,
  categories,
  className = '',
}) => {
  if (layout === 'grid') {
    return (
      <div
        className={`article-card duration-300 ${className}`}
        data-animation="fade"
        data-delay={animationDelay}
        data-duration="1.0"
      >
        <ArticleThumbnail
          article={article}
          onNavigate={onNavigate}
          className="h-[200px] sm:h-[400px] rounded-[10px]"
        />
        <div className="py-8">
          <ArticleTitleLink
            article={article}
            onNavigate={onNavigate}
            className="heading-xsmall mb-3 line-clamp-3 lg:line-clamp-2 uppercase secondary-color"
          />
          <ArticleMeta article={article} categories={categories} />
          <AnimatedButton
            onClick={() => onNavigate(article.link)}
            dataAnimation="fade"
            dataDelay="0.8"
            dataDuration="0.8"
            className="text-sm uppercase relative white-bg mt-[20px]"
          >
            Read More
          </AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`article-card bg-white flex lg:flex-row flex-col gap-10 ${className}`}
      data-animation="fade"
      data-delay={animationDelay}
      data-duration="1.0"
    >
      <ArticleThumbnail
        article={article}
        onNavigate={onNavigate}
        className="w-full lg:w-1/3 h-[200px] sm:h-[400px] lg:h-auto rounded-[10px]"
      />
      <div className="sm:p-6 w-full lg:w-2/3">
        <ArticleTitleLink
          article={article}
          onNavigate={onNavigate}
          className="heading-xsmall mb-3 line-clamp-4 lg:line-clamp-2 uppercase secondary-color"
        />
        <ArticleMeta article={article} categories={categories} />
        {article.seoDescription ? (
          <p className="mb-4 line-clamp-3">{article.seoDescription}</p>
        ) : null}
        <AnimatedButton
          onClick={() => onNavigate(article.link)}
          dataAnimation="fade"
          dataDelay="0.8"
          dataDuration="0.8"
          className="text-sm uppercase relative white-bg mt-[20px]"
        >
          Read More
        </AnimatedButton>
      </div>
    </div>
  );
};

interface ArticlePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ArticlePagination: React.FC<ArticlePaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const paginationButtonClass = (isActive: boolean) =>
    [
      'inline-flex h-10 w-10 items-center justify-center text-sm',
      articlePillClass(isActive),
    ].join(' ');

  const paginationArrowClass =
    'inline-flex h-10 w-10 items-center justify-center disabled:cursor-not-allowed disabled:opacity-30';

  return (
    <nav
      className="mt-16 flex items-center justify-center gap-2"
      aria-label="Articles pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`${paginationArrowClass} ${articlePillClass(false)}`}
        aria-label="Previous page"
      >
        ←
      </button>

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={paginationButtonClass(pageNumber === page)}
          aria-current={pageNumber === page ? 'page' : undefined}
          aria-label={`Page ${pageNumber}`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`${paginationArrowClass} ${articlePillClass(false)}`}
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  );
};

interface AllArticlesSectionProps {
  categoryTabs: Array<{ id: ArticleCategoryId; label: string; count: number }>;
  activeCategoryId: ArticleCategoryId;
  paginatedArticles: ArticleData[];
  page: number;
  totalPages: number;
  categories: ArticleCategory[];
  onCategoryChange: (categoryId: ArticleCategoryId) => void;
  onPageChange: (page: number) => void;
  onNavigate: (path: string) => void;
}

const TAB_SKELETON_MIN_MS = 450;

const ArticleCardSkeleton: React.FC = () => (
  <div className="pointer-events-none select-none" aria-hidden="true">
    <div className="article-skeleton-shimmer h-[200px] sm:h-[400px] rounded-[10px]" />
    <div className="space-y-4 py-8">
      <div className="article-skeleton-shimmer h-8 w-[85%] rounded-md" />
      <div className="article-skeleton-shimmer h-8 w-[65%] rounded-md lg:hidden" />
      <div className="article-skeleton-shimmer h-4 w-[40%] rounded-md" />
      <div className="article-skeleton-shimmer mt-2 h-10 w-28 rounded-full" />
    </div>
  </div>
);

const ArticleSkeletonGrid: React.FC<{ count: number }> = ({ count }) => (
  <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
    {Array.from({ length: count }, (_, index) => (
      <ArticleCardSkeleton key={`article-skeleton-${index}`} />
    ))}
  </div>
);

const AllArticlesSection: React.FC<AllArticlesSectionProps> = ({
  categoryTabs,
  activeCategoryId,
  paginatedArticles,
  page,
  totalPages,
  categories,
  onCategoryChange,
  onPageChange,
  onNavigate,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentKey = `${activeCategoryId}-${page}`;
  const skipInitialLoadRef = useRef(true);
  const loadStartedAtRef = useRef(0);
  const pendingFadeInRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const beginTransition = (action: () => void) => {
    loadStartedAtRef.current = Date.now();
    pendingFadeInRef.current = true;
    setIsLoading(true);
    action();
  };

  useEffect(() => {
    if (skipInitialLoadRef.current) {
      skipInitialLoadRef.current = false;
      return;
    }

    const elapsed = Date.now() - loadStartedAtRef.current;
    const remaining = Math.max(0, TAB_SKELETON_MIN_MS - elapsed);

    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [contentKey]);

  useEffect(() => {
    if (isLoading || !pendingFadeInRef.current) return;

    pendingFadeInRef.current = false;
    const content = contentRef.current;
    if (!content) return;

    gsap.killTweensOf(content);
    gsap.fromTo(
      content,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: 'power2.out' },
    );
  }, [isLoading, contentKey, paginatedArticles]);

  const skeletonCount = Math.max(
    paginatedArticles.length,
    ALL_ARTICLES_PAGE_SIZE,
  );

  return (
    <section
      className="bg-white p-8 py-[100px] md:py-[150px] xl:py-[200px] white-bg-section scroll-m-[100px]"
      data-animation="fade"
      data-delay="0.2"
      data-duration="1.0"
      id={ALL_ARTICLES_SECTION_ID}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12" data-animation="fade" data-delay="0.0" data-duration="0.5">
          <h2 className="heading-small mb-4 secondary-color">All Articles</h2>
        </div>

        <div
          className="mb-12 flex flex-wrap items-center justify-center gap-3"
          role="tablist"
          aria-label="Article categories"
        >
          {categoryTabs.map((tab) => {
            const isActive = tab.id === activeCategoryId;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`articles-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`articles-panel-${tab.id}`}
                disabled={tab.count === 0}
                onClick={() => beginTransition(() => onCategoryChange(tab.id))}
                className={[
                  'px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40',
                  articlePillClass(isActive),
                ].join(' ')}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          id={`articles-panel-${activeCategoryId}`}
          role="tabpanel"
          aria-labelledby={`articles-tab-${activeCategoryId}`}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className="sr-only">Loading articles</span>
              <ArticleSkeletonGrid count={skeletonCount} />
            </>
          ) : paginatedArticles.length > 0 ? (
            <div ref={contentRef}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {paginatedArticles.map((article, index) => (
                  <ArticleCard
                    key={article.link}
                    article={article}
                    layout="grid"
                    onNavigate={onNavigate}
                    animationDelay={0.2 + index * 0.1}
                    categories={categories}
                    className="all-articles-card"
                  />
                ))}
              </div>

              <ArticlePagination
                page={page}
                totalPages={totalPages}
                onPageChange={(nextPage) => beginTransition(() => onPageChange(nextPage))}
              />
            </div>
          ) : (
            <p className="text-center black text-lg">No articles in this category yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

const ArticlesPageContent: React.FC<ArticlesPageContentProps> = ({ content, articles }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const trimmedSearch = searchQuery.trim();
  const isSearching = trimmedSearch.length > 0;

  const categories = content.categories;

  const searchResults = useMemo(
    () => (isSearching ? searchArticles(articles, trimmedSearch, categories) : []),
    [articles, categories, isSearching, trimmedSearch],
  );

  const latestArticles = useMemo(
    () => getLatestArticles(articles, LATEST_ARTICLES_COUNT),
    [articles],
  );
  const latestLinks = useMemo(
    () => new Set(latestArticles.map((article) => article.link)),
    [latestArticles],
  );
  const categorySections = useMemo(
    () => getArticleCategorySections(articles, latestLinks, categories),
    [articles, categories, latestLinks],
  );

  const categoryTabs = useMemo(
    () =>
      categories.map((category) => ({
        id: category.id,
        label: category.label,
        count: getArticlesByCategory(articles, category.id, latestLinks).length,
      })),
    [articles, categories, latestLinks],
  );

  const defaultCategoryId = useMemo(
    () => categorySections[0]?.id ?? categories[0]?.id ?? 'homes-residential-guides',
    [categories, categorySections],
  );

  const categoryParam = searchParams.get('category');
  const activeCategoryId = resolveArticleCategoryId(
    categoryParam,
    defaultCategoryId,
    categories,
  );

  const categoryArticles = useMemo(
    () => getArticlesByCategory(articles, activeCategoryId, latestLinks),
    [articles, activeCategoryId, latestLinks],
  );

  const requestedPage = parsePageParam(searchParams.get('page'));
  const pagination = useMemo(
    () => paginateItems(categoryArticles, requestedPage, ALL_ARTICLES_PAGE_SIZE),
    [categoryArticles, requestedPage],
  );

  useEffect(() => {
    if (!isLegacyArticleCategoryIdParam(categoryParam)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('category', getArticleCategorySlug(categoryParam));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [categoryParam, pathname, router, searchParams]);

  const updateListingParams = useCallback(
    (categoryId: ArticleCategoryId, page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', getArticleCategorySlug(categoryId));

      if (page <= 1) {
        params.delete('page');
      } else {
        params.set('page', String(page));
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const handleCategoryChange = (categoryId: ArticleCategoryId) => {
    updateListingParams(categoryId, 1);
  };

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), pagination.totalPages);
    updateListingParams(activeCategoryId, nextPage);
  };

  const anchorLabel = useCallback(
    (id: string, fallback: string) =>
      content.anchorMenu?.find((item) => item.id === id)?.label?.trim() || fallback,
    [content.anchorMenu],
  );

  const anchorSections = useMemo(() => {
    const base = [{ id: 'intro', label: anchorLabel('intro', 'Introduction') }];

    if (isSearching) {
      return [
        ...base,
        { id: 'search-results', label: 'Search Results' },
        { id: 'section-4', label: anchorLabel('section-4', 'LinkedIn Stories') },
        { id: 'contact-us', label: anchorLabel('contact-us', 'Contact Us') },
      ];
    }

    return [
      ...base,
      { id: 'latest-articles', label: anchorLabel('latest-articles', 'Latest Articles') },
      { id: ALL_ARTICLES_SECTION_ID, label: anchorLabel(ALL_ARTICLES_SECTION_ID, 'All Articles') },
      { id: 'section-4', label: anchorLabel('section-4', 'LinkedIn Stories') },
      { id: 'contact-us', label: anchorLabel('contact-us', 'Contact Us') },
    ];
  }, [anchorLabel, isSearching]);

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

  useAutoScroll(0.65, 10000, 10, 1.5, 'power2.out', {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      const newCards = document.querySelectorAll('.article-card:not(.all-articles-card)');

      if (newCards.length > 0) {
        gsap.fromTo(
          newCards,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            stagger: 0.15,
            ease: 'power3.out',
          },
        );
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isSearching, trimmedSearch]);

  return (
    <div className="min-h-screen page-content">
      <AnchorMenu sections={anchorSections} />

      <section className="mx-auto px-4 py-16 lg:h-screen h-[calc(65vh)] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden banner-section">
        <div
          className="absolute inset-0 w-full lg:h-full h-[calc(65vh)] -z-10 overflow-hidden md:scale-200 scale-100 lg:scale-110"
          data-parallax="fix"
          data-speed="0.5"
        >
          <VimeoEmbed
            videoId={content.banner.vimeoBackgroundVideo}
            title={plainText(content.banner.title)}
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
          className="absolute inset-0 bg-black bg-opacity-30 z-10"
          data-animation="fade"
          data-delay="0.2"
          data-duration="1.0"
        />

        <div className="absolute z-20 text-white top-50 bottom-50 m-auto left-50 md:bottom-10 md:left-8 mb-4">
          <h1
            className="mb-4 text-reveal heading-large"
            data-animation="text-reveal"
            data-delay="3.0"
            data-duration="1.0"
            dangerouslySetInnerHTML={html(content.banner.title)}
          />
        </div>
      </section>

      <section
        className="bg-white p-8 py-[100px] md:py-[150px] xl:py-[200px] white-bg-section"
        id="intro"
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p
            className="mb-[30px] black max-w-[1000px] mx-auto font-semibold leading-[38px]"
            data-animation="fade"
            data-delay="0.6"
            data-duration="1.0"
            aria-label={plainText(content.introduction)}
            dangerouslySetInnerHTML={html(content.introduction)}
          />

          <div
            className="max-w-[720px] mx-auto text-left"
            data-animation="fade"
            data-delay="0.8"
            data-duration="1.0"
          >
            <label htmlFor="articles-search" className="sr-only">
              Search articles
            </label>
            <div className="relative">
              <input
                id="articles-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search our articles by category"
                className="w-full bg-transparent border-b border-[#bfb6ad] px-0 py-3 pr-10 text-base black placeholder:text-gray-500 focus:outline-none focus:border-secondary-color"
                autoComplete="off"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-sm uppercase text-gray-500 hover:text-black transition-colors"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {isSearching ? (
        searchResults.length > 0 ? (
          <section
            className="bg-white p-8 pt-0 pb-[100px] md:pb-[150px] white-bg-section scroll-m-[100px]"
            id="search-results"
          >
            <div className="max-w-[1400px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="heading-small mb-4 secondary-color">
                  Search results ({searchResults.length})
                </h2>
              </div>
              <div className="flex flex-col">
                {searchResults.map((article, index) => (
                  <React.Fragment key={article.link}>
                    <ArticleCard
                      article={article}
                      layout="list"
                      onNavigate={handleNavigation}
                      animationDelay={0.0 + index * 0.1}
                      categories={categories}
                    />
                    {index < searchResults.length - 1 && (
                      <div className="my-16 border-t border-gray-200" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section
            className="bg-white px-8 pt-0 pb-[100px] md:pb-[150px] white-bg-section"
            id="search-results"
          >
            <div className="max-w-[1400px] mx-auto text-center">
              <p className="black text-lg">
                No articles found for &ldquo;{trimmedSearch}&rdquo;. Try a different keyword.
              </p>
            </div>
          </section>
        )
      ) : (
        <>
          <section
            className="bg-white p-8 pt-0 white-bg-section scroll-m-[100px]"
            data-animation="fade"
            data-delay="0.2"
            data-duration="1.0"
            id="latest-articles"
          >
            <div className="max-w-[1400px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="heading-small mb-4 secondary-color">Latest Articles</h2>
              </div>
              <div className="flex flex-col">
                {latestArticles.map((article, index) => (
                  <ArticleCard
                    key={article.link}
                    article={article}
                    layout="list"
                    onNavigate={handleNavigation}
                    animationDelay={0.0 + index * 0.1}
                    categories={categories}
                  />
                ))}
              </div>
            </div>
          </section>

          <AllArticlesSection
            categoryTabs={categoryTabs}
            activeCategoryId={activeCategoryId}
            paginatedArticles={pagination.items}
            page={pagination.page}
            totalPages={pagination.totalPages}
            categories={categories}
            onCategoryChange={handleCategoryChange}
            onPageChange={handlePageChange}
            onNavigate={handleNavigation}
          />
        </>
      )}

      <section
        className="bg-white pb-[50px] md:pb-[150px] white-bg-section overflow-hidden scroll-m-[150px]"
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
              data-delay="0.5"
              data-duration="0.5"
              dangerouslySetInnerHTML={html(content.cta.heading)}
            />
            {content.cta.content ? (
              <p
                className="text-white mt-4 max-w-[800px] mx-auto"
                dangerouslySetInnerHTML={html(content.cta.content)}
              />
            ) : null}
          </div>
          <AnimatedButton
            onClick={() => handleNavigation(content.cta.buttonLink)}
            dataAnimation="fade"
            dataDelay="2.0"
            dataDuration="0.8"
            className="mt-[50px] text-sm m-auto z-50 uppercase relative"
          >
            <b dangerouslySetInnerHTML={html(content.cta.button)} />
          </AnimatedButton>
        </div>
      </section>
    </div>
  );
};

export default ArticlesPageContent;

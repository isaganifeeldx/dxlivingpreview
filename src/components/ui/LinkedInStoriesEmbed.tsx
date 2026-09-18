'use client';

import type { FC } from 'react';
import { useNearViewportOnce } from '@/hooks/useNearViewportOnce';

const FLOCKLER_EMBED_SRC =
  'https://plugins.flockler.com/embed/iframe/186c87dc6a7095503f00a33991498886/19ac87d6cd6058934504c460682198c3';

interface LinkedInStoriesEmbedProps {
  title?: string;
  iframeId?: string;
  className?: string;
  height?: number | string;
  width?: number | string;
}

/**
 * Defers the Flockler/LinkedIn Stories iframe until the section is near the viewport,
 * so LinkedIn media (~1.5MB+) is not requested on initial page load.
 */
const LinkedInStoriesEmbed: FC<LinkedInStoriesEmbedProps> = ({
  title = 'DX Living LinkedIn stories',
  iframeId = 'flockler-embed-iframe-19ac87d6cd6058934504c460682198c3',
  className = 'mt-[-30px] md:mt-[0px]',
  height = 440,
  width = 1200,
}) => {
  const { ref, shouldLoad } = useNearViewportOnce({ rootMargin: '300px 0px' });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        minHeight: typeof height === 'number' ? height : undefined,
      }}
    >
      {shouldLoad ? (
        <iframe
          src={FLOCKLER_EMBED_SRC}
          id={iframeId}
          height={height}
          width={width}
          style={{ display: 'block', border: 'none', width: '100%' }}
          title={title}
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <div
          aria-hidden
          style={{
            height: typeof height === 'number' ? height : 440,
            width: '100%',
            backgroundColor: '#f5f5f5',
          }}
        />
      )}
    </div>
  );
};

export default LinkedInStoriesEmbed;

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useViewportAutoplay } from '@/hooks/useViewportAutoplay';
import { useNearViewportOnce } from '@/hooks/useNearViewportOnce';
import {
  registerHeroVideoCandidate,
  signalHeroVideoReady,
} from '@/lib/heroVideoGate'
import { isShellReady, subscribeShellReady } from '@/lib/shellReadyGate'
import { loadVimeoApi } from '@/lib/vimeoApi'
import { getVimeoThumbnailUrl } from '@/lib/vimeoThumbnail'

interface VimeoEmbedProps {
  videoId: string;
  title: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
  parallax?: boolean;
  stretch?: boolean;
  viewportAutoplay?: boolean;
  viewportThreshold?: number;
  volumeTransitionDuration?: number;
  /** Assigns an id to the iframe (e.g. `mainVideo` for VideoSeekBar on the homepage). */
  iframeId?: string;
  /** Exposes the player on `window.mainVideoPlayer` for VideoSeekBar. */
  registerMainVideoPlayer?: boolean;
  /** Signals the global preloader that this hero video is ready to reveal. */
  signalPageReady?: boolean;
  /**
   * Full-viewport cover layout (homepage hero). Centers the iframe and uses
   * `video-container` styling instead of the default 16:9 embed box + stretch.
   */
  backgroundCover?: boolean;
  /**
   * Defer iframe + Vimeo API until near the viewport.
   * Opt-in only — use on homepage below-fold embeds, not site-wide.
   */
  lazy?: boolean;
  /**
   * Optional poster override. When omitted, the Vimeo upload thumbnail is fetched
   * automatically so every embed avoids a white flash before playback.
   */
  poster?: string | null;
  /**
   * Optional extra class for the poster image (e.g. homepage crop alignment).
   */
  posterClassName?: string;
  /** Delay iframe load (ms) so poster can paint first. */
  deferEmbedMs?: number;
  /** Vimeo quality hint. Prefer `auto` for first paint. */
  quality?: string;
}

const VimeoEmbed: React.FC<VimeoEmbedProps> = ({
  videoId,
  title,
  className = '',
  autoplay = true,
  loop = true,
  controls = false,
  muted = false,
  parallax = false,
  stretch = false,
  viewportAutoplay = false,
  viewportThreshold = 0.5,
  volumeTransitionDuration = 1000,
  iframeId,
  registerMainVideoPlayer = false,
  signalPageReady = false,
  backgroundCover = false,
  lazy = false,
  poster,
  posterClassName = '',
  deferEmbedMs = 0,
  quality = 'auto',
}) => {
  const playerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(poster ?? null);
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [deferPassed, setDeferPassed] = useState(deferEmbedMs <= 0)
  const [shellReady, setShellReadyState] = useState(false)
  const volumeTransitionRef = useRef<NodeJS.Timeout | null>(null)
  const [currentVolume, setCurrentVolume] = useState(0)
  const posterReadySignaledRef = useRef(false)

  const { ref: nearViewportRef, shouldLoad: nearViewportShouldLoad } = useNearViewportOnce({
    eager: !lazy,
    rootMargin: '200px 0px',
  })

  // Autoplay iframes created while intro/preload hides the page often never start.
  // Wait until SiteShell reveals content, then mount the player and play.
  const waitForShell = autoplay && !viewportAutoplay
  const shouldLoad =
    nearViewportShouldLoad && deferPassed && (!waitForShell || shellReady)

  useEffect(() => {
    setShellReadyState(isShellReady())
    return subscribeShellReady(setShellReadyState)
  }, [])

  const { elementRef: viewportAutoplayRef, isVisible } = useViewportAutoplay({
    threshold: viewportThreshold,
    rootMargin: '0px',
  })

  const setContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      nearViewportRef.current = node
      viewportAutoplayRef(node)
    },
    [viewportAutoplayRef],
  )

  const transitionVolume = (targetVolume: number, duration: number) => {
    if (!playerRef.current) return;

    if (volumeTransitionRef.current) {
      clearInterval(volumeTransitionRef.current);
    }

    const startVolume = currentVolume;
    const volumeDifference = targetVolume - startVolume;
    const steps = 30;
    const stepDuration = duration / steps;
    let step = 0;

    volumeTransitionRef.current = setInterval(() => {
      step++;
      const progress = step / steps;
      const newVolume = startVolume + volumeDifference * progress;

      setCurrentVolume(newVolume);
      playerRef.current.setVolume(newVolume).catch((error: any) => {
        console.log('Volume change failed:', error);
      });

      if (step >= steps) {
        clearInterval(volumeTransitionRef.current!);
        volumeTransitionRef.current = null;
      }
    }, stepDuration);
  };

  useEffect(() => {
    if (poster) {
      setThumbnailUrl(poster);
      return;
    }

    let cancelled = false;
    getVimeoThumbnailUrl(videoId)
      .then((url) => {
        if (!cancelled && url) setThumbnailUrl(url);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [poster, videoId]);

  useEffect(() => {
    if (deferEmbedMs <= 0) {
      setDeferPassed(true);
      return;
    }

    let idleId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      setDeferPassed(true);
    }, deferEmbedMs);

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === 'function') {
      idleId = win.requestIdleCallback(
        () => {
          setDeferPassed(true);
        },
        { timeout: deferEmbedMs },
      );
    }

    return () => {
      window.clearTimeout(timeoutId);
      if (idleId !== undefined && typeof win.cancelIdleCallback === 'function') {
        win.cancelIdleCallback(idleId);
      }
    };
  }, [deferEmbedMs]);

  useEffect(() => {
    if (!signalPageReady) return;
    registerHeroVideoCandidate();
  }, [signalPageReady]);

  const markPosterReady = useCallback(() => {
    if (!signalPageReady || posterReadySignaledRef.current) return;
    posterReadySignaledRef.current = true;
    signalHeroVideoReady();
  }, [signalPageReady]);

  useEffect(() => {
    if (!signalPageReady || !thumbnailUrl) return;

    let cancelled = false;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (!cancelled) markPosterReady();
    };
    img.onerror = () => {
      if (!cancelled) markPosterReady();
    };
    img.src = thumbnailUrl;

    const fallback = window.setTimeout(() => {
      if (!cancelled) markPosterReady();
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, [thumbnailUrl, signalPageReady, markPosterReady]);

  useEffect(() => {
    if (!shouldLoad) return;

    let cancelled = false;

    loadVimeoApi()
      .then(() => {
        if (cancelled || !iframeRef.current) return;
        const Vimeo = (window as Window & { Vimeo?: { Player: new (el: HTMLIFrameElement) => unknown } })
          .Vimeo;
        if (!Vimeo) return;
        playerRef.current = new Vimeo.Player(iframeRef.current);
        setIsPlayerReady(true);
      })
      .catch(() => {
        // Player API failed; iframe may still play without API controls.
      });

    return () => {
      cancelled = true;
      if (volumeTransitionRef.current) {
        clearInterval(volumeTransitionRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy?.();
        playerRef.current = null;
      }
      setIsPlayerReady(false);
    };
  }, [shouldLoad]);

  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return
    if (!autoplay || viewportAutoplay) return

    const player = playerRef.current
    let cancelled = false

    const ensurePlaying = async () => {
      try {
        await player.setVolume?.(0)
        await player.setMuted?.(true)
      } catch {
        // Optional API methods may be unavailable.
      }

      try {
        await player.play()
      } catch {
        // Autoplay may still be blocked; background mode usually allows muted play.
      }

      // Native iframe autoplay can start before Player listeners attach — if we
      // missed the play event, still reveal the iframe once playback is active.
      try {
        const paused = await player.getPaused?.()
        if (!cancelled && paused === false) {
          setIsVideoVisible(true)
        }
      } catch {
        // Ignore.
      }
    }

    ensurePlaying()
    const retryId = window.setTimeout(() => {
      if (!cancelled) ensurePlaying()
    }, 400)

    const retryIntervalId = window.setInterval(() => {
      if (cancelled || isVideoVisible) return
      ensurePlaying()
    }, 700)

    return () => {
      cancelled = true
      window.clearTimeout(retryId)
      window.clearInterval(retryIntervalId)
    }
  }, [autoplay, isPlayerReady, viewportAutoplay, isVideoVisible])

  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return

    let isCancelled = false
    const player = playerRef.current

    const revealVideo = () => {
      if (isCancelled) return
      setIsVideoVisible(true)
      markPosterReady()
    }

    // If there is no thumbnail, show the iframe as soon as it can play.
    if (!thumbnailUrl) {
      revealVideo()
    }

    player
      .ready()
      .then(async () => {
        if (isCancelled) return

        player.on('loaded', revealVideo)
        player.on('play', revealVideo)
        player.on('playing', revealVideo)

        try {
          const duration = await player.getDuration()
          if (duration > 0 && !thumbnailUrl) {
            revealVideo()
          }
        } catch {
          // Wait for loaded/play events.
        }

        // Cover the race where autoplay already started before listeners attached.
        try {
          const paused = await player.getPaused?.()
          if (paused === false) {
            revealVideo()
            return
          }
        } catch {
          // Continue to explicit play().
        }

        if (autoplay && !viewportAutoplay) {
          await player.play().catch(() => undefined)
          try {
            const paused = await player.getPaused?.()
            if (paused === false) {
              revealVideo()
              return
            }
          } catch {
            // Fall through.
          }
          if (!thumbnailUrl) {
            revealVideo()
          }
        }
      })
      .catch(() => {
        if (!isCancelled) revealVideo()
      })

    const fallbackTimeout = window.setTimeout(revealVideo, 5000)

    return () => {
      isCancelled = true
      window.clearTimeout(fallbackTimeout)
    }
  }, [autoplay, isPlayerReady, thumbnailUrl, viewportAutoplay, markPosterReady])

  useEffect(() => {
    if (!viewportAutoplay || !isPlayerReady || !playerRef.current) return;

    const player = playerRef.current;
    let cancelled = false;
    let pauseTimeoutId: number | undefined;
    let retryTimeoutId: number | undefined;

    const playInView = async () => {
      // Browsers block unmuted autoplay — start muted, then fade volume up.
      try {
        await player.setMuted?.(true);
        await player.setVolume?.(0);
      } catch {
        // Optional API methods may be unavailable.
      }

      try {
        await player.play();
      } catch (error) {
        console.log('Play failed:', error);
        return;
      }

      if (cancelled) return;

      setIsVideoVisible(true);
      try {
        const paused = await player.getPaused?.();
        if (paused === false) {
          transitionVolume(1, volumeTransitionDuration);
        }
      } catch {
        transitionVolume(1, volumeTransitionDuration);
      }
    };

    if (isVisible) {
      void playInView();
      retryTimeoutId = window.setTimeout(() => {
        if (!cancelled) void playInView();
      }, 400);
    } else {
      // Leave threshold crossed (e.g. ≤70% visible) — pause right away.
      transitionVolume(0, Math.min(volumeTransitionDuration, 250));
      pauseTimeoutId = window.setTimeout(() => {
        player.pause().catch((error: any) => {
          console.log('Pause failed:', error);
        });
      }, 50);
    }

    return () => {
      cancelled = true;
      if (retryTimeoutId !== undefined) window.clearTimeout(retryTimeoutId);
      if (pauseTimeoutId !== undefined) window.clearTimeout(pauseTimeoutId);
    };
  }, [isVisible, viewportAutoplay, isPlayerReady, volumeTransitionDuration]);

  useEffect(() => {
    if (!registerMainVideoPlayer || !isPlayerReady || !playerRef.current) return;

    const win = window as Window & {
      mainVideoPlayer?: unknown;
      dispatchEvent: (event: Event) => boolean;
    };
    win.mainVideoPlayer = playerRef.current;
    win.dispatchEvent(new Event('main-video-player-ready'));

    return () => {
      delete win.mainVideoPlayer;
    };
  }, [registerMainVideoPlayer, isPlayerReady]);

  const buildVimeoUrl = () => {
    const params = new URLSearchParams({
      badge: '0',
      autopause: '0',
      player_id: '0',
      app_id: '58479',
      autoplay: (viewportAutoplay ? false : autoplay) ? '1' : '0',
      loop: loop ? '1' : '0',
      controls: controls ? '1' : '0',
      // viewportAutoplay must start muted or browsers block play() when scrolled into view
      muted: muted || autoplay || viewportAutoplay ? '1' : '0',
      background: '1',
      // Reduce Vimeo analytics beacons (e.g. flarepoint) that can spam CORS console noise.
      dnt: '1',
      quality,
    });

    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  };

  const iframeProps = {
    ref: iframeRef,
    id: iframeId,
    src: shouldLoad ? buildVimeoUrl() : undefined,
    frameBorder: '0' as const,
    allow:
      'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share',
    referrerPolicy: 'strict-origin-when-cross-origin' as const,
    title,
  };

  if (backgroundCover) {
    return (
      <div className={`video-container ${className}`} ref={setContainerRef}>
        {/* Poster + iframe share .video-media-layer transforms (incl. homepage scale) */}
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            width={1920}
            height={1080}
            decoding="async"
            loading={signalPageReady ? 'eager' : 'lazy'}
            fetchPriority={signalPageReady ? 'high' : 'auto'}
            onLoad={markPosterReady}
            onError={markPosterReady}
            className={`video-media-layer video-media-layer--poster ${posterClassName}`.trim()}
          />
        ) : null}
        {shouldLoad ? (
          <iframe
            {...iframeProps}
            className="video-media-layer video-media-layer--video cursor-default"
            style={{
              opacity: isVideoVisible ? 1 : 0,
              transition: 'opacity 0.45s ease-in-out',
            }}
          />
        ) : null}
      </div>
    );
  }

  const mediaStyle: React.CSSProperties = {
    position: 'absolute',
    top: stretch ? '-20%' : '0',
    left: stretch ? '-20%' : '0',
    width: stretch ? '130%' : '100%',
    height: stretch ? '130%' : '100%',
    transform: parallax ? 'scale(1.1)' : 'none',
    willChange: parallax ? 'transform' : 'auto',
  };

  return (
    <div className={`vimeo-embed ${className}`} ref={setContainerRef}>
      <div
        style={{
          padding: className.includes('w-full h-full') ? '0' : '56.25% 0 0 0',
          position: 'relative',
          width: '100%',
          height: className.includes('w-full h-full') ? '100%' : 'auto',
          backgroundColor: '#0a0a0a',
          overflow: stretch ? 'hidden' : 'visible',
        }}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            width={1920}
            height={1080}
            decoding="async"
            loading={signalPageReady ? 'eager' : 'lazy'}
            fetchPriority={signalPageReady ? 'high' : 'auto'}
            onLoad={markPosterReady}
            onError={markPosterReady}
            className="pointer-events-none"
            style={{ ...mediaStyle, zIndex: 0, objectFit: 'cover' }}
          />
        ) : null}
        {shouldLoad ? (
          <iframe
            {...iframeProps}
            style={{
              ...mediaStyle,
              backgroundColor: 'transparent',
              zIndex: 1,
              opacity: isVideoVisible ? 1 : 0,
              transition: 'opacity 0.45s ease-in-out',
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default VimeoEmbed;

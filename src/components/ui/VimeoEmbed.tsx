'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useViewportAutoplay } from '@/hooks/useViewportAutoplay';
import { useNearViewportOnce } from '@/hooks/useNearViewportOnce';
import {
  registerHeroVideoCandidate,
  signalHeroVideoReady,
} from '@/lib/heroVideoGate'
import { isShellReady, subscribeShellReady } from '@/lib/shellReadyGate'
import { loadVimeoApi, withVimeoPlayerInitSlot } from '@/lib/vimeoApi'
import { getVimeoThumbnailUrl } from '@/lib/vimeoThumbnail'

type VimeoPlayerInstance = {
  play: () => Promise<void>
  pause: () => Promise<void>
  setVolume: (volume: number) => Promise<void>
  setMuted?: (muted: boolean) => Promise<void>
  getPaused?: () => Promise<boolean>
  getDuration: () => Promise<number>
  ready: () => Promise<void>
  on: (event: string, callback: () => void) => void
  off: (event: string, callback: () => void) => void
  destroy?: () => void
}

/** Vimeo postMessage routes by player_id — must be unique per iframe on the page. */
let vimeoPlayerIdSeq = 0

/** Reveal poster even if Player API hangs (common with many simultaneous embeds). */
const REVEAL_FALLBACK_MS = 2500
const PLAYER_READY_TIMEOUT_MS = 2500

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
  const reactId = useId().replace(/:/g, '')
  const playerIdRef = useRef<string | null>(null)
  if (!playerIdRef.current) {
    vimeoPlayerIdSeq += 1
    playerIdRef.current = `dxv-${videoId}-${reactId || vimeoPlayerIdSeq}`
  }
  const playerId = playerIdRef.current
  const resolvedIframeId = iframeId ?? playerId

  const playerRef = useRef<VimeoPlayerInstance | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(poster ?? null);
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [deferPassed, setDeferPassed] = useState(deferEmbedMs <= 0)
  const [shellReady, setShellReadyState] = useState(false)
  const volumeTransitionRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentVolumeRef = useRef(0)
  const posterReadySignaledRef = useRef(false)
  const isVideoVisibleRef = useRef(false)

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
      nearViewportRef(node)
      viewportAutoplayRef(node)
    },
    [nearViewportRef, viewportAutoplayRef],
  )

  const markPosterReady = useCallback(() => {
    if (!signalPageReady || posterReadySignaledRef.current) return;
    posterReadySignaledRef.current = true;
    signalHeroVideoReady();
  }, [signalPageReady]);

  const revealVideo = useCallback(() => {
    if (isVideoVisibleRef.current) {
      markPosterReady()
      return
    }
    isVideoVisibleRef.current = true
    setIsVideoVisible(true)
    markPosterReady()
  }, [markPosterReady])

  const transitionVolume = (targetVolume: number, duration: number) => {
    if (!playerRef.current) return;

    if (volumeTransitionRef.current) {
      clearInterval(volumeTransitionRef.current);
    }

    const startVolume = currentVolumeRef.current;
    const volumeDifference = targetVolume - startVolume;
    const steps = 30;
    const stepDuration = duration / steps;
    let step = 0;

    volumeTransitionRef.current = setInterval(() => {
      step++;
      const progress = step / steps;
      const newVolume = startVolume + volumeDifference * progress;

      currentVolumeRef.current = newVolume;
      playerRef.current?.setVolume(newVolume).catch(() => {
        // Volume API may be unavailable on background embeds.
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

  // Always lift the poster after the iframe mounts — even if Player API never
  // becomes ready (the root cause of "stuck on thumbnail" on multi-embed pages).
  useEffect(() => {
    if (!shouldLoad) return

    const fallbackId = window.setTimeout(revealVideo, REVEAL_FALLBACK_MS)
    return () => window.clearTimeout(fallbackId)
  }, [shouldLoad, revealVideo])

  useEffect(() => {
    if (!shouldLoad) return;

    let cancelled = false;

    const initPlayer = async () => {
      try {
        await loadVimeoApi()
        if (cancelled || !iframeRef.current) return

        const Vimeo = (
          window as Window & {
            Vimeo?: { Player: new (el: HTMLIFrameElement) => VimeoPlayerInstance }
          }
        ).Vimeo
        if (!Vimeo) return

        await withVimeoPlayerInitSlot(async () => {
          if (cancelled || !iframeRef.current) return

          const player = new Vimeo.Player(iframeRef.current)
          playerRef.current = player

          // Do not block forever on ready() — that left iframes at opacity 0.
          await Promise.race([
            player.ready().catch(() => undefined),
            new Promise<void>((resolve) => {
              window.setTimeout(resolve, PLAYER_READY_TIMEOUT_MS)
            }),
          ])

          if (cancelled) {
            player.destroy?.()
            if (playerRef.current === player) playerRef.current = null
            return
          }

          setIsPlayerReady(true)
        })
      } catch {
        // Player API failed; iframe may still play via native autoplay URL.
        // Reveal so the user is not stuck on the poster.
        if (!cancelled) revealVideo()
      }
    }

    void initPlayer()

    return () => {
      cancelled = true;
      if (volumeTransitionRef.current) {
        clearInterval(volumeTransitionRef.current);
        volumeTransitionRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.destroy?.();
        playerRef.current = null;
      }
      setIsPlayerReady(false);
    };
  }, [shouldLoad, revealVideo]);

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

      try {
        const paused = await player.getPaused?.()
        if (!cancelled && paused === false) {
          revealVideo()
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
      if (cancelled || isVideoVisibleRef.current) return
      ensurePlaying()
    }, 700)

    return () => {
      cancelled = true
      window.clearTimeout(retryId)
      window.clearInterval(retryIntervalId)
    }
  }, [autoplay, isPlayerReady, viewportAutoplay, revealVideo])

  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return

    let isCancelled = false
    const player = playerRef.current

    const onReveal = () => {
      if (!isCancelled) revealVideo()
    }

    if (!thumbnailUrl) {
      onReveal()
    }

    player.on('loaded', onReveal)
    player.on('play', onReveal)
    player.on('playing', onReveal)

    player
      .ready()
      .then(async () => {
        if (isCancelled) return

        try {
          const paused = await player.getPaused?.()
          if (paused === false) {
            onReveal()
            return
          }
        } catch {
          // Continue to explicit play().
        }

        if (autoplay && !viewportAutoplay) {
          await player.play().catch(() => undefined)
          try {
            const paused = await player.getPaused?.()
            if (paused === false) onReveal()
          } catch {
            // Fall through.
          }
        }
      })
      .catch(() => {
        if (!isCancelled) onReveal()
      })

    return () => {
      isCancelled = true
      try {
        player.off('loaded', onReveal)
        player.off('play', onReveal)
        player.off('playing', onReveal)
      } catch {
        // Player may already be destroyed.
      }
    }
  }, [autoplay, isPlayerReady, thumbnailUrl, viewportAutoplay, revealVideo])

  useEffect(() => {
    if (!viewportAutoplay || !isPlayerReady || !playerRef.current) return;

    const player = playerRef.current;
    let cancelled = false;
    let pauseTimeoutId: number | undefined;
    let retryTimeoutId: number | undefined;

    const playInView = async () => {
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

      revealVideo();
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
      transitionVolume(0, Math.min(volumeTransitionDuration, 250));
      pauseTimeoutId = window.setTimeout(() => {
        player.pause().catch(() => {
          // Ignore pause failures on teardown.
        });
      }, 50);
    }

    return () => {
      cancelled = true;
      if (retryTimeoutId !== undefined) window.clearTimeout(retryTimeoutId);
      if (pauseTimeoutId !== undefined) window.clearTimeout(pauseTimeoutId);
    };
  }, [isVisible, viewportAutoplay, isPlayerReady, volumeTransitionDuration, revealVideo]);

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

  const vimeoUrl = useMemo(() => {
    const params = new URLSearchParams({
      badge: '0',
      autopause: '0',
      // Unique per embed — shared player_id=0 breaks multi-embed Player API messaging.
      player_id: playerId,
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
  }, [
    playerId,
    videoId,
    viewportAutoplay,
    autoplay,
    loop,
    controls,
    muted,
    quality,
  ]);

  const handleIframeLoad = useCallback(() => {
    // Native autoplay may already be running; don't wait only on Player events.
    if (autoplay && !viewportAutoplay) {
      revealVideo()
    }
  }, [autoplay, viewportAutoplay, revealVideo])

  const iframeProps = {
    ref: iframeRef,
    id: resolvedIframeId,
    src: shouldLoad ? vimeoUrl : undefined,
    frameBorder: '0' as const,
    allow:
      'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share',
    referrerPolicy: 'strict-origin-when-cross-origin' as const,
    title,
    onLoad: handleIframeLoad,
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

  const isFullBleed = className.includes('w-full h-full')
  // Full-bleed CTA/banner: cover the box first; section CSS scales poster+iframe together.
  // Stretch/parallax extras still apply for non-CSS-scaled pages.
  const mediaStyle: React.CSSProperties = isFullBleed
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        objectFit: 'cover',
        objectPosition: 'center center',
        transform: parallax || stretch ? 'scale(1.15)' : 'none',
        transformOrigin: 'center center',
        willChange: parallax ? 'transform' : 'auto',
      }
    : {
        position: 'absolute',
        top: stretch ? '-20%' : '0',
        left: stretch ? '-20%' : '0',
        width: stretch ? '130%' : '100%',
        height: stretch ? '130%' : '100%',
        objectFit: 'cover',
        objectPosition: 'center center',
        transform: parallax ? 'scale(1.1)' : 'none',
        willChange: parallax ? 'transform' : 'auto',
      };

  return (
    <div className={`vimeo-embed ${className}`} ref={setContainerRef}>
      <div
        style={{
          padding: isFullBleed ? '0' : '56.25% 0 0 0',
          position: 'relative',
          width: '100%',
          height: isFullBleed ? '100%' : 'auto',
          backgroundColor: '#0a0a0a',
          overflow: 'hidden',
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
            className="pointer-events-none vimeo-embed__poster"
            style={{ ...mediaStyle, zIndex: 0 }}
          />
        ) : null}
        {shouldLoad ? (
          <iframe
            {...iframeProps}
            className="vimeo-embed__video"
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

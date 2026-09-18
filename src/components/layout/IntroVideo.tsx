'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { getVimeoThumbnailUrl } from '@/lib/vimeoThumbnail';

interface IntroVideoProps {
  onVideoComplete: () => void;
  onSkip: () => void;
  showSkipImmediately?: boolean;
  videoId: string;
  mobileVideoId?: string;
}

const INTRO_AUTO_SKIP_SECONDS = 8;

const IntroVideo: React.FC<IntroVideoProps> = ({
  onVideoComplete,
  onSkip,
  showSkipImmediately = false,
  videoId,
  mobileVideoId,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  type VimeoPlayer = {
    destroy: () => Promise<void>;
    pause: () => Promise<void>;
    play: () => Promise<void>;
    setVolume: (volume: number) => Promise<void>;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    off: (event: string, callback: (...args: unknown[]) => void) => void;
  };

  const playerRef = useRef<VimeoPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(showSkipImmediately);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMuteStatus, setShowMuteStatus] = useState(true);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [autoSkipActive, setAutoSkipActive] = useState(true);
  const [skipCountdown, setSkipCountdown] = useState(INTRO_AUTO_SKIP_SECONDS);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return videoId;
    }
    const isPortrait = window.innerHeight > window.innerWidth;
    return isPortrait && mobileVideoId ? mobileVideoId : videoId;
  });
  const [isSwitchingVideo, setIsSwitchingVideo] = useState(false);
  const skipDestroyRef = useRef(false);
  const showSkipButtonRef = useRef(showSkipImmediately);
  const hasEndedRef = useRef(false);
  const autoSkipActiveRef = useRef(true);

  useEffect(() => {
    showSkipButtonRef.current = showSkipButton;
  }, [showSkipButton]);

  useEffect(() => {
    hasEndedRef.current = hasEnded;
  }, [hasEnded]);

  useEffect(() => {
    autoSkipActiveRef.current = autoSkipActive;
  }, [autoSkipActive]);

  useEffect(() => {
    let cancelled = false;
    setIsVideoVisible(false);

    getVimeoThumbnailUrl(currentVideoId)
      .then((url) => {
        if (!cancelled) setThumbnailUrl(url);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [currentVideoId]);

  const checkIsPortrait = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight > window.innerWidth;
  }, []);

  const getVideoIdForOrientation = useCallback(() => {
    if (checkIsPortrait() && mobileVideoId) {
      return mobileVideoId;
    }
    return videoId;
  }, [checkIsPortrait, mobileVideoId, videoId]);

  const buildVimeoUrl = useCallback(
    (videoIdToUse?: string) => {
      const vidId = videoIdToUse || currentVideoId;
      const params = new URLSearchParams({
        autoplay: '1',
        loop: '0',
        muted: '1',
        background: '0',
        badge: '0',
        autopause: '0',
        controls: '0',
        // Reduce Vimeo analytics beacons (e.g. flarepoint) that can spam CORS console noise.
        dnt: '1',
      });

      return `https://player.vimeo.com/video/${vidId}?${params.toString()}`;
    },
    [currentVideoId],
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const existingScript = document.querySelector(
      'script[src="https://player.vimeo.com/api/player.js"]',
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!mobileVideoId || hasEnded) return;

    let resizeTimer: ReturnType<typeof setTimeout>;
    let orientationTimer: ReturnType<typeof setTimeout>;

    const handleOrientationChange = () => {
      clearTimeout(orientationTimer);
      orientationTimer = setTimeout(() => {
        const newVideoId = getVideoIdForOrientation();

        if (newVideoId !== currentVideoId && !hasEnded && isPlayerReady) {
          setIsSwitchingVideo(true);
          skipDestroyRef.current = true;

          if (playerRef.current) {
            playerRef.current.pause().catch(() => {});
          }

          setIsPlayerReady(false);
          setIsPlaying(false);
          setShowSkipButton(showSkipImmediately);
          setHasError(false);
          setShowMuteStatus(true);

          const oldPlayer = playerRef.current;
          playerRef.current = null;

          setCurrentVideoId(newVideoId);

          setTimeout(() => {
            if (oldPlayer) {
              try {
                oldPlayer.destroy().catch(() => {});
              } catch {
                // Ignore cleanup errors
              }
            }
            skipDestroyRef.current = false;
            setIsSwitchingVideo(false);
          }, 300);
        }
      }, 300);
    };

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleOrientationChange, 300);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      clearTimeout(resizeTimer);
      clearTimeout(orientationTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [
    currentVideoId,
    mobileVideoId,
    hasEnded,
    isPlayerReady,
    showSkipImmediately,
    getVideoIdForOrientation,
  ]);

  useEffect(() => {
    if (!iframeRef.current || isSwitchingVideo) return;

    let retryCount = 0;
    const maxRetries = 50;

    const initPlayer = () => {
      const Vimeo = (window as Window & { Vimeo?: { Player: new (el: HTMLIFrameElement) => VimeoPlayer } }).Vimeo;
      if (Vimeo && iframeRef.current) {
        playerRef.current = new Vimeo.Player(iframeRef.current);
        setIsPlayerReady(true);
      } else if (retryCount < maxRetries) {
        retryCount += 1;
        setTimeout(initPlayer, 100);
      } else {
        console.error('Failed to load Vimeo Player API');
        setHasError(true);
      }
    };

    initPlayer();

    return () => {
      if (skipDestroyRef.current) {
        return;
      }

      if (playerRef.current) {
        try {
          if (iframeRef.current?.parentNode) {
            playerRef.current.destroy().catch(() => {});
          }
        } catch {
          // Ignore cleanup errors
        }
        playerRef.current = null;
      }
    };
  }, [currentVideoId, isSwitchingVideo]);

  useEffect(() => {
    if (!isPlayerReady || !playerRef.current || hasEndedRef.current) return;

    const player = playerRef.current;
    let skipTimer: ReturnType<typeof setTimeout> | undefined;
    let muteStatusTimer: ReturnType<typeof setTimeout> | undefined;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsVideoVisible(true);

      muteStatusTimer = setTimeout(() => {
        setShowMuteStatus(false);
      }, 5000);
    };

    const handleEnded = () => {
      if (hasEndedRef.current) return;

      hasEndedRef.current = true;
      setHasEnded(true);

      if (playerRef.current) {
        playerRef.current.pause().catch(() => {});
      }

      if (iframeRef.current) {
        iframeRef.current.style.display = 'none';
      }

      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          onVideoComplete();
        },
      });
    };

    const handleTimeUpdate = (...args: unknown[]) => {
      const data = args[0] as { seconds?: number; duration?: number };
      if (
        data.seconds !== undefined &&
        data.seconds >= 1 &&
        !showSkipButtonRef.current &&
        !showSkipImmediately
      ) {
        showSkipButtonRef.current = true;
        setShowSkipButton(true);
      }

      if (
        data.duration &&
        data.seconds !== undefined &&
        data.seconds >= data.duration - 0.1 &&
        !hasEndedRef.current
      ) {
        handleEnded();
      }
    };

    const handleError = () => {
      console.error('Intro video error');
      setHasError(true);
      setTimeout(() => {
        onSkip();
      }, 2000);
    };

    player.on('play', handlePlay);
    player.on('ended', handleEnded);
    player.on('timeupdate', handleTimeUpdate);
    player.on('error', handleError);

    // Show skip controls quickly so users can Stay or Skip.
    if (!showSkipImmediately) {
      skipTimer = setTimeout(() => {
        showSkipButtonRef.current = true;
        setShowSkipButton(true);
      }, 800);
    }

    player.play().catch(() => {
      setHasError(true);
    });

    gsap.to(containerRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    });

    return () => {
      if (skipTimer) {
        clearTimeout(skipTimer);
      }
      if (muteStatusTimer) {
        clearTimeout(muteStatusTimer);
      }
      player.off('play', handlePlay);
      player.off('ended', handleEnded);
      player.off('timeupdate', handleTimeUpdate);
      player.off('error', handleError);
    };
  }, [isPlayerReady, onVideoComplete, onSkip, showSkipImmediately]);

  const finishIntro = useCallback(
    (mode: 'skip' | 'complete') => {
      if (hasEndedRef.current) return;
      hasEndedRef.current = true;
      setHasEnded(true);
      setAutoSkipActive(false);

      if (playerRef.current) {
        playerRef.current.pause().catch(() => {});
      }

      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          if (mode === 'skip') {
            onSkip();
          } else {
            onVideoComplete();
          }
        },
      });
    },
    [onSkip, onVideoComplete],
  );

  // Countdown auto-skip; Stay cancels this and lets the video finish.
  useEffect(() => {
    if (!isPlayerReady || !autoSkipActive || hasEnded) return;

    let remaining = INTRO_AUTO_SKIP_SECONDS;
    setSkipCountdown(remaining);

    const intervalId = window.setInterval(() => {
      if (!autoSkipActiveRef.current || hasEndedRef.current) {
        window.clearInterval(intervalId);
        return;
      }

      remaining -= 1;
      setSkipCountdown(remaining);

      if (remaining <= 0) {
        window.clearInterval(intervalId);
        finishIntro('skip');
      }
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoSkipActive, finishIntro, hasEnded, isPlayerReady]);

  const handleSkip = () => {
    finishIntro('skip');
  };

  const handleStay = () => {
    autoSkipActiveRef.current = false;
    setAutoSkipActive(false);
  };

  const toggleMute = () => {
    if (playerRef.current && isPlayerReady) {
      const currentVolume = isMuted ? 0.7 : 0;
      playerRef.current
        .setVolume(currentVolume)
        .then(() => {
          setIsMuted(!isMuted);
        })
        .catch((error: unknown) => {
          console.error('Error toggling mute:', error);
        });
    }
  };

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-[10000] bg-black flex items-center justify-center"
        style={{ opacity: 1 }}
      >
        <div className="text-center text-white">
          <div className="text-lg mb-4">Video loading failed</div>
          <button
            type="button"
            onClick={handleSkip}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Continue to Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] bg-black flex items-center justify-center"
      style={{ opacity: 0 }}
      data-noindex="true"
      role="dialog"
      aria-label="Intro video"
    >
      <div className="relative w-full h-full overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt=""
            width={1920}
            height={1080}
            decoding="async"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover scale-[1.15] lg:scale-[1.2]"
            style={{
              zIndex: 0,
              opacity: isVideoVisible ? 0 : 1,
              transition: 'opacity 0.45s ease-in-out',
            }}
          />
        ) : null}

        <iframe
          ref={iframeRef}
          src={buildVimeoUrl(currentVideoId)}
          className="pointer-events-none absolute inset-0 h-full w-full scale-[1.15] lg:scale-[1.2]"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Intro video"
          style={{
            objectFit: 'cover',
            zIndex: 1,
            opacity: isVideoVisible ? 1 : 0,
            transition: 'opacity 0.45s ease-in-out',
          }}
          key={currentVideoId}
          tabIndex={-1}
        />

        {!isPlaying && !thumbnailUrl && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-white pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="text-black text-2xl font-light tracking-wider opacity-0"
              ref={(el) => {
                if (el) {
                  gsap.to(el, {
                    opacity: 1,
                    duration: 1.5,
                    ease: 'power2.out',
                    delay: 0.3,
                  });
                }
              }}
            >
              DX LIVING
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={toggleMute}
          className="absolute top-8 left-8 z-30 pointer-events-auto bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-lg transition-all duration-300 hover:scale-105"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute intro video' : 'Mute intro video'}
        >
          {isMuted ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>

        {isMuted && showMuteStatus && (
          <div
            className="absolute top-8 left-[90px] z-30 pointer-events-none bg-black bg-opacity-50 text-white p-3.5 rounded-lg text-sm w-[250px] md:w-fit"
            aria-hidden="true"
          >
            The video is muted. Click the speaker button to unmute.
          </div>
        )}

        {showSkipButton && (
          <div className="absolute bottom-8 inset-x-0 z-30 flex justify-center items-center gap-4 pointer-events-auto">
            {autoSkipActive && (
              <AnimatedButton
                onClick={handleStay}
                dataAnimation="fade"
                dataDelay="0"
                dataDuration="0.8"
                className="text-white relative z-30"
                skipEntranceAnimation
              >
                Stay
              </AnimatedButton>
            )}
            <AnimatedButton
              onClick={handleSkip}
              dataAnimation="fade"
              dataDelay="0"
              dataDuration="0.8"
              className="text-white relative z-30"
              skipEntranceAnimation
            >
              {autoSkipActive ? `Skip Intro (${skipCountdown})` : 'Skip Intro'}
            </AnimatedButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroVideo;

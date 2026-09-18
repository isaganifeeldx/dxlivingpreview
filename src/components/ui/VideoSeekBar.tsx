import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface VideoSeekBarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const VideoSeekBar: React.FC<VideoSeekBarProps> = ({ className = '', ...rest }) => {
  const seekBarContainerRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const seekBarProgressRef = useRef<HTMLDivElement>(null);
  const seekBarHandleRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  /** GSAP inline transforms override Tailwind responsive translate — clear after anim / on resize. */
  const releaseLayoutTransforms = () => {
    const seekBarContainer = seekBarContainerRef.current;
    if (seekBarContainer) {
      gsap.set(seekBarContainer, { clearProps: 'transform,x,y,scale' });
    }
  };

  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [vimeoPlayer, setVimeoPlayer] = useState<unknown>(null);
  const [videoType, setVideoType] = useState<'html5' | 'vimeo'>('html5');

  // Find the video element or Vimeo player (may appear after deferred hero load).
  useEffect(() => {
    let cancelled = false;
    let retryCount = 0;
    const maxRetries = 120; // ~12s — covers deferred homepage Vimeo load
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const assignPlayer = () => {
      if (cancelled) return true;

      const video = document.querySelector('#mainVideo');
      const player = (window as Window & { mainVideoPlayer?: unknown }).mainVideoPlayer;

      if (video instanceof HTMLVideoElement) {
        setVideoElement(video);
        setVideoType('html5');
        return true;
      }

      if (video instanceof HTMLIFrameElement && player) {
        setVimeoPlayer(player);
        setVideoType('vimeo');
        return true;
      }

      return false;
    };

    const checkForVideo = () => {
      if (assignPlayer()) return;

      if (retryCount >= maxRetries) {
        console.warn('Homepage video player not found for seek bar');
        return;
      }

      retryCount += 1;
      timeoutId = setTimeout(checkForVideo, 100);
    };

    const onPlayerReady = () => {
      assignPlayer();
    };

    window.addEventListener('main-video-player-ready', onPlayerReady);
    checkForVideo();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('main-video-player-ready', onPlayerReady);
    };
  }, []);

  useEffect(() => {
    if (!videoElement && !vimeoPlayer) return;

    const seekBar = seekBarRef.current;
    const seekBarProgress = seekBarProgressRef.current;
    const seekBarHandle = seekBarHandleRef.current;
    const seekBarContainer = seekBarContainerRef.current;

    if (!seekBar || !seekBarProgress || !seekBarHandle || !seekBarContainer) {
      return;
    }

    type VimeoPlayerApi = {
      getCurrentTime: () => Promise<number>;
      getDuration: () => Promise<number>;
      setCurrentTime: (time: number) => Promise<number>;
    };

    const player = vimeoPlayer as VimeoPlayerApi | null;

    const getCurrentTime = async (): Promise<number> => {
      if (videoType === 'html5' && videoElement) {
        return videoElement.currentTime;
      }
      if (videoType === 'vimeo' && player) {
        return player.getCurrentTime();
      }
      return 0;
    };

    const getDuration = async (): Promise<number> => {
      if (videoType === 'html5' && videoElement) {
        return videoElement.duration;
      }
      if (videoType === 'vimeo' && player) {
        return player.getDuration();
      }
      return 0;
    };

    const setTime = async (time: number): Promise<void> => {
      if (videoType === 'html5' && videoElement) {
        videoElement.currentTime = time;
      } else if (videoType === 'vimeo' && player) {
        await player.setCurrentTime(time);
      }
    };

    const tl = gsap.timeline({
      onComplete: releaseLayoutTransforms,
    });

    tl.from(seekBarContainer, {
      y: 50,
      opacity: 0.5,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'transform,y',
    });

    const handleResize = () => {
      releaseLayoutTransforms();
    };
    window.addEventListener('resize', handleResize);

    const handleLoadedMetadata = () => {
      gsap.from(seekBar, {
        scaleX: 0,
        duration: 0.8,
        ease: 'power2.out',
        transformOrigin: 'left center',
      });
    };

    const updateSeekBar = async () => {
      if (isDraggingRef.current) return;

      const currentTime = await getCurrentTime();
      const dur = await getDuration();
      if (!(dur > 0)) return;

      const percentage = (currentTime / dur) * 100;

      gsap.to(seekBarProgress, {
        width: `${percentage}%`,
        duration: 0.1,
        ease: 'none',
      });

      gsap.to(seekBarHandle, {
        left: `${percentage}%`,
        duration: 0.1,
        ease: 'none',
      });
    };

    const handleTimeUpdate = () => {
      void updateSeekBar();
    };

    const handleSeekBarClick = async (e: MouseEvent) => {
      if (isDraggingRef.current) return;

      const rect = seekBar.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const dur = await getDuration();
      if (!(dur > 0)) return;

      await setTime(percentage * dur);

      gsap.to(seekBarProgress, {
        width: `${percentage * 100}%`,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(seekBarHandle, {
        left: `${percentage * 100}%`,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      e.preventDefault();

      seekBarHandle.style.cursor = 'grabbing';
      seekBarHandle.classList.add('dragging');

      gsap.to(seekBarHandle, {
        scale: 1.4,
        duration: 0.2,
        ease: 'power2.out',
      });

      const handleMouseMove = async (moveEvent: MouseEvent) => {
        if (!isDraggingRef.current) return;

        const rect = seekBar.getBoundingClientRect();
        const percentage = Math.max(
          0,
          Math.min(1, (moveEvent.clientX - rect.left) / rect.width),
        );
        const dur = await getDuration();
        if (!(dur > 0)) return;

        await setTime(percentage * dur);
        gsap.set(seekBarProgress, { width: `${percentage * 100}%` });
        gsap.set(seekBarHandle, { left: `${percentage * 100}%` });
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        seekBarHandle.style.cursor = 'grab';
        seekBarHandle.classList.remove('dragging');

        gsap.to(seekBarHandle, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
        });

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleSeekBarMouseEnter = () => {
      gsap.to(seekBar, {
        height: 8,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(seekBarHandle, {
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleSeekBarMouseLeave = () => {
      gsap.to(seekBar, {
        height: 6,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(seekBarHandle, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleKeyDown = async (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[contenteditable="true"]');

      if (isInputField) return;

      switch (e.code) {
        case 'ArrowLeft': {
          e.preventDefault();
          const currentTime = await getCurrentTime();
          await setTime(Math.max(0, currentTime - 10));
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          const currentTime = await getCurrentTime();
          const dur = await getDuration();
          await setTime(Math.min(dur, currentTime + 10));
          break;
        }
        case 'KeyF': {
          e.preventDefault();
          const videoContainer = document.querySelector('.video-container');
          if (!document.fullscreenElement && videoContainer) {
            videoContainer.requestFullscreen().catch(() => undefined);
          } else {
            document.exitFullscreen();
          }
          break;
        }
        default:
          break;
      }
    };

    let hideControlsTimeout: ReturnType<typeof setTimeout>;
    const resetHideControlsTimeout = () => {
      clearTimeout(hideControlsTimeout);
      gsap.to(seekBarContainer, {
        opacity: 1,
        duration: 0.3,
        overwrite: 'auto',
      });

      hideControlsTimeout = setTimeout(() => {
        gsap.to(seekBarContainer, {
          opacity: 0.5,
          duration: 0.5,
          overwrite: 'auto',
        });
      }, 3000);
    };

    let timeUpdateInterval: ReturnType<typeof setInterval> | null = null;

    if (videoType === 'html5' && videoElement) {
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
    } else if (videoType === 'vimeo' && player) {
      timeUpdateInterval = setInterval(() => {
        void updateSeekBar();
      }, 100);
    }

    seekBar.addEventListener('click', handleSeekBarClick);
    seekBarHandle.addEventListener('mousedown', handleMouseDown);
    seekBar.addEventListener('mouseenter', handleSeekBarMouseEnter);
    seekBar.addEventListener('mouseleave', handleSeekBarMouseLeave);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', resetHideControlsTimeout);
    document.addEventListener('click', resetHideControlsTimeout);

    resetHideControlsTimeout();
    void updateSeekBar();

    return () => {
      window.removeEventListener('resize', handleResize);
      tl.kill();

      if (videoElement) {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      }

      if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval);
      }

      seekBar.removeEventListener('click', handleSeekBarClick);
      seekBarHandle.removeEventListener('mousedown', handleMouseDown);
      seekBar.removeEventListener('mouseenter', handleSeekBarMouseEnter);
      seekBar.removeEventListener('mouseleave', handleSeekBarMouseLeave);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', resetHideControlsTimeout);
      document.removeEventListener('click', resetHideControlsTimeout);
      clearTimeout(hideControlsTimeout);
    };
  }, [videoElement, vimeoPlayer, videoType]);

  return (
    <div
      className={`video-seekbar-container pointer-events-none ${className}`}
      {...rest}
    >
      <div
        ref={seekBarContainerRef}
        className="seek-bar-container pointer-events-auto absolute z-40 left-1/2 -translate-x-1/2 w-[min(100%-2rem,300px)] max-w-[300px] opacity-0 transition-opacity duration-300 bottom-[200px] sm:bottom-[220px] lg:left-auto lg:right-[35px] lg:translate-x-0 lg:bottom-[120px] lg:w-full"
      >
        <div
          ref={seekBarRef}
          className="seek-bar relative h-1.5 bg-white/30 rounded-sm cursor-pointer mb-2.5"
        >
          <div
            ref={seekBarProgressRef}
            className="seek-bar-progress h-full bg-gradient-to-r from-red-500 to-teal-400 rounded-sm w-0 transition-all duration-100"
          />
          <div
            ref={seekBarHandleRef}
            className="seek-bar-handle absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-grab transition-all duration-200 hover:shadow-xl active:cursor-grabbing"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoSeekBar;

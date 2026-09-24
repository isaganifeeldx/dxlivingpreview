'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedButton from '@/components/ui/AnimatedButton';
import VimeoEmbed from '@/components/ui/VimeoEmbed';
import IdleWarningModal from '@/components/interactive/IdleWarningModal';
import type { InteractiveAppConfig } from '@/data/interactiveApps';
import { getInteractiveAppPath } from '@/data/interactiveApps';
import { buildPathWithReturnTo } from '@/lib/interactive/returnTo';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { getApiBaseUrl } from '@/lib/interactive/config';
import { requestEmailVerification } from '@/lib/auth/verifyEmail';

interface InteractiveAppViewerProps {
  app: InteractiveAppConfig;
  onBack: () => void;
}

const SHOW_MOBILE_COMING_SOON = true;

const InteractiveAppViewer: React.FC<InteractiveAppViewerProps> = ({ app, onBack }) => {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [apiStatus, setApiStatus] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({
    usernameOrEmail: '',
    password: '',
    rememberMe: false,
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState('');
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [resendVerificationMessage, setResendVerificationMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLoadingVideo, setShowLoadingVideo] = useState(false);
  const [, setIframeReady] = useState(false);
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [waitingForFullscreen, setWaitingForFullscreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  const handleIdleTimeout = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    localStorage.removeItem('dxliving_token');
    localStorage.removeItem('dxliving_user');
    setShowLoginForm(true);
    setApiStatus('');
    setHasError(false);
    setIsLoading(false);
    setShowLoadingVideo(false);
    setIframeReady(false);
    setVideoHasPlayed(false);
    setShowMobileOverlay(false);
    setIsFullscreen(false);
    if (videoTimerRef.current) {
      clearTimeout(videoTimerRef.current);
      videoTimerRef.current = null;
    }
    setLoginData({ usernameOrEmail: '', password: '', rememberMe: false });
    setIframeSrc(null);
  };

  const [, setVideoHasPlayed] = useState(false);
  const [idleTimeoutEnabled, setIdleTimeoutEnabled] = useState(false);

  useEffect(() => {
    setIdleTimeoutEnabled(
      !!localStorage.getItem('dxliving_token') && app.id === 'interactive1',
    );
  }, [app.id]);

  const { isWarning, remainingSeconds } = useIdleTimeout({
    timeoutMinutes: 11,
    warningMinutes: 1,
    onTimeout: handleIdleTimeout,
    enabled: idleTimeoutEnabled,
  });

  const navigateToPath = (path: string) => {
    const win = window as Window & { navigateWithTransition?: (path: string) => void };
    if (win.navigateWithTransition) {
      win.navigateWithTransition(path);
    } else {
      router.push(path);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/verify-token`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        localStorage.removeItem('dxliving_token');
        localStorage.removeItem('dxliving_user');
        setShowLoginForm(true);

        if (response.status === 403) {
          const data = await response.json().catch(() => ({}));
          if (data?.code === 'EMAIL_NOT_VERIFIED') {
            setNeedsEmailVerification(true);
            setPendingVerifyEmail(typeof data.email === 'string' ? data.email : '');
            setLoginError(
              typeof data.error === 'string'
                ? data.error
                : 'Please verify your email before continuing.',
            );
          }
        }
      }
    } catch (error) {
      console.error('Token verification error:', error);
    }
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (app.id === 'interactive1') {
      setShowLoginForm(true);
      const token = localStorage.getItem('dxliving_token');
      const user = localStorage.getItem('dxliving_user');
      if (token && user) {
        verifyToken(token);
      }
    } else {
      proceedWithAppAccess(app);
    }

    return () => {
      hasInitialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.id]);

  useEffect(() => {
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('http-equiv', 'Permissions-Policy');
    metaTag.setAttribute('content', 'fullscreen=*');
    document.head.appendChild(metaTag);

    return () => {
      const existingMeta = document.querySelector('meta[http-equiv="Permissions-Policy"]');
      if (existingMeta) {
        document.head.removeChild(existingMeta);
      }
    };
  }, []);

  useEffect(() => {
    const checkMobileAndShowOverlay = () => {
      const isDXModelApp = app.id === 'interactive1' || app.id === 'interactive2';

      if (!isDXModelApp) {
        setShowMobileOverlay(false);
        return;
      }

      const isMobileDevice = window.innerWidth < 768;

      setShowMobileOverlay(
        isMobileDevice &&
          !isFullscreen &&
          !showLoginForm &&
          !hasError &&
          (waitingForFullscreen || (!isLoading && !showLoadingVideo)),
      );
    };

    checkMobileAndShowOverlay();
    window.addEventListener('resize', checkMobileAndShowOverlay);

    return () => {
      window.removeEventListener('resize', checkMobileAndShowOverlay);
    };
  }, [app, isFullscreen, showLoginForm, isLoading, hasError, waitingForFullscreen, showLoadingVideo]);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      if (isCurrentlyFullscreen) {
        setShowMobileOverlay(false);
        setIsPortrait(window.innerHeight > window.innerWidth);
      } else if (iframeRef.current) {
        iframeRef.current.style.height = '';
        iframeRef.current.style.width = '';
        if (app.id === 'interactive1' || app.id === 'interactive2') {
          const isMobileDevice = window.innerWidth < 768;
          setShowMobileOverlay(isMobileDevice && !showLoginForm && !isLoading && !hasError);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [app, showLoginForm, isLoading, hasError]);

  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current) {
        iframeRef.current.style.height = '';
        iframeRef.current.style.width = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        iframe.setAttribute(
          'allow',
          'fullscreen *; microphone; camera; gamepad; autoplay; encrypted-media; gyroscope; accelerometer; magnetometer; payment',
        );
      } catch (error) {
        console.error('Failed to set permissions policy:', error);
      }

      setTimeout(() => {
        setIframeReady(true);
        setHasError(false);
      }, 2000);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      setShowLoadingVideo(false);
      if (videoTimerRef.current) {
        clearTimeout(videoTimerRef.current);
        videoTimerRef.current = null;
      }
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);

    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
        setShowLoadingVideo(false);
        if (videoTimerRef.current) {
          clearTimeout(videoTimerRef.current);
          videoTimerRef.current = null;
        }
      }
    }, 30000);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
      clearTimeout(timeout);
    };
  }, [isLoading, app, iframeSrc]);

  const proceedWithAppAccess = async (appConfig: InteractiveAppConfig) => {
    if (appConfig.id === 'interactive2') {
      setIsLoading(false);
      setHasError(false);
      setApiStatus('');
      setShowLoginForm(false);
      setShowLoadingVideo(false);
      setIframeSrc(appConfig.url);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setApiStatus('Verifying access permissions...');

    try {
      if (appConfig.id === 'interactive1') {
        const token = localStorage.getItem('dxliving_token');
        if (!token) {
          throw new Error('Authentication required for DX Model');
        }

        try {
          const authResponse = await fetch(`${getApiBaseUrl()}/api/dx-model-access`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ appId: appConfig.id }),
          });

          if (!authResponse.ok) {
            const errorData = await authResponse.text();
            console.warn(`Backend auth verification failed: ${authResponse.status} - ${errorData}`);
          } else {
            setApiStatus('Access verified! Loading app...');
          }
        } catch (authError) {
          console.warn('Backend auth verification error:', authError);
        }
      } else {
        setApiStatus('Making API request...');
      }

      const response = await fetch(appConfig.apiEndpoint, { method: 'POST' });

      if (response.ok) {
        setApiStatus('API request successful! Loading app...');
        setTimeout(() => {
          setIframeSrc(appConfig.url);
        }, 500);
      } else {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('API request error:', error);
      setApiStatus(
        `API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      setHasError(true);
      setIsLoading(false);
      setShowLoadingVideo(false);
      if (videoTimerRef.current) {
        clearTimeout(videoTimerRef.current);
        videoTimerRef.current = null;
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dxliving_token');
    localStorage.removeItem('dxliving_user');
    setShowLoginForm(false);
    setLoginError('');
    setNeedsEmailVerification(false);
    setPendingVerifyEmail('');
    setResendVerificationMessage('');
    setLoginData({ usernameOrEmail: '', password: '', rememberMe: false });
    setIframeReady(false);
    setVideoHasPlayed(false);
    setIframeSrc(null);
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setLoginError('');
    setNeedsEmailVerification(false);
    setResendVerificationMessage('');
  };

  const handleResendVerification = async () => {
    const email =
      pendingVerifyEmail ||
      (loginData.usernameOrEmail.includes('@')
        ? loginData.usernameOrEmail.trim().toLowerCase()
        : '');

    if (!email) {
      setResendVerificationMessage('Enter your email address above, then resend.');
      return;
    }

    setIsResendingVerification(true);
    setResendVerificationMessage('');
    try {
      await requestEmailVerification(email);
      setResendVerificationMessage(
        'If an account exists for that email, a verification link has been sent.',
      );
    } catch {
      setResendVerificationMessage('Could not send verification email. Please try again.');
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    setNeedsEmailVerification(false);
    setResendVerificationMessage('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: loginData.usernameOrEmail,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('dxliving_token', data.token);
        localStorage.setItem('dxliving_user', JSON.stringify(data.user));

        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowLoginForm(false);

        const isMobileDevice = window.innerWidth < 768;
        if (isMobileDevice && (app.id === 'interactive1' || app.id === 'interactive2')) {
          setWaitingForFullscreen(true);
          setIsLoading(true);
        } else {
          setShowLoadingVideo(true);

          if (videoTimerRef.current) {
            clearTimeout(videoTimerRef.current);
          }
          videoTimerRef.current = setTimeout(() => {
            setShowLoadingVideo(false);
            setIsLoading(false);
            setVideoHasPlayed(true);
          }, 30000);

          setTimeout(async () => {
            await proceedWithAppAccess(app);
          }, 2000);
        }
      } else if (response.status === 403 && data.code === 'EMAIL_NOT_VERIFIED') {
        setNeedsEmailVerification(true);
        setPendingVerifyEmail(
          typeof data.email === 'string' && data.email
            ? data.email
            : loginData.usernameOrEmail.includes('@')
              ? loginData.usernameOrEmail.trim().toLowerCase()
              : '',
        );
        setLoginError(
          typeof data.error === 'string'
            ? data.error
            : 'Please verify your email before logging in.',
        );
      } else {
        setLoginError(data.error || 'Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Connection error. Please check your internet connection and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRequestFullscreen = async () => {
    const container = iframeContainerRef.current;
    if (!container) return;

    try {
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else if ('webkitRequestFullscreen' in container) {
        await (container as HTMLElement & { webkitRequestFullscreen: () => Promise<void> })
          .webkitRequestFullscreen();
      }

      setShowMobileOverlay(false);

      if (waitingForFullscreen) {
        setWaitingForFullscreen(false);
        setShowLoadingVideo(true);

        if (videoTimerRef.current) {
          clearTimeout(videoTimerRef.current);
        }
        videoTimerRef.current = setTimeout(() => {
          setShowLoadingVideo(false);
          setIsLoading(false);
          setVideoHasPlayed(true);
        }, 30000);

        setTimeout(async () => {
          await proceedWithAppAccess(app);
        }, 2000);
      }
    } catch (error) {
      console.error('Error requesting fullscreen:', error);
      alert("Unable to enter fullscreen mode. Please try using your browser's fullscreen option.");
    }
  };

  return (
    <>
      <div className="relative w-full mx-auto md:max-w-[1200px] md:max-h-[676px] z-[100] my-[100px]">
        <div
          ref={iframeContainerRef}
          className="relative w-full h-full mx-auto overflow-hidden border border-black/10 rounded-md shadow-md lg:aspect-[16/9] md:aspect-[16/7] aspect-[16/17]"
        >
          <div className="relative w-full h-full">
            {showMobileOverlay && (app.id === 'interactive1' || app.id === 'interactive2') && (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-white z-[99] p-6">
                <div className="text-center max-w-md">
                  <p className="black text-lg mb-6">
                    For better viewing experience, please rotate your phone and go full screen.
                  </p>
                  <AnimatedButton
                    onClick={handleRequestFullscreen}
                    dataAnimation="fade"
                    dataDelay="0.2"
                    dataDuration="0.8"
                    className="button uppercase relative mx-auto white-bg"
                  >
                    Full screen mode
                  </AnimatedButton>
                </div>
              </div>
            )}

            {isFullscreen && isPortrait && (app.id === 'interactive1' || app.id === 'interactive2') && (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-white z-[100] p-6">
                <div className="text-center max-w-md">
                  <p className="text-black text-xl font-semibold mb-2">Please Rotate Your Device</p>
                  <p className="text-black/70 text-base">
                    For the best viewing experience, please rotate your device to landscape mode.
                  </p>
                </div>
              </div>
            )}

            {SHOW_MOBILE_COMING_SOON && showLoginForm && isMobile && (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-white z-40 p-6">
                <div className="text-center max-w-md">
                  <h2 className="text-lg font-bold mb-4 text-black">
                    The mobile version is coming soon.
                  </h2>
                  <p className="text-lg text-black/70 mb-6">
                    In the meantime, please access the DX Model app on a desktop or PC.
                  </p>
                </div>
              </div>
            )}

            {showLoginForm && !(SHOW_MOBILE_COMING_SOON && isMobile) && (
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-30">
                <div className="w-full max-w-md mx-auto p-8">
                  <div className="text-center mb-8">
                    <h2 className="heading-small black">Welcome Back</h2>
                    <p className="black mt-2">Please login to access {app.name}</p>
                  </div>

                  {loginError ? (
                    <div className="mb-6 p-4 bg-red-900/50 border border-red-400 text-red-200 rounded">
                      <p>{loginError}</p>
                      {needsEmailVerification ? (
                        <div className="mt-3 space-y-2">
                          <button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={isResendingVerification}
                            className="text-sm underline text-red-100 hover:text-white disabled:opacity-60"
                          >
                            {isResendingVerification
                              ? 'Sending…'
                              : 'Resend verification email'}
                          </button>
                          {resendVerificationMessage ? (
                            <p className="text-sm text-red-100/90">{resendVerificationMessage}</p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div>
                      <input
                        type="text"
                        id="usernameOrEmail"
                        name="usernameOrEmail"
                        value={loginData.usernameOrEmail}
                        onChange={handleLoginInputChange}
                        required
                        className="black bg-transparent border-b border-[#2A3040] px-0 py-2 w-full placeholder:text-[#bfb6ad] focus:outline-none"
                        placeholder="Username or Email Address"
                      />
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginInputChange}
                        required
                        className="black bg-transparent border-b border-[#2A3040] px-0 py-2 w-full pr-8 placeholder:text-[#bfb6ad] focus:outline-none"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#bfb6ad] hover:text-black transition-colors focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M3 3L21 21"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M10.58 10.58A2 2 0 0013.42 13.42"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M9.88 5.09A10.94 10.94 0 0112 4c5.52 0 9.27 4.27 10 8-.33 1.68-1.27 3.36-2.71 4.74M6.1 6.1C4.3 7.55 3.21 9.44 2 12c.56 1.86 1.72 3.76 3.4 5.28A10.8 10.8 0 0012 20c1.45 0 2.8-.29 4.03-.8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <a
                        href="/forgot-password"
                        className="steal-slate-color hover:text-[#bfb6ad] transition-colors underline text-sm"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <div className="pt-4">
                      <AnimatedButton
                        type="submit"
                        className="button uppercase relative full-width mx-auto white-bg"
                        dataAnimation="fade"
                        dataDelay="0.2"
                        dataDuration="0.8"
                      >
                        {isLoggingIn ? 'Signing In...' : 'Login'}
                      </AnimatedButton>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {isLoading && !waitingForFullscreen ? (
              <div
                className={`absolute inset-0 flex flex-col justify-center items-center z-30 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  display: isLoading ? 'flex' : 'none',
                  backgroundColor: showLoadingVideo ? 'transparent' : 'rgb(0, 0, 0, 0.8)',
                }}
              >
                {showLoadingVideo ? (
                  <div className="w-full h-full">
                    <VimeoEmbed
                      videoId="1121801459"
                      title="Loading Video"
                      className="w-full h-full scale-[1.1]"
                      autoplay
                      loop
                      controls={false}
                      muted={false}
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-[50px] h-[50px] border-[3px] border-white/30 border-t-white rounded-full animate-spin mb-5" />
                    <h2 className="text-2xl font-bold mb-2 text-white">Loading {app.name}...</h2>
                    <p className="text-center mb-4 text-white">
                      Please wait while the application initializes
                    </p>
                    {apiStatus ? <p className="text-sm text-white/70">{apiStatus}</p> : null}
                  </>
                )}
              </div>
            ) : null}

            {iframeSrc ? (
              <iframe
                ref={iframeRef}
                className="w-full h-full border-none rounded-[10px]"
                src={iframeSrc}
                title={app.name}
                allow="fullscreen *; gamepad; autoplay; encrypted-media; gyroscope; accelerometer; magnetometer; payment"
                allowFullScreen
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-top-navigation allow-pointer-lock allow-orientation-lock allow-modals allow-downloads"
                referrerPolicy="no-referrer-when-downgrade"
                loading="eager"
                onContextMenu={(e) => e.preventDefault()}
                onMouseEnter={() => iframeRef.current?.focus()}
              />
            ) : (
              <div className="w-full h-full min-h-[200px] rounded-[10px]" aria-hidden />
            )}
          </div>
        </div>

        <div className="interactive-viewer-actions relative z-20 w-full px-4 py-10 mt-2">
          {app.benefits ? <p className="text-center mb-4 black">{app.benefits}</p> : null}

          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 w-full max-w-4xl mx-auto">
            <AnimatedButton
              onClick={onBack}
              skipEntranceAnimation
              className="white-bg relative shrink-0"
            >
              Back to Apps
            </AnimatedButton>
            <div className="flex flex-row flex-wrap justify-center gap-2">
              {app.id === 'interactive1' ? (
                <AnimatedButton
                  onClick={() =>
                    navigateToPath(
                      buildPathWithReturnTo('/register', getInteractiveAppPath(app.id)),
                    )
                  }
                  skipEntranceAnimation
                  className="white-bg relative shrink-0"
                >
                  <b className="px-[10px]">Create account</b>
                </AnimatedButton>
              ) : null}
              <AnimatedButton
                onClick={() => navigateToPath('/contact')}
                skipEntranceAnimation
                className="white-bg relative shrink-0"
              >
                <b className="px-[10px]">Contact us</b>
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      <IdleWarningModal
        isVisible={isWarning}
        remainingSeconds={remainingSeconds}
        onDismiss={() => {}}
        onLogout={handleLogout}
      />
    </>
  );
};

export default InteractiveAppViewer;

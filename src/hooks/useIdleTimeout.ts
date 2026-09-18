import { useEffect, useRef, useState } from 'react';

interface UseIdleTimeoutOptions {
  timeoutMinutes: number;
  warningMinutes: number;
  onTimeout: () => void;
  onWarning?: (remainingSeconds: number) => void;
  enabled?: boolean;
}

export const useIdleTimeout = ({
  timeoutMinutes,
  warningMinutes,
  onTimeout,
  onWarning,
  enabled = true,
}: UseIdleTimeoutOptions) => {
  const [isWarning, setIsWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeoutRef = useRef(onTimeout);
  const onWarningRef = useRef(onWarning);
  const enabledRef = useRef(enabled);
  const timeoutMinutesRef = useRef(timeoutMinutes);
  const warningMinutesRef = useRef(warningMinutes);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
    onWarningRef.current = onWarning;
    enabledRef.current = enabled;
    timeoutMinutesRef.current = timeoutMinutes;
    warningMinutesRef.current = warningMinutes;
  }, [onTimeout, onWarning, enabled, timeoutMinutes, warningMinutes]);

  const clearAllTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const startTimeouts = () => {
    if (!enabledRef.current) return;

    clearAllTimeouts();
    setIsWarning(false);
    setRemainingSeconds(0);

    const warningTimeoutMs =
      (timeoutMinutesRef.current - warningMinutesRef.current) * 60 * 1000;

    warningTimeoutRef.current = setTimeout(() => {
      if (!enabledRef.current) return;

      setIsWarning(true);
      setRemainingSeconds(warningMinutesRef.current * 60);

      countdownRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearAllTimeouts();
            onTimeoutRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      onWarningRef.current?.(warningMinutesRef.current * 60);
    }, warningTimeoutMs);

    const timeoutMs = timeoutMinutesRef.current * 60 * 1000;

    timeoutRef.current = setTimeout(() => {
      if (!enabledRef.current) return;
      clearAllTimeouts();
      onTimeoutRef.current();
    }, timeoutMs);
  };

  const dismissWarning = () => {
    setIsWarning(false);
    setRemainingSeconds(0);
    clearAllTimeouts();
    startTimeouts();
  };

  useEffect(() => {
    if (!enabled) {
      clearAllTimeouts();
      setIsWarning(false);
      setRemainingSeconds(0);
      return;
    }

    setIsWarning(false);
    setRemainingSeconds(0);

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
    ];

    const activityHandler = () => {
      if (!enabledRef.current) return;
      startTimeouts();
    };

    events.forEach((event) => {
      document.addEventListener(event, activityHandler, true);
    });

    startTimeouts();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, activityHandler, true);
      });
      clearAllTimeouts();
    };
  }, [enabled]);

  return {
    isWarning,
    remainingSeconds,
    dismissWarning,
  };
};

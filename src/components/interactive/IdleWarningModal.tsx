'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface IdleWarningModalProps {
  isVisible: boolean;
  remainingSeconds: number;
  onDismiss: () => void;
  onLogout: () => void;
}

const IdleWarningModal: React.FC<IdleWarningModalProps> = ({
  isVisible,
  remainingSeconds,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.8, y: -50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' },
      );
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && countdownRef.current) {
      gsap.fromTo(
        countdownRef.current,
        { scale: 1.2, color: '#ef4444' },
        { scale: 1, color: '#1f2937', duration: 0.2, ease: 'power2.out' },
      );
    }
  }, [remainingSeconds, isVisible]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl border border-gray-200"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Timeout Warning</h2>

          <p className="text-gray-600 mb-6">
            You will be automatically logged out due to inactivity. Click &ldquo;Stay Logged
            In&rdquo; to continue your session.
          </p>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">Time remaining:</div>
            <div ref={countdownRef} className="text-4xl font-bold text-gray-900 font-mono">
              {formatTime(remainingSeconds)}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(remainingSeconds / 60) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleWarningModal;

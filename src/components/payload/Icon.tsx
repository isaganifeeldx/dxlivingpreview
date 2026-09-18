import React from 'react';

/**
 * Payload admin nav icon (graphics.Icon).
 * Must fill `.step-nav__home` (18×18) like the default Payload SVG:
 * width/height 100% inside a square viewBox — not a fixed 32px image.
 */
export default function Icon() {
  return (
    <svg
      className="graphic-icon"
      width="100%"
      height="100%"
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DX Living"
      role="img"
    >
      <image
        href="/favicon.ico"
        width="25"
        height="25"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}

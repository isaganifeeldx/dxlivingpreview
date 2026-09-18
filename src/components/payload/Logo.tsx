import React from 'react';

/**
 * Payload admin login logo (graphics.Logo).
 * Keep it simple: just render an <img> so Payload can SSR it.
 */
const LOGIN_LOGO_COLOR = '#1e293b'

export default function Logo() {
  return (
    <span
      className="dxl-login-logo"
      role="img"
      aria-label="DX Living"
      style={{
        display: 'block',
        width: 220,
        height: 29,
        backgroundColor: LOGIN_LOGO_COLOR,
        WebkitMaskImage: 'url(/dxlogo.svg)',
        maskImage: 'url(/dxlogo.svg)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  )
}

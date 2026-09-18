'use client'

import { type ReactNode } from 'react'
import { usePageAnimations, usePageTransition } from '@/lib/utils/animations'
import { useScrollToTop } from '@/lib/utils/scrollToTop'

interface LegalPageShellProps {
  title: string
  ariaLabel: string
  children: ReactNode
}

export default function LegalPageShell({ title, ariaLabel, children }: LegalPageShellProps) {
  useScrollToTop()
  usePageAnimations(false)

  usePageTransition('dynamic', '/images/whiteBanner.jpg', {
    slideDuration: 1.8,
    slideDelay: 0,
    fadeDelay: 0.8,
    fadeDuration: 1.8,
    backgroundPosition: 'center 11.5%',
    skipOnInitialLoad: true,
    transitionType: 'fade',
    dynamicDirections: {
      toHomepage: 'top',
      fromHomepage: 'bottom',
      betweenPages: 'right',
    },
  })

  return (
    <div className="min-h-screen page-content">
      <section className="mx-auto py-16 h-[50vh] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden banner-section">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/whiteBanner.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div
          className="absolute inset-0 bg-black bg-opacity-30 z-10"
          data-animation="fade"
          data-delay="0.2"
          data-duration="1.0"
        />

        <div className="absolute z-20 text-white bottom-10 left-8 mb-4" tabIndex={1} aria-label={ariaLabel}>
          <h1
            className="text-reveal heading-large"
            data-animation="text-reveal"
            data-delay="3.0"
            data-duration="1.0"
          >
            {title}
          </h1>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24 white-bg-section">
        <div className="max-w-4xl mx-auto px-8">
          <div className="prose prose-lg max-w-none">{children}</div>
        </div>
      </section>
    </div>
  )
}

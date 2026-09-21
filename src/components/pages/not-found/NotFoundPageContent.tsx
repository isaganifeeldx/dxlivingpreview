'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AnimatedButton from '@/components/ui/AnimatedButton'
import {
  preparePageAnimationElements,
  prefersReducedMotion,
  revealAllAnimatedElements,
  usePageAnimations,
} from '@/lib/utils/animations'
import { LOGO_FILL_DARK, LOGO_FILL_LIGHT, setLogoFill } from '@/lib/utils/logoColor'

export type NotFoundPageContentProps = {
  heading: string
  title: string
  description: string
  hint: string
  ctaLabel: string
  ctaHref: string
}

export default function NotFoundPageContent({
  heading,
  title,
  description,
  hint,
  ctaLabel,
  ctaHref,
}: NotFoundPageContentProps) {
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)

  // Hide before paint so content never flashes visible → hidden → animate
  // (text-reveal uses clip-path, so opacity-0 alone is not enough).
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (prefersReducedMotion()) {
      revealAllAnimatedElements(root)
      return
    }
    preparePageAnimationElements(root)
  }, [])

  usePageAnimations(false)

  // White-first page — force dark logo on enter; reset on leave.
  useEffect(() => {
    const timer = window.setTimeout(() => setLogoFill(LOGO_FILL_DARK), 300)
    return () => {
      window.clearTimeout(timer)
      window.setTimeout(() => setLogoFill(LOGO_FILL_LIGHT), 100)
    }
  }, [])

  const handleGoHome = () => {
    const href = ctaHref?.trim() || '/'
    const win = window as Window & { navigateWithTransition?: (path: string) => void }
    if (win.navigateWithTransition) {
      win.navigateWithTransition(href)
      return
    }
    router.push(href)
  }

  return (
    <div ref={rootRef} className="min-h-screen page-content not-found-page">
      <section className="min-h-screen bg-white py-16 md:py-24 white-bg-section flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1
            className="text-reveal heading-large black"
            data-animation="text-reveal"
            data-delay="0.4"
            data-duration="1.0"
          >
            {heading}
          </h1>
          <h2
            className="font-bold text-gray-900 mb-6 black"
            data-animation="fade"
            data-delay="0.8"
            data-duration="1.0"
          >
            {title}
          </h2>

          <p
            className="text-xl text-gray-600 mb-4 black"
            data-animation="fade"
            data-delay="1.2"
            data-duration="1.0"
          >
            {description}
          </p>

          <p
            className="text-gray-600 mb-12 black"
            data-animation="fade"
            data-delay="1.2"
            data-duration="1.0"
          >
            {hint}
          </p>

          <div data-animation="fade" data-delay="1.6" data-duration="1.0">
            <AnimatedButton
              onClick={handleGoHome}
              skipEntranceAnimation
              className="button white-bg text-sm m-auto z-50 uppercase"
            >
              {ctaLabel}
            </AnimatedButton>
          </div>
        </div>
      </section>
    </div>
  )
}

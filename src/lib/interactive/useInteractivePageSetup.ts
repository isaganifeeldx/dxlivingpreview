'use client'

import { useEffect, useLayoutEffect } from 'react'
import { preparePageAnimationElements, usePageAnimations } from '@/lib/utils/animations'
import { LOGO_FILL_DARK, LOGO_FILL_LIGHT, setLogoFill } from '@/lib/utils/logoColor'
import { useScrollToTop } from '@/lib/utils/scrollToTop'

/** Shared layout/animation setup for Start Interactive pages (dark logo on white bg). */
export const useInteractivePageSetup = () => {
  useScrollToTop()

  useLayoutEffect(() => {
    preparePageAnimationElements()
  }, [])

  usePageAnimations(false)

  useEffect(() => {
    const timer = setTimeout(() => setLogoFill(LOGO_FILL_DARK), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    return () => {
      setTimeout(() => setLogoFill(LOGO_FILL_LIGHT), 100)
    }
  }, [])
}

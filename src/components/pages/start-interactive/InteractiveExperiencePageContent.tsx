'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import InteractiveAppViewer from '@/components/interactive/InteractiveAppViewer'
import type { InteractiveAppConfig } from '@/data/interactiveApps'
import { useInteractivePageSetup } from '@/lib/interactive/useInteractivePageSetup'

interface InteractiveExperiencePageContentProps {
  app: InteractiveAppConfig
}

const InteractiveExperiencePageContent: React.FC<InteractiveExperiencePageContentProps> = ({
  app,
}) => {
  const router = useRouter()
  useInteractivePageSetup()

  useEffect(() => {
    const handlePopState = () => {
      router.replace('/start-interactive')
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [router])

  const handleBack = () => {
    const win = window as Window & { navigateWithTransition?: (path: string) => void }
    if (win.navigateWithTransition) {
      win.navigateWithTransition('/start-interactive')
    } else {
      router.push('/start-interactive')
    }
  }

  return (
    <section className="min-h-[100vh] relative white-bg-section flex flex-col justify-center items-center pb-[50px] p-8">
      <InteractiveAppViewer app={app} onBack={handleBack} />
    </section>
  )
}

export default InteractiveExperiencePageContent

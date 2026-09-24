'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AnimatedButton from '@/components/ui/AnimatedButton'
import { INTERACTIVE_APPS, getInteractiveAppPath, type InteractiveAppConfig } from '@/data/interactiveApps'
import { warmupInteractiveLoginApi } from '@/lib/interactive/config'
import { useInteractivePageSetup } from '@/lib/interactive/useInteractivePageSetup'

const StartInteractivePageContent: React.FC = () => {
  const router = useRouter()
  useInteractivePageSetup()

  useEffect(() => {
    void warmupInteractiveLoginApi('START-INTERACTIVE')
  }, [])

  const navigateToPath = (path: string) => {
    const win = window as Window & { navigateWithTransition?: (path: string) => void }
    if (win.navigateWithTransition) {
      win.navigateWithTransition(path)
    } else {
      router.push(path)
    }
  }

  const handleAppAccess = (app: InteractiveAppConfig) => {
    navigateToPath(getInteractiveAppPath(app.id))
  }

  return (
    <section className="min-h-[100vh] relative white-bg-section flex flex-col justify-center items-center pb-[50px] p-8">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 py-20">
        <div className="text-center mb-12 mt-[50px] lg:mt-0">
          <h1
            className="text-reveal heading-large black"
            data-animation="text-reveal"
            data-delay="0.4"
            data-duration="1.0"
          >
            START INTERACTIVE
          </h1>
          <p className="mx-auto" data-animation="fade" data-delay="0.8" data-duration="2.0">
            Choose from our collection of immersive interactive design experiences
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          data-animation="fade"
          data-delay="1.5"
          data-duration="0.8"
        >
          {INTERACTIVE_APPS.map((app) => (
            <div
              key={app.id}
              className="bg-white/80 backdrop-blur-sm rounded-md p-8 hover:bg-white/100 transition-all duration-300 hover:scale-105 cursor-pointer group border border-black/10 shadow-md hover:shadow-lg"
              onClick={() => handleAppAccess(app)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleAppAccess(app)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                {app.icon}
              </div>
              <h3 className="heading-xsmall lao mb-4 text-center primary-color group-hover:text-black transition-all duration-300">
                {app.name}
              </h3>
              <p className="text-center mb-6 group-hover:text-[#bfb6ad] transition-all duration-300 text-[16px]">
                {app.description}
              </p>
              <AnimatedButton
                onClick={() => handleAppAccess(app)}
                dataAnimation="fade"
                dataDelay="0.6"
                dataDuration="0.8"
                className="m-auto z-50 w-fit white-bg relative mt-[30px]"
              >
                Start Experience
              </AnimatedButton>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <AnimatedButton
            onClick={() => navigateToPath('/')}
            dataAnimation="fade"
            dataDelay="2.2"
            dataDuration="0.8"
            className="m-auto z-50 w-fit white-bg relative"
          >
            Back to Homepage
          </AnimatedButton>
        </div>
      </div>
    </section>
  )
}

export default StartInteractivePageContent

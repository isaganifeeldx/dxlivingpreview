'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HubSpotNewsletter from '@/components/layout/HubSpotNewsletter'
import SocialLinks from '@/components/ui/SocialLinks'
import type { SiteSettingsData } from '@/lib/settings/defaults'
import type { SocialLinks as SocialLinksData } from '@/lib/socialLinks'

interface FooterProps {
  socialLinks: SocialLinksData
  footer: SiteSettingsData['footer']
}

const moduleLabel = (label: string) => {
  if (/^DX\s/i.test(label)) {
    return (
      <>
        <strong>DX</strong> {label.slice(3)}
      </>
    )
  }
  return label
}

const Footer: React.FC<FooterProps> = ({ socialLinks, footer }) => {
  const pathname = usePathname()

  const handleNavigation = (path: string) => {
    if (path === pathname) return

    const win = window as Window & { navigateWithTransition?: (path: string) => void }
    if (win.navigateWithTransition) {
      win.navigateWithTransition(path)
    } else {
      window.location.href = path
    }
  }

  return (
    <footer
      id="site-footer"
      className="secondary-bg text-white relative z-20 text-[16px] md:text-[18px] pt-[50px] md:pt-[100px]"
      tabIndex={2}
      aria-label="Footer"
    >
      <div className="mx-auto px-8 py-5">
        <div className="flex flex-row gap-x-5 gap-y-10 sm:gap-10 md:gap-8 xl:gap-8 md:gap-x-12 xl:gap-x-8 justify-center xl:justify-between flex-wrap xl:flex-nowrap">
          <div className="flex-grow flex-shrink xl:flex-grow-0 max-w-[300px] lg:max-w-[500px] items-center md:items-start flex flex-col text-center md:text-left">
            <div className="flex items-center space-x-2 mb-8">
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation('/')
                }}
                aria-label="DX Living home"
              >
                <img src="/dxlogo.svg" alt="DX LIVING" width={229} height={29} />
              </Link>
            </div>
            <p className="mb-8 max-w-md" tabIndex={2}>
              {footer.tagline}
            </p>
            <SocialLinks links={socialLinks} variant="footer" className="flex space-x-4" />
          </div>

          <div className="w-[90px] sm:w-[135px] md:w-[150px] 2xl:w-auto">
            <h3
              className="mb-4 lao primary-color uppercase text-[18px]"
              tabIndex={2}
              aria-label={footer.linkColumnTitle}
            >
              {footer.linkColumnTitle}
            </h3>
            <ul className="space-y-2">
              {footer.linkColumn.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigation(item.href)
                    }}
                    className="hover:text-[#BFB6AD] transition-colors"
                    tabIndex={2}
                    aria-label={item.label}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-[135px] md:w-[150px] xl:w-[220px] 2xl:w-auto">
            <h3
              className="mb-4 lao primary-color uppercase text-[18px]"
              tabIndex={2}
              aria-label={footer.modulesColumnTitle}
            >
              {footer.modulesColumnTitle}
            </h3>
            <ul className="space-y-2">
              {footer.modulesColumn.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigation(item.href)
                    }}
                    className="hover:text-[#BFB6AD] transition-colors"
                    tabIndex={2}
                    aria-label={item.label}
                  >
                    {moduleLabel(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:max-w-[300px]">
            <h3
              className="mb-4 lao primary-color uppercase text-[18px]"
              tabIndex={2}
              aria-label="Stay In Touch"
            >
              STAY IN TOUCH
            </h3>
            <HubSpotNewsletter />
          </div>

          <div className="sm:max-w-[300px]">
            <h3
              className="mb-4 lao primary-color uppercase text-[18px]"
              tabIndex={2}
              aria-label="Contact"
            >
              Contact
            </h3>
            <div className="space-y-2">
              <p tabIndex={2}>{footer.contact.intro}</p>
              <div className="flex flex-col gap-2 pt-4">
                <a
                  href={footer.contact.phoneHref}
                  className="hover:text-[#BFB6AD] transition-colors flex items-center gap-2"
                  tabIndex={2}
                  aria-label="Phone Number"
                >
                  <img src="/tel-icon.svg" alt="Phone" className="w-4 h-4" /> {footer.contact.phone}
                </a>
                <a
                  href={`mailto:${footer.contact.email}`}
                  className="hover:text-[#BFB6AD] transition-colors flex items-center gap-2"
                  tabIndex={2}
                  aria-label="Email"
                >
                  <img src="/mail-icon.svg" alt="Email" className="w-4 h-4" /> {footer.contact.email}
                </a>
                <a
                  href={footer.contact.locationHref}
                  className="hover:text-[#BFB6AD] transition-colors flex items-start gap-2"
                  tabIndex={2}
                  aria-label="Location"
                >
                  <img src="/pin-icon.svg" alt="Location" className="w-4 h-4 mt-[7px]" />{' '}
                  {footer.contact.location}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[14px] border-t border-[#6A758C] mt-[100px] pt-[20px] text-center text-gray-400 flex flex-row flex-wrap items-center gap-2 justify-center md:justify-between uppercase">
          <p tabIndex={2}>{footer.copyright}</p>
          <div className="flex justify-center gap-4">
            {footer.legalLinks.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigation(item.href)
                }}
                className="text-gray-400 hover:text-white transition-colors"
                tabIndex={2}
                aria-label={item.label}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

'use client'

import { useEffect, useMemo, useState } from 'react'
import FaqAccordion from '@/components/ui/FaqAccordion'
import { usePageAnimations, usePageTransition } from '@/lib/utils/animations'
import { LOGO_FILL_DARK, LOGO_FILL_LIGHT, setLogoFill } from '@/lib/utils/logoColor'
import { useScrollToTop } from '@/lib/utils/scrollToTop'
import type { FaqItem } from '@/data/faqData'

const SearchIcon = () => (
  <svg className="w-5 h-5 text-[#6A758C]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export interface FaqPageContentProps {
  title: string
  intro: string
  items: FaqItem[]
}

export default function FaqPageContent({ title, intro, items }: FaqPageContentProps) {
  const [searchQuery, setSearchQuery] = useState('')

  useScrollToTop()
  usePageAnimations(false)
  usePageTransition('dynamic', '/images/whiteBanner.jpg', {
    slideDuration: 1.8,
    slideDelay: 0,
    fadeDelay: 0.8,
    fadeDuration: 1.8,
    backgroundPosition: 'center 11.5%',
    skipOnInitialLoad: false,
    transitionType: 'fade',
    dynamicDirections: {
      toHomepage: 'top',
      fromHomepage: 'bottom',
      betweenPages: 'right',
    },
  })

  // FAQ is white-first (no dark banner). Force dark logo on enter; reset so
  // other pages can resume the normal white-bg-section color flow.
  useEffect(() => {
    const timer = window.setTimeout(() => setLogoFill(LOGO_FILL_DARK), 300)
    return () => {
      window.clearTimeout(timer)
      window.setTimeout(() => setLogoFill(LOGO_FILL_LIGHT), 100)
    }
  }, [])

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return items

    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query),
    )
  }, [items, searchQuery])

  // Remount accordion when search results change so first match opens by default.
  const accordionKey = useMemo(
    () => filteredItems.map((item) => item.id).join('|') || 'empty',
    [filteredItems],
  )

  return (
    <div className="min-h-screen page-content bg-white">
      <section
        className="white-bg-section bg-white pt-[140px] md:pt-[180px] pb-16 md:pb-24"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-[920px] mx-auto px-8">
          <h1
            id="faq-heading"
            className="heading-small text-center text-[#2A3040] mb-10 md:mb-12"
            tabIndex={1}
            data-animation="fade"
            data-delay="0.4"
            data-duration="1.0"
          >
            {title}
          </h1>

          <div
            className="relative max-w-[640px] mx-auto mb-8"
            data-animation="fade"
            data-delay="0.55"
            data-duration="1.0"
          >
            <label htmlFor="faq-search" className="sr-only">
              Search FAQs
            </label>
            <input
              id="faq-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type your question here"
              className="w-full border-b border-[#D5D5D5] rounded-sm px-4 py-3 pr-12 text-[15px] text-[#2A3040] placeholder:text-[#9AA1AD] focus:outline-none focus:border-[#BFB6AD] transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </span>
          </div>

          <p
            className="text-center text-[15px] md:text-[16px] text-[#6A758C] leading-relaxed max-w-[720px] mx-auto mb-12 md:mb-16"
            data-animation="fade"
            data-delay="0.7"
            data-duration="1.0"
          >
            {intro}
          </p>

          <div data-animation="fade" data-delay="0.85" data-duration="1.0">
            {filteredItems.length === 0 ? (
              <p className="py-10 text-center text-[#6A758C] text-[15px] border-t border-[#E5E5E5]">
                No results found. Try a different search.
              </p>
            ) : (
              <FaqAccordion key={accordionKey} items={filteredItems} openFirst />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

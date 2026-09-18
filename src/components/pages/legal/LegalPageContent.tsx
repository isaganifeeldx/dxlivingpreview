'use client'

import LegalPageShell from '@/components/pages/legal/LegalPageShell'

export interface LegalPageContentProps {
  title: string
  ariaLabel: string
  /** Already sanitized on the server — do not run DOMPurify again on the client. */
  contentHtml: string
}

export default function LegalPageContent({ title, ariaLabel, contentHtml }: LegalPageContentProps) {
  return (
    <LegalPageShell title={title} ariaLabel={ariaLabel}>
      <div
        data-animation="fade"
        data-delay="0.6"
        data-duration="1.0"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </LegalPageShell>
  )
}

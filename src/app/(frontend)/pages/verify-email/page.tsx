import type { Metadata } from 'next'
import { Suspense } from 'react'
import VerifyEmailPageContent from '@/components/pages/auth/VerifyEmailPageContent'

export const metadata: Metadata = {
  title: {
    absolute: 'Verify email | DX Living',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPageContent />
    </Suspense>
  )
}

import type { Metadata } from 'next'
import { Suspense } from 'react'
import ResetPasswordPageContent from '@/components/pages/auth/ResetPasswordPageContent'

export const metadata: Metadata = {
  title: {
    absolute: 'Reset password | DX Living',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageContent />
    </Suspense>
  )
}

import type { Metadata } from 'next'
import ForgotPasswordPageContent from '@/components/pages/auth/ForgotPasswordPageContent'

export const metadata: Metadata = {
  title: {
    absolute: 'Forgot password | DX Living',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageContent />
}

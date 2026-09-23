'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import AnimatedButton from '@/components/ui/AnimatedButton'
import { confirmEmailVerification } from '@/lib/auth/verifyEmail'
import { usePageAnimations } from '@/lib/utils/animations'
import { useScrollToTop } from '@/lib/utils/scrollToTop'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function VerifyEmailPageContent() {
  const searchParams = useSearchParams()
  const token = (searchParams.get('token') || '').trim()
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'error')
  const [message, setMessage] = useState(
    token ? 'Verifying your email…' : 'This verification link is missing a token.',
  )

  useScrollToTop()
  usePageAnimations(false)

  useEffect(() => {
    if (!token) return

    let cancelled = false

    ;(async () => {
      const result = await confirmEmailVerification(token)
      if (cancelled) return
      if (result.ok) {
        setStatus('success')
        setMessage(result.message)
        return
      }
      setStatus('error')
      setMessage(result.message)
    })()

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div className="min-h-screen page-content flex bg-white white-bg-section">
      <div className="w-full flex items-center justify-center p-8">
        <div className="w-full max-w-[500px] text-center">
          <h1 className="heading-small black mb-4">Email verification</h1>

          {status === 'loading' && (
            <p className="black text-gray-600">{message}</p>
          )}

          {status === 'success' && (
            <>
              <p className="black text-gray-700 mb-8">{message}</p>
              <AnimatedButton
                href="/login"
                className="button white-bg text-sm m-auto uppercase"
                skipEntranceAnimation
              >
                Continue to login
              </AnimatedButton>
            </>
          )}

          {status === 'error' && (
            <>
              <p className="black text-gray-700 mb-4">{message}</p>
              <p className="text-sm text-gray-500 mb-8">
                You can request a new link from the registration page, or contact support if
                this keeps happening.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register" className="button white-bg text-sm uppercase px-4 py-2">
                  Back to register
                </Link>
                <Link href="/login" className="button white-bg text-sm uppercase px-4 py-2">
                  Go to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AnimatedButton from '@/components/ui/AnimatedButton'
import { requestPasswordReset } from '@/lib/auth/passwordReset'
import {
  normalizeRegistrationEmail,
  validateRegistrationEmail,
} from '@/lib/auth/registrationValidation'
import { usePageAnimations } from '@/lib/utils/animations'
import { useScrollToTop } from '@/lib/utils/scrollToTop'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ForgotPasswordPageContent() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [fieldError, setFieldError] = useState<string | undefined>()

  useScrollToTop()
  usePageAnimations(false)

  const navigate = (path: string) => {
    const win = window as Window & { navigateWithTransition?: (targetPath: string) => void }
    if (win.navigateWithTransition) {
      win.navigateWithTransition(path)
      return
    }
    router.push(path)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const emailError = validateRegistrationEmail(email)
    if (emailError) {
      setFieldError(emailError)
      setStatus('idle')
      return
    }

    setFieldError(undefined)
    setStatus('loading')
    setMessage('')

    const result = await requestPasswordReset(normalizeRegistrationEmail(email))
    if (result.ok) {
      setStatus('success')
      setMessage(result.message)
      return
    }

    setStatus('error')
    setMessage(result.message)
  }

  return (
    <div className="min-h-screen page-content flex bg-white white-bg-section">
      <div className="w-full flex items-center justify-center p-8">
        <div className="w-full max-w-[500px]">
          <div className="text-center mb-8">
            <h1 className="heading-small black">Forgot password</h1>
            <p className="black mt-2 text-gray-600">
              Enter your email and we&apos;ll send a reset link if an account exists.
            </p>
          </div>

          {status === 'success' ? (
            <div className="text-center">
              <p className="black text-gray-700 mb-8">{message}</p>
              <div className="pt-4">
                <AnimatedButton
                  type="button"
                  onClick={() => navigate('/login')}
                  className="uppercase relative full-width mx-auto white-bg"
                  dataAnimation="fade"
                  dataDelay="0.2"
                  dataDuration="0.8"
                  skipEntranceAnimation
                >
                  Back to login
                </AnimatedButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' ? (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {message}
                </div>
              ) : null}

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldError) setFieldError(undefined)
                  }}
                  required
                  autoComplete="email"
                  className={`bg-transparent border-b px-0 py-2 w-full placeholder:text-[#bfb6ad] focus:outline-none ${
                    fieldError ? 'border-red-500' : 'border-[#2A3040]'
                  }`}
                  placeholder="Email Address"
                  aria-invalid={Boolean(fieldError)}
                />
                {fieldError ? (
                  <p className="mt-2 text-sm text-red-600">{fieldError}</p>
                ) : null}
              </div>

              <div className="pt-4">
                <AnimatedButton
                  type="submit"
                  className="uppercase relative full-width mx-auto white-bg"
                  dataAnimation="fade"
                  dataDelay="0.2"
                  dataDuration="0.8"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Sending…' : 'Send reset link'}
                </AnimatedButton>
              </div>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="steal-slate-color hover:text-[#bfb6ad] transition-colors underline bg-transparent border-none cursor-pointer text-sm"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-10">
            Need an account?{' '}
            <Link href="/register" className="underline steal-slate-color">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

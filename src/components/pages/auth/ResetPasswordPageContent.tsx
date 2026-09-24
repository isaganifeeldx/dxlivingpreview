'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import AnimatedButton from '@/components/ui/AnimatedButton'
import { confirmPasswordReset } from '@/lib/auth/passwordReset'
import {
  getPasswordRequirements,
  PASSWORD_REQUIREMENT_LABELS,
  REGISTRATION_PASSWORD_MAX_LENGTH,
  REGISTRATION_PASSWORD_MIN_LENGTH,
  validateConfirmPassword,
  validateRegistrationPassword,
  type PasswordRequirementKey,
} from '@/lib/auth/registrationValidation'
import { usePageAnimations } from '@/lib/utils/animations'
import { useScrollToTop } from '@/lib/utils/scrollToTop'

type Status = 'form' | 'loading' | 'success' | 'error'

export default function ResetPasswordPageContent() {
  const searchParams = useSearchParams()
  const token = (searchParams.get('token') || '').trim()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<Status>(token ? 'form' : 'error')
  const [message, setMessage] = useState(
    token ? '' : 'This reset link is missing a token. Please request a new one.',
  )
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [confirmError, setConfirmError] = useState<string | undefined>()

  useScrollToTop()
  usePageAnimations(false)

  const requirements = getPasswordRequirements(password)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!token) return

    const nextPasswordError = validateRegistrationPassword(password)
    const nextConfirmError = validateConfirmPassword(password, confirmPassword)
    setPasswordError(nextPasswordError)
    setConfirmError(nextConfirmError)
    if (nextPasswordError || nextConfirmError) return

    setStatus('loading')
    setMessage('')

    const result = await confirmPasswordReset(token, password)
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
            <h1 className="heading-small black">Reset password</h1>
            {status === 'form' || status === 'loading' ? (
              <p className="black mt-2 text-gray-600">Choose a new password for your account.</p>
            ) : null}
          </div>

          {status === 'success' ? (
            <div className="text-center">
              <p className="black text-gray-700 mb-8">{message}</p>
              <AnimatedButton
                href="/login"
                className="button white-bg text-sm m-auto uppercase"
                skipEntranceAnimation
              >
                Continue to login
              </AnimatedButton>
            </div>
          ) : null}

          {status === 'error' && !token ? (
            <div className="text-center">
              <p className="black text-gray-700 mb-8">{message}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/forgot-password" className="button white-bg text-sm uppercase px-4 py-2">
                  Request a new link
                </Link>
                <Link href="/login" className="button white-bg text-sm uppercase px-4 py-2">
                  Go to login
                </Link>
              </div>
            </div>
          ) : null}

          {status === 'error' && token ? (
            <div className="text-center mb-8">
              <p className="black text-gray-700 mb-4">{message}</p>
              <Link
                href="/forgot-password"
                className="steal-slate-color underline text-sm"
              >
                Request a new reset link
              </Link>
            </div>
          ) : null}

          {(status === 'form' || status === 'loading' || (status === 'error' && token)) &&
          token ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (passwordError) setPasswordError(undefined)
                  }}
                  required
                  autoComplete="new-password"
                  minLength={REGISTRATION_PASSWORD_MIN_LENGTH}
                  maxLength={REGISTRATION_PASSWORD_MAX_LENGTH}
                  className={`bg-transparent border-b px-0 py-2 w-full pr-8 placeholder:text-[#bfb6ad] focus:outline-none ${
                    passwordError ? 'border-red-500' : 'border-[#2A3040]'
                  }`}
                  placeholder="New password"
                  aria-invalid={Boolean(passwordError)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#bfb6ad] hover:text-black transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M3 3L21 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.58 10.58A2 2 0 0013.42 13.42"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.88 5.09A10.94 10.94 0 0112 4c5.52 0 9.27 4.27 10 8-.33 1.68-1.27 3.36-2.71 4.74M6.1 6.1C4.3 7.55 3.21 9.44 2 12c.56 1.86 1.72 3.76 3.4 5.28A10.8 10.8 0 0012 20c1.45 0 2.8-.29 4.03-.8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                </button>
                {passwordError ? (
                  <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                ) : null}
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  {(Object.keys(PASSWORD_REQUIREMENT_LABELS) as PasswordRequirementKey[]).map(
                    (key) => (
                      <li
                        key={key}
                        className={requirements[key] ? 'text-green-700' : 'text-gray-500'}
                      >
                        {requirements[key] ? '✓' : '○'} {PASSWORD_REQUIREMENT_LABELS[key]}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (confirmError) setConfirmError(undefined)
                  }}
                  required
                  autoComplete="new-password"
                  minLength={REGISTRATION_PASSWORD_MIN_LENGTH}
                  maxLength={REGISTRATION_PASSWORD_MAX_LENGTH}
                  className={`bg-transparent border-b px-0 py-2 w-full placeholder:text-[#bfb6ad] focus:outline-none ${
                    confirmError ? 'border-red-500' : 'border-[#2A3040]'
                  }`}
                  placeholder="Confirm new password"
                  aria-invalid={Boolean(confirmError)}
                />
                {confirmError ? (
                  <p className="mt-2 text-sm text-red-600">{confirmError}</p>
                ) : null}
              </div>

              <div className="pt-2">
                <AnimatedButton
                  type="submit"
                  className="uppercase relative full-width mx-auto white-bg"
                  dataAnimation="fade"
                  dataDelay="0.2"
                  dataDuration="0.8"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Updating…' : 'Update password'}
                </AnimatedButton>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  )
}

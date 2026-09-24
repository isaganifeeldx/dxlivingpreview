'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePageAnimations } from '@/lib/utils/animations'
import { useScrollToTop } from '@/lib/utils/scrollToTop'
import AnimatedButton from '@/components/ui/AnimatedButton'
import VimeoEmbed from '@/components/ui/VimeoEmbed'
import { loginWithPassword, POST_LOGIN_PATH, storeAuthSession } from '@/lib/auth/login'
import { requestEmailVerification } from '@/lib/auth/verifyEmail'
import { warmupInteractiveLoginApi } from '@/lib/interactive/config'

type SubmitStatus = 'idle' | 'success' | 'error'

export default function LoginPageContent() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
    rememberMe: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false)
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState('')
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const [resendVerificationMessage, setResendVerificationMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useScrollToTop()
  usePageAnimations(false)

  useEffect(() => {
    void warmupInteractiveLoginApi('LOGIN')
  }, [])

  const navigate = (path: string) => {
    const win = window as Window & { navigateWithTransition?: (targetPath: string) => void }
    if (win.navigateWithTransition) {
      win.navigateWithTransition(path)
      return
    }
    router.push(path)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setSubmitStatus('idle')
    setErrorMessage('')
    setNeedsEmailVerification(false)
    setResendVerificationMessage('')
  }

  const handleResendVerification = async () => {
    const email =
      pendingVerifyEmail ||
      (formData.usernameOrEmail.includes('@')
        ? formData.usernameOrEmail.trim().toLowerCase()
        : '')

    if (!email) {
      setResendVerificationMessage('Enter your email address above, then resend.')
      return
    }

    setIsResendingVerification(true)
    setResendVerificationMessage('')
    try {
      await requestEmailVerification(email)
      setResendVerificationMessage(
        'If an account exists for that email, a verification link has been sent.',
      )
    } catch {
      setResendVerificationMessage('Could not send verification email. Please try again.')
    } finally {
      setIsResendingVerification(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')
    setNeedsEmailVerification(false)
    setResendVerificationMessage('')

    try {
      const result = await loginWithPassword(formData.usernameOrEmail, formData.password)

      if (result.ok) {
        storeAuthSession(result.token, result.user)
        setSubmitStatus('success')
        navigate(POST_LOGIN_PATH)
        return
      }

      if (result.code === 'EMAIL_NOT_VERIFIED') {
        setNeedsEmailVerification(true)
        setPendingVerifyEmail(
          result.email ||
            (formData.usernameOrEmail.includes('@')
              ? formData.usernameOrEmail.trim().toLowerCase()
              : ''),
        )
      }

      setSubmitStatus('error')
      setErrorMessage(result.message)
    } catch (error) {
      console.error('Login error:', error)
      setSubmitStatus('error')
      setErrorMessage('Connection error. Please check your internet connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen page-content flex bg-white white-bg-section">
      <div className="w-full xl:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          <div className="relative" data-animation="fade" data-delay="0.3" data-duration="0.8">
            <div className="text-center mb-8">
              <h1 className="heading-small black">Welcome Back</h1>
              <p className="black mt-2">Please enter your details below</p>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                Logged in successfully. Opening DX Model…
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>{errorMessage}</p>
                {needsEmailVerification ? (
                  <div className="mt-3 space-y-2">
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResendingVerification}
                      className="text-sm underline text-red-700 hover:text-red-900 disabled:opacity-60 bg-transparent border-none cursor-pointer p-0"
                    >
                      {isResendingVerification ? 'Sending…' : 'Resend verification email'}
                    </button>
                    {resendVerificationMessage ? (
                      <p className="text-sm text-red-700/90">{resendVerificationMessage}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleInputChange}
                  required
                  autoComplete="username"
                  className="bg-transparent border-b border-[#2A3040] px-0 py-2 w-full placeholder:text-[#bfb6ad] focus:outline-none"
                  placeholder="Username or Email Address"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                  className="bg-transparent border-b border-[#2A3040] px-0 py-2 w-full pr-8 placeholder:text-[#bfb6ad] focus:outline-none"
                  placeholder="Password"
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
              </div>

              <div className="flex items-center justify-between">
                <label className="container cursor-pointer text-sm steal-slate-color">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="checkmark" />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="steal-slate-color hover:text-[#bfb6ad] transition-colors underline bg-transparent border-none cursor-pointer text-sm whitespace-nowrap"
                >
                  Forgot password?
                </button>
              </div>

              <div className="pt-4">
                <AnimatedButton
                  type="submit"
                  className="uppercase relative full-width mx-auto white-bg"
                  dataAnimation="fade"
                  dataDelay="0.2"
                  dataDuration="0.8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing In...' : 'Login'}
                </AnimatedButton>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm black">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="steal-slate-color hover:text-[#bfb6ad] transition-colors underline bg-transparent border-none cursor-pointer"
                  >
                    Register Now
                  </button>
                </p>
              </div>
            </form>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="black hover:text-[#bfb6ad] transition-colors bg-transparent border-none cursor-pointer text-sm whitespace-nowrap absolute bottom-6 right-6 flex items-center gap-1"
          >
            <span aria-hidden="true">←</span>
            Back to Homepage
          </button>
        </div>
      </div>

      <div className="hidden xl:block sm:w-1/3 lg:w-1/2 h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full z-0 overflow-hidden scale-[1.8] left-[-5%]"
          data-parallax="false"
          data-speed="0.5"
        >
          <VimeoEmbed
            videoId="1117317031"
            title="Log in | DX LIVING Account"
            className="w-full h-full"
            autoplay
            loop
            controls={false}
            muted
            parallax
            stretch
          />
        </div>
      </div>
    </div>
  )
}

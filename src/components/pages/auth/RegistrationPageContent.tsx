'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePageAnimations } from '@/lib/utils/animations'
import { useScrollToTop } from '@/lib/utils/scrollToTop'
import AnimatedButton from '@/components/ui/AnimatedButton'
import VimeoEmbed from '@/components/ui/VimeoEmbed'
import { registerUser } from '@/lib/interactive/register'
import { getSafeReturnPath } from '@/lib/interactive/returnTo'
import {
  getPasswordRequirements,
  getRegistrationFieldErrors,
  isRegistrationFormReady,
  normalizeRegistrationEmail,
  normalizeRegistrationName,
  PASSWORD_REQUIREMENT_LABELS,
  REGISTRATION_EMAIL_MAX_LENGTH,
  REGISTRATION_NAME_MAX_LENGTH,
  REGISTRATION_PASSWORD_MAX_LENGTH,
  REGISTRATION_PASSWORD_MIN_LENGTH,
  type PasswordRequirementKey,
} from '@/lib/auth/registrationValidation'

type SubmitStatus = 'idle' | 'success' | 'error'

type TouchedFields = {
  firstName: boolean
  lastName: boolean
  email: boolean
  password: boolean
  confirmPassword: boolean
}

export default function RegistrationPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = getSafeReturnPath(searchParams.get('returnTo'))
  const postAuthPath = returnTo ?? '/login'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState<TouchedFields>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  useScrollToTop()
  usePageAnimations(false)

  const fieldErrors = useMemo(() => getRegistrationFieldErrors(formData), [formData])

  const passwordRequirements = useMemo(
    () => getPasswordRequirements(formData.password),
    [formData.password],
  )

  const isFormComplete = isRegistrationFormReady(formData)

  const markTouched = (field: keyof TouchedFields) => {
    setTouched((previous) => ({ ...previous, [field]: true }))
  }

  const showFieldError = (field: keyof TouchedFields) =>
    touched[field] ? fieldErrors[field] : undefined

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
    setErrorMessage('')
  }

  const handleNameBlur = (field: 'firstName' | 'lastName') => {
    markTouched(field)
    setFormData((previous) => ({
      ...previous,
      [field]: normalizeRegistrationName(previous[field]),
    }))
  }

  const handleEmailBlur = () => {
    markTouched('email')
    setFormData((previous) => ({
      ...previous,
      email: normalizeRegistrationEmail(previous.email),
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    })

    if (!isRegistrationFormReady(formData)) {
      const errors = getRegistrationFieldErrors(formData)
      setSubmitStatus('error')
      setErrorMessage(
        errors.firstName ??
          errors.lastName ??
          errors.email ??
          errors.password ??
          errors.confirmPassword ??
          'Please complete all required fields correctly.',
      )
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    const email = normalizeRegistrationEmail(formData.email)

    try {
      await registerUser({
        email,
        password: formData.password,
        firstName: normalizeRegistrationName(formData.firstName),
        lastName: normalizeRegistrationName(formData.lastName),
      })

      setSubmitStatus('success')

      window.setTimeout(() => {
        navigate(postAuthPath)
      }, 1500)
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const eyeIcon = (visible: boolean) =>
    visible ? (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
    )

  return (
    <div className="min-h-screen page-content flex bg-white white-bg-section">
      <div className="w-full xl:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-[500px]">
          <div data-animation="fade" data-delay="0.3" data-duration="0.8">
            <div className="text-center mb-8">
              <h1 className="heading-small black">Shape Your Space</h1>
              <p className="black mt-2">Sign up and get access to personalized design tools</p>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                Account created successfully!{' '}
                {returnTo?.startsWith('/start-interactive')
                  ? 'Returning to the app...'
                  : 'Redirecting to login...'}
              </div>
            )}

            {submitStatus === 'error' && errorMessage ? (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {errorMessage}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-6 md:px-16">
              <div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onBlur={() => handleNameBlur('firstName')}
                  required
                  autoComplete="given-name"
                  maxLength={REGISTRATION_NAME_MAX_LENGTH}
                  aria-invalid={Boolean(showFieldError('firstName'))}
                  aria-describedby={
                    showFieldError('firstName') ? 'first-name-error' : undefined
                  }
                  className={`bg-transparent border-b px-0 py-2 w-full placeholder:text-[#bfb6ad] focus:outline-none ${
                    showFieldError('firstName') ? 'border-red-500' : 'border-[#bfb6ad]'
                  }`}
                  placeholder="First Name *"
                />
                {showFieldError('firstName') ? (
                  <p id="first-name-error" className="mt-1 text-xs text-red-600" role="alert">
                    {showFieldError('firstName')}
                  </p>
                ) : null}
              </div>

              <div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onBlur={() => handleNameBlur('lastName')}
                  required
                  autoComplete="family-name"
                  maxLength={REGISTRATION_NAME_MAX_LENGTH}
                  aria-invalid={Boolean(showFieldError('lastName'))}
                  aria-describedby={
                    showFieldError('lastName') ? 'last-name-error' : undefined
                  }
                  className={`bg-transparent border-b px-0 py-2 w-full placeholder:text-[#bfb6ad] focus:outline-none ${
                    showFieldError('lastName') ? 'border-red-500' : 'border-[#bfb6ad]'
                  }`}
                  placeholder="Last Name *"
                />
                {showFieldError('lastName') ? (
                  <p id="last-name-error" className="mt-1 text-xs text-red-600" role="alert">
                    {showFieldError('lastName')}
                  </p>
                ) : null}
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleEmailBlur}
                  required
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  autoCapitalize="none"
                  autoCorrect="off"
                  maxLength={REGISTRATION_EMAIL_MAX_LENGTH}
                  aria-invalid={Boolean(showFieldError('email'))}
                  aria-describedby={showFieldError('email') ? 'email-error' : undefined}
                  className={`bg-transparent border-b px-0 py-2 w-full placeholder:text-[#bfb6ad] focus:outline-none ${
                    showFieldError('email') ? 'border-red-500' : 'border-[#bfb6ad]'
                  }`}
                  placeholder="Email Address *"
                />
                {showFieldError('email') ? (
                  <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">
                    {showFieldError('email')}
                  </p>
                ) : null}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => markTouched('password')}
                    required
                    autoComplete="new-password"
                    minLength={REGISTRATION_PASSWORD_MIN_LENGTH}
                    maxLength={REGISTRATION_PASSWORD_MAX_LENGTH}
                    aria-invalid={Boolean(showFieldError('password'))}
                    aria-describedby={
                      formData.password.length > 0 ? 'password-requirements' : undefined
                    }
                    className={`bg-transparent border-b px-0 py-2 w-full pr-8 placeholder:text-[#bfb6ad] focus:outline-none ${
                      showFieldError('password') ? 'border-red-500' : 'border-[#bfb6ad]'
                    }`}
                    placeholder="Password *"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#bfb6ad] hover:text-black transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {eyeIcon(showPassword)}
                  </button>
                </div>
                {formData.password.length > 0 ? (
                  <ul
                    id="password-requirements"
                    className="mt-2 space-y-1 text-xs text-[#8a8279]"
                    aria-live="polite"
                  >
                    {(Object.keys(PASSWORD_REQUIREMENT_LABELS) as PasswordRequirementKey[]).map(
                      (key) => (
                        <li
                          key={key}
                          className={passwordRequirements[key] ? 'text-green-700' : undefined}
                        >
                          {passwordRequirements[key] ? '✓ ' : '○ '}
                          {PASSWORD_REQUIREMENT_LABELS[key]}
                        </li>
                      ),
                    )}
                  </ul>
                ) : null}
                {showFieldError('password') ? (
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {showFieldError('password')}
                  </p>
                ) : null}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={() => markTouched('confirmPassword')}
                    required
                    autoComplete="new-password"
                    minLength={REGISTRATION_PASSWORD_MIN_LENGTH}
                    maxLength={REGISTRATION_PASSWORD_MAX_LENGTH}
                    aria-invalid={Boolean(showFieldError('confirmPassword'))}
                    aria-describedby={
                      showFieldError('confirmPassword') ? 'confirm-password-error' : undefined
                    }
                    className={`bg-transparent border-b px-0 py-2 w-full pr-8 placeholder:text-[#bfb6ad] focus:outline-none ${
                      showFieldError('confirmPassword') ? 'border-red-500' : 'border-[#bfb6ad]'
                    }`}
                    placeholder="Confirm Password *"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#bfb6ad] hover:text-black transition-colors focus:outline-none"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {eyeIcon(showConfirmPassword)}
                  </button>
                </div>
                {showFieldError('confirmPassword') ? (
                  <p
                    id="confirm-password-error"
                    className="mt-1 text-xs text-red-600"
                    role="alert"
                  >
                    {showFieldError('confirmPassword')}
                  </p>
                ) : null}
              </div>

              <label className="container cursor-pointer text-sm flex items-start gap-1">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
                <span className="checkmark" />
                <span className="black">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/terms-of-service')}
                    className="primary-color hover:text-[#bfb6ad] underline bg-transparent border-none cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </span>
              </label>

              <div className="pt-4">
                <AnimatedButton
                  type="submit"
                  disabled={!isFormComplete || isSubmitting}
                  className={`uppercase relative full-width mx-auto white-bg ${
                    !isFormComplete || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  dataAnimation="fade"
                  dataDelay="0.2"
                  dataDuration="0.8"
                >
                  {isSubmitting ? 'Creating Account...' : 'Begin Your Journey'}
                </AnimatedButton>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm black">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate(postAuthPath)}
                    className="steal-slate-color hover:text-[#bfb6ad] transition-colors underline bg-transparent border-none cursor-pointer"
                  >
                    Login now
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
            videoId="1117308076"
            title="Start Your Project | DX LIVING Account"
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

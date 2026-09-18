/** Practical RFC 5322–inspired email check (not exhaustive). */
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export const REGISTRATION_EMAIL_MAX_LENGTH = 254
export const REGISTRATION_NAME_MAX_LENGTH = 100
export const REGISTRATION_PASSWORD_MIN_LENGTH = 8
export const REGISTRATION_PASSWORD_MAX_LENGTH = 128

export type RegistrationFieldErrors = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export type PasswordRequirementKey = 'minLength' | 'uppercase' | 'lowercase' | 'number'

export type PasswordRequirements = Record<PasswordRequirementKey, boolean>

export const PASSWORD_REQUIREMENT_LABELS: Record<PasswordRequirementKey, string> = {
  minLength: `At least ${REGISTRATION_PASSWORD_MIN_LENGTH} characters`,
  uppercase: 'One uppercase letter',
  lowercase: 'One lowercase letter',
  number: 'One number',
}

export function normalizeRegistrationEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function normalizeRegistrationName(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function validateRegistrationName(
  value: string,
  label: 'First name' | 'Last name',
): string | undefined {
  const normalized = normalizeRegistrationName(value)

  if (!normalized) {
    return `${label} is required.`
  }

  if (normalized.length > REGISTRATION_NAME_MAX_LENGTH) {
    return `${label} must be ${REGISTRATION_NAME_MAX_LENGTH} characters or fewer.`
  }

  return undefined
}

export function getPasswordRequirements(password: string): PasswordRequirements {
  return {
    minLength: password.length >= REGISTRATION_PASSWORD_MIN_LENGTH,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  }
}

export function validateRegistrationEmail(email: string): string | undefined {
  const normalized = normalizeRegistrationEmail(email)

  if (!normalized) {
    return 'Email address is required.'
  }

  if (normalized.length > REGISTRATION_EMAIL_MAX_LENGTH) {
    return 'Email address is too long.'
  }

  if (!EMAIL_PATTERN.test(normalized)) {
    return 'Please enter a valid email address.'
  }

  return undefined
}

export function validateRegistrationPassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required.'
  }

  if (password.length > REGISTRATION_PASSWORD_MAX_LENGTH) {
    return `Password must be ${REGISTRATION_PASSWORD_MAX_LENGTH} characters or fewer.`
  }

  const requirements = getPasswordRequirements(password)
  const unmet = (Object.keys(requirements) as PasswordRequirementKey[]).filter(
    (key) => !requirements[key],
  )

  if (unmet.length > 0) {
    return 'Password does not meet the security requirements below.'
  }

  return undefined
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) {
    return 'Please confirm your password.'
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.'
  }

  return undefined
}

export function getRegistrationFieldErrors(input: {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}): RegistrationFieldErrors {
  return {
    firstName: validateRegistrationName(input.firstName, 'First name'),
    lastName: validateRegistrationName(input.lastName, 'Last name'),
    email: validateRegistrationEmail(input.email),
    password: validateRegistrationPassword(input.password),
    confirmPassword: validateConfirmPassword(input.password, input.confirmPassword),
  }
}

export function isRegistrationFormReady(input: {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}): boolean {
  if (!input.agreeToTerms) {
    return false
  }

  const errors = getRegistrationFieldErrors({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    password: input.password,
    confirmPassword: input.confirmPassword,
  })

  return (
    !errors.firstName &&
    !errors.lastName &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword
  )
}

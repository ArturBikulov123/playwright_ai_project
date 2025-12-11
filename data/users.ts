/**
 * Test Data - SauceDemo User Credentials
 * Typed user data for authentication testing
 * SECURITY: Credentials loaded from environment variables to prevent hardcoding
 */

export interface User {
  username: string
  password: string
  description: string
}

// Load credentials from environment variables with secure defaults for test environments
// SECURITY: Never commit real credentials. Use .env file (not tracked) for production values
function getEnvCredential(key: string, defaultValue: string): string {
  const value = process.env[key]
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`Required environment variable ${key} is not set`)
  }
  return value ?? defaultValue
}

export const USERS = {
  STANDARD: {
    username: getEnvCredential('TEST_USER_STANDARD_USERNAME', 'standard_user'),
    password: getEnvCredential('TEST_USER_STANDARD_PASSWORD', 'secret_sauce'),
    description: 'Standard user with full access',
  } as User,
  LOCKED_OUT: {
    username: getEnvCredential('TEST_USER_LOCKED_OUT_USERNAME', 'locked_out_user'),
    password: getEnvCredential('TEST_USER_LOCKED_OUT_PASSWORD', 'secret_sauce'),
    description: 'User account that is locked out',
  } as User,
} as const

export const INVALID_CREDENTIALS = {
  INVALID_PASSWORD: {
    username: 'standard_user',
    password: 'wrong_password',
    description: 'Valid username with wrong password',
  } as User,
} as const

/**
 * Get user credentials by type
 * @param type - User type ('STANDARD', 'LOCKED_OUT', etc.)
 * @returns User object
 * @throws Error if invalid user type is provided
 */
export function getUser(type: keyof typeof USERS): User {
  if (!(type in USERS)) {
    const validTypes = Object.keys(USERS).join(', ')
    throw new Error(
      `Invalid user type: "${type}". Valid types are: ${validTypes}`
    )
  }
  return USERS[type]
}

/**
 * Get standard user (most commonly used)
 */
export const standardUser = USERS.STANDARD


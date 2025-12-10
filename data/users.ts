/**
 * Test Data - SauceDemo User Credentials
 * Typed user data for authentication testing
 */

export interface User {
  username: string;
  password: string;
  description: string;
}

export const USERS = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Standard user with full access',
  } as User,
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'User account that is locked out',
  } as User,
  PROBLEM: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'User with problematic behavior',
  } as User,
  PERFORMANCE_GLITCH: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'User that experiences performance issues',
  } as User,
  ERROR: {
    username: 'error_user',
    password: 'secret_sauce',
    description: 'User that triggers error states',
  } as User,
  VISUAL: {
    username: 'visual_user',
    password: 'secret_sauce',
    description: 'User for visual testing scenarios',
  } as User,
} as const;

export const INVALID_CREDENTIALS = {
  INVALID_USERNAME: {
    username: 'invalid_user',
    password: 'secret_sauce',
    description: 'Non-existent username',
  } as User,
  INVALID_PASSWORD: {
    username: 'standard_user',
    password: 'wrong_password',
    description: 'Valid username with wrong password',
  } as User,
} as const;

/**
 * Get user credentials by type
 * @param type - User type ('standard', 'locked_out', 'problem', etc.)
 * @returns User object or undefined if not found
 */
export function getUser(type: keyof typeof USERS): User {
  return USERS[type];
}

/**
 * Get standard user (most commonly used)
 */
export const standardUser = USERS.STANDARD;


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
} as const;

export const INVALID_CREDENTIALS = {
  INVALID_PASSWORD: {
    username: 'standard_user',
    password: 'wrong_password',
    description: 'Valid username with wrong password',
  } as User,
} as const;

/**
 * Get user credentials by type
 * @param type - User type ('STANDARD', 'LOCKED_OUT', etc.)
 * @returns User object
 * @throws Error if invalid user type is provided
 */
export function getUser(type: keyof typeof USERS): User {
  if (!(type in USERS)) {
    const validTypes = Object.keys(USERS).join(', ');
    throw new Error(
      `Invalid user type: "${type}". Valid types are: ${validTypes}`
    );
  }
  return USERS[type];
}

/**
 * Get standard user (most commonly used)
 */
export const standardUser = USERS.STANDARD;


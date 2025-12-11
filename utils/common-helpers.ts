import { APIResponse } from '@playwright/test'
import { logger } from './logger'

/**
 * Common helper utilities used across the codebase
 * Applies DRY principles to reduce code duplication
 */

/**
 * Extract error message from unknown error type
 * @param error - Error object of unknown type
 * @returns Error message as string
 */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

/**
 * Validate URL is secure (HTTPS)
 * SECURITY: Prevents insecure HTTP connections
 * Allows localhost for development/testing
 * @param url - URL to validate
 * @param key - Environment variable key (for error messages)
 * @returns Validated URL
 * @throws Error if URL is insecure in production
 */
export function validateSecureUrl(url: string, key?: string): string {
  if (!url) {
    return url
  }

  // Allow localhost for development
  const isLocalhost = /^https?:\/\/localhost(:\d+)?(\/|$)/i.test(url) ||
                     /^https?:\/\/127\.0\.0\.1(:\d+)?(\/|$)/i.test(url) ||
                     /^https?:\/\/::1(:\d+)?(\/|$)/i.test(url)

  if (!isLocalhost && !url.startsWith('https://')) {
    if (process.env.NODE_ENV === 'production') {
      const errorMsg = key
        ? `Security violation: ${key} must use HTTPS in production. Current value: ${url}`
        : `Security violation: URL must use HTTPS in production. URL: ${url}`
      throw new Error(errorMsg)
    }
    const warningMsg = key
      ? `Security warning: ${key} uses HTTP instead of HTTPS. This is insecure and not allowed in production.`
      : `Security warning: Insecure HTTP URL detected: ${url}. HTTPS is required in production.`
    logger.warn(warningMsg)
  }

  return url
}

/**
 * Handle API response errors consistently
 * Checks if response is OK, logs errors, and throws appropriate exceptions
 * @param response - API response to check
 * @param context - Context description for error messages (e.g., 'Ollama API', 'GET request')
 * @throws Error if response is not OK
 */
export async function handleApiResponseError(
  response: APIResponse,
  context: string = 'API'
): Promise<void> {
  if (!response.ok()) {
    const errorText = await response.text()
    logger.error(`${context} error`, { status: response.status(), error: errorText })
    throw new Error(`${context} error: ${response.status()} - ${errorText}`)
  }
}


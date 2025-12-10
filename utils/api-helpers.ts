import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from './logger';

/**
 * API helper utilities for API testing
 * Provides common API request patterns and response handling
 */

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

export class ApiHelpers {
  /**
   * Validate URL is secure (HTTPS)
   * SECURITY: Prevents insecure HTTP connections
   */
  private static validateSecureUrl(url: string): void {
    // Allow localhost for development/testing
    const isLocalhost = /^https?:\/\/localhost(:\d+)?(\/|$)/i.test(url) || 
                       /^https?:\/\/127\.0\.0\.1(:\d+)?(\/|$)/i.test(url) ||
                       /^https?:\/\/::1(:\d+)?(\/|$)/i.test(url);
    
    if (!isLocalhost && !url.startsWith('https://')) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Security violation: URL must use HTTPS in production. URL: ${url}`);
      }
      logger.warn(`Security warning: Insecure HTTP URL detected: ${url}. HTTPS is required in production.`);
    }
  }

  /**
   * Sanitize data for logging to prevent credential exposure
   * SECURITY: Removes sensitive fields from logged data
   */
  private static sanitizeForLogging(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }
    
    const sensitiveKeys = ['password', 'passwd', 'pass', 'pwd', 'secret', 'token', 'apiKey', 'api_key', 
                          'accessToken', 'access_token', 'refreshToken', 'refresh_token', 'authorization',
                          'auth', 'credential', 'private', 'privateKey', 'private_key'];
    
    const sanitized = Array.isArray(data) ? [...(data as unknown[])] : { ...(data as Record<string, unknown>) };
    
    for (const key in sanitized as Record<string, unknown>) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        (sanitized as Record<string, unknown>)[key] = '***REDACTED***';
      } else if (typeof (sanitized as Record<string, unknown>)[key] === 'object' && (sanitized as Record<string, unknown>)[key] !== null) {
        (sanitized as Record<string, unknown>)[key] = this.sanitizeForLogging((sanitized as Record<string, unknown>)[key]);
      }
    }
    
    return sanitized;
  }

  /**
   * Perform GET request
   * @param request - Playwright API request context
   * @param url - Endpoint URL
   * @param options - Request options
   * @returns API response
   * @throws Error if request fails
   */
  static async get(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<APIResponse> {
    try {
      // SECURITY: Validate URL is secure
      this.validateSecureUrl(url);
      
      // SECURITY: Sanitize params before logging
      const sanitizedParams = options.params ? this.sanitizeForLogging(options.params) : undefined;
      logger.info('GET request', { url, params: sanitizedParams });
      
      const response = await request.get(url, {
        headers: options.headers,
        params: options.params,
        timeout: options.timeout,
      });
      logger.debug('Response received', { status: response.status() });
      return response;
    } catch (error) {
      // SECURITY: Don't log full URL in error messages to avoid leaking sensitive data
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('GET request failed', { error: errorMessage });
      throw error;
    }
  }
}


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
   * Perform GET request
   * @param request - Playwright API request context
   * @param url - Endpoint URL
   * @param options - Request options
   * @returns API response
   */
  static async get(
    request: APIRequestContext,
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<APIResponse> {
    logger.info(`GET ${url}`);
    const response = await request.get(url, {
      headers: options.headers,
      params: options.params,
      timeout: options.timeout,
    });
    logger.debug(`Response status: ${response.status()}`);
    return response;
  }
}


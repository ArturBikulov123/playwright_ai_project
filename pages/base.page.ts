import { Page, Locator } from '@playwright/test';

/**
 * BasePage - Base class for all page objects
 * Provides common functionality and shared helpers for all pages
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific path using baseURL
   * SECURITY: Validates path to prevent open redirects and injection
   * @param path - The path to navigate to (e.g., '/inventory.html')
   */
  async goto(path: string = '/'): Promise<void> {
    // SECURITY: Validate path to prevent open redirects and injection
    if (!path || typeof path !== 'string') {
      throw new Error('Invalid path: path must be a non-empty string');
    }
    
    // Prevent absolute URLs that could be used for open redirects
    // Only allow relative paths or paths starting with /
    if (path.match(/^https?:\/\//i)) {
      throw new Error('Security violation: Absolute URLs not allowed. Use relative paths only.');
    }
    
    // Basic path validation - allow alphanumeric, slashes, dashes, underscores, dots, query params
    // This is a test framework, so we allow more flexibility than production code
    if (!path.match(/^[/]?[a-zA-Z0-9/._?-]*$/)) {
      throw new Error('Invalid path format detected');
    }
    
    await this.page.goto(path);
  }

  /**
   * Get element by data-test attribute
   * Centralizes data test selector pattern
   * @param id - The data-test attribute value
   * @returns Locator for the element
   */
  getByDataTestId(id: string): Locator {
    return this.page.locator(`[data-test="${id}"]`);
  }

  /**
   * Get current URL
   * @returns The current page URL as a string
   */
  getCurrentUrl(): string {
    return this.page.url();
  }
}


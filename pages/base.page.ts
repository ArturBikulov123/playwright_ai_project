import { Page, Locator } from '@playwright/test';

/**
 * BasePage - Base class for all page objects
 * Provides common functionality and shared helpers for all pages
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific path using baseURL
   * @param path - The path to navigate to (e.g., '/inventory.html')
   */
  async goto(path: string = '/'): Promise<void> {
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
   */
  getCurrentUrl(): string {
    return this.page.url();
  }
}


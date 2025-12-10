import { Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * LoginPage - Page Object Model for SauceDemo login page
 * Handles all interactions with the login screen
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await super.goto('/');
  }

  /**
   * Perform login action
   * @param username - The username to enter
   * @param password - The password to enter
   */
  async login(username: string, password: string): Promise<void> {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }

  /**
   * Assert error message is displayed
   * @param message - Expected error message text
   */
  async assertErrorMessage(message: string): Promise<void> {
    const errorElement = this.getByDataTestId('error');
    await errorElement.waitFor({ state: 'visible' });
    const errorText = await errorElement.textContent();
    if (!errorText?.includes(message)) {
      throw new Error(`Expected error message "${message}" but got "${errorText}"`);
    }
  }
}


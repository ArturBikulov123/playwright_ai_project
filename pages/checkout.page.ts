import { Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * CheckoutPage - Page Object Model for SauceDemo checkout process
 * Handles both checkout step one (information) and step two (overview)
 */
export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Fill customer information on checkout step one
   * @param firstName - Customer first name
   * @param lastName - Customer last name
   * @param zipCode - Customer zip code
   */
  async fillCustomerInfo(firstName: string, lastName: string, zipCode: string): Promise<void> {
    await this.getByDataTestId('firstName').fill(firstName);
    await this.getByDataTestId('lastName').fill(lastName);
    await this.getByDataTestId('postalCode').fill(zipCode);
  }

  /**
   * Continue from checkout step one to step two
   */
  async continue(): Promise<void> {
    await this.getByDataTestId('continue').click();
  }

  /**
   * Finish the checkout process
   */
  async finishCheckout(): Promise<void> {
    await this.getByDataTestId('finish').click();
  }

  /**
   * Assert that order was completed successfully
   */
  async assertOrderSuccess(): Promise<void> {
    await this.getByDataTestId('checkout-complete-container').waitFor({ state: 'visible' });
    const completeHeader = this.getByDataTestId('complete-header');
    await completeHeader.waitFor({ state: 'visible' });
    const headerText = await completeHeader.textContent();
    if (!headerText?.includes('Thank you')) {
      throw new Error(`Expected success message but got "${headerText}"`);
    }
  }

  /**
   * Assert that error message is shown for empty required fields
   */
  async assertRequiredFieldError(): Promise<void> {
    const errorButton = this.getByDataTestId('error');
    await errorButton.waitFor({ state: 'visible' });
    const errorText = await errorButton.textContent();
    if (!errorText?.includes('required')) {
      throw new Error(`Expected required field error but got "${errorText}"`);
    }
  }
}


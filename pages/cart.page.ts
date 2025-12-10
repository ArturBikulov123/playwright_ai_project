import { Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * CartPage - Page Object Model for SauceDemo shopping cart page
 * Handles interactions with the cart and checkout initiation
 */
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Assert that a specific item is in the cart
   * @param name - The name of the product to verify
   */
  async expectCartItem(name: string): Promise<void> {
    const cartItem = this.page.locator('.cart_item').filter({ hasText: name });
    await cartItem.waitFor({ state: 'visible' });
  }

  /**
   * Remove an item from the cart by product name
   * @param name - The name of the product to remove
   */
  async removeItem(name: string): Promise<void> {
    const cartItem = this.page.locator('.cart_item').filter({ hasText: name });
    const removeButton = cartItem.locator('button').filter({ hasText: /Remove/i });
    await removeButton.click();
  }

  /**
   * Start the checkout process
   */
  async startCheckout(): Promise<void> {
    await this.getByDataTestId('checkout').click();
  }

  /**
   * Get the count of items in the cart
   * @returns Number of cart items
   */
  async getCartItemCount(): Promise<number> {
    const cartItems = this.page.locator('.cart_item');
    return await cartItems.count();
  }
}


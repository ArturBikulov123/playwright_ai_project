import { Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * ProductsPage - Page Object Model for SauceDemo products/inventory page
 * Handles interactions with the product listing and cart actions
 */
export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Assert that we are on the products page
   */
  async expectOnProductsPage(): Promise<void> {
    await this.getByDataTestId('inventory-container').waitFor({ state: 'visible' });
    const url = this.getCurrentUrl();
    if (!url.includes('/inventory.html')) {
      throw new Error(`Expected to be on products page but was on ${url}`);
    }
  }

  /**
   * Add a product to cart by product name
   * @param name - The name of the product to add
   */
  async addProductToCartByName(name: string): Promise<void> {
    const productItem = this.page.locator('.inventory_item').filter({ hasText: name });
    const addToCartButton = productItem.locator('button').filter({ hasText: /Add to cart/i });
    await addToCartButton.click();
  }

  /**
   * Open the shopping cart
   */
  async openCart(): Promise<void> {
    await this.getByDataTestId('shopping-cart-link').click();
  }

  /**
   * Get the cart badge count
   * @returns The number displayed on the cart badge, or 0 if badge is not visible
   */
  async getCartBadgeCount(): Promise<number> {
    const badge = this.getByDataTestId('shopping-cart-badge');
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      return parseInt(text || '0', 10);
    }
    return 0;
  }
}


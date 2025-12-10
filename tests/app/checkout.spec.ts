import { test, expect } from '../../fixtures/test-fixtures';
import { ORDER_DATA } from '../../data/orders';

test.describe('Checkout Tests', () => {
  test('should complete full checkout flow from login to order completion', async ({
    _loggedInUser,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    // Given - User is logged in and on products page
    await productsPage.expectOnProductsPage();

    // When - User adds product to cart
    await productsPage.addProductToCartByName('Sauce Labs Backpack');

    // And - User opens cart and starts checkout
    await productsPage.openCart();
    await cartPage.startCheckout();

    // And - User fills customer information
    await checkoutPage.fillCustomerInfo(
      ORDER_DATA.firstName,
      ORDER_DATA.lastName,
      ORDER_DATA.zipCode
    );
    await checkoutPage.continue();

    // And - User finishes checkout
    await checkoutPage.finishCheckout();

    // Then - Order should be completed successfully
    await checkoutPage.assertOrderSuccess();
    expect(checkoutPage.getCurrentUrl()).toContain('checkout-complete.html');
  });

  test('should show error when required checkout fields are empty', async ({
    _loggedInUser,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    // Given - User is logged in and has item in cart
    await productsPage.expectOnProductsPage();
    await productsPage.addProductToCartByName('Sauce Labs Backpack');
    await productsPage.openCart();
    await cartPage.startCheckout();

    // When - User attempts to continue without filling required fields
    await checkoutPage.continue();

    // Then - Error message should be displayed
    await checkoutPage.assertRequiredFieldError();
    expect(checkoutPage.getCurrentUrl()).toContain('checkout-step-one');
  });

  test('should clear cart after successful order completion', async ({
    _loggedInUser,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    // Given - User is logged in and completes an order
    await productsPage.expectOnProductsPage();
    await productsPage.addProductToCartByName('Sauce Labs Backpack');
    await productsPage.openCart();
    await cartPage.startCheckout();
    await checkoutPage.fillCustomerInfo(
      ORDER_DATA.firstName,
      ORDER_DATA.lastName,
      ORDER_DATA.zipCode
    );
    await checkoutPage.continue();
    await checkoutPage.finishCheckout();
    await checkoutPage.assertOrderSuccess();

    // When - User navigates back to products page
    await productsPage.goto('/inventory.html');
    await productsPage.expectOnProductsPage();

    // Then - Cart badge should not be visible (cart is empty)
    const badgeCount = await productsPage.getCartBadgeCount();
    expect(badgeCount).toBe(0);
  });
});


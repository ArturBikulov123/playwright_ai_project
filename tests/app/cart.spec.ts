import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Cart Tests', () => {
  test('should add single item to cart and verify it appears in cart', async ({
    loggedInUser,
    productsPage,
    cartPage,
  }) => {
    // Given - User is logged in and on products page
    await productsPage.expectOnProductsPage();

    // When - User adds a product to cart
    await productsPage.addProductToCartByName('Sauce Labs Backpack');

    // And - User opens the cart
    await productsPage.openCart();

    // Then - Cart should contain the added item
    await cartPage.expectCartItem('Sauce Labs Backpack');
  });

  test('should add two items and remove one from cart', async ({
    loggedInUser,
    productsPage,
    cartPage,
  }) => {
    // Given - User is logged in and on products page
    await productsPage.expectOnProductsPage();

    // When - User adds two products to cart
    await productsPage.addProductToCartByName('Sauce Labs Backpack');
    await productsPage.addProductToCartByName('Sauce Labs Bike Light');

    // And - User opens the cart
    await productsPage.openCart();

    // And - User removes one item
    await cartPage.removeItem('Sauce Labs Backpack');

    // Then - Only the remaining item should be in cart
    await cartPage.expectCartItem('Sauce Labs Bike Light');
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);
  });

  test('should verify cart badge count matches items in cart', async ({
    loggedInUser,
    productsPage,
    cartPage,
  }) => {
    // Given - User is logged in and on products page
    await productsPage.expectOnProductsPage();

    // When - User adds multiple products to cart
    await productsPage.addProductToCartByName('Sauce Labs Backpack');
    await productsPage.addProductToCartByName('Sauce Labs Bike Light');
    await productsPage.addProductToCartByName('Sauce Labs Bolt T-Shirt');

    // Then - Cart badge should show correct count
    const badgeCount = await productsPage.getCartBadgeCount();
    expect(badgeCount).toBe(3);

    // When - User opens cart
    await productsPage.openCart();

    // Then - Cart item count should match badge count
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(3);
    expect(cartItemCount).toBe(badgeCount);
  });
});


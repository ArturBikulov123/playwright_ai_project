import { test as base, Page } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { ProductsPage } from '../pages/products.page'
import { CartPage } from '../pages/cart.page'
import { CheckoutPage } from '../pages/checkout.page'
import { standardUser } from '../data/users'

/**
 * Custom test fixtures extending Playwright's base test
 * Provides page objects and authenticated user session
 */
type TestFixtures = {
  loginPage: LoginPage
  productsPage: ProductsPage
  cartPage: CartPage
  checkoutPage: CheckoutPage
  loggedInUser: { page: Page, productsPage: ProductsPage }
}

export const test = base.extend<TestFixtures>({
  /**
   * LoginPage fixture - provides LoginPage instance
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await use(loginPage)
  },

  /**
   * ProductsPage fixture - provides ProductsPage instance
   */
  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page)
    await use(productsPage)
  },

  /**
   * CartPage fixture - provides CartPage instance
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page)
    await use(cartPage)
  },

  /**
   * CheckoutPage fixture - provides CheckoutPage instance
   */
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page)
    await use(checkoutPage)
  },

  /**
   * loggedInUser fixture - logs in with standard user before test
   * Provides authenticated session and productsPage for convenience
   */
  loggedInUser: async ({ page, productsPage }, use) => {
    // Given - Navigate to login and authenticate
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login(standardUser.username, standardUser.password)

    // Wait for products page to load
    await productsPage.expectOnProductsPage()

    // Use the authenticated session
    await use({ page, productsPage })
  },
})

export { expect } from '@playwright/test'


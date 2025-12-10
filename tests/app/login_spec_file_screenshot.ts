import { test, expect } from '../../fixtures/test-fixtures';
import { getUser, INVALID_CREDENTIALS } from '../../data/users';

test.describe('Login Tests', () => {
  test('should login successfully with standard_user and land on products page', async ({
    page,
    loginPage,
    productsPage,
  }) => {
    // Given - User navigates to login page
    await loginPage.goto();
    await page.pause(); // 🔴 BREAKPOINT: Pause here to see the login page

    // When - User logs in with valid credentials
    const standardUser = getUser('STANDARD');
    await loginPage.login(standardUser.username, standardUser.password);
    await page.pause(); // 🔴 BREAKPOINT: Pause here to see after login

    // Then - User should be on the products page
    await productsPage.expectOnProductsPage();
    await page.pause(); // 🔴 BREAKPOINT: Pause here to see the final result
  });

  test('should display error message for wrong password', async ({ page, loginPage }) => {
    // Given - User navigates to login page
    await loginPage.goto();
    await page.pause(); // 🔴 BREAKPOINT: Pause here to see the login page

    // When - User attempts login with wrong password
    await loginPage.login(
      INVALID_CREDENTIALS.INVALID_PASSWORD.username,
      INVALID_CREDENTIALS.INVALID_PASSWORD.password
    );
    await page.pause(); // 🔴 BREAKPOINT: Pause here to see the error message

    // Then - Error message should be displayed
    await loginPage.assertErrorMessage(
      'Username and password do not match any user in this service'
    );
  });

  test('should display locked out error message for locked_out_user', async ({ page, loginPage }) => {
    // Given - User navigates to login page
    await loginPage.goto();
    await page.pause(); // 🔴 BREAKPOINT: Pause here to see the login page

    // When - User attempts login with locked out account
    const lockedOutUser = getUser('LOCKED_OUT');
    await loginPage.login(lockedOutUser.username, lockedOutUser.password);
    await page.pause(); // 🔴 BREAKPOINT: Pause here to see the locked out error

    // Then - Locked out error message should be displayed
    await loginPage.assertErrorMessage('Sorry, this user has been locked out.');
  });
});


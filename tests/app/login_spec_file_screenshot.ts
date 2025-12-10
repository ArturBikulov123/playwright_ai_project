import { test, expect } from '../../fixtures/test-fixtures';
import { getUser, INVALID_CREDENTIALS } from '../../data/users';

test.describe('Login Tests', () => {
  test('should login successfully with standard_user and land on products page', async ({
    loginPage,
    productsPage,
  }) => {
    // Given - User navigates to login page
    await loginPage.goto();

    // When - User logs in with valid credentials
    const standardUser = getUser('STANDARD');
    await loginPage.login(standardUser.username, standardUser.password);

    // Then - User should be on the products page
    await productsPage.expectOnProductsPage();
    expect(productsPage.getCurrentUrl()).toContain('/inventory.html');
  });

  test('should display error message for wrong password', async ({ loginPage }) => {
    // Given - User navigates to login page
    await loginPage.goto();

    // When - User attempts login with wrong password
    await loginPage.login(
      INVALID_CREDENTIALS.INVALID_PASSWORD.username,
      INVALID_CREDENTIALS.INVALID_PASSWORD.password
    );

    // Then - Error message should be displayed
    await loginPage.assertErrorMessage(
      'Username and password do not match any user in this service'
    );
    expect(loginPage.getCurrentUrl()).not.toContain('/inventory.html');
  });

  test('should display locked out error message for locked_out_user', async ({ loginPage }) => {
    // Given - User navigates to login page
    await loginPage.goto();

    // When - User attempts login with locked out account
    const lockedOutUser = getUser('LOCKED_OUT');
    await loginPage.login(lockedOutUser.username, lockedOutUser.password);

    // Then - Locked out error message should be displayed
    await loginPage.assertErrorMessage('Sorry, this user has been locked out.');
    expect(loginPage.getCurrentUrl()).not.toContain('/inventory.html');
  });
});


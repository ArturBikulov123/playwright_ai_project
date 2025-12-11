import { test, expect } from '../../fixtures/test-fixtures'
import { getUser, INVALID_CREDENTIALS } from '../../data/users'

test.describe('Login Tests', () => {
  test('should login successfully with standard_user and land on products page @smoke @regression', async ({
    loginPage,
    productsPage,
  }) => {
    await loginPage.goto()

    const standardUser = getUser('STANDARD')
    await loginPage.login(standardUser.username, standardUser.password)

    await productsPage.expectOnProductsPage()
    const currentUrl = productsPage.getCurrentUrl()
    expect(currentUrl).toContain('/inventory.html')
  })

  test('should display error message for wrong password @regression', async ({ loginPage }) => {
    await loginPage.goto()

    await loginPage.login(
      INVALID_CREDENTIALS.INVALID_PASSWORD.username,
      INVALID_CREDENTIALS.INVALID_PASSWORD.password
    )

    await loginPage.assertErrorMessage(
      'Username and password do not match any user in this service'
    )
    const currentUrl = loginPage.getCurrentUrl()
    expect(currentUrl).not.toContain('/inventory.html')
  })

  test('should display locked out error message for locked_out_user @regression', async ({ loginPage }) => {
    await loginPage.goto()

    const lockedOutUser = getUser('LOCKED_OUT')
    await loginPage.login(lockedOutUser.username, lockedOutUser.password)

    await loginPage.assertErrorMessage('Sorry, this user has been locked out.')
    const currentUrl = loginPage.getCurrentUrl()
    expect(currentUrl).not.toContain('/inventory.html')
  })
})


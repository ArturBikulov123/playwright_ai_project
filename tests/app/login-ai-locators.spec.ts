/**
 * Login with AI-generated locators tests
 * Tests SauceDemo login functionality using AI to verify and generate locators
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { join } from 'path'
import { OllamaHelpers } from '../../utils/ollama-helpers'
import { logger } from '../../utils/logger'
import { getUser } from '../../data/users'
import { envConfig } from '../../config/env.config'

test.describe('Login with AI Locators Tests', () => {
  test('should login to SauceDemo using AI-verified locators @smoke', async ({
    request,
    page,
  }) => {
    test.setTimeout(60000)
    logger.step('Testing login with AI-generated locator verification')

    // Navigate to the login page
    await page.goto(`${envConfig.baseUrl}/`)
    await page.waitForLoadState('networkidle')

    // Get the HTML content of the page
    const htmlContent = await page.content()

    // Read the LoginPage POM file content
    const pomFilePath = join(process.cwd(), 'pages', 'login.page.ts')
    const pomFileContent = readFileSync(pomFilePath, 'utf-8')

    // Verify locators using AI
    logger.info('Verifying page locators using AI')
    const verificationResult = await OllamaHelpers.verifyPageLocators(
      request,
      pomFileContent,
      htmlContent
    )

    // Verify that we got a response
    expect(verificationResult).toBeDefined()
    expect(verificationResult.length).toBeGreaterThan(0)

    logger.info('Page locator verification completed', {
      resultLength: verificationResult.length,
    })
    logger.debug('Verification result', { result: verificationResult })

    // Generate locators for key login elements using AI
    logger.info('Generating locators for login page elements using AI')
    const elementDescriptions = [
      'username input field',
      'password input field',
      'login button',
    ]

    const generatedLocators = await OllamaHelpers.generatePageLocators(
      request,
      htmlContent,
      elementDescriptions
    )

    expect(generatedLocators).toBeDefined()
    expect(generatedLocators.length).toBeGreaterThan(0)

    logger.info('Locators generated successfully', {
      resultLength: generatedLocators.length,
    })
    logger.debug('Generated locators', { result: generatedLocators })

    // Perform actual login using the existing POM locators
    logger.step('Performing login with standard user credentials')
    const standardUser = getUser('STANDARD')

    // Use the existing POM locators to perform login
    await page.fill('#user-name', standardUser.username)
    await page.fill('#password', standardUser.password)
    await page.click('#login-button')

    // Verify successful login by checking URL
    await page.waitForURL('**/inventory.html', { timeout: 10000 })
    const currentUrl = page.url()
    expect(currentUrl).toContain('/inventory.html')

    logger.info('Login successful', { username: standardUser.username })
  })
})


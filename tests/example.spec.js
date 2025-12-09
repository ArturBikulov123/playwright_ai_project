const { test, expect } = require('@playwright/test');

test('simple test - visit example.com', async ({ page }) => {
  // Navigate to a simple website
  await page.goto('https://example.com');
  
  // Check that the page title contains "Example"
  await expect(page).toHaveTitle(/Example/);
  
  // Check that the page contains the expected heading
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
  await expect(heading).toContainText('Example Domain');
  
  console.log('Test passed! Page loaded successfully.');
});


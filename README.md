# SauceDemo Test Framework

A professional, enterprise-grade Playwright test framework for testing the [SauceDemo](https://www.saucedemo.com) e-commerce application. This project demonstrates modern test automation practices, clean architecture, and maintainable code patterns suitable for SDET and QA Automation roles.

## Project Overview

This framework implements a comprehensive test suite for SauceDemo using TypeScript and Playwright, following industry best practices for test automation. The architecture emphasizes:

- **Page Object Model (POM)** - Clean separation of page interactions
- **Test Fixtures** - Reusable test setup and authentication
- **Type Safety** - Full TypeScript implementation for better DX and maintainability
- **Data-Driven Testing** - Centralized test data management
- **Clear Test Structure** - Given-When-Then style test organization

## Tech Stack

- **TypeScript** - Type-safe test code
- **Playwright** - Modern, reliable end-to-end testing
- **@playwright/test** - Playwright's test runner

## Folder Structure

```
playwright_ai_project/
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies
│
├── pages/                     # Page Object Models
│   ├── base.page.ts          # Base page with shared helpers
│   ├── login.page.ts         # Login page interactions
│   ├── products.page.ts      # Products/inventory page
│   ├── cart.page.ts          # Shopping cart page
│   └── checkout.page.ts      # Checkout process
│
├── fixtures/                  # Test fixtures
│   └── test-fixtures.ts      # Custom fixtures with page objects and auth
│
├── data/                      # Test data
│   ├── users.ts              # User credentials and helpers
│   └── orders.ts             # Order information for checkout
│
└── tests/                     # Test suites
    └── app/
        ├── login.spec.ts     # Login functionality tests
        ├── cart.spec.ts      # Shopping cart tests
        └── checkout.spec.ts # Checkout flow tests
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright_ai_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers** (if not already installed)
   ```bash
   npx playwright install chromium
   ```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/app/login.spec.ts
```

## Example Scenarios Covered

### Login Tests (`login.spec.ts`)
- ✅ Successful login with standard user
- ✅ Error handling for invalid credentials
- ✅ Locked out user validation

### Cart Tests (`cart.spec.ts`)
- ✅ Add items to cart
- ✅ Remove items from cart
- ✅ Cart badge count validation
- ✅ Cart item verification

### Checkout Tests (`checkout.spec.ts`)
- ✅ Complete checkout flow (login → cart → checkout → completion)
- ✅ Required field validation
- ✅ Order success confirmation
- ✅ Cart clearing after order completion

## Why This Project is Relevant for SDET/QA Automation Roles

This framework demonstrates several key competencies valued in enterprise test automation:

1. **Architecture & Design Patterns**
   - Page Object Model implementation
   - Test fixture pattern for reusable setup
   - Separation of concerns (pages, data, tests)

2. **Code Quality**
   - TypeScript for type safety and better IDE support
   - Clean, readable code following best practices
   - Maintainable and extensible structure

3. **Testing Best Practices**
   - Proper wait strategies (no hard-coded sleeps)
   - Assertion-based validation
   - Clear test organization (Given-When-Then)

4. **Professional Standards**
   - Enterprise-level configuration
   - Sensible timeouts and retry strategies
   - Comprehensive test coverage

5. **Developer Experience**
   - Intuitive API design
   - Helpful error messages
   - Easy to extend and maintain

## Configuration Highlights

- **Base URL**: Configured to `https://www.saucedemo.com`
- **Browser**: Chromium (single project for simplicity)
- **Timeouts**: 30s per test, 10s for assertions
- **Reporting**: HTML reporter with trace on failure
- **Retries**: 2 retries in CI environments

## Contributing

This is a portfolio project demonstrating test automation expertise. Feel free to use it as a reference or starting point for your own projects.

## License

ISC

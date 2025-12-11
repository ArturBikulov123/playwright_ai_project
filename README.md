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
- **Faker.js** - Dynamic test data generation
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality gates
- **GitHub Actions** - CI/CD pipeline

## Folder Structure

```
playwright_ai_project/
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies
├── global-setup.ts            # Global test setup
├── global-teardown.ts         # Global test teardown
│
├── config/                    # Configuration files
│   └── env.config.ts         # Environment configuration
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
├── utils/                     # Utility functions
│   ├── logger.ts             # Structured logging utility
│   ├── wait-helpers.ts       # Advanced wait strategies
│   ├── file-helpers.ts       # File operations
│   ├── api-helpers.ts        # API testing utilities
│   ├── test-data-factory.ts  # Dynamic test data generation
│   ├── visual-helpers.ts     # Visual regression testing
│   ├── performance-helpers.ts # Performance testing utilities
│   └── index.ts              # Central utility exports
│
├── data/                      # Test data
│   ├── users.ts              # User credentials and helpers
│   └── orders.ts             # Order information for checkout
│
├── tests/                     # Test suites
│   ├── app/                   # Application tests
│   │   ├── login.spec.ts     # Login functionality tests
│   │   ├── cart.spec.ts      # Shopping cart tests
│   │   └── checkout.spec.ts  # Checkout flow tests
│   └── api/                   # API tests
│       └── example-api.spec.ts # API testing examples
│
└── .github/                   # GitHub workflows
    └── workflows/
        └── ci.yml            # CI/CD pipeline
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
   npx playwright install --with-deps
   ```

4. **Set up environment variables** (optional but recommended for security)
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
   
   **Security Note:** Never commit `.env` files. They are already in `.gitignore`. See [SECURITY.md](./SECURITY.md) for details.

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

### Run tests for specific browser
```bash
npm run test:chromium    # Run on Chromium only (Chrome)
# npm run test:firefox     # Run on Firefox only (commented out)
# npm run test:webkit      # Run on WebKit only (commented out)
# npm run test:mobile      # Run on mobile browsers (commented out)
```

### Run tests by tags
```bash
npm run test:smoke       # Run smoke tests (@smoke tag)
npm run test:regression  # Run regression tests (@regression tag)
npm run test:api         # Run API tests (@api tag)
```

### View test report
```bash
npm run test:report      # Open HTML test report
```

### Code generation
```bash
npm run test:codegen     # Generate test code interactively
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

## Key Features

### 🎯 Browser Support
- **Desktop**: Chromium (Google Chrome) - Currently active
- **Other browsers**: Firefox, WebKit, Mobile Chrome, Mobile Safari, Tablet (commented out)

### 🛠️ Utility Functions
- **Logger**: Structured logging with different log levels
- **Wait Helpers**: Advanced wait strategies beyond Playwright defaults
- **API Helpers**: Comprehensive API testing utilities
- **Test Data Factory**: Dynamic test data generation with Faker.js
- **Visual Helpers**: Screenshot comparison and visual regression testing
- **Performance Helpers**: Page load metrics and performance monitoring
- **File Helpers**: JSON file operations and test data management

### 🔧 Configuration
- **Environment-based**: Configurable via `.env` file
- **Multiple Reporters**: HTML, JSON, JUnit, List, GitHub Actions
- **Global Setup/Teardown**: Pre-test setup and post-test cleanup
- **CI/CD Ready**: GitHub Actions workflow included

### 📊 Reporting
- **HTML Report**: Interactive test report with screenshots and videos
- **JSON Report**: Machine-readable test results
- **JUnit Report**: CI/CD integration compatible
- **GitHub Actions**: Native GitHub Actions reporter

### 🎨 Code Quality
- **ESLint**: Comprehensive linting rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit and pre-push hooks
- **TypeScript**: Full type safety

## Security

This framework implements enterprise-grade security practices:

- ✅ **Credential Management**: Environment variables, no hardcoded secrets
- ✅ **Input Validation**: All user inputs validated and sanitized
- ✅ **Path Traversal Protection**: File operations secured against directory traversal
- ✅ **HTTPS Enforcement**: All URLs validated for secure connections
- ✅ **Secure Logging**: Sensitive data automatically redacted in logs
- ✅ **Error Handling**: Generic error messages prevent information leakage
- ✅ **Dependency Scanning**: Automated security audits in CI/CD
- ✅ **OWASP Compliance**: Aligned with OWASP Top 10 and ASVS standards

See [SECURITY.md](./SECURITY.md) for detailed security documentation and [SECURITY_REVIEW.md](./SECURITY_REVIEW.md) for the complete security audit.

### Security Testing

Run security tests:
```bash
npm test -- --grep @security
```

Run security audit:
```bash
npm run security:audit
```

## Configuration Highlights

- **Base URL**: Configurable via environment variables (default: `https://www.saucedemo.com`)
- **Browsers**: Chromium (Google Chrome) - Other browsers (Firefox, WebKit, Mobile) are commented out
- **Timeouts**: 30s per test, 10s for assertions (configurable)
- **Reporting**: HTML, JSON, JUnit, List, GitHub Actions reporters
- **Retries**: 2 retries in CI environments, 0 in local
- **Workers**: Auto-detected in local, 1 in CI
- **Screenshots**: Only on failure
- **Videos**: Retained on failure
- **Traces**: On first retry

## Environment Variables

Create a `.env` file (use `.env.example` as a template) to configure:

- `BASE_URL`: Application base URL
- `HEADLESS`: Run tests in headless mode (true/false)
- `BROWSER`: Default browser (chromium - other browsers commented out)
- `TIMEOUT`: Test timeout in milliseconds
- `LOG_LEVEL`: Logging level (DEBUG/INFO/WARN/ERROR)
- And more... (see `.env.example`)

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:
- Runs tests on multiple browsers
- Executes linter checks
- Uploads test results and reports as artifacts
- Publishes HTML reports to GitHub Pages

## Best Practices Implemented

1. **Page Object Model (POM)** - Clean separation of page interactions
2. **Test Fixtures** - Reusable test setup and authentication
3. **Utility Functions** - DRY principle with reusable helpers
4. **Environment Configuration** - Flexible environment-based configuration
5. **Type Safety** - Full TypeScript implementation
6. **Code Quality** - ESLint, Prettier, and Husky hooks
7. **CI/CD Integration** - Automated testing pipeline
8. **Browser Testing** - Currently configured for Chrome (Chromium) only
9. **Comprehensive Reporting** - Multiple reporter formats
10. **Visual Regression** - Screenshot comparison capabilities
11. **Performance Testing** - Built-in performance monitoring
12. **API Testing** - API testing utilities and examples

## Contributing

This is a portfolio project demonstrating test automation expertise. Feel free to use it as a reference or starting point for your own projects.

## License

ISC

import { faker } from '@faker-js/faker';
import { logger } from './logger';

/**
 * Test data factory using Faker.js
 * Provides dynamic test data generation for tests
 */

/**
 * Generate random user data
 * @returns User object with random data
 */
export function generateUser() {
  const user = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password({ length: 12 }),
    phone: faker.phone.number(),
  };
  logger.debug('Generated random user data', { username: user.username });
  return user;
}

/**
 * Generate random order data
 * @returns Order object with random data
 */
export function generateOrder() {
  const order = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    zipCode: faker.location.zipCode(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
  };
  logger.debug('Generated random order data', { zipCode: order.zipCode });
  return order;
}

/**
 * Generate random product name
 * @returns Random product name
 */
export function generateProductName(): string {
  const productName = faker.commerce.productName();
  logger.debug('Generated random product name', { productName });
  return productName;
}

/**
 * Generate random email
 * @returns Random email address
 */
export function generateEmail(): string {
  return faker.internet.email();
}

/**
 * Generate random string of specified length
 * @param length - Length of the string
 * @returns Random string
 */
export function generateRandomString(length: number = 10): string {
  return faker.string.alphanumeric(length);
}

/**
 * Generate random number within range
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Random number
 */
export function generateRandomNumber(min: number = 0, max: number = 100): number {
  return faker.number.int({ min, max });
}

/**
 * Generate random date
 * @param past - Whether to generate a past date (default: false)
 * @returns Random date
 */
export function generateRandomDate(past: boolean = false): Date {
  return past ? faker.date.past() : faker.date.future();
}


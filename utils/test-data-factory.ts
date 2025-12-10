import { faker } from '@faker-js/faker';
import { logger } from './logger';

/**
 * Test data factory for generating dynamic test data
 * Uses Faker.js for realistic test data generation
 */

export interface UserData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface OrderData {
  firstName: string;
  lastName: string;
  zipCode: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export class TestDataFactory {
  /**
   * Generate random user data
   * @returns UserData object with random values
   */
  static generateUser(): UserData {
    const username = faker.internet.userName();
    const password = faker.internet.password({ length: 12, memorable: false });
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const user = {
      username,
      password,
      firstName,
      lastName,
      email,
    };
    logger.debug('Generated user data', user);
    return user;
  }

  /**
   * Generate random order data
   * @returns OrderData object with random values
   */
  static generateOrder(): OrderData {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const zipCode = faker.location.zipCode();
    const address = faker.location.streetAddress();
    const city = faker.location.city();
    const state = faker.location.state();
    const country = faker.location.country();
    const order = {
      firstName,
      lastName,
      zipCode,
      address,
      city,
      state,
      country,
    };
    logger.debug('Generated order data', order);
    return order;
  }

  /**
   * Generate random string
   * @param length - Length of the string
   * @returns Random string
   */
  static generateString(length: number = 10): string {
    return faker.string.alphanumeric(length);
  }

  /**
   * Generate random number
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random number
   */
  static generateNumber(min: number = 0, max: number = 100): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generate random email
   * @returns Random email address
   */
  static generateEmail(): string {
    return faker.internet.email();
  }

  /**
   * Generate random phone number
   * @returns Random phone number
   */
  static generatePhoneNumber(): string {
    return faker.phone.number();
  }

  /**
   * Generate random date
   * @param past - Whether to generate a past date
   * @returns Random date
   */
  static generateDate(past: boolean = false): Date {
    return past ? faker.date.past() : faker.date.future();
  }

  /**
   * Generate random UUID
   * @returns Random UUID string
   */
  static generateUUID(): string {
    return faker.string.uuid();
  }
}


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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const username = faker.internet.userName() as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const password = faker.internet.password({ length: 12, memorable: false }) as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const firstName = faker.person.firstName() as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const lastName = faker.person.lastName() as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const email = faker.internet.email() as string;
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const firstName = faker.person.firstName() as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const lastName = faker.person.lastName() as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const zipCode = faker.location.zipCode() as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const address = faker.location.streetAddress() as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const city = faker.location.city() as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const state = faker.location.state() as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const country = faker.location.country() as string;
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return faker.string.alphanumeric(length) as string;
  }

  /**
   * Generate random number
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random number
   */
  static generateNumber(min: number = 0, max: number = 100): number {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return faker.number.int({ min, max }) as number;
  }

  /**
   * Generate random email
   * @returns Random email address
   */
  static generateEmail(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return faker.internet.email() as string;
  }

  /**
   * Generate random phone number
   * @returns Random phone number
   */
  static generatePhoneNumber(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return faker.phone.number() as string;
  }

  /**
   * Generate random date
   * @param past - Whether to generate a past date
   * @returns Random date
   */
  static generateDate(past: boolean = false): Date {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return (past ? faker.date.past() : faker.date.future()) as Date;
  }

  /**
   * Generate random UUID
   * @returns Random UUID string
   */
  static generateUUID(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return faker.string.uuid() as string;
  }
}


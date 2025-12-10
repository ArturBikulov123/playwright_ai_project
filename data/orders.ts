/**
 * Test Data - Order Information
 * Typed order data for checkout testing
 */

export interface OrderInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

export const ORDER_DATA: OrderInfo = {
  firstName: 'John',
  lastName: 'Doe',
  zipCode: '12345',
} as const;


/**
 * QuickKart — Cart Validation Schemas (Zod)
 */

import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid('Invalid product ID format'),
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative'),
});

export const applyCouponSchema = z.object({
  couponCode: z
    .string({ required_error: 'Coupon code is required' })
    .trim()
    .min(1, 'Coupon code cannot be empty')
    .toUpperCase(),
});

export const productIdParamSchema = z.object({
  productId: z.string().uuid('Invalid product ID format in URL path'),
});

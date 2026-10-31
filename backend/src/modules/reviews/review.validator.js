/**
 * QuickKart — Review Validation Schemas (Zod)
 */

import { z } from 'zod';

export const createReviewSchema = z
  .object({
    orderId: z.string().uuid('Invalid order ID format'),
    storeRating: z
      .number({ invalid_type_error: 'Store rating must be an integer between 1 and 5' })
      .int()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5')
      .optional()
      .nullable(),
    storeComment: z
      .string()
      .trim()
      .max(500, 'Store comment cannot exceed 500 characters')
      .optional()
      .nullable(),
    deliveryRating: z
      .number({ invalid_type_error: 'Delivery rating must be an integer between 1 and 5' })
      .int()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5')
      .optional()
      .nullable(),
    deliveryComment: z
      .string()
      .trim()
      .max(500, 'Delivery comment cannot exceed 500 characters')
      .optional()
      .nullable(),
  })
  .refine(
    (data) => data.storeRating != null || data.deliveryRating != null,
    {
      message: 'At least one rating (storeRating or deliveryRating) must be provided',
      path: ['storeRating'],
    }
  );

export const listReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const storeIdParamSchema = z.object({
  storeId: z.string().uuid('Invalid store ID format'),
});

export const partnerIdParamSchema = z.object({
  partnerId: z.string().uuid('Invalid delivery partner ID format'),
});

export const orderIdParamSchema = z.object({
  orderId: z.string().uuid('Invalid order ID format'),
});

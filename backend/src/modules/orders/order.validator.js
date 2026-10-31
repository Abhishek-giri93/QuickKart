/**
 * QuickKart — Order Validation Schemas (Zod)
 */

import { z } from 'zod';
import { PAYMENT_METHOD, ORDER_STATUS } from '../../utils/constants.js';

export const createOrderSchema = z.object({
  addressId: z.string().uuid('Invalid address ID format'),
  paymentMethod: z.enum([PAYMENT_METHOD.COD, PAYMENT_METHOD.RAZORPAY], {
    errorMap: () => ({ message: 'Payment method must be COD or RAZORPAY' }),
  }),
  specialInstructions: z
    .string()
    .trim()
    .max(500, 'Special instructions cannot exceed 500 characters')
    .optional()
    .nullable(),
  scheduledAt: z
    .string()
    .datetime({ message: 'scheduledAt must be a valid ISO 8601 date string' })
    .optional()
    .nullable(),
});

export const cancelOrderSchema = z.object({
  cancellationReason: z
    .string()
    .trim()
    .min(3, 'Cancellation reason must be at least 3 characters')
    .max(250, 'Cancellation reason cannot exceed 250 characters')
    .optional()
    .nullable(),
});

export const sellerRejectOrderSchema = z.object({
  cancellationReason: z
    .string({ required_error: 'Rejection reason is required' })
    .trim()
    .min(3, 'Rejection reason must be at least 3 characters')
    .max(250, 'Rejection reason cannot exceed 250 characters'),
});

export const listOrdersQuerySchema = z.object({
  status: z.nativeEnum(ORDER_STATUS).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const orderIdParamSchema = z.object({
  id: z.string().uuid('Invalid order ID format'),
});

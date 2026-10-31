/**
 * QuickKart — Payment Validation Schemas (Zod)
 */

import { z } from 'zod';
import { TRANSACTION_TYPE } from '../../utils/constants.js';

export const createRazorpayOrderSchema = z.object({
  orderId: z.string().uuid('Invalid order ID format'),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().uuid('Invalid order ID format'),
  razorpayOrderId: z.string().min(1, 'Razorpay order ID is required').trim(),
  razorpayPaymentId: z.string().min(1, 'Razorpay payment ID is required').trim(),
  razorpaySignature: z.string().min(1, 'Razorpay signature is required').trim(),
});

export const initiateRefundSchema = z.object({
  paymentId: z.string().uuid('Invalid payment ID format'),
  amount: z.number().positive('Refund amount must be greater than 0'),
  reason: z
    .string()
    .trim()
    .min(3, 'Refund reason must be at least 3 characters')
    .max(250, 'Refund reason cannot exceed 250 characters'),
});

export const paymentIdParamSchema = z.object({
  id: z.string().uuid('Invalid payment ID format'),
});

export const listTransactionsQuerySchema = z.object({
  type: z.nativeEnum(TRANSACTION_TYPE).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

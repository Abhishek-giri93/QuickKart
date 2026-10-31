/**
 * QuickKart — Admin Validation Schemas (Zod)
 */

import { z } from 'zod';
import { STORE_STATUS, USER_ROLES } from '../../utils/constants.js';

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export const updateStoreStatusSchema = z.object({
  status: z.nativeEnum(STORE_STATUS, {
    errorMap: () => ({ message: 'Invalid store status' }),
  }),
});

export const updateStoreCommissionSchema = z.object({
  commissionRate: z
    .number({ required_error: 'Commission rate is required' })
    .min(0, 'Commission cannot be negative')
    .max(100, 'Commission cannot exceed 100%'),
});

export const verifyPartnerSchema = z.object({
  isVerified: z.boolean({ required_error: 'isVerified boolean is required' }),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean({ required_error: 'isActive boolean is required' }),
});

export const createCouponSchema = z
  .object({
    code: z
      .string({ required_error: 'Coupon code is required' })
      .trim()
      .min(2, 'Coupon code must be at least 2 characters')
      .max(30, 'Coupon code cannot exceed 30 characters')
      .toUpperCase(),
    description: z.string().trim().max(255).optional().nullable(),
    discountPercent: z.number().min(1).max(100).optional().nullable(),
    discountAmount: z.number().positive().optional().nullable(),
    minOrderAmount: z.number().min(0).optional().nullable(),
    maxDiscount: z.number().positive().optional().nullable(),
    usageLimit: z.number().int().min(1).optional().nullable(),
    perUserLimit: z.number().int().min(1).default(1),
    validFrom: z.string().datetime({ message: 'validFrom must be a valid ISO 8601 date string' }),
    validUntil: z.string().datetime({ message: 'validUntil must be a valid ISO 8601 date string' }),
  })
  .refine(
    (data) => data.discountPercent != null || data.discountAmount != null,
    {
      message: 'At least one of discountPercent or discountAmount must be provided',
      path: ['discountPercent'],
    }
  )
  .refine(
    (data) => new Date(data.validUntil) > new Date(data.validFrom),
    {
      message: 'validUntil must be after validFrom',
      path: ['validUntil'],
    }
  );

export const updateCouponSchema = z.object({
  description: z.string().trim().max(255).optional().nullable(),
  isActive: z.boolean().optional(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  validUntil: z.string().datetime().optional(),
});

export const listUsersQuerySchema = z.object({
  role: z.nativeEnum(USER_ROLES).optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const listStoresQuerySchema = z.object({
  status: z.nativeEnum(STORE_STATUS).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const listPartnersQuerySchema = z.object({
  isVerified: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const listCouponsQuerySchema = z.object({
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});


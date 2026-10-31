/**
 * QuickKart — Delivery Validation Schemas (Zod)
 */

import { z } from 'zod';
import { DELIVERY_STATUS } from '../../utils/constants.js';

export const deliveryIdParamSchema = z.object({
  id: z.string().uuid('Invalid delivery ID format'),
});

export const acceptDeliverySchema = z.object({
  deliveryNotes: z
    .string()
    .trim()
    .max(300, 'Delivery notes cannot exceed 300 characters')
    .optional()
    .nullable(),
});

export const updateLocationSchema = z.object({
  latitude: z
    .number({ required_error: 'Latitude is required' })
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number({ required_error: 'Longitude is required' })
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
});

export const verifyOtpSchema = z.object({
  otp: z
    .string({ required_error: 'OTP is required' })
    .length(4, 'OTP must be exactly 4 digits')
    .regex(/^\d{4}$/, 'OTP must contain only digits'),
});

export const listDeliveriesQuerySchema = z.object({
  status: z.nativeEnum(DELIVERY_STATUS).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});


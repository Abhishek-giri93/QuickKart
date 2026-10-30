/**
 * Authentication Input Validation Schemas (Zod)
 */

import { z } from 'zod';

const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const registerCustomerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.string().regex(phoneRegex, 'Invalid Indian phone number format (10 digits starting with 6-9)').trim(),
  password: passwordSchema,
  firstName: z.string().min(2, 'First name must be at least 2 characters').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
});

export const registerSellerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.string().regex(phoneRegex, 'Invalid Indian phone number format').trim(),
  password: passwordSchema,
  firstName: z.string().min(2, 'First name must be at least 2 characters').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  businessName: z.string().min(2, 'Business name is required').trim(),
  gstNumber: z.string().trim().optional(),
  panNumber: z.string().trim().optional(),
});

export const registerDeliveryPartnerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.string().regex(phoneRegex, 'Invalid Indian phone number format').trim(),
  password: passwordSchema,
  firstName: z.string().min(2, 'First name must be at least 2 characters').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'OTHER'], {
    errorMap: () => ({ message: 'Vehicle type must be BICYCLE, MOTORCYCLE, CAR, or OTHER' }),
  }),
  vehicleNumber: z.string().min(2, 'Vehicle number is required').trim(),
  licenseNumber: z.string().min(2, 'Driver license number is required').trim(),
});

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Email or phone is required').trim(),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional(),
});

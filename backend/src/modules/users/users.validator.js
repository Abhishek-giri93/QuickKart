/**
 * Users & Profiles Input Validation Schemas (Zod)
 */

import { z } from 'zod';

const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/; // Standard 6-digit Indian PIN code

// ── Customer Profile ────────────────────────────────────────────────────────
export const updateCustomerProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').trim().optional(),
  lastName: z.string().min(1, 'Last name cannot be empty').trim().optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional().nullable(),
  dateOfBirth: z.string().datetime({ message: 'Invalid ISO datetime string' }).optional().nullable(),
});

// ── Address ─────────────────────────────────────────────────────────────────
export const createAddressSchema = z.object({
  label: z.enum(['Home', 'Work', 'Other'], {
    errorMap: () => ({ message: 'Label must be Home, Work, or Other' }),
  }),
  recipientName: z.string().min(2, 'Recipient name is required').trim(),
  recipientPhone: z.string().regex(phoneRegex, 'Invalid phone number format').trim(),
  addressLine1: z.string().min(5, 'Address line 1 must be at least 5 characters').trim(),
  addressLine2: z.string().trim().optional().nullable(),
  landmark: z.string().trim().optional().nullable(),
  city: z.string().min(2, 'City is required').trim(),
  state: z.string().min(2, 'State is required').trim(),
  pincode: z.string().regex(pincodeRegex, 'Invalid 6-digit PIN code format').trim(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

export const addressIdParamSchema = z.object({
  id: z.string().uuid('Invalid address ID format'),
});

// ── Seller Profile ──────────────────────────────────────────────────────────
export const updateSellerProfileSchema = z.object({
  firstName: z.string().min(2).trim().optional(),
  lastName: z.string().min(1).trim().optional(),
  businessName: z.string().min(2).trim().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  gstNumber: z.string().trim().optional().nullable(),
  panNumber: z.string().trim().optional().nullable(),
  bankAccountNo: z.string().min(9).max(18).trim().optional().nullable(),
  bankIfsc: z.string().min(4).max(11).trim().optional().nullable(),
});

// ── Delivery Partner Profile ────────────────────────────────────────────────
export const updateDeliveryPartnerProfileSchema = z.object({
  firstName: z.string().min(2).trim().optional(),
  lastName: z.string().min(1).trim().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'OTHER']).optional(),
  vehicleNumber: z.string().min(2).trim().optional(),
  licenseNumber: z.string().min(2).trim().optional(),
});

export const toggleOnlineStatusSchema = z.object({
  isOnline: z.boolean({ required_error: 'isOnline boolean is required' }),
});

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
});

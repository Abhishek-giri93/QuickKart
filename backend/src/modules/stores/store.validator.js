/**
 * Store Validation Schemas (Zod)
 */

import { z } from 'zod';

const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
const pincodeRegex = /^[1-9][0-9]{5}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // 24-hr format "09:00"

export const createStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters').trim(),
  description: z.string().trim().optional().nullable(),
  coverImageUrl: z.string().url('Invalid cover image URL').optional().nullable(),
  logoUrl: z.string().url('Invalid logo image URL').optional().nullable(),
  phone: z.string().regex(phoneRegex, 'Invalid store contact number').trim(),
  email: z.string().email('Invalid store email').optional().nullable(),
  addressLine: z.string().min(5, 'Store address is required').trim(),
  city: z.string().min(2, 'City is required').trim(),
  state: z.string().min(2, 'State is required').trim(),
  pincode: z.string().regex(pincodeRegex, 'Invalid 6-digit PIN code').trim(),
  latitude: z.number().min(-90).max(90, 'Valid latitude required'),
  longitude: z.number().min(-180).max(180, 'Valid longitude required'),
  openingTime: z.string().regex(timeRegex, 'Format must be HH:mm (e.g. 09:00)').optional().nullable(),
  closingTime: z.string().regex(timeRegex, 'Format must be HH:mm (e.g. 22:00)').optional().nullable(),
});

export const updateStoreSchema = createStoreSchema.partial();

export const toggleStoreOpenSchema = z.object({
  isOpen: z.boolean({ required_error: 'isOpen boolean is required' }),
});

export const updateStoreStatusSchema = z.object({
  status: z.enum(['PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'REJECTED'], {
    errorMap: () => ({ message: 'Status must be PENDING_VERIFICATION, ACTIVE, SUSPENDED, or REJECTED' }),
  }),
});

export const updateStoreCommissionSchema = z.object({
  commissionRate: z.number().min(0).max(100, 'Commission rate must be between 0 and 100 percent'),
});

export const discoverStoresQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().min(1).max(50).default(10).optional(),
  city: z.string().trim().optional(),
  search: z.string().trim().optional(),
  categoryId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20).optional(),
});

export const storeIdParamSchema = z.object({
  id: z.string().uuid('Invalid store ID format'),
});

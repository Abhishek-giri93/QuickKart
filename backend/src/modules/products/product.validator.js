/**
 * Product & Inventory Validation Schemas (Zod)
 */

import { z } from 'zod';

export const createProductSchema = z
  .object({
    storeId: z.string().uuid('Invalid store ID'),
    categoryId: z.string().uuid('Invalid category ID'),
    name: z.string().min(2, 'Product name must be at least 2 characters').trim(),
    slug: z.string().trim().optional(),
    description: z.string().trim().optional().nullable(),
    price: z.number().positive('Price must be greater than 0'),
    discountedPrice: z.number().positive('Discounted price must be greater than 0').optional().nullable(),
    unit: z.string().min(1, 'Unit is required (e.g. kg, piece, litre)').trim().optional().nullable(),
    isAvailable: z.boolean().default(true),
    initialStock: z.number().int().min(0, 'Initial stock cannot be negative').default(0),
    lowStockAlert: z.number().int().min(0).default(10),
    images: z
      .array(
        z.object({
          imageUrl: z.string().url('Invalid image URL'),
          publicId: z.string().optional().nullable(),
          isPrimary: z.boolean().default(false),
          sortOrder: z.number().int().min(0).default(0),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.discountedPrice != null) {
        return data.discountedPrice <= data.price;
      }
      return true;
    },
    {
      message: 'Discounted price cannot be greater than regular price',
      path: ['discountedPrice'],
    }
  );

export const updateProductSchema = z
  .object({
    categoryId: z.string().uuid('Invalid category ID').optional(),
    name: z.string().min(2).trim().optional(),
    slug: z.string().trim().optional(),
    description: z.string().trim().optional().nullable(),
    price: z.number().positive().optional(),
    discountedPrice: z.number().positive().optional().nullable(),
    unit: z.string().min(1).trim().optional().nullable(),
    isAvailable: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.price != null && data.discountedPrice != null) {
        return data.discountedPrice <= data.price;
      }
      return true;
    },
    {
      message: 'Discounted price cannot be greater than regular price',
      path: ['discountedPrice'],
    }
  );

export const updateInventorySchema = z
  .object({
    quantity: z.number().int().min(0, 'Stock quantity cannot be negative').optional(),
    adjustment: z.number().int().optional(),
    lowStockAlert: z.number().int().min(0).optional(),
  })
  .refine(
    (data) => data.quantity !== undefined || data.adjustment !== undefined || data.lowStockAlert !== undefined,
    {
      message: 'At least one of quantity, adjustment, or lowStockAlert must be provided',
    }
  );

export const addProductImageSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  publicId: z.string().optional().nullable(),
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export const listProductsQuerySchema = z.object({
  storeId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  isAvailable: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
});

export const productIdParamSchema = z.object({
  id: z.string().uuid('Invalid product ID'),
});

export const productImageIdParamSchema = z.object({
  id: z.string().uuid('Invalid product ID'),
  imageId: z.string().uuid('Invalid image ID'),
});

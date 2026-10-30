/**
 * Category Validation Schemas (Zod)
 */

import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').trim(),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional().nullable(),
  imageUrl: z.string().url('Invalid image URL').optional().nullable(),
  parentId: z.string().uuid('Invalid parent category ID').optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdParamSchema = z.object({
  id: z.string().min(1, 'Category ID or slug is required'),
});

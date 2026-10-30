/**
 * Category Route Handlers (Controller)
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/response.js';
import * as categoryService from './category.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true';
  const categories = await categoryService.getAllCategories({ includeInactive });

  sendSuccess(res, {
    message: 'Categories retrieved successfully',
    data: categories,
  });
});

export const getByIdOrSlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryByIdOrSlug(req.params.id);

  sendSuccess(res, {
    message: 'Category retrieved successfully',
    data: category,
  });
});

export const create = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  sendCreated(res, {
    message: 'Category created successfully',
    data: category,
  });
});

export const update = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);

  sendSuccess(res, {
    message: 'Category updated successfully',
    data: category,
  });
});

export const remove = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  sendSuccess(res, {
    message: 'Category deleted successfully',
  });
});

/**
 * Product & Inventory Route Handlers (Controller)
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/response.js';
import * as productService from './product.service.js';

// ── Public Product Discovery ─────────────────────────────────────────────────

export const listProducts = asyncHandler(async (req, res) => {
  const result = await productService.listProducts(req.query);
  sendSuccess(res, {
    message: 'Products retrieved successfully',
    data: result.products,
    meta: result.meta,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductByIdOrSlug(req.params.id);
  sendSuccess(res, {
    message: 'Product details retrieved',
    data: product,
  });
});

// ── Seller Product Management ────────────────────────────────────────────────

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.user.id, req.user.role, req.body);
  sendCreated(res, {
    message: 'Product created successfully',
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.user.id, req.user.role, req.params.id, req.body);
  sendSuccess(res, {
    message: 'Product updated successfully',
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.user.id, req.user.role, req.params.id);
  sendSuccess(res, {
    message: 'Product deleted successfully',
  });
});

export const addImage = asyncHandler(async (req, res) => {
  const image = await productService.addImage(req.user.id, req.user.role, req.params.id, req.body);
  sendCreated(res, {
    message: 'Product image added successfully',
    data: image,
  });
});

export const removeImage = asyncHandler(async (req, res) => {
  await productService.removeImage(req.user.id, req.user.role, req.params.id, req.params.imageId);
  sendSuccess(res, {
    message: 'Product image removed successfully',
  });
});

// ── Inventory Management ─────────────────────────────────────────────────────

export const updateInventory = asyncHandler(async (req, res) => {
  const inventory = await productService.updateInventory(req.user.id, req.user.role, req.params.id, req.body);
  sendSuccess(res, {
    message: 'Inventory updated successfully',
    data: inventory,
  });
});

export const getLowStock = asyncHandler(async (req, res) => {
  const storeId = req.query.storeId;
  const products = await productService.getLowStockProducts(req.user.id, req.user.role, storeId);
  sendSuccess(res, {
    message: 'Low stock products retrieved',
    data: products,
  });
});

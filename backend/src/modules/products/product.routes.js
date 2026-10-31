/**
 * Product Express Routes
 * Mounted at: /api/v1/products
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as productCtrl from './product.controller.js';
import {
  createProductSchema,
  updateProductSchema,
  updateInventorySchema,
  addProductImageSchema,
  listProductsQuerySchema,
  productIdParamSchema,
  productImageIdParamSchema,
} from './product.validator.js';

const router = Router();

// ── Public Product Discovery ─────────────────────────────────────────────────
router.get('/', validate(listProductsQuerySchema, 'query'), productCtrl.listProducts);

// ── Seller Product Operations ────────────────────────────────────────────────
router.post(
  '/',
  protect,
  authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN),
  validate(createProductSchema),
  productCtrl.createProduct
);

router.patch(
  '/:id',
  protect,
  authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN),
  validate(productIdParamSchema, 'params'),
  validate(updateProductSchema),
  productCtrl.updateProduct
);

router.delete(
  '/:id',
  protect,
  authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN),
  validate(productIdParamSchema, 'params'),
  productCtrl.deleteProduct
);

// ── Product Images ───────────────────────────────────────────────────────────
router.post(
  '/:id/images',
  protect,
  authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN),
  validate(productIdParamSchema, 'params'),
  validate(addProductImageSchema),
  productCtrl.addImage
);

router.delete(
  '/:id/images/:imageId',
  protect,
  authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN),
  validate(productImageIdParamSchema, 'params'),
  productCtrl.removeImage
);

// ── Product Inventory Update ─────────────────────────────────────────────────
router.patch(
  '/:id/inventory',
  protect,
  authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN),
  validate(productIdParamSchema, 'params'),
  validate(updateInventorySchema),
  productCtrl.updateInventory
);

// ── Public Product Details by ID / Slug ──────────────────────────────────────
router.get('/:id', productCtrl.getProductById);

export default router;

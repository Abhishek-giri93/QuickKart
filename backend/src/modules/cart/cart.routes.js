/**
 * QuickKart — Cart Routes
 * Mounted at: /api/v1/cart
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as cartCtrl from './cart.controller.js';
import {
  addToCartSchema,
  updateCartItemSchema,
  applyCouponSchema,
  productIdParamSchema,
} from './cart.validator.js';

const router = Router();

// All cart operations require authenticated CUSTOMER role
router.use(protect, authorize(USER_ROLES.CUSTOMER));

router.get('/', cartCtrl.getCart);
router.post('/items', validate(addToCartSchema), cartCtrl.addToCart);
router.patch(
  '/items/:productId',
  validate(productIdParamSchema, 'params'),
  validate(updateCartItemSchema),
  cartCtrl.updateCartItem
);
router.delete(
  '/items/:productId',
  validate(productIdParamSchema, 'params'),
  cartCtrl.removeCartItem
);
router.delete('/clear', cartCtrl.clearCart);

router.post('/coupon', validate(applyCouponSchema), cartCtrl.applyCoupon);
router.delete('/coupon', cartCtrl.removeCoupon);

export default router;

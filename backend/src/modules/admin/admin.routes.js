/**
 * QuickKart — Admin Routes
 * Mounted at: /api/v1/admin
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as adminCtrl from './admin.controller.js';
import {
  idParamSchema,
  updateStoreStatusSchema,
  updateStoreCommissionSchema,
  verifyPartnerSchema,
  updateUserStatusSchema,
  createCouponSchema,
  updateCouponSchema,
  listUsersQuerySchema,
  listStoresQuerySchema,
  listPartnersQuerySchema,
  listCouponsQuerySchema,
} from './admin.validator.js';

const router = Router();

// All admin routes strictly require authenticated ADMIN role
router.use(protect, authorize(USER_ROLES.ADMIN));

// ── Platform Analytics Overview ─────────────────────────────────────────────
router.get('/analytics/overview', adminCtrl.getPlatformOverview);

// ── Store Controls ──────────────────────────────────────────────────────────
router.get('/stores', validate(listStoresQuerySchema, 'query'), adminCtrl.listStores);
router.patch(
  '/stores/:id/status',
  validate(idParamSchema, 'params'),
  validate(updateStoreStatusSchema),
  adminCtrl.updateStoreStatus
);
router.patch(
  '/stores/:id/commission',
  validate(idParamSchema, 'params'),
  validate(updateStoreCommissionSchema),
  adminCtrl.updateStoreCommission
);

// ── Delivery Partner Verification ───────────────────────────────────────────
router.get(
  '/delivery-partners',
  validate(listPartnersQuerySchema, 'query'),
  adminCtrl.listDeliveryPartners
);
router.patch(
  '/delivery-partners/:id/verify',
  validate(idParamSchema, 'params'),
  validate(verifyPartnerSchema),
  adminCtrl.verifyDeliveryPartner
);

// ── User Management ─────────────────────────────────────────────────────────
router.get('/users', validate(listUsersQuerySchema, 'query'), adminCtrl.listUsers);
router.patch(
  '/users/:id/status',
  validate(idParamSchema, 'params'),
  validate(updateUserStatusSchema),
  adminCtrl.updateUserStatus
);

// ── Coupon Management ───────────────────────────────────────────────────────
router.post('/coupons', validate(createCouponSchema), adminCtrl.createCoupon);
router.get('/coupons', validate(listCouponsQuerySchema, 'query'), adminCtrl.listCoupons);
router.patch(
  '/coupons/:id',
  validate(idParamSchema, 'params'),
  validate(updateCouponSchema),
  adminCtrl.updateCoupon
);

export default router;


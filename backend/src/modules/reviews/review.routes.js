/**
 * QuickKart — Review Routes
 * Mounted at: /api/v1/reviews
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as reviewCtrl from './review.controller.js';
import {
  createReviewSchema,
  listReviewsQuerySchema,
  storeIdParamSchema,
  partnerIdParamSchema,
  orderIdParamSchema,
} from './review.validator.js';

const router = Router();

// ── Public Store Reviews ────────────────────────────────────────────────────
router.get(
  '/store/:storeId',
  validate(storeIdParamSchema, 'params'),
  validate(listReviewsQuerySchema, 'query'),
  reviewCtrl.getStoreReviews
);

// ── Protected Endpoints ─────────────────────────────────────────────────────
router.use(protect);

router.post(
  '/',
  authorize(USER_ROLES.CUSTOMER),
  validate(createReviewSchema),
  reviewCtrl.createReview
);

router.get(
  '/order/:orderId',
  validate(orderIdParamSchema, 'params'),
  reviewCtrl.getOrderReview
);

router.get(
  '/delivery-partner/:partnerId',
  authorize(USER_ROLES.DELIVERY_PARTNER, USER_ROLES.ADMIN),
  validate(partnerIdParamSchema, 'params'),
  validate(listReviewsQuerySchema, 'query'),
  reviewCtrl.getDeliveryPartnerReviews
);

export default router;

/**
 * QuickKart — Delivery Routes
 * Mounted at: /api/v1/deliveries
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as deliveryCtrl from './delivery.controller.js';
import {
  deliveryIdParamSchema,
  updateLocationSchema,
  verifyOtpSchema,
  listDeliveriesQuerySchema,
} from './delivery.validator.js';

const router = Router();

// All delivery endpoints require authentication
router.use(protect);

// ── Admin Endpoints (must be before /:id param routes) ───────────────────────
router.get(
  '/pending',
  authorize(USER_ROLES.ADMIN),
  validate(listDeliveriesQuerySchema, 'query'),
  deliveryCtrl.getPendingDeliveries
);

router.post(
  '/:id/assign',
  authorize(USER_ROLES.ADMIN),
  validate(deliveryIdParamSchema, 'params'),
  deliveryCtrl.triggerAssignment
);

// ── Delivery Partner Endpoints ───────────────────────────────────────────────
router.get(
  '/',
  authorize(USER_ROLES.DELIVERY_PARTNER),
  validate(listDeliveriesQuerySchema, 'query'),
  deliveryCtrl.getMyDeliveries
);

router.patch(
  '/location',
  authorize(USER_ROLES.DELIVERY_PARTNER),
  validate(updateLocationSchema),
  deliveryCtrl.updateLocation
);

router.get(
  '/:id',
  authorize(USER_ROLES.DELIVERY_PARTNER, USER_ROLES.ADMIN),
  validate(deliveryIdParamSchema, 'params'),
  deliveryCtrl.getDeliveryById
);

router.patch(
  '/:id/pickup',
  authorize(USER_ROLES.DELIVERY_PARTNER),
  validate(deliveryIdParamSchema, 'params'),
  deliveryCtrl.confirmPickup
);

router.patch(
  '/:id/deliver',
  authorize(USER_ROLES.DELIVERY_PARTNER),
  validate(deliveryIdParamSchema, 'params'),
  validate(verifyOtpSchema),
  deliveryCtrl.verifyAndDeliver
);

export default router;


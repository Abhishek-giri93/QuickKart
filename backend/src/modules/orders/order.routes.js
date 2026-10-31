/**
 * QuickKart — Order Routes
 * Mounted at: /api/v1/orders
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as orderCtrl from './order.controller.js';
import {
  createOrderSchema,
  cancelOrderSchema,
  sellerRejectOrderSchema,
  listOrdersQuerySchema,
  orderIdParamSchema,
} from './order.validator.js';

const router = Router();

// All order endpoints require authentication
router.use(protect);

// ── Seller Workflow Routes (Mounted before /:id parameter) ───────────────────
router.get(
  '/seller/store-orders',
  authorize(USER_ROLES.SELLER),
  validate(listOrdersQuerySchema, 'query'),
  orderCtrl.getSellerOrders
);

router.patch(
  '/:id/accept',
  authorize(USER_ROLES.SELLER),
  validate(orderIdParamSchema, 'params'),
  orderCtrl.acceptOrder
);

router.patch(
  '/:id/reject',
  authorize(USER_ROLES.SELLER),
  validate(orderIdParamSchema, 'params'),
  validate(sellerRejectOrderSchema),
  orderCtrl.rejectOrder
);

router.patch(
  '/:id/prepare',
  authorize(USER_ROLES.SELLER),
  validate(orderIdParamSchema, 'params'),
  orderCtrl.markPreparing
);

router.patch(
  '/:id/ready',
  authorize(USER_ROLES.SELLER),
  validate(orderIdParamSchema, 'params'),
  orderCtrl.markReady
);

// ── Customer Order Routes ───────────────────────────────────────────────────
router.post(
  '/',
  authorize(USER_ROLES.CUSTOMER),
  validate(createOrderSchema),
  orderCtrl.createOrder
);

router.get(
  '/',
  authorize(USER_ROLES.CUSTOMER),
  validate(listOrdersQuerySchema, 'query'),
  orderCtrl.getCustomerOrders
);

router.patch(
  '/:id/cancel',
  authorize(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN),
  validate(orderIdParamSchema, 'params'),
  validate(cancelOrderSchema),
  orderCtrl.cancelOrder
);

// ── Order Details (Authorized for involved parties) ──────────────────────────
router.get(
  '/:id',
  validate(orderIdParamSchema, 'params'),
  orderCtrl.getOrderById
);

export default router;

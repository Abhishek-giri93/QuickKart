/**
 * QuickKart — Payment Routes
 * Mounted at: /api/v1/payments
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as paymentCtrl from './payment.controller.js';
import {
  createRazorpayOrderSchema,
  verifyPaymentSchema,
  initiateRefundSchema,
  paymentIdParamSchema,
  listTransactionsQuerySchema,
} from './payment.validator.js';

const router = Router();

// ── Public Webhook Endpoint (No JWT authentication, signature checked in service) ──
router.post('/webhook', paymentCtrl.handleWebhook);

// ── All other endpoints require authentication ──────────────────────────────
router.use(protect);

// Customer endpoints
router.post(
  '/create-razorpay-order',
  authorize(USER_ROLES.CUSTOMER),
  validate(createRazorpayOrderSchema),
  paymentCtrl.createRazorpayOrder
);

router.post(
  '/verify',
  authorize(USER_ROLES.CUSTOMER),
  validate(verifyPaymentSchema),
  paymentCtrl.verifyPayment
);

router.get(
  '/transactions',
  authorize(USER_ROLES.CUSTOMER),
  validate(listTransactionsQuerySchema, 'query'),
  paymentCtrl.getCustomerTransactions
);

// Refund endpoint (Admin or Seller)
router.post(
  '/refund',
  authorize(USER_ROLES.ADMIN, USER_ROLES.SELLER),
  validate(initiateRefundSchema),
  paymentCtrl.initiateRefund
);

// Payment details by ID
router.get(
  '/:id',
  validate(paymentIdParamSchema, 'params'),
  paymentCtrl.getPaymentById
);

export default router;

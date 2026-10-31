/**
 * QuickKart — Payment Controller
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as paymentService from './payment.service.js';

/**
 * Create Razorpay Order
 * POST /api/v1/payments/create-razorpay-order
 */
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const result = await paymentService.createRazorpayOrder(req.user.id, req.body);
  sendSuccess(res, {
    message: 'Razorpay order created successfully',
    data: result,
  });
});

/**
 * Verify Razorpay payment signature
 * POST /api/v1/payments/verify
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.verifyPayment(req.user.id, req.body);
  sendSuccess(res, {
    message: 'Payment verified and captured successfully',
    data: payment,
  });
});

/**
 * Handle Razorpay Webhooks
 * POST /api/v1/payments/webhook
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const result = await paymentService.handleWebhook(req.body, signature);
  sendSuccess(res, {
    message: 'Webhook processed successfully',
    data: result,
  });
});

/**
 * Initiate Refund
 * POST /api/v1/payments/refund
 */
export const initiateRefund = asyncHandler(async (req, res) => {
  const refund = await paymentService.initiateRefund(req.user, req.body);
  sendSuccess(res, {
    message: 'Refund processed successfully',
    data: refund,
  });
});

/**
 * Get payment details by ID
 * GET /api/v1/payments/:id
 */
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.user, req.params.id);
  sendSuccess(res, {
    message: 'Payment details retrieved successfully',
    data: payment,
  });
});

/**
 * Get customer transactions history
 * GET /api/v1/payments/transactions
 */
export const getCustomerTransactions = asyncHandler(async (req, res) => {
  const result = await paymentService.getCustomerTransactions(req.user.id, req.query);
  sendSuccess(res, {
    message: 'Transactions retrieved successfully',
    data: result.transactions,
    meta: result.pagination,
  });
});

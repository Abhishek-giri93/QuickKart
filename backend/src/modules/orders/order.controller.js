/**
 * QuickKart — Order Controller
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/response.js';
import * as orderService from './order.service.js';

/**
 * Place a new order from current cart
 * POST /api/v1/orders
 */
export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  sendCreated(res, {
    message: 'Order placed successfully',
    data: order,
  });
});

/**
 * Get customer's order history
 * GET /api/v1/orders
 */
export const getCustomerOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getCustomerOrders(req.user.id, req.query);
  sendSuccess(res, {
    message: 'Orders retrieved successfully',
    data: result.orders,
    meta: result.pagination,
  });
});

/**
 * Get order details by ID
 * GET /api/v1/orders/:id
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.user, req.params.id);
  sendSuccess(res, {
    message: 'Order details retrieved successfully',
    data: order,
  });
});

/**
 * Customer cancel order
 * PATCH /api/v1/orders/:id/cancel
 */
export const cancelOrder = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;
  const order = await orderService.cancelOrder(
    req.user.id,
    req.params.id,
    cancellationReason
  );
  sendSuccess(res, {
    message: 'Order cancelled successfully',
    data: order,
  });
});

/**
 * Seller view store orders
 * GET /api/v1/orders/seller/store-orders
 */
export const getSellerOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getSellerOrders(req.user.id, req.query);
  sendSuccess(res, {
    message: 'Store orders retrieved successfully',
    data: result.orders,
    meta: result.pagination,
  });
});

/**
 * Seller accept order
 * PATCH /api/v1/orders/:id/accept
 */
export const acceptOrder = asyncHandler(async (req, res) => {
  const order = await orderService.sellerAcceptOrder(req.user.id, req.params.id);
  sendSuccess(res, {
    message: 'Order accepted successfully',
    data: order,
  });
});

/**
 * Seller reject order
 * PATCH /api/v1/orders/:id/reject
 */
export const rejectOrder = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;
  const order = await orderService.sellerRejectOrder(
    req.user.id,
    req.params.id,
    cancellationReason
  );
  sendSuccess(res, {
    message: 'Order rejected successfully',
    data: order,
  });
});

/**
 * Seller mark order preparing
 * PATCH /api/v1/orders/:id/prepare
 */
export const markPreparing = asyncHandler(async (req, res) => {
  const order = await orderService.sellerMarkPreparing(req.user.id, req.params.id);
  sendSuccess(res, {
    message: 'Order status updated to preparing',
    data: order,
  });
});

/**
 * Seller mark order ready
 * PATCH /api/v1/orders/:id/ready
 */
export const markReady = asyncHandler(async (req, res) => {
  const order = await orderService.sellerMarkReady(req.user.id, req.params.id);
  sendSuccess(res, {
    message: 'Order is ready and queued for delivery assignment',
    data: order,
  });
});

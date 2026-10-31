/**
 * QuickKart — Delivery Controller
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as deliveryService from './delivery.service.js';

/**
 * Get deliveries for the authenticated delivery partner
 * GET /api/v1/deliveries
 */
export const getMyDeliveries = asyncHandler(async (req, res) => {
  const result = await deliveryService.getPartnerDeliveries(req.user.id, req.query);
  sendSuccess(res, {
    message: 'Deliveries retrieved successfully',
    data: result.deliveries,
    meta: result.pagination,
  });
});

/**
 * Get delivery details by ID
 * GET /api/v1/deliveries/:id
 */
export const getDeliveryById = asyncHandler(async (req, res) => {
  const delivery = await deliveryService.getDeliveryById(req.user.id, req.params.id);
  sendSuccess(res, {
    message: 'Delivery details retrieved successfully',
    data: delivery,
  });
});

/**
 * Confirm pickup from store
 * PATCH /api/v1/deliveries/:id/pickup
 */
export const confirmPickup = asyncHandler(async (req, res) => {
  const delivery = await deliveryService.confirmPickup(req.user.id, req.params.id);
  sendSuccess(res, {
    message: 'Pickup confirmed. Order is now out for delivery.',
    data: delivery,
  });
});

/**
 * Verify OTP and complete delivery
 * PATCH /api/v1/deliveries/:id/deliver
 */
export const verifyAndDeliver = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const delivery = await deliveryService.verifyOtpAndDeliver(req.user.id, req.params.id, otp);
  sendSuccess(res, {
    message: 'Delivery completed successfully! OTP verified.',
    data: delivery,
  });
});

/**
 * Update live GPS location
 * PATCH /api/v1/deliveries/location
 */
export const updateLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  const location = await deliveryService.updatePartnerLocation(req.user.id, latitude, longitude);
  sendSuccess(res, {
    message: 'Location updated successfully',
    data: location,
  });
});

/**
 * Admin: Get pending (unassigned) deliveries
 * GET /api/v1/deliveries/pending
 */
export const getPendingDeliveries = asyncHandler(async (req, res) => {
  const result = await deliveryService.getPendingDeliveries(req.query);
  sendSuccess(res, {
    message: 'Pending deliveries retrieved',
    data: result.deliveries,
    meta: result.pagination,
  });
});

/**
 * Admin: Manually trigger auto-assignment for a delivery
 * POST /api/v1/deliveries/:id/assign
 */
export const triggerAssignment = asyncHandler(async (req, res) => {
  const result = await deliveryService.triggerAssignment(req.params.id);
  sendSuccess(res, {
    message: result.assigned
      ? 'Delivery partner assigned successfully'
      : result.message,
    data: result.assigned ? result.delivery : null,
  });
});


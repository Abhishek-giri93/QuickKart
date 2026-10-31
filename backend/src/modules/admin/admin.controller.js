/**
 * QuickKart — Admin Controller
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/response.js';
import * as adminService from './admin.service.js';

/**
 * Platform analytics and overview metrics
 * GET /api/v1/admin/analytics/overview
 */
export const getPlatformOverview = asyncHandler(async (req, res) => {
  const metrics = await adminService.getPlatformOverview();
  sendSuccess(res, {
    message: 'Platform overview metrics retrieved successfully',
    data: metrics,
  });
});

/**
 * List stores
 * GET /api/v1/admin/stores
 */
export const listStores = asyncHandler(async (req, res) => {
  const result = await adminService.listStores(req.query);
  sendSuccess(res, {
    message: 'Stores retrieved successfully',
    data: result.stores,
    meta: result.pagination,
  });
});

/**
 * Update store verification/status
 * PATCH /api/v1/admin/stores/:id/status
 */
export const updateStoreStatus = asyncHandler(async (req, res) => {
  const store = await adminService.updateStoreStatus(req.params.id, req.body.status);
  sendSuccess(res, {
    message: `Store status updated to ${store.status}`,
    data: store,
  });
});

/**
 * Update store commission rate
 * PATCH /api/v1/admin/stores/:id/commission
 */
export const updateStoreCommission = asyncHandler(async (req, res) => {
  const store = await adminService.updateStoreCommission(req.params.id, req.body.commissionRate);
  sendSuccess(res, {
    message: `Store commission rate updated to ${store.commissionRate}%`,
    data: store,
  });
});

/**
 * List delivery partners
 * GET /api/v1/admin/delivery-partners
 */
export const listDeliveryPartners = asyncHandler(async (req, res) => {
  const result = await adminService.listDeliveryPartners(req.query);
  sendSuccess(res, {
    message: 'Delivery partners retrieved successfully',
    data: result.partners,
    meta: result.pagination,
  });
});

/**
 * Verify delivery partner
 * PATCH /api/v1/admin/delivery-partners/:id/verify
 */
export const verifyDeliveryPartner = asyncHandler(async (req, res) => {
  const partner = await adminService.verifyDeliveryPartner(req.params.id, req.body.isVerified);
  sendSuccess(res, {
    message: partner.isVerified
      ? 'Delivery partner verified successfully'
      : 'Delivery partner verification revoked',
    data: partner,
  });
});

/**
 * List platform users
 * GET /api/v1/admin/users
 */
export const listUsers = asyncHandler(async (req, res) => {
  const result = await adminService.listUsers(req.query);
  sendSuccess(res, {
    message: 'Users retrieved successfully',
    data: result.users,
    meta: result.pagination,
  });
});

/**
 * Ban / unban user
 * PATCH /api/v1/admin/users/:id/status
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserStatus(req.params.id, req.body.isActive);
  sendSuccess(res, {
    message: user.isActive ? 'User activated successfully' : 'User deactivated / banned',
    data: user,
  });
});

/**
 * Create coupon
 * POST /api/v1/admin/coupons
 */
export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await adminService.createCoupon(req.body);
  sendCreated(res, {
    message: 'Promotional coupon created successfully',
    data: coupon,
  });
});

/**
 * List coupons
 * GET /api/v1/admin/coupons
 */
export const listCoupons = asyncHandler(async (req, res) => {
  const result = await adminService.listCoupons(req.query);
  sendSuccess(res, {
    message: 'Coupons retrieved successfully',
    data: result.coupons,
    meta: result.pagination,
  });
});

/**
 * Update coupon
 * PATCH /api/v1/admin/coupons/:id
 */
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await adminService.updateCoupon(req.params.id, req.body);
  sendSuccess(res, {
    message: 'Coupon updated successfully',
    data: coupon,
  });
});


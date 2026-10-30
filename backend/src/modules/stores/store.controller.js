/**
 * Store Route Handlers (Controller)
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/response.js';
import * as storeService from './store.service.js';

// ── Public Store Discovery ───────────────────────────────────────────────────

export const discover = asyncHandler(async (req, res) => {
  const result = await storeService.discoverStores(req.query);
  sendSuccess(res, {
    message: 'Stores retrieved successfully',
    data: result.stores,
    meta: result.meta,
  });
});

export const getPublicById = asyncHandler(async (req, res) => {
  const store = await storeService.getPublicStoreById(req.params.id);
  sendSuccess(res, {
    message: 'Store details retrieved',
    data: store,
  });
});

// ── Seller Store Operations ──────────────────────────────────────────────────

export const create = asyncHandler(async (req, res) => {
  const store = await storeService.createStore(req.user.id, req.body);
  sendCreated(res, {
    message: 'Store registered successfully and is pending admin approval',
    data: store,
  });
});

export const getMyStores = asyncHandler(async (req, res) => {
  const stores = await storeService.getSellerStores(req.user.id);
  sendSuccess(res, {
    message: 'Seller stores retrieved successfully',
    data: stores,
  });
});

export const getMyStoreById = asyncHandler(async (req, res) => {
  const store = await storeService.getSellerStoreById(req.user.id, req.params.id);
  sendSuccess(res, {
    message: 'Store details retrieved',
    data: store,
  });
});

export const updateMyStore = asyncHandler(async (req, res) => {
  const updated = await storeService.updateSellerStore(req.user.id, req.params.id, req.body);
  sendSuccess(res, {
    message: 'Store details updated successfully',
    data: updated,
  });
});

export const toggleOpen = asyncHandler(async (req, res) => {
  const updated = await storeService.toggleStoreOpen(req.user.id, req.params.id, req.body.isOpen);
  sendSuccess(res, {
    message: `Store is now ${updated.isOpen ? 'Open for orders' : 'Closed'}`,
    data: { isOpen: updated.isOpen },
  });
});

// ── Admin Store Operations ───────────────────────────────────────────────────

export const updateStatus = asyncHandler(async (req, res) => {
  const updated = await storeService.updateStoreStatus(req.params.id, req.body.status);
  sendSuccess(res, {
    message: `Store status updated to ${updated.status}`,
    data: updated,
  });
});

export const updateCommission = asyncHandler(async (req, res) => {
  const updated = await storeService.updateStoreCommission(req.params.id, req.body.commissionRate);
  sendSuccess(res, {
    message: 'Store commission rate updated successfully',
    data: updated,
  });
});

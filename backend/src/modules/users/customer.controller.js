/**
 * Customer & Address Controllers
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/response.js';
import * as userService from './users.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getCustomerProfile(req.user.id);
  sendSuccess(res, {
    message: 'Customer profile retrieved',
    data: profile,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updated = await userService.updateCustomerProfile(req.user.id, req.body);
  sendSuccess(res, {
    message: 'Customer profile updated successfully',
    data: updated,
  });
});

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await userService.getAddresses(req.user.id);
  sendSuccess(res, {
    message: 'Addresses retrieved successfully',
    data: addresses,
  });
});

export const getAddressById = asyncHandler(async (req, res) => {
  const address = await userService.getAddressById(req.user.id, req.params.id);
  sendSuccess(res, {
    message: 'Address retrieved successfully',
    data: address,
  });
});

export const createAddress = asyncHandler(async (req, res) => {
  const address = await userService.createAddress(req.user.id, req.body);
  sendCreated(res, {
    message: 'Address added successfully',
    data: address,
  });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const updated = await userService.updateAddress(req.user.id, req.params.id, req.body);
  sendSuccess(res, {
    message: 'Address updated successfully',
    data: updated,
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  await userService.deleteAddress(req.user.id, req.params.id);
  sendSuccess(res, {
    message: 'Address deleted successfully',
  });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const updated = await userService.setDefaultAddress(req.user.id, req.params.id);
  sendSuccess(res, {
    message: 'Default address updated successfully',
    data: updated,
  });
});

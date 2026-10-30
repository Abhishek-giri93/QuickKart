/**
 * Seller Profile Controller
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as userService from './users.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getSellerProfile(req.user.id);
  sendSuccess(res, {
    message: 'Seller profile retrieved',
    data: profile,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updated = await userService.updateSellerProfile(req.user.id, req.body);
  sendSuccess(res, {
    message: 'Seller profile updated successfully',
    data: updated,
  });
});

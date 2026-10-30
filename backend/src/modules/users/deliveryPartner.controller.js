/**
 * Delivery Partner Profile Controller
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as userService from './users.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getDeliveryPartnerProfile(req.user.id);
  sendSuccess(res, {
    message: 'Delivery partner profile retrieved',
    data: profile,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updated = await userService.updateDeliveryPartnerProfile(req.user.id, req.body);
  sendSuccess(res, {
    message: 'Profile updated successfully',
    data: updated,
  });
});

export const toggleStatus = asyncHandler(async (req, res) => {
  const updated = await userService.toggleOnlineStatus(req.user.id, req.body.isOnline);
  sendSuccess(res, {
    message: `Delivery partner is now ${req.body.isOnline ? 'Online' : 'Offline'}`,
    data: { isOnline: updated.isOnline },
  });
});

export const updateLocation = asyncHandler(async (req, res) => {
  const updated = await userService.updateLocation(req.user.id, req.body);
  sendSuccess(res, {
    message: 'Location updated successfully',
    data: {
      latitude: updated.currentLat,
      longitude: updated.currentLng,
    },
  });
});

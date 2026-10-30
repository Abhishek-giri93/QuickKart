/**
 * Authentication Route Handlers (Controller)
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/response.js';
import { HTTP_STATUS } from '../../utils/constants.js';
import { config } from '../../config/env.config.js';
import { AppError } from '../../utils/AppError.js';
import * as authService from './auth.service.js';

const REFRESH_COOKIE_NAME = 'refreshToken';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: config.server.nodeEnv === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

/**
 * Helper to set refresh token in HttpOnly cookie
 */
const setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE_NAME, token, getCookieOptions());
};

/**
 * POST /api/v1/auth/register/customer
 */
export const registerCustomer = asyncHandler(async (req, res) => {
  const result = await authService.registerCustomer(req.body);
  setRefreshCookie(res, result.refreshToken);

  sendCreated(res, {
    message: 'Customer registered successfully',
    data: result,
  });
});

/**
 * POST /api/v1/auth/register/seller
 */
export const registerSeller = asyncHandler(async (req, res) => {
  const result = await authService.registerSeller(req.body);
  setRefreshCookie(res, result.refreshToken);

  sendCreated(res, {
    message: 'Seller registered successfully',
    data: result,
  });
});

/**
 * POST /api/v1/auth/register/delivery-partner
 */
export const registerDeliveryPartner = asyncHandler(async (req, res) => {
  const result = await authService.registerDeliveryPartner(req.body);
  setRefreshCookie(res, result.refreshToken);

  sendCreated(res, {
    message: 'Delivery partner registered successfully',
    data: result,
  });
});

/**
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  setRefreshCookie(res, result.refreshToken);

  sendSuccess(res, {
    message: 'Login successful',
    data: result,
  });
});

/**
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  // Support both cookie-based (web) and body-based (mobile) refresh tokens
  const token = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

  if (!token) {
    throw new AppError('Refresh token required', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await authService.refreshSession(token);
  setRefreshCookie(res, result.refreshToken);

  sendSuccess(res, {
    message: 'Token refreshed successfully',
    data: result,
  });
});

/**
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  if (req.user?.id) {
    await authService.logout(req.user.id);
  }

  res.clearCookie(REFRESH_COOKIE_NAME, getCookieOptions());

  sendSuccess(res, {
    message: 'Logged out successfully',
  });
});

/**
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    message: 'Current profile retrieved successfully',
    data: { user: req.user },
  });
});

/**
 * Authentication Express Routes
 */

import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { authLimiter } from '../../middlewares/rateLimiter.js';
import { protect } from '../../middlewares/auth.middleware.js';
import * as authController from './auth.controller.js';
import {
  registerCustomerSchema,
  registerSellerSchema,
  registerDeliveryPartnerSchema,
  loginSchema,
  refreshTokenSchema,
} from './auth.validator.js';

const router = Router();

// Registration routes (rate-limited)
router.post(
  '/register/customer',
  authLimiter,
  validate(registerCustomerSchema),
  authController.registerCustomer
);

router.post(
  '/register/seller',
  authLimiter,
  validate(registerSellerSchema),
  authController.registerSeller
);

router.post(
  '/register/delivery-partner',
  authLimiter,
  validate(registerDeliveryPartnerSchema),
  authController.registerDeliveryPartner
);

// Login route (rate-limited)
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Session management
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', protect, authController.logout);

// Current user profile
router.get('/me', protect, authController.getMe);

export default router;

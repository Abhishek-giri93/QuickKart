/**
 * Delivery Partner Routes
 * Mounted at: /api/v1/delivery-partners
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as partnerCtrl from './deliveryPartner.controller.js';
import {
  updateDeliveryPartnerProfileSchema,
  toggleOnlineStatusSchema,
  updateLocationSchema,
} from './users.validator.js';

const router = Router();

// Delivery partner authentication required
router.use(protect, authorize(USER_ROLES.DELIVERY_PARTNER, USER_ROLES.ADMIN));

router.get('/profile', partnerCtrl.getProfile);
router.patch('/profile', validate(updateDeliveryPartnerProfileSchema), partnerCtrl.updateProfile);
router.patch('/status', validate(toggleOnlineStatusSchema), partnerCtrl.toggleStatus);
router.patch('/location', validate(updateLocationSchema), partnerCtrl.updateLocation);

export default router;

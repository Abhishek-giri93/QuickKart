/**
 * Seller Profile Routes
 * Mounted at: /api/v1/sellers
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as sellerCtrl from './seller.controller.js';
import { updateSellerProfileSchema } from './users.validator.js';

const router = Router();

// Seller authentication required
router.use(protect, authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN));

router.get('/profile', sellerCtrl.getProfile);
router.patch('/profile', validate(updateSellerProfileSchema), sellerCtrl.updateProfile);

export default router;

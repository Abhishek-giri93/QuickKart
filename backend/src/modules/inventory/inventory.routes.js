/**
 * Inventory Express Routes
 * Mounted at: /api/v1/inventory
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { USER_ROLES } from '../../utils/constants.js';
import { getLowStock } from '../products/product.controller.js';

const router = Router();

// Protected for sellers and admins
router.use(protect, authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN));

router.get('/low-stock', getLowStock);

export default router;

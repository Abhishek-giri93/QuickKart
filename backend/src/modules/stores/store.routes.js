/**
 * Store Express Routes
 * Mounted at: /api/v1/stores
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as storeCtrl from './store.controller.js';
import {
  createStoreSchema,
  updateStoreSchema,
  toggleStoreOpenSchema,
  updateStoreStatusSchema,
  updateStoreCommissionSchema,
  discoverStoresQuerySchema,
  storeIdParamSchema,
} from './store.validator.js';

const router = Router();

// ── Public Store Discovery ───────────────────────────────────────────────────
router.get('/', validate(discoverStoresQuerySchema, 'query'), storeCtrl.discover);

// ── Seller Store Management (Ownership protected) ────────────────────────────
// Specific routes placed before `/:id` to prevent routing conflicts
router.get('/my-stores', protect, authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN), storeCtrl.getMyStores);
router.post(
  '/',
  protect,
  authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN),
  validate(createStoreSchema),
  storeCtrl.create
);

router.get(
  '/my-stores/:id',
  protect,
  authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN),
  validate(storeIdParamSchema, 'params'),
  storeCtrl.getMyStoreById
);

router.patch(
  '/my-stores/:id',
  protect,
  authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN),
  validate(storeIdParamSchema, 'params'),
  validate(updateStoreSchema),
  storeCtrl.updateMyStore
);

router.patch(
  '/my-stores/:id/toggle-open',
  protect,
  authorize(USER_ROLES.SELLER, USER_ROLES.ADMIN),
  validate(storeIdParamSchema, 'params'),
  validate(toggleStoreOpenSchema),
  storeCtrl.toggleOpen
);

// ── Admin Store Management ───────────────────────────────────────────────────
router.patch(
  '/:id/status',
  protect,
  authorize(USER_ROLES.ADMIN),
  validate(storeIdParamSchema, 'params'),
  validate(updateStoreStatusSchema),
  storeCtrl.updateStatus
);

router.patch(
  '/:id/commission',
  protect,
  authorize(USER_ROLES.ADMIN),
  validate(storeIdParamSchema, 'params'),
  validate(updateStoreCommissionSchema),
  storeCtrl.updateCommission
);

// ── Public Store Details by ID ───────────────────────────────────────────────
router.get('/:id', validate(storeIdParamSchema, 'params'), storeCtrl.getPublicById);

export default router;

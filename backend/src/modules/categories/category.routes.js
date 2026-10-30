/**
 * Category Express Routes
 * Mounted at: /api/v1/categories
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as categoryCtrl from './category.controller.js';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from './category.validator.js';

const router = Router();

// ── Public Routes ─────────────────────────────────────────────────────────────
router.get('/', categoryCtrl.getAll);
router.get('/:id', validate(categoryIdParamSchema, 'params'), categoryCtrl.getByIdOrSlug);

// ── Admin-Only Routes ─────────────────────────────────────────────────────────
router.post(
  '/',
  protect,
  authorize(USER_ROLES.ADMIN),
  validate(createCategorySchema),
  categoryCtrl.create
);

router.patch(
  '/:id',
  protect,
  authorize(USER_ROLES.ADMIN),
  validate(categoryIdParamSchema, 'params'),
  validate(updateCategorySchema),
  categoryCtrl.update
);

router.delete(
  '/:id',
  protect,
  authorize(USER_ROLES.ADMIN),
  validate(categoryIdParamSchema, 'params'),
  categoryCtrl.remove
);

export default router;

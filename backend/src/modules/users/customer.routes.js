/**
 * Customer & Address Routes
 * Mounted at: /api/v1/customers
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as customerCtrl from './customer.controller.js';
import {
  updateCustomerProfileSchema,
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
} from './users.validator.js';

const router = Router();

// All routes require authentication as a CUSTOMER
router.use(protect, authorize(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN));

// Profile
router.get('/profile', customerCtrl.getProfile);
router.patch('/profile', validate(updateCustomerProfileSchema), customerCtrl.updateProfile);

// Addresses
router.get('/addresses', customerCtrl.getAddresses);
router.post('/addresses', validate(createAddressSchema), customerCtrl.createAddress);

router.get('/addresses/:id', validate(addressIdParamSchema, 'params'), customerCtrl.getAddressById);
router.patch(
  '/addresses/:id',
  validate(addressIdParamSchema, 'params'),
  validate(updateAddressSchema),
  customerCtrl.updateAddress
);
router.delete('/addresses/:id', validate(addressIdParamSchema, 'params'), customerCtrl.deleteAddress);
router.patch(
  '/addresses/:id/default',
  validate(addressIdParamSchema, 'params'),
  customerCtrl.setDefaultAddress
);

export default router;

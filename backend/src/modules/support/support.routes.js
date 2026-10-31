/**
 * QuickKart — Support Routes
 * Mounted at: /api/v1/support
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as supportCtrl from './support.controller.js';
import {
  createTicketSchema,
  updateTicketStatusSchema,
  ticketIdParamSchema,
  listTicketsQuerySchema,
} from './support.validator.js';

const router = Router();

// All support ticket routes require authentication
router.use(protect);

// ── Admin: View all platform tickets ────────────────────────────────────────
router.get(
  '/tickets/admin/all',
  authorize(USER_ROLES.ADMIN),
  validate(listTicketsQuerySchema, 'query'),
  supportCtrl.getAllTicketsAdmin
);

// ── User Ticket Operations ──────────────────────────────────────────────────
router.post(
  '/tickets',
  validate(createTicketSchema),
  supportCtrl.createTicket
);

router.get(
  '/tickets',
  validate(listTicketsQuerySchema, 'query'),
  supportCtrl.getUserTickets
);

router.get(
  '/tickets/:id',
  validate(ticketIdParamSchema, 'params'),
  supportCtrl.getTicketById
);

// ── Admin: Resolve/Update ticket ────────────────────────────────────────────
router.patch(
  '/tickets/:id/status',
  authorize(USER_ROLES.ADMIN),
  validate(ticketIdParamSchema, 'params'),
  validate(updateTicketStatusSchema),
  supportCtrl.updateTicketStatus
);

export default router;

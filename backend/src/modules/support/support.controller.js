/**
 * QuickKart — Support Controller
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/response.js';
import * as supportService from './support.service.js';

/**
 * Create a new support ticket
 * POST /api/v1/support/tickets
 */
export const createTicket = asyncHandler(async (req, res) => {
  const ticket = await supportService.createTicket(req.user.id, req.body);
  sendCreated(res, {
    message: 'Support ticket submitted successfully',
    data: ticket,
  });
});

/**
 * Get current user's tickets
 * GET /api/v1/support/tickets
 */
export const getUserTickets = asyncHandler(async (req, res) => {
  const result = await supportService.getUserTickets(req.user.id, req.query);
  sendSuccess(res, {
    message: 'Tickets retrieved successfully',
    data: result.tickets,
    meta: result.pagination,
  });
});

/**
 * Get all tickets across platform (Admin)
 * GET /api/v1/support/tickets/admin/all
 */
export const getAllTicketsAdmin = asyncHandler(async (req, res) => {
  const result = await supportService.getAllTicketsAdmin(req.query);
  sendSuccess(res, {
    message: 'All platform tickets retrieved successfully',
    data: result.tickets,
    meta: result.pagination,
  });
});

/**
 * Get ticket details by ID
 * GET /api/v1/support/tickets/:id
 */
export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await supportService.getTicketById(req.user, req.params.id);
  sendSuccess(res, {
    message: 'Ticket details retrieved successfully',
    data: ticket,
  });
});

/**
 * Update ticket status and resolution (Admin)
 * PATCH /api/v1/support/tickets/:id/status
 */
export const updateTicketStatus = asyncHandler(async (req, res) => {
  const ticket = await supportService.updateTicketStatus(req.user, req.params.id, req.body);
  sendSuccess(res, {
    message: 'Ticket status updated successfully',
    data: ticket,
  });
});

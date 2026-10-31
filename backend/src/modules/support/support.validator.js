/**
 * QuickKart — Support Validation Schemas (Zod)
 */

import { z } from 'zod';
import { TICKET_STATUS } from '../../utils/constants.js';

export const createTicketSchema = z.object({
  orderId: z.string().uuid('Invalid order ID format').optional().nullable(),
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(150, 'Subject cannot exceed 150 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
});

export const updateTicketStatusSchema = z.object({
  status: z.nativeEnum(TICKET_STATUS, {
    errorMap: () => ({ message: 'Invalid ticket status' }),
  }),
  resolution: z
    .string()
    .trim()
    .max(1000, 'Resolution cannot exceed 1000 characters')
    .optional()
    .nullable(),
});

export const ticketIdParamSchema = z.object({
  id: z.string().uuid('Invalid ticket ID format'),
});

export const listTicketsQuerySchema = z.object({
  status: z.nativeEnum(TICKET_STATUS).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

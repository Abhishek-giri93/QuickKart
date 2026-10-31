/**
 * QuickKart — Support Service
 *
 * Implements customer/seller support ticket creation, tracking & resolution.
 */

import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { TICKET_STATUS, USER_ROLES } from '../../utils/constants.js';

/**
 * Create a new support ticket
 */
export const createTicket = async (userId, { orderId, subject, description }) => {
  if (orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new AppError('Associated order not found', 404);
    }
  }

  const ticket = await prisma.supportTicket.create({
    data: {
      userId,
      orderId: orderId || null,
      subject,
      description,
      status: TICKET_STATUS.OPEN,
    },
  });

  return ticket;
};

/**
 * List tickets created by the authenticated user
 */
export const getUserTickets = async (userId, { status, page = 1, limit = 20 }) => {
  const where = {
    userId,
    ...(status && { status }),
  };

  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return {
    tickets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * List all tickets across platform (Admin only)
 */
export const getAllTicketsAdmin = async ({ status, page = 1, limit = 20 }) => {
  const where = {
    ...(status && { status }),
  };

  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
          },
        },
      },
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return {
    tickets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get ticket details by ID (Owner or Admin)
 */
export const getTicketById = async (user, ticketId) => {
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
        },
      },
    },
  });

  if (!ticket) {
    throw new AppError('Support ticket not found', 404);
  }

  if (user.role !== USER_ROLES.ADMIN && ticket.userId !== user.id) {
    throw new AppError('Access forbidden: you do not own this ticket', 403);
  }

  return ticket;
};

/**
 * Update ticket status and resolution (Admin)
 */
export const updateTicketStatus = async (user, ticketId, { status, resolution }) => {
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new AppError('Support ticket not found', 404);
  }

  const isResolvedOrClosed = status === TICKET_STATUS.RESOLVED || status === TICKET_STATUS.CLOSED;

  const updatedTicket = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: {
      status,
      resolution: resolution || ticket.resolution,
      resolvedAt: isResolvedOrClosed ? new Date() : ticket.resolvedAt,
    },
  });

  return updatedTicket;
};

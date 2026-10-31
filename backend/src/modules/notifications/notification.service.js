/**
 * QuickKart — Notification Service
 *
 * Implements notification persistence and real-time Socket.IO dispatch.
 */

import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { emitToUser } from '../../socket/socket.js';

/**
 * Fetch paginated notifications for an authenticated user
 */
export const getUserNotifications = async (userId, { isRead, type, page = 1, limit = 20 }) => {
  const where = {
    userId,
    ...(isRead !== undefined && { isRead }),
    ...(type && { type }),
  };

  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({
      where: { userId, isRead: false },
    }),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Mark a single notification as read
 */
export const markAsRead = async (userId, notificationId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (notification.userId !== userId) {
    throw new AppError('Access forbidden: this notification belongs to another user', 403);
  }

  if (notification.isRead) {
    return notification;
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};

/**
 * Mark all notifications as read for current user
 */
export const markAllAsRead = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return { updatedCount: result.count };
};

/**
 * Get count of unread notifications for a user
 */
export const getUnreadCount = async (userId) => {
  const unreadCount = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  return { unreadCount };
};

/**
 * Create and dispatch a notification (Database + Realtime Socket)
 */
export const sendNotification = async ({ userId, type, title, body, data = null }) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      data: data || {},
    },
  });

  // Real-time dispatch via Socket.IO
  emitToUser(userId, 'notification:received', notification);

  return notification;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (userId, notificationId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (notification.userId !== userId) {
    throw new AppError('Access forbidden', 403);
  }

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  return { message: 'Notification deleted successfully' };
};

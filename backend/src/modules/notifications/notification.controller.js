/**
 * QuickKart — Notification Controller
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/response.js';
import * as notificationService from './notification.service.js';

/**
 * Get user notifications
 * GET /api/v1/notifications
 */
export const getUserNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getUserNotifications(req.user.id, req.query);
  sendSuccess(res, {
    message: 'Notifications retrieved successfully',
    data: {
      notifications: result.notifications,
      unreadCount: result.unreadCount,
    },
    meta: result.pagination,
  });
});

/**
 * Mark notification as read
 * PATCH /api/v1/notifications/:id/read
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.user.id, req.params.id);
  sendSuccess(res, {
    message: 'Notification marked as read',
    data: notification,
  });
});

/**
 * Mark all notifications as read
 * PATCH /api/v1/notifications/read-all
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  sendSuccess(res, {
    message: 'All notifications marked as read',
    data: result,
  });
});

/**
 * Get unread notification count
 * GET /api/v1/notifications/unread-count
 */
export const getUnreadCount = asyncHandler(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user.id);
  sendSuccess(res, {
    message: 'Unread count retrieved successfully',
    data: result,
  });
});

/**
 * Admin: Send notification
 * POST /api/v1/notifications/send
 */
export const sendNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.sendNotification(req.body);
  sendCreated(res, {
    message: 'Notification sent successfully',
    data: notification,
  });
});

/**
 * Delete notification
 * DELETE /api/v1/notifications/:id
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteNotification(req.user.id, req.params.id);
  sendSuccess(res, {
    message: result.message,
    data: null,
  });
});

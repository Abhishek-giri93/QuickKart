/**
 * QuickKart — Notification Routes
 * Mounted at: /api/v1/notifications
 */

import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.js';
import { USER_ROLES } from '../../utils/constants.js';
import * as notificationCtrl from './notification.controller.js';
import {
  listNotificationsQuerySchema,
  notificationIdParamSchema,
  sendNotificationSchema,
} from './notification.validator.js';

const router = Router();

// All notification routes require authentication
router.use(protect);

router.get(
  '/',
  validate(listNotificationsQuerySchema, 'query'),
  notificationCtrl.getUserNotifications
);

router.get('/unread-count', notificationCtrl.getUnreadCount);

router.patch('/read-all', notificationCtrl.markAllAsRead);

router.patch(
  '/:id/read',
  validate(notificationIdParamSchema, 'params'),
  notificationCtrl.markAsRead
);

router.delete(
  '/:id',
  validate(notificationIdParamSchema, 'params'),
  notificationCtrl.deleteNotification
);

// Admin-only notification dispatch
router.post(
  '/send',
  authorize(USER_ROLES.ADMIN),
  validate(sendNotificationSchema),
  notificationCtrl.sendNotification
);

export default router;

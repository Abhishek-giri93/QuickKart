/**
 * QuickKart — Notification Validation Schemas (Zod)
 */

import { z } from 'zod';
import { NOTIFICATION_TYPE } from '../../utils/constants.js';

export const listNotificationsQuerySchema = z.object({
  isRead: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  type: z.nativeEnum(NOTIFICATION_TYPE).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const notificationIdParamSchema = z.object({
  id: z.string().uuid('Invalid notification ID format'),
});

export const sendNotificationSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  type: z.nativeEnum(NOTIFICATION_TYPE, {
    errorMap: () => ({ message: 'Invalid notification type' }),
  }),
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(150, 'Title cannot exceed 150 characters'),
  body: z
    .string({ required_error: 'Body is required' })
    .trim()
    .min(1, 'Body cannot be empty')
    .max(500, 'Body cannot exceed 500 characters'),
  data: z.record(z.any()).optional().nullable(),
});

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

const mocks = vi.hoisted(() => {
  const USER_ID = '11111111-1111-4111-8111-111111111111';
  const OTHER_USER_ID = '22222222-2222-4222-8222-222222222222';
  const ADMIN_USER_ID = '33333333-3333-4333-8333-333333333333';
  const NOTIF_ID_1 = '44444444-4444-4444-8444-444444444444';
  const NOTIF_ID_2 = '55555555-5555-4555-8555-555555555555';

  const mockNotif1 = {
    id: NOTIF_ID_1,
    userId: USER_ID,
    type: 'ORDER_UPDATE',
    title: 'Order Confirmed',
    body: 'Your order #QK-2026-00001 has been confirmed by the store.',
    data: { orderId: 'ord-123' },
    isRead: false,
    readAt: null,
    createdAt: new Date(),
  };

  const mockNotif2 = {
    id: NOTIF_ID_2,
    userId: OTHER_USER_ID,
    type: 'DELIVERY_UPDATE',
    title: 'Out for delivery',
    body: 'Delivery partner is on the way.',
    data: {},
    isRead: false,
    readAt: null,
    createdAt: new Date(),
  };

  return {
    USER_ID,
    OTHER_USER_ID,
    ADMIN_USER_ID,
    NOTIF_ID_1,
    NOTIF_ID_2,
    mockNotif1,
    mockNotif2,
  };
});

vi.mock('../src/config/prisma.js', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.USER_ID) {
            return { id: mocks.USER_ID, role: 'CUSTOMER', isActive: true };
          }
          if (where.id === mocks.OTHER_USER_ID) {
            return { id: mocks.OTHER_USER_ID, role: 'CUSTOMER', isActive: true };
          }
          if (where.id === mocks.ADMIN_USER_ID) {
            return { id: mocks.ADMIN_USER_ID, role: 'ADMIN', isActive: true };
          }
          return null;
        }),
      },
      notification: {
        findMany: vi.fn().mockResolvedValue([mocks.mockNotif1]),
        count: vi.fn().mockImplementation(async ({ where }) => {
          if (where.isRead === false) return 1;
          return 1;
        }),
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.NOTIF_ID_1) return mocks.mockNotif1;
          if (where.id === mocks.NOTIF_ID_2) return mocks.mockNotif2;
          return null;
        }),
        update: vi.fn().mockImplementation(async ({ where, data }) => {
          return { ...mocks.mockNotif1, ...data };
        }),
        updateMany: vi.fn().mockResolvedValue({ count: 2 }),
        create: vi.fn().mockImplementation(async ({ data }) => {
          return { id: 'new-notif-uuid', ...data, isRead: false, createdAt: new Date() };
        }),
        delete: vi.fn().mockResolvedValue({ id: mocks.NOTIF_ID_1 }),
      },
    },
  };
});

// Mock Socket.IO helper functions
vi.mock('../src/socket/socket.js', () => ({
  emitToUser: vi.fn(),
  emitToOrder: vi.fn(),
  getIO: vi.fn().mockReturnValue(null),
}));

import app from '../src/app.js';
import { generateAccessToken } from '../src/utils/jwt.js';

describe('Phase 10: Notifications Module & Realtime Events', () => {
  const userToken = generateAccessToken({
    id: mocks.USER_ID,
    email: 'user@test.com',
    role: 'CUSTOMER',
  });

  const otherUserToken = generateAccessToken({
    id: mocks.OTHER_USER_ID,
    email: 'other@test.com',
    role: 'CUSTOMER',
  });

  const adminToken = generateAccessToken({
    id: mocks.ADMIN_USER_ID,
    email: 'admin@test.com',
    role: 'ADMIN',
  });

  it('should block unauthenticated access to notifications', async () => {
    const res = await request(app).get('/api/v1/notifications');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should allow authenticated user to retrieve their notifications', async () => {
    const res = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.notifications)).toBe(true);
    expect(res.body.data.unreadCount).toBeDefined();
    expect(res.body.meta).toBeDefined();
  });

  it('should allow user to get unread notification count', async () => {
    const res = await request(app)
      .get('/api/v1/notifications/unread-count')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.unreadCount).toBe(1);
  });

  it('should allow user to mark their notification as read', async () => {
    const res = await request(app)
      .patch(`/api/v1/notifications/${mocks.NOTIF_ID_1}/read`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isRead).toBe(true);
  });

  it('should forbid user from marking another user notification as read', async () => {
    const res = await request(app)
      .patch(`/api/v1/notifications/${mocks.NOTIF_ID_2}/read`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow user to mark all notifications as read', async () => {
    const res = await request(app)
      .patch('/api/v1/notifications/read-all')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.updatedCount).toBe(2);
  });

  it('should allow user to delete their notification', async () => {
    const res = await request(app)
      .delete(`/api/v1/notifications/${mocks.NOTIF_ID_1}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should forbid non-admins from sending notifications via /send', async () => {
    const res = await request(app)
      .post('/api/v1/notifications/send')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        userId: mocks.USER_ID,
        type: 'SYSTEM',
        title: 'Platform Maintenance',
        body: 'QuickKart will undergo routine maintenance at 2 AM.',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow admin to send notification', async () => {
    const res = await request(app)
      .post('/api/v1/notifications/send')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId: mocks.USER_ID,
        type: 'SYSTEM',
        title: 'Platform Maintenance',
        body: 'QuickKart will undergo routine maintenance at 2 AM.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
  });
});

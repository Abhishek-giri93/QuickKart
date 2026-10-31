/**
 * QuickKart — Admin Module Tests (Phase 12)
 *
 * Tests admin-only endpoints:
 *   - Platform analytics overview
 *   - Store controls (list, update status, update commission)
 *   - Delivery partner controls (list, verify)
 *   - User moderation (list, ban/unban)
 *   - Coupon management (create, list, update)
 *
 * Uses vi.hoisted() pattern to avoid Vitest hoisting issues.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// ─────────────────────────────────────────────────────────────────────────────
// Hoist all mock data BEFORE vi.mock() calls
// ─────────────────────────────────────────────────────────────────────────────
const mocks = vi.hoisted(() => {
  const ADMIN_USER_ID    = '11111111-1111-4111-8111-111111111111';
  const CUSTOMER_USER_ID = '22222222-2222-4222-8222-222222222222';
  const STORE_ID         = '33333333-3333-4333-8333-333333333333';
  const PARTNER_ID       = '44444444-4444-4444-8444-444444444444';
  const COUPON_ID        = '55555555-5555-4555-8555-555555555555';

  // Admin user (ADMIN role)
  const mockAdminUser = {
    id: ADMIN_USER_ID,
    email: 'admin@quickkart.com',
    phone: '9999999999',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
    passwordHash: 'HASHED',
  };

  // Customer user (CUSTOMER role — for 403 tests)
  const mockCustomerUser = {
    id: CUSTOMER_USER_ID,
    email: 'customer@test.com',
    phone: '8888888888',
    role: 'CUSTOMER',
    isActive: true,
    isVerified: true,
    passwordHash: 'HASHED',
  };

  // Store mock
  const mockStore = {
    id: STORE_ID,
    name: 'Best Store',
    status: 'ACTIVE',
    commissionRate: 10,
    avgRating: 4.5,
    totalRatings: 100,
    sellerProfile: {
      businessName: 'Best Store Pvt Ltd',
      isKycVerified: true,
      user: { email: 'seller@test.com', phone: '7777777777' },
    },
    createdAt: new Date(),
  };

  // Delivery partner mock
  const mockPartner = {
    id: PARTNER_ID,
    firstName: 'Rider',
    lastName: 'Singh',
    isVerified: false,
    isOnline: true,
    user: { email: 'rider@test.com', phone: '6666666666', isActive: true },
    createdAt: new Date(),
  };

  // Coupon mock
  const mockCoupon = {
    id: COUPON_ID,
    code: 'SAVE20',
    description: '20% off on first order',
    discountPercent: 20,
    discountAmount: null,
    minOrderAmount: 200,
    maxDiscount: 100,
    usageLimit: 500,
    perUserLimit: 1,
    usageCount: 0,
    isActive: true,
    validFrom: new Date('2026-01-01T00:00:00Z'),
    validUntil: new Date('2026-12-31T23:59:59Z'),
    createdAt: new Date(),
  };

  // Platform order aggregate stats mock
  const mockOrderAggregate = {
    _sum: { totalAmount: 50000 },
    _count: { id: 10 },
  };

  return {
    ADMIN_USER_ID,
    CUSTOMER_USER_ID,
    STORE_ID,
    PARTNER_ID,
    COUPON_ID,
    mockAdminUser,
    mockCustomerUser,
    mockStore,
    mockPartner,
    mockCoupon,
    mockOrderAggregate,
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Mock Socket.IO
// ─────────────────────────────────────────────────────────────────────────────
vi.mock('../src/socket/socket.js', () => ({
  emitToUser: vi.fn(),
  emitToOrder: vi.fn(),
  getIO: vi.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Mock Prisma client
// ─────────────────────────────────────────────────────────────────────────────
vi.mock('../src/config/prisma.js', () => {
  const prisma = {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
    store: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
    deliveryPartner: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
    order: {
      aggregate: vi.fn(),
      count: vi.fn(),
    },
    coupon: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((cb) => (typeof cb === 'function' ? cb(prisma) : Promise.all(cb))),
  };
  return { default: prisma };
});

// ─────────────────────────────────────────────────────────────────────────────
// Import app AFTER mocks
// ─────────────────────────────────────────────────────────────────────────────
import app from '../src/app.js';
import prisma from '../src/config/prisma.js';
import { generateAccessToken } from '../src/utils/jwt.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — generate JWT tokens
// ─────────────────────────────────────────────────────────────────────────────
const adminToken    = () => generateAccessToken({ id: mocks.ADMIN_USER_ID,    role: 'ADMIN' });
const customerToken = () => generateAccessToken({ id: mocks.CUSTOMER_USER_ID, role: 'CUSTOMER' });

// ─────────────────────────────────────────────────────────────────────────────
// Helpers to set up auth mock per role
// ─────────────────────────────────────────────────────────────────────────────
const setupAdminAuth = () => {
  prisma.user.findUnique.mockImplementation(({ where }) => {
    if (where.id === mocks.ADMIN_USER_ID) return Promise.resolve(mocks.mockAdminUser);
    if (where.id === mocks.CUSTOMER_USER_ID) return Promise.resolve(mocks.mockCustomerUser);
    return Promise.resolve(null);
  });
};

const setupCustomerAuth = () => {
  prisma.user.findUnique.mockImplementation(({ where }) => {
    if (where.id === mocks.CUSTOMER_USER_ID) return Promise.resolve(mocks.mockCustomerUser);
    return Promise.resolve(null);
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Reset mocks before each test
// ─────────────────────────────────────────────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks();
});

// ═════════════════════════════════════════════════════════════════════════════
//  Admin Module Tests
// ═════════════════════════════════════════════════════════════════════════════
describe('Admin Module — Phase 12', () => {

  // ── Authentication / Authorization Guards ─────────────────────────────────
  describe('Auth Guards', () => {
    it('401 — unauthenticated request blocked', async () => {
      const res = await request(app).get('/api/v1/admin/analytics/overview');
      expect(res.status).toBe(401);
    });

    it('403 — CUSTOMER role cannot access admin endpoints', async () => {
      setupCustomerAuth();
      const res = await request(app)
        .get('/api/v1/admin/analytics/overview')
        .set('Authorization', `Bearer ${customerToken()}`);
      expect(res.status).toBe(403);
    });
  });

  // ── Platform Analytics Overview ───────────────────────────────────────────
  describe('GET /api/v1/admin/analytics/overview', () => {
    it('200 — admin can get platform overview', async () => {
      setupAdminAuth();

      prisma.order.aggregate.mockResolvedValue(mocks.mockOrderAggregate);
      prisma.order.count
        .mockResolvedValueOnce(15)   // total orders
        .mockResolvedValueOnce(3)    // pending
        .mockResolvedValueOnce(2);   // cancelled
      prisma.user.count
        .mockResolvedValueOnce(100)  // customers
        .mockResolvedValueOnce(20)   // sellers
        .mockResolvedValueOnce(15);  // delivery partners
      prisma.store.count.mockResolvedValue(12);
      prisma.deliveryPartner.count.mockResolvedValue(10);

      const res = await request(app)
        .get('/api/v1/admin/analytics/overview')
        .set('Authorization', `Bearer ${adminToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('financials');
      expect(res.body.data).toHaveProperty('orders');
      expect(res.body.data).toHaveProperty('users');
      expect(res.body.data).toHaveProperty('operations');
      expect(res.body.data.financials.grossMerchandiseValue).toBe(50000);
      expect(res.body.data.orders.total).toBe(15);
      expect(res.body.data.users.customers).toBe(100);
      expect(res.body.data.operations.activeStores).toBe(12);
    });
  });

  // ── Store Controls ────────────────────────────────────────────────────────
  describe('Store Controls', () => {
    it('200 — admin can list all stores', async () => {
      setupAdminAuth();
      prisma.store.findMany.mockResolvedValue([mocks.mockStore]);
      prisma.store.count.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/v1/admin/stores')
        .set('Authorization', `Bearer ${adminToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].id).toBe(mocks.STORE_ID);
    });

    it('200 — admin can update store status to SUSPENDED', async () => {
      setupAdminAuth();
      const updatedStore = { ...mocks.mockStore, status: 'SUSPENDED' };
      prisma.store.findUnique.mockResolvedValue(mocks.mockStore);
      prisma.store.update.mockResolvedValue(updatedStore);

      const res = await request(app)
        .patch(`/api/v1/admin/stores/${mocks.STORE_ID}/status`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send({ status: 'SUSPENDED' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('SUSPENDED');
    });

    it('200 — admin can update store commission rate', async () => {
      setupAdminAuth();
      const updatedStore = { ...mocks.mockStore, commissionRate: 15 };
      prisma.store.findUnique.mockResolvedValue(mocks.mockStore);
      prisma.store.update.mockResolvedValue(updatedStore);

      const res = await request(app)
        .patch(`/api/v1/admin/stores/${mocks.STORE_ID}/commission`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send({ commissionRate: 15 });

      expect(res.status).toBe(200);
      expect(res.body.data.commissionRate).toBe(15);
    });
  });

  // ── Delivery Partner Controls ─────────────────────────────────────────────
  describe('Delivery Partner Controls', () => {
    it('200 — admin can list delivery partners', async () => {
      setupAdminAuth();
      prisma.deliveryPartner.findMany.mockResolvedValue([mocks.mockPartner]);
      prisma.deliveryPartner.count.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/v1/admin/delivery-partners')
        .set('Authorization', `Bearer ${adminToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].id).toBe(mocks.PARTNER_ID);
    });

    it('200 — admin can verify a delivery partner', async () => {
      setupAdminAuth();
      const verifiedPartner = { ...mocks.mockPartner, isVerified: true };
      prisma.deliveryPartner.findUnique.mockResolvedValue(mocks.mockPartner);
      prisma.deliveryPartner.update.mockResolvedValue(verifiedPartner);

      const res = await request(app)
        .patch(`/api/v1/admin/delivery-partners/${mocks.PARTNER_ID}/verify`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send({ isVerified: true });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isVerified).toBe(true);
      expect(res.body.message).toContain('verified');
    });
  });

  // ── User Management ───────────────────────────────────────────────────────
  describe('User Management', () => {
    it('200 — admin can list platform users', async () => {
      setupAdminAuth();
      const mockUserList = [
        {
          id: mocks.CUSTOMER_USER_ID,
          email: 'customer@test.com',
          phone: '8888888888',
          role: 'CUSTOMER',
          isActive: true,
          isVerified: true,
          createdAt: new Date(),
        },
      ];
      prisma.user.findMany.mockResolvedValue(mockUserList);
      prisma.user.count.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].email).toBe('customer@test.com');
    });

    it('200 — admin can ban a user', async () => {
      setupAdminAuth();
      const bannedUser = {
        id: mocks.CUSTOMER_USER_ID,
        email: 'customer@test.com',
        role: 'CUSTOMER',
        isActive: false,
      };
      prisma.user.update.mockResolvedValue(bannedUser);

      const res = await request(app)
        .patch(`/api/v1/admin/users/${mocks.CUSTOMER_USER_ID}/status`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send({ isActive: false });

      expect(res.status).toBe(200);
      expect(res.body.data.isActive).toBe(false);
      expect(res.body.message).toContain('banned');
    });
  });

  // ── Coupon Management ─────────────────────────────────────────────────────
  describe('Coupon Management', () => {
    it('422 — coupon creation fails when neither discountPercent nor discountAmount provided', async () => {
      setupAdminAuth();

      const res = await request(app)
        .post('/api/v1/admin/coupons')
        .set('Authorization', `Bearer ${adminToken()}`)
        .send({
          code: 'BADDISCOUNT',
          validFrom: '2026-01-01T00:00:00Z',
          validUntil: '2026-12-31T23:59:59Z',
        });

      expect(res.status).toBe(422);
    });

    it('201 — admin can create a coupon', async () => {
      setupAdminAuth();
      prisma.coupon.findUnique.mockResolvedValue(null); // code does not exist yet
      prisma.coupon.create.mockResolvedValue(mocks.mockCoupon);

      const res = await request(app)
        .post('/api/v1/admin/coupons')
        .set('Authorization', `Bearer ${adminToken()}`)
        .send({
          code: 'SAVE20',
          description: '20% off on first order',
          discountPercent: 20,
          minOrderAmount: 200,
          maxDiscount: 100,
          usageLimit: 500,
          validFrom: '2026-01-01T00:00:00Z',
          validUntil: '2026-12-31T23:59:59Z',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe('SAVE20');
    });

    it('200 — admin can list all coupons', async () => {
      setupAdminAuth();
      prisma.coupon.findMany.mockResolvedValue([mocks.mockCoupon]);
      prisma.coupon.count.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/v1/admin/coupons')
        .set('Authorization', `Bearer ${adminToken()}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].code).toBe('SAVE20');
      expect(res.body.meta).toHaveProperty('total');
    });

    it('200 — admin can update coupon (toggle isActive)', async () => {
      setupAdminAuth();
      const updatedCoupon = { ...mocks.mockCoupon, isActive: false };
      prisma.coupon.findUnique.mockResolvedValue(mocks.mockCoupon);
      prisma.coupon.update.mockResolvedValue(updatedCoupon);

      const res = await request(app)
        .patch(`/api/v1/admin/coupons/${mocks.COUPON_ID}`)
        .set('Authorization', `Bearer ${adminToken()}`)
        .send({ isActive: false });

      expect(res.status).toBe(200);
      expect(res.body.data.isActive).toBe(false);
    });
  });
});

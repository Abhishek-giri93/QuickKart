import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

const mocks = vi.hoisted(() => {
  const CUSTOMER_USER_ID = '11111111-1111-4111-8111-111111111111';
  const SELLER_USER_ID = '22222222-2222-4222-8222-222222222222';
  const DP_USER_ID = '33333333-3333-4333-8333-333333333333';
  const ADMIN_USER_ID = '44444444-4444-4444-8444-444444444444';
  const CUSTOMER_PROFILE_ID = '55555555-5555-4555-8555-555555555555';
  const DP_PROFILE_ID = '66666666-6666-4666-8666-666666666666';
  const STORE_ID = '77777777-7777-4777-8777-777777777777';
  const ORDER_ID = '88888888-8888-4888-8888-888888888888';
  const REVIEW_ID = '99999999-9999-4999-8999-999999999999';
  const TICKET_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

  const mockCustomerProfile = {
    id: CUSTOMER_PROFILE_ID,
    userId: CUSTOMER_USER_ID,
    firstName: 'Priya',
    lastName: 'Patel',
    avatarUrl: null,
  };

  let orderStatus = 'DELIVERED';
  let hasExistingReview = false;

  const mockOrder = {
    id: ORDER_ID,
    orderNumber: 'QK-2026-88888',
    customerProfileId: CUSTOMER_PROFILE_ID,
    storeId: STORE_ID,
    status: orderStatus,
    delivery: {
      id: 'del-uuid-1',
      deliveryPartnerId: DP_PROFILE_ID,
    },
    store: {
      id: STORE_ID,
      name: 'Priya Groceries',
    },
  };

  const mockReview = {
    id: REVIEW_ID,
    orderId: ORDER_ID,
    customerProfileId: CUSTOMER_PROFILE_ID,
    storeId: STORE_ID,
    deliveryPartnerId: DP_PROFILE_ID,
    storeRating: 5,
    storeComment: 'Items were fresh and neatly packaged!',
    deliveryRating: 5,
    deliveryComment: 'Delivered fast and polite rider.',
    createdAt: new Date(),
    customerProfile: mockCustomerProfile,
    store: { id: STORE_ID, name: 'Priya Groceries' },
    deliveryPartner: { id: DP_PROFILE_ID, firstName: 'Rider', lastName: 'X' },
  };

  const mockTicket = {
    id: TICKET_ID,
    userId: CUSTOMER_USER_ID,
    orderId: ORDER_ID,
    subject: 'Damaged item in delivery',
    description: 'One packet of milk was leaking when handed over.',
    status: 'OPEN',
    resolution: null,
    resolvedAt: null,
    createdAt: new Date(),
    user: {
      id: CUSTOMER_USER_ID,
      email: 'priya@test.com',
      phone: '9876543210',
      role: 'CUSTOMER',
    },
  };

  return {
    CUSTOMER_USER_ID,
    SELLER_USER_ID,
    DP_USER_ID,
    ADMIN_USER_ID,
    CUSTOMER_PROFILE_ID,
    DP_PROFILE_ID,
    STORE_ID,
    ORDER_ID,
    REVIEW_ID,
    TICKET_ID,
    mockCustomerProfile,
    mockOrder,
    mockReview,
    mockTicket,
    getOrderStatus: () => orderStatus,
    setOrderStatus: (s) => {
      orderStatus = s;
    },
    getHasExistingReview: () => hasExistingReview,
    setHasExistingReview: (val) => {
      hasExistingReview = val;
    },
  };
});

vi.mock('../src/config/prisma.js', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.CUSTOMER_USER_ID) {
            return { id: mocks.CUSTOMER_USER_ID, role: 'CUSTOMER', isActive: true };
          }
          if (where.id === mocks.SELLER_USER_ID) {
            return { id: mocks.SELLER_USER_ID, role: 'SELLER', isActive: true };
          }
          if (where.id === mocks.DP_USER_ID) {
            return { id: mocks.DP_USER_ID, role: 'DELIVERY_PARTNER', isActive: true };
          }
          if (where.id === mocks.ADMIN_USER_ID) {
            return { id: mocks.ADMIN_USER_ID, role: 'ADMIN', isActive: true };
          }
          return null;
        }),
      },
      customerProfile: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.userId === mocks.CUSTOMER_USER_ID) return mocks.mockCustomerProfile;
          return null;
        }),
      },
      order: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.ORDER_ID) {
            return { ...mocks.mockOrder, status: mocks.getOrderStatus() };
          }
          return null;
        }),
      },
      store: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.STORE_ID) {
            return { id: mocks.STORE_ID, name: 'Priya Groceries', avgRating: 4.5, totalRatings: 10 };
          }
          return null;
        }),
        update: vi.fn().mockResolvedValue({}),
      },
      deliveryPartner: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.DP_PROFILE_ID) {
            return { id: mocks.DP_PROFILE_ID, firstName: 'Rider', lastName: 'X' };
          }
          return null;
        }),
        update: vi.fn().mockResolvedValue({}),
      },
      review: {
        findUnique: vi.fn().mockImplementation(async () => {
          if (mocks.getHasExistingReview()) return mocks.mockReview;
          return null;
        }),
        findFirst: vi.fn().mockImplementation(async ({ where }) => {
          if (where.orderId === mocks.ORDER_ID) return mocks.mockReview;
          return null;
        }),
        findMany: vi.fn().mockResolvedValue([mocks.mockReview]),
        count: vi.fn().mockResolvedValue(1),
        aggregate: vi.fn().mockResolvedValue({
          _avg: { storeRating: 4.8, deliveryRating: 4.9 },
          _count: { storeRating: 11, deliveryRating: 11 },
        }),
        create: vi.fn().mockResolvedValue(mocks.mockReview),
      },
      supportTicket: {
        create: vi.fn().mockResolvedValue(mocks.mockTicket),
        findMany: vi.fn().mockResolvedValue([mocks.mockTicket]),
        count: vi.fn().mockResolvedValue(1),
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.TICKET_ID) return mocks.mockTicket;
          return null;
        }),
        update: vi.fn().mockImplementation(async ({ where, data }) => {
          return { ...mocks.mockTicket, ...data };
        }),
      },
      $transaction: vi.fn().mockImplementation(async (callback) => {
        return callback({
          review: {
            create: vi.fn().mockResolvedValue(mocks.mockReview),
            aggregate: vi.fn().mockResolvedValue({
              _avg: { storeRating: 4.8, deliveryRating: 4.9 },
              _count: { storeRating: 11, deliveryRating: 11 },
            }),
          },
          store: {
            update: vi.fn().mockResolvedValue({}),
          },
          deliveryPartner: {
            update: vi.fn().mockResolvedValue({}),
          },
        });
      }),
    },
  };
});

import app from '../src/app.js';
import { generateAccessToken } from '../src/utils/jwt.js';

describe('Phase 11: Reviews & Support Tickets Module', () => {
  const customerToken = generateAccessToken({
    id: mocks.CUSTOMER_USER_ID,
    email: 'priya@test.com',
    role: 'CUSTOMER',
  });

  const sellerToken = generateAccessToken({
    id: mocks.SELLER_USER_ID,
    email: 'seller@test.com',
    role: 'SELLER',
  });

  const adminToken = generateAccessToken({
    id: mocks.ADMIN_USER_ID,
    email: 'admin@test.com',
    role: 'ADMIN',
  });

  it('should block unauthenticated review submissions', async () => {
    const res = await request(app).post('/api/v1/reviews').send({
      orderId: mocks.ORDER_ID,
      storeRating: 5,
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should forbid non-customers from submitting reviews', async () => {
    const res = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        orderId: mocks.ORDER_ID,
        storeRating: 5,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should reject review submission if order is not delivered', async () => {
    mocks.setOrderStatus('PREPARING');
    const res = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderId: mocks.ORDER_ID,
        storeRating: 5,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('DELIVERED');
  });

  it('should allow customer to submit review for delivered order', async () => {
    mocks.setOrderStatus('DELIVERED');
    mocks.setHasExistingReview(false);
    const res = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderId: mocks.ORDER_ID,
        storeRating: 5,
        storeComment: 'Excellent produce!',
        deliveryRating: 5,
        deliveryComment: 'Super fast delivery!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.storeRating).toBe(5);
  });

  it('should reject duplicate review for same order', async () => {
    mocks.setOrderStatus('DELIVERED');
    mocks.setHasExistingReview(true);
    const res = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderId: mocks.ORDER_ID,
        storeRating: 4,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already submitted a review');
  });

  it('should allow public access to view store reviews', async () => {
    const res = await request(app).get(`/api/v1/reviews/store/${mocks.STORE_ID}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should allow viewing order review details', async () => {
    const res = await request(app)
      .get(`/api/v1/reviews/order/${mocks.ORDER_ID}`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toBe(mocks.ORDER_ID);
  });

  it('should allow authenticated user to create a support ticket', async () => {
    const res = await request(app)
      .post('/api/v1/support/tickets')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderId: mocks.ORDER_ID,
        subject: 'Damaged item in delivery',
        description: 'One packet of milk was leaking when handed over.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('OPEN');
  });

  it('should allow user to list their support tickets', async () => {
    const res = await request(app)
      .get('/api/v1/support/tickets')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toBeDefined();
  });

  it('should allow viewing support ticket details by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/support/tickets/${mocks.TICKET_ID}`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mocks.TICKET_ID);
  });

  it('should forbid regular users from updating ticket status', async () => {
    const res = await request(app)
      .patch(`/api/v1/support/tickets/${mocks.TICKET_ID}/status`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        status: 'RESOLVED',
        resolution: 'Refund processed to customer wallet.',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow admin to resolve a support ticket', async () => {
    const res = await request(app)
      .patch(`/api/v1/support/tickets/${mocks.TICKET_ID}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'RESOLVED',
        resolution: 'Refund processed to customer wallet.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('RESOLVED');
  });
});

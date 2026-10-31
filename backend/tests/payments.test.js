import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';

const mocks = vi.hoisted(() => {
  const CUSTOMER_USER_ID = '11111111-1111-4111-8111-111111111111';
  const SELLER_USER_ID = '22222222-2222-4222-8222-222222222222';
  const ADMIN_USER_ID = '33333333-3333-4333-8333-333333333333';
  const CUSTOMER_PROFILE_ID = '44444444-4444-4444-8444-444444444444';
  const SELLER_PROFILE_ID = '55555555-5555-4555-8555-555555555555';
  const STORE_ID = '66666666-6666-4666-8666-666666666666';
  const ORDER_ID = '77777777-7777-4777-8777-777777777777';
  const PAYMENT_ID = '88888888-8888-4888-8888-888888888888';

  const mockCustomerProfile = {
    id: CUSTOMER_PROFILE_ID,
    userId: CUSTOMER_USER_ID,
    firstName: 'Alice',
    lastName: 'Sharma',
  };

  const mockSellerProfile = {
    id: SELLER_PROFILE_ID,
    userId: SELLER_USER_ID,
    businessName: 'Super Mart',
  };

  const mockStore = {
    id: STORE_ID,
    name: 'Super Mart Store',
    sellerProfile: mockSellerProfile,
  };

  let currentPaymentStatus = 'PENDING';
  let currentRefunds = [];

  const mockPayment = {
    id: PAYMENT_ID,
    orderId: ORDER_ID,
    method: 'RAZORPAY',
    status: currentPaymentStatus,
    amount: 500,
    currency: 'INR',
    razorpayOrderId: 'order_test_12345',
    razorpayPaymentId: null,
    razorpaySignature: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    refunds: currentRefunds,
    transactions: [],
  };

  const mockOrder = {
    id: ORDER_ID,
    orderNumber: 'QK-2026-11111',
    customerProfileId: CUSTOMER_PROFILE_ID,
    storeId: STORE_ID,
    status: 'PENDING',
    payment: mockPayment,
    store: mockStore,
    customerProfile: mockCustomerProfile,
  };

  return {
    CUSTOMER_USER_ID,
    SELLER_USER_ID,
    ADMIN_USER_ID,
    CUSTOMER_PROFILE_ID,
    SELLER_PROFILE_ID,
    STORE_ID,
    ORDER_ID,
    PAYMENT_ID,
    mockCustomerProfile,
    mockSellerProfile,
    mockStore,
    mockPayment,
    mockOrder,
    getCurrentPaymentStatus: () => currentPaymentStatus,
    setCurrentPaymentStatus: (s) => {
      currentPaymentStatus = s;
    },
    getRefunds: () => currentRefunds,
    addRefund: (r) => {
      currentRefunds.push(r);
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
            return {
              ...mocks.mockOrder,
              payment: {
                ...mocks.mockPayment,
                status: mocks.getCurrentPaymentStatus(),
                refunds: mocks.getRefunds(),
              },
            };
          }
          return null;
        }),
      },
      payment: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.PAYMENT_ID) {
            return {
              ...mocks.mockPayment,
              status: mocks.getCurrentPaymentStatus(),
              refunds: mocks.getRefunds(),
              order: mocks.mockOrder,
            };
          }
          return null;
        }),
        findFirst: vi.fn().mockImplementation(async ({ where }) => {
          return {
            ...mocks.mockPayment,
            status: mocks.getCurrentPaymentStatus(),
            refunds: mocks.getRefunds(),
          };
        }),
        update: vi.fn().mockImplementation(async ({ data }) => {
          if (data.status) mocks.setCurrentPaymentStatus(data.status);
          return {
            ...mocks.mockPayment,
            ...data,
            status: mocks.getCurrentPaymentStatus(),
          };
        }),
      },
      transaction: {
        create: vi.fn().mockImplementation(async ({ data }) => ({
          id: 'tx-uuid-1',
          ...data,
          createdAt: new Date(),
        })),
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'tx-uuid-1',
            type: 'PAYMENT',
            amount: 500,
            payment: { id: mocks.PAYMENT_ID, method: 'RAZORPAY', status: 'SUCCESS' },
          },
        ]),
        count: vi.fn().mockResolvedValue(1),
      },
      refund: {
        create: vi.fn().mockImplementation(async ({ data }) => {
          mocks.addRefund(data);
          return { id: 'rfnd-uuid-1', ...data };
        }),
      },
      $transaction: vi.fn().mockImplementation(async (callback) => {
        return callback({
          payment: {
            update: vi.fn().mockImplementation(async ({ data }) => {
              if (data.status) mocks.setCurrentPaymentStatus(data.status);
              return {
                ...mocks.mockPayment,
                ...data,
                status: mocks.getCurrentPaymentStatus(),
              };
            }),
          },
          transaction: {
            create: vi.fn().mockImplementation(async ({ data }) => ({
              id: 'tx-uuid-1',
              ...data,
            })),
          },
          refund: {
            create: vi.fn().mockImplementation(async ({ data }) => {
              mocks.addRefund(data);
              return { id: 'rfnd-uuid-1', ...data };
            }),
          },
        });
      }),
    },
  };
});

import app from '../src/app.js';
import { generateAccessToken } from '../src/utils/jwt.js';
import { config } from '../src/config/env.config.js';

describe('Phase 9: Payments Module — Razorpay, Signatures & Refunds', () => {
  const customerToken = generateAccessToken({
    id: mocks.CUSTOMER_USER_ID,
    email: 'alice@test.com',
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

  it('should block unauthenticated access to payments', async () => {
    const res = await request(app).post('/api/v1/payments/create-razorpay-order').send({
      orderId: mocks.ORDER_ID,
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should forbid non-customers from creating razorpay orders', async () => {
    const res = await request(app)
      .post('/api/v1/payments/create-razorpay-order')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ orderId: mocks.ORDER_ID });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should create Razorpay order details for customer order', async () => {
    const res = await request(app)
      .post('/api/v1/payments/create-razorpay-order')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ orderId: mocks.ORDER_ID });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.razorpayOrderId).toBeDefined();
    expect(res.body.data.amountInPaise).toBe(50000); // 500 * 100
  });

  it('should reject payment verification when signature is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/payments/verify')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderId: mocks.ORDER_ID,
        razorpayOrderId: 'order_test_12345',
        razorpayPaymentId: 'pay_test_99999',
        razorpaySignature: 'invalid_forged_signature_hex',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('signature verification failed');
  });

  it('should verify payment signature successfully and mark payment SUCCESS', async () => {
    const razorpayOrderId = 'order_test_12345';
    const razorpayPaymentId = 'pay_test_99999';
    const validSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const res = await request(app)
      .post('/api/v1/payments/verify')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderId: mocks.ORDER_ID,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature: validSignature,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUCCESS');
  });

  it('should allow customer to get their payment details by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/payments/${mocks.PAYMENT_ID}`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mocks.PAYMENT_ID);
  });

  it('should allow customer to view transaction history', async () => {
    const res = await request(app)
      .get('/api/v1/payments/transactions')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toBeDefined();
  });

  it('should forbid customers from initiating refunds', async () => {
    const res = await request(app)
      .post('/api/v1/payments/refund')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        paymentId: mocks.PAYMENT_ID,
        amount: 200,
        reason: 'Customer request',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should reject refund when amount exceeds refundable balance', async () => {
    mocks.setCurrentPaymentStatus('SUCCESS');
    const res = await request(app)
      .post('/api/v1/payments/refund')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        paymentId: mocks.PAYMENT_ID,
        amount: 99999, // exceeds 500
        reason: 'Out of stock',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('exceeds maximum refundable');
  });

  it('should allow admin to initiate refund successfully', async () => {
    mocks.setCurrentPaymentStatus('SUCCESS');
    const res = await request(app)
      .post('/api/v1/payments/refund')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        paymentId: mocks.PAYMENT_ID,
        amount: 250,
        reason: 'Partial return of items',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.amount).toBe(250);
  });

  it('should process webhook event successfully with valid webhook signature', async () => {
    const webhookPayload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_hook_123',
            order_id: 'order_test_12345',
            amount: 50000,
          },
        },
      },
    };
    const bodyStr = JSON.stringify(webhookPayload);
    const webhookSignature = crypto
      .createHmac('sha256', config.razorpay.webhookSecret)
      .update(bodyStr)
      .digest('hex');

    const res = await request(app)
      .post('/api/v1/payments/webhook')
      .set('x-razorpay-signature', webhookSignature)
      .send(webhookPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

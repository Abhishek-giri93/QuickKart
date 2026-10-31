import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

const mocks = vi.hoisted(() => {
  const CUSTOMER_USER_ID = '11111111-1111-4111-8111-111111111111';
  const OTHER_CUSTOMER_USER_ID = '22222222-2222-4222-8222-222222222222';
  const SELLER_USER_ID = '33333333-3333-4333-8333-333333333333';
  const CUSTOMER_PROFILE_ID = '44444444-4444-4444-8444-444444444444';
  const SELLER_PROFILE_ID = '55555555-5555-4555-8555-555555555555';
  const STORE_ID = '66666666-6666-4666-8666-666666666666';
  const ADDRESS_ID = '77777777-7777-4777-8777-777777777777';
  const PRODUCT_ID = '88888888-8888-4888-8888-888888888888';
  const ORDER_ID = '99999999-9999-4999-8999-999999999999';
  const CART_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

  const mockCustomerProfile = {
    id: CUSTOMER_PROFILE_ID,
    userId: CUSTOMER_USER_ID,
    firstName: 'Alice',
    lastName: 'Customer',
  };

  const mockSellerProfile = {
    id: SELLER_PROFILE_ID,
    userId: SELLER_USER_ID,
    businessName: 'Fresh Mart',
    stores: [{ id: STORE_ID }],
  };

  const mockStore = {
    id: STORE_ID,
    sellerProfileId: SELLER_PROFILE_ID,
    name: 'Fresh Mart Store',
    status: 'ACTIVE',
    isOpen: true,
    phone: '9876543210',
    addressLine: '123 Market Road',
    city: 'Mumbai',
    sellerProfile: mockSellerProfile,
  };

  const mockAddress = {
    id: ADDRESS_ID,
    customerProfileId: CUSTOMER_PROFILE_ID,
    label: 'Home',
    recipientName: 'Alice',
    recipientPhone: '9876543210',
    addressLine1: 'Flat 101, Galaxy Apts',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  };

  const mockProduct = {
    id: PRODUCT_ID,
    storeId: STORE_ID,
    categoryId: 'cat-uuid-1',
    name: 'Organic Honey 500g',
    slug: 'organic-honey-500g',
    price: 250,
    discountedPrice: 220,
    unit: 'jar',
    isAvailable: true,
    isActive: true,
    images: [],
    store: mockStore,
    inventory: { quantity: 15, lowStockAlert: 3 },
  };

  const mockCartWithItems = {
    id: CART_ID,
    customerProfileId: CUSTOMER_PROFILE_ID,
    storeId: STORE_ID,
    couponId: null,
    items: [
      {
        id: 'item-uuid-1',
        cartId: CART_ID,
        productId: PRODUCT_ID,
        quantity: 2,
        product: mockProduct,
      },
    ],
    coupon: null,
  };

  let currentOrderStatus = 'PENDING';

  const mockOrder = {
    id: ORDER_ID,
    orderNumber: 'QK-2026-99999',
    customerProfileId: CUSTOMER_PROFILE_ID,
    storeId: STORE_ID,
    addressId: ADDRESS_ID,
    couponId: null,
    status: currentOrderStatus,
    subtotal: 440,
    discountAmount: 0,
    deliveryFee: 40,
    taxAmount: 22,
    totalAmount: 502,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [
      {
        id: 'order-item-1',
        orderId: ORDER_ID,
        productId: PRODUCT_ID,
        productName: 'Organic Honey 500g',
        productUnit: 'jar',
        quantity: 2,
        unitPrice: 220,
        totalPrice: 440,
      },
    ],
    payment: {
      id: 'pay-uuid-1',
      orderId: ORDER_ID,
      method: 'COD',
      status: 'PENDING',
      amount: 502,
    },
    store: mockStore,
    address: mockAddress,
    customerProfile: mockCustomerProfile,
  };

  return {
    CUSTOMER_USER_ID,
    OTHER_CUSTOMER_USER_ID,
    SELLER_USER_ID,
    CUSTOMER_PROFILE_ID,
    SELLER_PROFILE_ID,
    STORE_ID,
    ADDRESS_ID,
    PRODUCT_ID,
    ORDER_ID,
    CART_ID,
    mockCustomerProfile,
    mockSellerProfile,
    mockStore,
    mockAddress,
    mockProduct,
    mockCartWithItems,
    mockOrder,
    getCurrentStatus: () => currentOrderStatus,
    setCurrentStatus: (s) => {
      currentOrderStatus = s;
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
          if (where.id === mocks.OTHER_CUSTOMER_USER_ID) {
            return { id: mocks.OTHER_CUSTOMER_USER_ID, role: 'CUSTOMER', isActive: true };
          }
          if (where.id === mocks.SELLER_USER_ID) {
            return { id: mocks.SELLER_USER_ID, role: 'SELLER', isActive: true };
          }
          return null;
        }),
      },
      customerProfile: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.userId === mocks.CUSTOMER_USER_ID) return mocks.mockCustomerProfile;
          if (where.userId === mocks.OTHER_CUSTOMER_USER_ID) {
            return {
              id: 'other-cust-profile',
              userId: mocks.OTHER_CUSTOMER_USER_ID,
              firstName: 'Bob',
            };
          }
          return null;
        }),
      },
      sellerProfile: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.userId === mocks.SELLER_USER_ID) return mocks.mockSellerProfile;
          return null;
        }),
      },
      address: {
        findFirst: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.ADDRESS_ID && where.customerProfileId === mocks.CUSTOMER_PROFILE_ID) {
            return mocks.mockAddress;
          }
          return null;
        }),
      },
      cart: {
        findUnique: vi.fn().mockResolvedValue(mocks.mockCartWithItems),
        update: vi.fn().mockResolvedValue(mocks.mockCartWithItems),
      },
      cartItem: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      store: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.STORE_ID) return mocks.mockStore;
          return null;
        }),
      },
      inventory: {
        update: vi.fn().mockResolvedValue({ quantity: 13 }),
      },
      coupon: {
        update: vi.fn().mockResolvedValue({}),
      },
      order: {
        create: vi.fn().mockResolvedValue(mocks.mockOrder),
        findMany: vi.fn().mockResolvedValue([mocks.mockOrder]),
        count: vi.fn().mockResolvedValue(1),
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.ORDER_ID) {
            return { ...mocks.mockOrder, status: mocks.getCurrentStatus() };
          }
          return null;
        }),
        update: vi.fn().mockImplementation(async ({ data }) => {
          if (data.status) mocks.setCurrentStatus(data.status);
          return { ...mocks.mockOrder, ...data, status: mocks.getCurrentStatus() };
        }),
      },
      delivery: {
        upsert: vi.fn().mockResolvedValue({ id: 'del-uuid-1', status: 'PENDING' }),
      },
      $transaction: vi.fn().mockImplementation(async (callback) => {
        return callback({
          inventory: {
            update: vi.fn().mockResolvedValue({ quantity: 13 }),
          },
          order: {
            create: vi.fn().mockResolvedValue(mocks.mockOrder),
            update: vi.fn().mockImplementation(async ({ data }) => {
              if (data.status) mocks.setCurrentStatus(data.status);
              return { ...mocks.mockOrder, ...data, status: mocks.getCurrentStatus() };
            }),
          },
          coupon: {
            update: vi.fn().mockResolvedValue({}),
          },
          cartItem: {
            deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
          },
          cart: {
            update: vi.fn().mockResolvedValue({}),
          },
          delivery: {
            upsert: vi.fn().mockResolvedValue({ id: 'del-uuid-1', status: 'PENDING' }),
          },
        });
      }),
    },
  };
});

import app from '../src/app.js';
import { generateAccessToken } from '../src/utils/jwt.js';

describe('Phase 7: Orders Module Lifecycle & State Machine', () => {
  const customerToken = generateAccessToken({
    id: mocks.CUSTOMER_USER_ID,
    email: 'alice@test.com',
    role: 'CUSTOMER',
  });

  const otherCustomerToken = generateAccessToken({
    id: mocks.OTHER_CUSTOMER_USER_ID,
    email: 'bob@test.com',
    role: 'CUSTOMER',
  });

  const sellerToken = generateAccessToken({
    id: mocks.SELLER_USER_ID,
    email: 'seller@test.com',
    role: 'SELLER',
  });

  it('should block unauthenticated access to orders', async () => {
    const res = await request(app).get('/api/v1/orders');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should forbid non-customers from creating orders (e.g. SELLER)', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        addressId: mocks.ADDRESS_ID,
        paymentMethod: 'COD',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should reject order creation with invalid address ID format', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        addressId: 'not-a-valid-uuid',
        paymentMethod: 'COD',
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('should create an order successfully with COD payment method', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        addressId: mocks.ADDRESS_ID,
        paymentMethod: 'COD',
        specialInstructions: 'Leave package at security gate',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderNumber).toBeDefined();
    expect(res.body.data.status).toBe('PENDING');
  });

  it('should allow customer to get their orders history', async () => {
    const res = await request(app)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toBeDefined();
  });

  it('should allow customer to view their order by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/orders/${mocks.ORDER_ID}`)
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mocks.ORDER_ID);
  });

  it('should forbid other customers from viewing another customer order', async () => {
    const res = await request(app)
      .get(`/api/v1/orders/${mocks.ORDER_ID}`)
      .set('Authorization', `Bearer ${otherCustomerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow seller to view their store orders', async () => {
    const res = await request(app)
      .get('/api/v1/orders/seller/store-orders')
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should allow seller to accept order (PENDING -> ACCEPTED)', async () => {
    mocks.setCurrentStatus('PENDING');
    const res = await request(app)
      .patch(`/api/v1/orders/${mocks.ORDER_ID}/accept`)
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ACCEPTED');
  });

  it('should allow seller to mark order preparing (ACCEPTED -> PREPARING)', async () => {
    mocks.setCurrentStatus('ACCEPTED');
    const res = await request(app)
      .patch(`/api/v1/orders/${mocks.ORDER_ID}/prepare`)
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('PREPARING');
  });

  it('should allow seller to mark order ready (PREPARING -> READY)', async () => {
    mocks.setCurrentStatus('PREPARING');
    const res = await request(app)
      .patch(`/api/v1/orders/${mocks.ORDER_ID}/ready`)
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('READY');
  });

  it('should forbid customer from cancelling order when already in READY status', async () => {
    mocks.setCurrentStatus('READY');
    const res = await request(app)
      .patch(`/api/v1/orders/${mocks.ORDER_ID}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        cancellationReason: 'Changed my mind',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('cannot be cancelled');
  });

  it('should allow customer to cancel order when in PENDING status', async () => {
    mocks.setCurrentStatus('PENDING');
    const res = await request(app)
      .patch(`/api/v1/orders/${mocks.ORDER_ID}/cancel`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        cancellationReason: 'Ordered by mistake',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('CANCELLED');
  });
});

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock Prisma for Cart Module testing
vi.mock('../src/config/prisma.js', () => {
  const mockCustomerProfile = {
    id: 'cust-prof-uuid-1',
    userId: 'cust-uuid-1',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockProductStoreA = {
    id: '11111111-1111-4111-8111-111111111111',
    storeId: 'store-uuid-A',
    categoryId: 'cat-uuid-1',
    name: 'Farm Fresh Milk 1L',
    slug: 'farm-fresh-milk-1l',
    price: 60,
    discountedPrice: 55,
    unit: 'litre',
    isAvailable: true,
    isActive: true,
    images: [],
    store: { id: 'store-uuid-A', name: 'Fresh Dairy' },
    inventory: { quantity: 10, lowStockAlert: 2 },
  };

  const mockProductStoreB = {
    id: '22222222-2222-4222-8222-222222222222',
    storeId: 'store-uuid-B',
    categoryId: 'cat-uuid-1',
    name: 'Whole Grain Bread',
    slug: 'whole-grain-bread',
    price: 45,
    discountedPrice: null,
    unit: 'piece',
    isAvailable: true,
    isActive: true,
    images: [],
    store: { id: 'store-uuid-B', name: 'Bakery Express' },
    inventory: { quantity: 20, lowStockAlert: 5 },
  };

  const mockCart = {
    id: 'cart-uuid-1',
    customerProfileId: 'cust-prof-uuid-1',
    storeId: 'store-uuid-A',
    couponId: null,
    items: [
      {
        id: 'item-uuid-1',
        cartId: 'cart-uuid-1',
        productId: mockProductStoreA.id,
        quantity: 2,
        product: mockProductStoreA,
      },
    ],
    coupon: null,
  };

  return {
    default: {
      user: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === 'cust-uuid-1') {
            return { id: 'cust-uuid-1', role: 'CUSTOMER', isActive: true };
          }
          if (where.id === 'seller-uuid-1') {
            return { id: 'seller-uuid-1', role: 'SELLER', isActive: true };
          }
          return null;
        }),
      },
      customerProfile: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.userId === 'cust-uuid-1') {
            return mockCustomerProfile;
          }
          return null;
        }),
      },
      cart: {
        findUnique: vi.fn().mockResolvedValue(mockCart),
        create: vi.fn().mockResolvedValue(mockCart),
        update: vi.fn().mockImplementation(async ({ data }) => {
          return { ...mockCart, ...data };
        }),
      },
      cartItem: {
        create: vi.fn().mockImplementation(async ({ data }) => ({
          id: 'new-item-uuid',
          ...data,
        })),
        update: vi.fn().mockImplementation(async ({ data }) => ({
          id: 'item-uuid-1',
          ...data,
        })),
        delete: vi.fn().mockResolvedValue({ id: 'item-uuid-1' }),
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      product: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mockProductStoreA.id) return mockProductStoreA;
          if (where.id === mockProductStoreB.id) return mockProductStoreB;
          return null;
        }),
      },
      coupon: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.code === 'WELCOME50') {
            return {
              id: 'coupon-uuid-1',
              code: 'WELCOME50',
              discountAmount: 50,
              minOrderAmount: 100,
              isActive: true,
              validFrom: new Date('2020-01-01'),
              validUntil: new Date('2030-01-01'),
              usageLimit: 1000,
              usedCount: 10,
              perUserLimit: 1,
            };
          }
          return null;
        }),
      },
      order: {
        count: vi.fn().mockResolvedValue(0),
      },
    },
  };
});

import app from '../src/app.js';
import { generateAccessToken } from '../src/utils/jwt.js';

describe('Phase 6: Cart Module & Single-Store Enforcement', () => {
  const customerToken = generateAccessToken({
    id: 'cust-uuid-1',
    email: 'customer@test.com',
    role: 'CUSTOMER',
  });

  const sellerToken = generateAccessToken({
    id: 'seller-uuid-1',
    email: 'seller@test.com',
    role: 'SELLER',
  });

  it('should block unauthenticated access to cart', async () => {
    const res = await request(app).get('/api/v1/cart');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should forbid non-customer roles (e.g. SELLER) from cart endpoints', async () => {
    const res = await request(app)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow customer to get their cart with calculated breakdown', async () => {
    const res = await request(app)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary).toBeDefined();
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.summary.subtotal).toBe(110); // 2 * 55
  });

  it('should reject adding an item with invalid productId or non-positive quantity', async () => {
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: 'not-a-valid-uuid',
        quantity: -1,
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('should enforce single-store constraint when adding item from different store', async () => {
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: '22222222-2222-4222-8222-222222222222', // Store B product
        quantity: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('another store');
  });

  it('should reject adding item when requested quantity exceeds available inventory', async () => {
    const res = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        productId: '11111111-1111-4111-8111-111111111111',
        quantity: 50, // exceeds inventory (10)
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Insufficient stock');
  });

  it('should reject applying a non-existent or invalid coupon code', async () => {
    const res = await request(app)
      .post('/api/v1/cart/coupon')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        couponCode: 'INVALIDCODE99',
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should apply a valid coupon code successfully', async () => {
    const res = await request(app)
      .post('/api/v1/cart/coupon')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        couponCode: 'WELCOME50',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Coupon applied');
  });

  it('should allow customer to clear their cart', async () => {
    const res = await request(app)
      .delete('/api/v1/cart/clear')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('cleared');
  });
});

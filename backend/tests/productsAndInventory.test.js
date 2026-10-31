import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock Prisma for testing without database dependency
vi.mock('../src/config/prisma.js', () => {
  return {
    default: {
      product: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'prod-uuid-1',
            name: 'Aashirvaad Whole Wheat Atta',
            price: 250,
            discountedPrice: 235,
            isAvailable: true,
            images: [],
          },
        ]),
        count: vi.fn().mockResolvedValue(1),
      },
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
    },
  };
});

import app from '../src/app.js';
import { generateAccessToken } from '../src/utils/jwt.js';

describe('Phase 5: Products & Inventory Management', () => {
  const customerToken = generateAccessToken({
    id: 'cust-uuid-1',
    email: 'cust@test.com',
    role: 'CUSTOMER',
  });

  const sellerToken = generateAccessToken({
    id: 'seller-uuid-1',
    email: 'seller@test.com',
    role: 'SELLER',
  });

  it('should allow public access to list products', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should forbid customers from creating products (Seller only)', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        storeId: '3c852431-7e8e-4a8b-a25e-315f6064f9f6',
        categoryId: '8a24584a-5fe2-4cb6-ba09-514ffc1815fa',
        name: 'Organic Milk',
        price: 60,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should reject product creation when discountedPrice is higher than price', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        storeId: '3c852431-7e8e-4a8b-a25e-315f6064f9f6',
        categoryId: '8a24584a-5fe2-4cb6-ba09-514ffc1815fa',
        name: 'Organic Milk',
        price: 50,
        discountedPrice: 70, // Invalid: discounted price cannot be greater than regular price
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('should reject inventory update with negative absolute quantity', async () => {
    const res = await request(app)
      .patch('/api/v1/products/3c852431-7e8e-4a8b-a25e-315f6064f9f6/inventory')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        quantity: -10, // Invalid: cannot be negative
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('should forbid customers from viewing low stock reports', async () => {
    const res = await request(app)
      .get('/api/v1/inventory/low-stock')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
  });
});

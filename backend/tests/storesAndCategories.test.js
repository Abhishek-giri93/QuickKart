import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock Prisma for unit and integration testing without database dependency
vi.mock('../src/config/prisma.js', () => {
  return {
    default: {
      category: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'cat-uuid-1',
            name: 'Groceries',
            slug: 'groceries',
            children: [],
          },
        ]),
      },
      store: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'store-uuid-1',
            name: 'Quick Mart',
            description: 'Local essentials',
            latitude: 28.6139,
            longitude: 77.2090,
            isOpen: true,
            avgRating: 4.5,
            totalRatings: 120,
          },
        ]),
      },
      user: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === 'customer-uuid-1') {
            return { id: 'customer-uuid-1', role: 'CUSTOMER', isActive: true };
          }
          if (where.id === 'seller-uuid-1') {
            return { id: 'seller-uuid-1', role: 'SELLER', isActive: true };
          }
          if (where.id === 'admin-uuid-1') {
            return { id: 'admin-uuid-1', role: 'ADMIN', isActive: true };
          }
          return null;
        }),
      },
    },
  };
});

import app from '../src/app.js';
import { generateAccessToken } from '../src/utils/jwt.js';

describe('Phase 4: Stores & Categories Routes & Protection', () => {
  const customerToken = generateAccessToken({
    id: 'customer-uuid-1',
    email: 'cust@test.com',
    role: 'CUSTOMER',
  });

  const sellerToken = generateAccessToken({
    id: 'seller-uuid-1',
    email: 'seller@test.com',
    role: 'SELLER',
  });

  it('should allow public access to list categories', async () => {
    const res = await request(app).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should forbid customers from creating categories (Admin only)', async () => {
    const res = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ name: 'Stationery' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow public access to discover stores with geolocation', async () => {
    const res = await request(app)
      .get('/api/v1/stores')
      .query({ latitude: 28.6139, longitude: 77.2090, radiusKm: 15 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should forbid customers from registering a store (Seller only)', async () => {
    const res = await request(app)
      .post('/api/v1/stores')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'My Store',
        phone: '9876543210',
        addressLine: '123 Market Road',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        latitude: 28.61,
        longitude: 77.20,
      });

    expect(res.status).toBe(403);
  });

  it('should reject invalid store registration data (missing coords, bad phone)', async () => {
    const res = await request(app)
      .post('/api/v1/stores')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        name: 'S',
        phone: '123',
        addressLine: 'Short',
        city: 'D',
        state: 'D',
        pincode: 'invalid',
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });
});

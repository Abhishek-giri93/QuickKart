import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock Prisma for unit tests so they don't depend on a live PostgreSQL database
vi.mock('../src/config/prisma.js', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === 'cust-uuid-1') {
            return {
              id: 'cust-uuid-1',
              email: 'customer@test.com',
              role: 'CUSTOMER',
              isActive: true,
            };
          }
          if (where.id === 'seller-uuid-1') {
            return {
              id: 'seller-uuid-1',
              email: 'seller@test.com',
              role: 'SELLER',
              isActive: true,
            };
          }
          return null;
        }),
      },
    },
  };
});

import app from '../src/app.js';
import { generateAccessToken } from '../src/utils/jwt.js';

describe('Phase 3: Profiles & Address Management RBAC & Validation', () => {
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

  it('should block unauthenticated access to customer profile', async () => {
    const res = await request(app).get('/api/v1/customers/profile');
    expect(res.status).toBe(401);
  });

  it('should block unauthenticated access to seller profile', async () => {
    const res = await request(app).get('/api/v1/sellers/profile');
    expect(res.status).toBe(401);
  });

  it('should block unauthenticated access to delivery partner profile', async () => {
    const res = await request(app).get('/api/v1/delivery-partners/profile');
    expect(res.status).toBe(401);
  });

  it('should reject invalid address payload (bad pincode, invalid label)', async () => {
    const res = await request(app)
      .post('/api/v1/customers/addresses')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        label: 'InvalidLabel',
        recipientName: 'Abhi',
        recipientPhone: '9876543210',
        addressLine1: 'Short',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '123', // Invalid PIN code
      });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('should reject invalid location coordinates for delivery partner (RBAC check)', async () => {
    const res = await request(app)
      .patch('/api/v1/delivery-partners/location')
      .set('Authorization', `Bearer ${sellerToken}`) // Wrong role: SELLER instead of DELIVERY_PARTNER
      .send({
        latitude: 195, // Out of range (> 90)
        longitude: 77.2,
      });

    // Role check fails before validation
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

const mocks = vi.hoisted(() => {
  const DP_USER_ID = '11111111-1111-4111-8111-111111111111';
  const CUSTOMER_USER_ID = '22222222-2222-4222-8222-222222222222';
  const ADMIN_USER_ID = '33333333-3333-4333-8333-333333333333';
  const DP_PROFILE_ID = '44444444-4444-4444-8444-444444444444';
  const DELIVERY_ID = '55555555-5555-4555-8555-555555555555';
  const ORDER_ID = '66666666-6666-4666-8666-666666666666';
  const STORE_ID = '77777777-7777-4777-8777-777777777777';

  let currentDeliveryStatus = 'ACCEPTED';

  const mockDeliveryPartner = {
    id: DP_PROFILE_ID,
    userId: DP_USER_ID,
    firstName: 'Ravi',
    lastName: 'Kumar',
    vehicleType: 'BIKE',
    vehicleNumber: 'KA-01-AB-1234',
    isOnline: true,
    isVerified: true,
    currentLat: 12.9716,
    currentLng: 77.5946,
    totalDeliveries: 42,
  };

  const mockDelivery = {
    id: DELIVERY_ID,
    orderId: ORDER_ID,
    deliveryPartnerId: DP_PROFILE_ID,
    status: 'ACCEPTED',
    otp: '4567',
    pickedUpAt: null,
    deliveredAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: {
      id: ORDER_ID,
      orderNumber: 'QK-2026-12345',
      storeId: STORE_ID,
      store: {
        id: STORE_ID,
        name: 'Fresh Mart',
        phone: '9876543210',
        addressLine: '123 MG Road',
        city: 'Bangalore',
        latitude: 12.9716,
        longitude: 77.5946,
      },
      address: {
        addressLine1: 'Flat 201, Tower B',
        city: 'Bangalore',
        pincode: '560001',
      },
      items: [
        { productName: 'Organic Honey', quantity: 2 },
      ],
    },
    deliveryPartner: {
      id: DP_PROFILE_ID,
      firstName: 'Ravi',
      lastName: 'Kumar',
      vehicleType: 'BIKE',
      vehicleNumber: 'KA-01-AB-1234',
    },
  };

  return {
    DP_USER_ID,
    CUSTOMER_USER_ID,
    ADMIN_USER_ID,
    DP_PROFILE_ID,
    DELIVERY_ID,
    ORDER_ID,
    STORE_ID,
    mockDeliveryPartner,
    mockDelivery,
    getCurrentStatus: () => currentDeliveryStatus,
    setCurrentStatus: (s) => { currentDeliveryStatus = s; },
  };
});

vi.mock('../src/config/prisma.js', () => {
  return {
    default: {
      user: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.DP_USER_ID) {
            return { id: mocks.DP_USER_ID, role: 'DELIVERY_PARTNER', isActive: true };
          }
          if (where.id === mocks.CUSTOMER_USER_ID) {
            return { id: mocks.CUSTOMER_USER_ID, role: 'CUSTOMER', isActive: true };
          }
          if (where.id === mocks.ADMIN_USER_ID) {
            return { id: mocks.ADMIN_USER_ID, role: 'ADMIN', isActive: true };
          }
          return null;
        }),
      },
      deliveryPartner: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.userId === mocks.DP_USER_ID) return mocks.mockDeliveryPartner;
          return null;
        }),
        findMany: vi.fn().mockResolvedValue([mocks.mockDeliveryPartner]),
        update: vi.fn().mockImplementation(async ({ data }) => {
          return { ...mocks.mockDeliveryPartner, ...data };
        }),
      },
      delivery: {
        findUnique: vi.fn().mockImplementation(async ({ where }) => {
          if (where.id === mocks.DELIVERY_ID) {
            return { ...mocks.mockDelivery, status: mocks.getCurrentStatus() };
          }
          return null;
        }),
        findMany: vi.fn().mockResolvedValue([mocks.mockDelivery]),
        count: vi.fn().mockResolvedValue(1),
        update: vi.fn().mockImplementation(async ({ data }) => {
          if (data.status) mocks.setCurrentStatus(data.status);
          return { ...mocks.mockDelivery, ...data, status: mocks.getCurrentStatus() };
        }),
      },
      order: {
        update: vi.fn().mockResolvedValue({}),
      },
      payment: {
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
      $transaction: vi.fn().mockImplementation(async (callback) => {
        return callback({
          delivery: {
            update: vi.fn().mockImplementation(async ({ data }) => {
              if (data.status) mocks.setCurrentStatus(data.status);
              return { ...mocks.mockDelivery, ...data, status: mocks.getCurrentStatus() };
            }),
          },
          order: {
            update: vi.fn().mockResolvedValue({}),
          },
          payment: {
            updateMany: vi.fn().mockResolvedValue({ count: 1 }),
          },
          deliveryPartner: {
            update: vi.fn().mockResolvedValue({ totalDeliveries: 43 }),
          },
        });
      }),
    },
  };
});

import app from '../src/app.js';
import { generateAccessToken } from '../src/utils/jwt.js';

describe('Phase 8: Deliveries Module — Assignment, Pickup & OTP Verification', () => {
  const dpToken = generateAccessToken({
    id: mocks.DP_USER_ID,
    email: 'ravi@test.com',
    role: 'DELIVERY_PARTNER',
  });

  const customerToken = generateAccessToken({
    id: mocks.CUSTOMER_USER_ID,
    email: 'customer@test.com',
    role: 'CUSTOMER',
  });

  const adminToken = generateAccessToken({
    id: mocks.ADMIN_USER_ID,
    email: 'admin@test.com',
    role: 'ADMIN',
  });

  it('should block unauthenticated access to deliveries', async () => {
    const res = await request(app).get('/api/v1/deliveries');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should forbid customers from accessing delivery partner endpoints', async () => {
    const res = await request(app)
      .get('/api/v1/deliveries')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow delivery partner to list their assigned deliveries', async () => {
    const res = await request(app)
      .get('/api/v1/deliveries')
      .set('Authorization', `Bearer ${dpToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toBeDefined();
  });

  it('should allow delivery partner to view delivery details by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/deliveries/${mocks.DELIVERY_ID}`)
      .set('Authorization', `Bearer ${dpToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mocks.DELIVERY_ID);
  });

  it('should allow delivery partner to confirm pickup (ACCEPTED -> PICKED_UP)', async () => {
    mocks.setCurrentStatus('ACCEPTED');
    const res = await request(app)
      .patch(`/api/v1/deliveries/${mocks.DELIVERY_ID}/pickup`)
      .set('Authorization', `Bearer ${dpToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('PICKED_UP');
  });

  it('should reject pickup confirmation when not in ACCEPTED status', async () => {
    mocks.setCurrentStatus('PICKED_UP');
    const res = await request(app)
      .patch(`/api/v1/deliveries/${mocks.DELIVERY_ID}/pickup`)
      .set('Authorization', `Bearer ${dpToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject delivery with invalid OTP', async () => {
    mocks.setCurrentStatus('PICKED_UP');
    const res = await request(app)
      .patch(`/api/v1/deliveries/${mocks.DELIVERY_ID}/deliver`)
      .set('Authorization', `Bearer ${dpToken}`)
      .send({ otp: '0000' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid OTP');
  });

  it('should complete delivery with correct OTP (PICKED_UP -> DELIVERED)', async () => {
    mocks.setCurrentStatus('PICKED_UP');
    const res = await request(app)
      .patch(`/api/v1/deliveries/${mocks.DELIVERY_ID}/deliver`)
      .set('Authorization', `Bearer ${dpToken}`)
      .send({ otp: '4567' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('DELIVERED');
  });

  it('should allow delivery partner to update GPS location', async () => {
    const res = await request(app)
      .patch('/api/v1/deliveries/location')
      .set('Authorization', `Bearer ${dpToken}`)
      .send({ latitude: 12.9800, longitude: 77.6000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.currentLat).toBeDefined();
  });

  it('should reject location update with invalid coordinates', async () => {
    const res = await request(app)
      .patch('/api/v1/deliveries/location')
      .set('Authorization', `Bearer ${dpToken}`)
      .send({ latitude: 999, longitude: -200 });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('should forbid customers from accessing admin pending deliveries', async () => {
    const res = await request(app)
      .get('/api/v1/deliveries/pending')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow admin to view pending deliveries', async () => {
    const res = await request(app)
      .get('/api/v1/deliveries/pending')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});


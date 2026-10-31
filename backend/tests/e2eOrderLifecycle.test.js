/**
 * QuickKart — End-to-End Order Lifecycle Integration Tests (Phase 13)
 *
 * Verifies complete cross-module integration across the 4 key actors:
 * 1. Customer: Cart → Checkout → Order placement → Rate & Review
 * 2. Seller: Order Acceptance → Preparing → Ready for dispatch
 * 3. Delivery Partner: Assignment → Pickup → OTP Verification & Delivery
 * 4. Admin: Platform monitoring, Support Ticket resolution & GMV metrics
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// ─────────────────────────────────────────────────────────────────────────────
// Hoisted mock state and test fixtures
// ─────────────────────────────────────────────────────────────────────────────
const mocks = vi.hoisted(() => {
  const CUSTOMER_USER_ID    = '11111111-1111-4111-8111-111111111111';
  const SELLER_USER_ID      = '22222222-2222-4222-8222-222222222222';
  const DP_USER_ID          = '33333333-3333-4333-8333-333333333333';
  const ADMIN_USER_ID       = '44444444-4444-4444-8444-444444444444';

  const CUSTOMER_PROFILE_ID = '55555555-5555-4555-8555-555555555555';
  const SELLER_PROFILE_ID   = '66666666-6666-4666-8666-666666666666';
  const DP_PROFILE_ID       = '77777777-7777-4777-8777-777777777777';

  const STORE_ID            = '88888888-8888-4888-8888-888888888888';
  const ADDRESS_ID          = '99999999-9999-4999-8999-999999999999';
  const PRODUCT_ID          = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const ORDER_ID            = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const DELIVERY_ID         = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
  const CART_ID             = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
  const TICKET_ID           = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';

  // Users
  const mockCustomerUser = {
    id: CUSTOMER_USER_ID,
    email: 'customer@quickkart.test',
    phone: '9876543210',
    role: 'CUSTOMER',
    isActive: true,
    isVerified: true,
    customerProfile: { id: CUSTOMER_PROFILE_ID, userId: CUSTOMER_USER_ID, firstName: 'Aarav', lastName: 'Sharma' },
  };

  const mockSellerUser = {
    id: SELLER_USER_ID,
    email: 'seller@quickkart.test',
    phone: '9876543211',
    role: 'SELLER',
    isActive: true,
    isVerified: true,
    sellerProfile: {
      id: SELLER_PROFILE_ID,
      userId: SELLER_USER_ID,
      businessName: 'Sharma Superstore',
      stores: [{ id: STORE_ID }],
    },
  };

  const mockDpUser = {
    id: DP_USER_ID,
    email: 'rider@quickkart.test',
    phone: '9876543212',
    role: 'DELIVERY_PARTNER',
    isActive: true,
    isVerified: true,
    deliveryPartner: {
      id: DP_PROFILE_ID,
      userId: DP_USER_ID,
      firstName: 'Vikram',
      lastName: 'Singh',
      isOnline: true,
      isVerified: true,
    },
  };

  const mockAdminUser = {
    id: ADMIN_USER_ID,
    email: 'admin@quickkart.test',
    phone: '9876543213',
    role: 'ADMIN',
    isActive: true,
    isVerified: true,
  };

  // Store
  const mockStore = {
    id: STORE_ID,
    sellerProfileId: SELLER_PROFILE_ID,
    name: 'Sharma Superstore',
    status: 'ACTIVE',
    isOpen: true,
    commissionRate: 10,
    avgRating: 4.8,
    totalRatings: 50,
  };

  // Product
  const mockProduct = {
    id: PRODUCT_ID,
    storeId: STORE_ID,
    name: 'Fresh Alphonso Mangoes 1kg',
    price: 450,
    discountedPrice: 400,
    isAvailable: true,
    isActive: true,
    store: mockStore,
    inventory: { quantity: 50, lowStockAlert: 5 },
  };

  // Cart
  const mockCart = {
    id: CART_ID,
    customerProfileId: CUSTOMER_PROFILE_ID,
    storeId: STORE_ID,
    items: [
      {
        id: 'cart-item-1',
        productId: PRODUCT_ID,
        quantity: 2,
        price: 400,
        product: mockProduct,
      },
    ],
  };

  // Order
  const mockOrder = {
    id: ORDER_ID,
    orderNumber: 'QK-E2E-99001',
    customerProfileId: CUSTOMER_PROFILE_ID,
    storeId: STORE_ID,
    addressId: ADDRESS_ID,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    paymentMethod: 'COD',
    itemsPrice: 800,
    deliveryFee: 40,
    taxPrice: 40,
    totalAmount: 880,
    items: [
      {
        id: 'order-item-1',
        productId: PRODUCT_ID,
        productName: 'Fresh Alphonso Mangoes 1kg',
        quantity: 2,
        price: 400,
      },
    ],
    delivery: {
      id: DELIVERY_ID,
      deliveryPartnerId: DP_PROFILE_ID,
      status: 'ACCEPTED',
      otp: '7890',
    },
    store: mockStore,
    customerProfile: {
      id: CUSTOMER_PROFILE_ID,
      userId: CUSTOMER_USER_ID,
      firstName: 'Aarav',
      lastName: 'Sharma',
      user: { phone: '9876543210' },
    },
  };

  // Delivery
  const mockDelivery = {
    id: DELIVERY_ID,
    orderId: ORDER_ID,
    deliveryPartnerId: DP_PROFILE_ID,
    status: 'ACCEPTED',
    otp: '7890',
    pickedUpAt: null,
    deliveredAt: null,
    order: mockOrder,
    deliveryPartner: {
      id: DP_PROFILE_ID,
      userId: DP_USER_ID,
      firstName: 'Vikram',
      lastName: 'Singh',
    },
  };

  return {
    CUSTOMER_USER_ID,
    SELLER_USER_ID,
    DP_USER_ID,
    ADMIN_USER_ID,
    CUSTOMER_PROFILE_ID,
    SELLER_PROFILE_ID,
    DP_PROFILE_ID,
    STORE_ID,
    ADDRESS_ID,
    PRODUCT_ID,
    ORDER_ID,
    DELIVERY_ID,
    CART_ID,
    TICKET_ID,
    mockCustomerUser,
    mockSellerUser,
    mockDpUser,
    mockAdminUser,
    mockStore,
    mockProduct,
    mockCart,
    mockOrder,
    mockDelivery,
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Socket.IO mock
// ─────────────────────────────────────────────────────────────────────────────
vi.mock('../src/socket/socket.js', () => ({
  emitToUser: vi.fn(),
  emitToOrder: vi.fn(),
  getIO: vi.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Prisma mock
// ─────────────────────────────────────────────────────────────────────────────
vi.mock('../src/config/prisma.js', () => {
  const prisma = {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
    },
    customerProfile: {
      findUnique: vi.fn(),
    },
    sellerProfile: {
      findUnique: vi.fn(),
    },
    deliveryPartner: {
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
    product: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    address: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
    cart: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    cartItem: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    inventory: {
      update: vi.fn(),
    },
    payment: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    order: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
    },
    delivery: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
      count: vi.fn(),
    },
    review: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      aggregate: vi.fn(),
      count: vi.fn(),
    },
    supportTicket: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    coupon: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((cb) => (typeof cb === 'function' ? cb(prisma) : Promise.all(cb))),
  };
  return { default: prisma };
});

import app from '../src/app.js';
import prisma from '../src/config/prisma.js';
import { generateAccessToken } from '../src/utils/jwt.js';

// JWT Helper
const createToken = (id, role) => generateAccessToken({ id, role });

beforeEach(() => {
  vi.clearAllMocks();

  // Route auth user lookup
  prisma.user.findUnique.mockImplementation(({ where }) => {
    if (where.id === mocks.CUSTOMER_USER_ID) return Promise.resolve(mocks.mockCustomerUser);
    if (where.id === mocks.SELLER_USER_ID) return Promise.resolve(mocks.mockSellerUser);
    if (where.id === mocks.DP_USER_ID) return Promise.resolve(mocks.mockDpUser);
    if (where.id === mocks.ADMIN_USER_ID) return Promise.resolve(mocks.mockAdminUser);
    return Promise.resolve(null);
  });

  // Profiles lookup
  prisma.customerProfile.findUnique.mockImplementation(({ where }) => {
    if (where.userId === mocks.CUSTOMER_USER_ID || where.id === mocks.CUSTOMER_PROFILE_ID) {
      return Promise.resolve(mocks.mockCustomerUser.customerProfile);
    }
    return Promise.resolve(null);
  });

  prisma.sellerProfile.findUnique.mockImplementation(({ where }) => {
    if (where.userId === mocks.SELLER_USER_ID || where.id === mocks.SELLER_PROFILE_ID) {
      return Promise.resolve(mocks.mockSellerUser.sellerProfile);
    }
    return Promise.resolve(null);
  });

  prisma.deliveryPartner.findUnique.mockImplementation(({ where }) => {
    if (where.userId === mocks.DP_USER_ID || where.id === mocks.DP_PROFILE_ID) {
      return Promise.resolve(mocks.mockDpUser.deliveryPartner);
    }
    return Promise.resolve(null);
  });

  // Store lookup default active
  prisma.store.findUnique.mockResolvedValue(mocks.mockStore);
});

// ═════════════════════════════════════════════════════════════════════════════
// Phase 13: End-to-End Cross-Module Integration Tests
// ═════════════════════════════════════════════════════════════════════════════
describe('Phase 13: Full Platform End-to-End Integration Tests', () => {

  describe('Complete Order Lifecycle Journey (Customer → Seller → Partner → Admin)', () => {
    
    it('Step 1: Customer inspects cart items and calculates totals', async () => {
      prisma.cart.findUnique.mockResolvedValue(mocks.mockCart);

      const res = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${createToken(mocks.CUSTOMER_USER_ID, 'CUSTOMER')}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.itemCount).toBe(2);
      expect(res.body.data.summary.subtotal).toBe(800);
    });

    it('Step 2: Customer places COD order successfully', async () => {
      prisma.address.findFirst.mockResolvedValue({
        id: mocks.ADDRESS_ID,
        customerProfileId: mocks.CUSTOMER_PROFILE_ID,
      });
      prisma.cart.findUnique.mockResolvedValue(mocks.mockCart);
      prisma.order.create.mockResolvedValue(mocks.mockOrder);
      prisma.cart.update.mockResolvedValue({ ...mocks.mockCart, items: [] });

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${createToken(mocks.CUSTOMER_USER_ID, 'CUSTOMER')}`)
        .send({
          addressId: mocks.ADDRESS_ID,
          paymentMethod: 'COD',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderNumber).toBe('QK-E2E-99001');
      expect(res.body.data.status).toBe('PENDING');
    });

    it('Step 3: Seller accepts order (PENDING → ACCEPTED)', async () => {
      prisma.order.findUnique.mockResolvedValue(mocks.mockOrder);
      const acceptedOrder = { ...mocks.mockOrder, status: 'ACCEPTED' };
      prisma.order.update.mockResolvedValue(acceptedOrder);

      const res = await request(app)
        .patch(`/api/v1/orders/${mocks.ORDER_ID}/accept`)
        .set('Authorization', `Bearer ${createToken(mocks.SELLER_USER_ID, 'SELLER')}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('ACCEPTED');
    });

    it('Step 4: Seller marks order as READY for pickup (ACCEPTED → PREPARING → READY)', async () => {
      const preparingOrder = { ...mocks.mockOrder, status: 'PREPARING' };
      prisma.order.findUnique.mockResolvedValue(preparingOrder);
      const readyOrder = { ...mocks.mockOrder, status: 'READY' };
      prisma.order.update.mockResolvedValue(readyOrder);

      const res = await request(app)
        .patch(`/api/v1/orders/${mocks.ORDER_ID}/ready`)
        .set('Authorization', `Bearer ${createToken(mocks.SELLER_USER_ID, 'SELLER')}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('READY');
    });

    it('Step 5: Delivery partner confirms pickup (ACCEPTED → PICKED_UP)', async () => {
      prisma.delivery.findUnique.mockResolvedValue(mocks.mockDelivery);
      const pickedUpDelivery = {
        ...mocks.mockDelivery,
        status: 'PICKED_UP',
        pickedUpAt: new Date(),
      };
      prisma.delivery.update.mockResolvedValue(pickedUpDelivery);

      const res = await request(app)
        .patch(`/api/v1/deliveries/${mocks.DELIVERY_ID}/pickup`)
        .set('Authorization', `Bearer ${createToken(mocks.DP_USER_ID, 'DELIVERY_PARTNER')}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('PICKED_UP');
    });

    it('Step 6: Delivery partner delivers order with verified OTP (PICKED_UP → DELIVERED)', async () => {
      const pickedUpDelivery = {
        ...mocks.mockDelivery,
        status: 'PICKED_UP',
        otp: '7890',
      };
      prisma.delivery.findUnique.mockResolvedValue(pickedUpDelivery);
      const deliveredDelivery = {
        ...mocks.mockDelivery,
        status: 'DELIVERED',
        deliveredAt: new Date(),
      };
      prisma.delivery.update.mockResolvedValue(deliveredDelivery);
      prisma.order.update.mockResolvedValue({
        ...mocks.mockOrder,
        status: 'DELIVERED',
      });
      prisma.deliveryPartner.update.mockResolvedValue({
        id: mocks.DP_PROFILE_ID,
        totalDeliveries: 43,
      });

      const res = await request(app)
        .patch(`/api/v1/deliveries/${mocks.DELIVERY_ID}/deliver`)
        .set('Authorization', `Bearer ${createToken(mocks.DP_USER_ID, 'DELIVERY_PARTNER')}`)
        .send({ otp: '7890' });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('verified');
      expect(res.body.data.status).toBe('DELIVERED');
    });

    it('Step 7: Customer submits dual rating & review for delivered order', async () => {
      const deliveredOrder = {
        ...mocks.mockOrder,
        status: 'DELIVERED',
        delivery: { deliveryPartnerId: mocks.DP_PROFILE_ID },
      };
      prisma.order.findUnique.mockResolvedValue(deliveredOrder);
      prisma.review.findUnique.mockResolvedValue(null); // No existing review
      prisma.review.create.mockResolvedValue({
        id: 'review-uuid-1',
        orderId: mocks.ORDER_ID,
        customerProfileId: mocks.CUSTOMER_PROFILE_ID,
        storeRating: 5,
        storeComment: 'Excellent mangoes!',
        deliveryRating: 5,
        deliveryComment: 'Delivered quickly and safe.',
      });
      prisma.review.aggregate.mockResolvedValue({
        _avg: { storeRating: 4.9 },
        _count: { id: 51 },
      });
      prisma.store.update.mockResolvedValue(mocks.mockStore);

      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${createToken(mocks.CUSTOMER_USER_ID, 'CUSTOMER')}`)
        .send({
          orderId: mocks.ORDER_ID,
          storeRating: 5,
          storeComment: 'Excellent mangoes!',
          deliveryRating: 5,
          deliveryComment: 'Delivered quickly and safe.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.storeRating).toBe(5);
    });

    it('Step 8: Admin checks analytics overview and observes platform stats', async () => {
      prisma.order.aggregate.mockResolvedValue({
        _sum: { totalAmount: 880 },
        _count: { id: 1 },
      });
      prisma.order.count
        .mockResolvedValueOnce(1)  // total
        .mockResolvedValueOnce(0)  // pending
        .mockResolvedValueOnce(0); // cancelled
      prisma.user.count
        .mockResolvedValueOnce(1)  // customers
        .mockResolvedValueOnce(1)  // sellers
        .mockResolvedValueOnce(1); // partners
      prisma.store.count.mockResolvedValue(1);
      prisma.deliveryPartner.count.mockResolvedValue(1);

      const res = await request(app)
        .get('/api/v1/admin/analytics/overview')
        .set('Authorization', `Bearer ${createToken(mocks.ADMIN_USER_ID, 'ADMIN')}`);

      expect(res.status).toBe(200);
      expect(res.body.data.financials.grossMerchandiseValue).toBe(880);
      expect(res.body.data.financials.estimatedPlatformCommission).toBe(88);
      expect(res.body.data.orders.delivered).toBe(1);
    });
  });

  describe('Edge Cases & State Machine Invariant Protections', () => {
    it('Blocks delivery verification when OTP is incorrect', async () => {
      const pickedUpDelivery = {
        ...mocks.mockDelivery,
        status: 'PICKED_UP',
        otp: '7890',
      };
      prisma.delivery.findUnique.mockResolvedValue(pickedUpDelivery);

      const res = await request(app)
        .patch(`/api/v1/deliveries/${mocks.DELIVERY_ID}/deliver`)
        .set('Authorization', `Bearer ${createToken(mocks.DP_USER_ID, 'DELIVERY_PARTNER')}`)
        .send({ otp: '0000' }); // Wrong OTP

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid OTP');
    });

    it('Forbids customer from cancelling an order once in READY status', async () => {
      const readyOrder = { ...mocks.mockOrder, status: 'READY' };
      prisma.order.findUnique.mockResolvedValue(readyOrder);

      const res = await request(app)
        .patch(`/api/v1/orders/${mocks.ORDER_ID}/cancel`)
        .set('Authorization', `Bearer ${createToken(mocks.CUSTOMER_USER_ID, 'CUSTOMER')}`)
        .send({ cancellationReason: 'Changed my mind' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Order cannot be cancelled');
    });

    it('Rejects reviews for orders that are not DELIVERED', async () => {
      const preparingOrder = { ...mocks.mockOrder, status: 'PREPARING' };
      prisma.order.findUnique.mockResolvedValue(preparingOrder);

      const res = await request(app)
        .post('/api/v1/reviews')
        .set('Authorization', `Bearer ${createToken(mocks.CUSTOMER_USER_ID, 'CUSTOMER')}`)
        .send({
          orderId: mocks.ORDER_ID,
          storeRating: 4,
          deliveryRating: 4,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('DELIVERED');
    });

    it('Customer creates a support ticket and admin resolves it', async () => {
      // Customer creates ticket
      const mockCreatedTicket = {
        id: mocks.TICKET_ID,
        userId: mocks.CUSTOMER_USER_ID,
        orderId: mocks.ORDER_ID,
        subject: 'Packaging issue',
        description: 'One box was lightly dented.',
        status: 'OPEN',
      };
      prisma.supportTicket.create.mockResolvedValue(mockCreatedTicket);

      const createRes = await request(app)
        .post('/api/v1/support/tickets')
        .set('Authorization', `Bearer ${createToken(mocks.CUSTOMER_USER_ID, 'CUSTOMER')}`)
        .send({
          orderId: mocks.ORDER_ID,
          subject: 'Packaging issue',
          description: 'One box was lightly dented.',
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.data.status).toBe('OPEN');

      // Admin resolves ticket
      prisma.supportTicket.findUnique.mockResolvedValue(mockCreatedTicket);
      prisma.supportTicket.update.mockResolvedValue({
        ...mockCreatedTicket,
        status: 'RESOLVED',
        resolution: 'Credit refund applied to user wallet.',
      });

      const resolveRes = await request(app)
        .patch(`/api/v1/support/tickets/${mocks.TICKET_ID}/status`)
        .set('Authorization', `Bearer ${createToken(mocks.ADMIN_USER_ID, 'ADMIN')}`)
        .send({
          status: 'RESOLVED',
          resolution: 'Credit refund applied to user wallet.',
        });

      expect(resolveRes.status).toBe(200);
      expect(resolveRes.body.data.status).toBe('RESOLVED');
    });
  });
});

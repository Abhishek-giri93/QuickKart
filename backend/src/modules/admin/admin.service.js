/**
 * QuickKart — Admin Service
 *
 * Implements administrative dashboard analytics, platform controls,
 * store/partner verification, user moderation, and coupon management.
 */

import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { ORDER_STATUS, USER_ROLES } from '../../utils/constants.js';

/**
 * Platform analytics and health metrics overview
 */
export const getPlatformOverview = async () => {
  const [
    deliveredOrdersStats,
    totalOrdersCount,
    pendingOrdersCount,
    cancelledOrdersCount,
    customerCount,
    sellerCount,
    partnerCount,
    activeStoresCount,
    onlinePartnersCount,
  ] = await Promise.all([
    // GMV from completed deliveries
    prisma.order.aggregate({
      where: { status: ORDER_STATUS.DELIVERED },
      _sum: { totalAmount: true },
      _count: { id: true },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: ORDER_STATUS.PENDING } }),
    prisma.order.count({ where: { status: ORDER_STATUS.CANCELLED } }),
    prisma.user.count({ where: { role: USER_ROLES.CUSTOMER } }),
    prisma.user.count({ where: { role: USER_ROLES.SELLER } }),
    prisma.user.count({ where: { role: USER_ROLES.DELIVERY_PARTNER } }),
    prisma.store.count({ where: { status: 'ACTIVE' } }),
    prisma.deliveryPartner.count({ where: { isOnline: true, isVerified: true } }),
  ]);

  const gmv = Number((deliveredOrdersStats._sum.totalAmount || 0).toFixed(2));
  const estimatedCommission = Number((gmv * 0.1).toFixed(2)); // Platform commission estimate (10%)

  return {
    financials: {
      grossMerchandiseValue: gmv,
      estimatedPlatformCommission: estimatedCommission,
      completedOrdersCount: deliveredOrdersStats._count.id || 0,
    },
    orders: {
      total: totalOrdersCount,
      pending: pendingOrdersCount,
      delivered: deliveredOrdersStats._count.id || 0,
      cancelled: cancelledOrdersCount,
    },
    users: {
      customers: customerCount,
      sellers: sellerCount,
      deliveryPartners: partnerCount,
      total: customerCount + sellerCount + partnerCount,
    },
    operations: {
      activeStores: activeStoresCount,
      onlineVerifiedPartners: onlinePartnersCount,
    },
  };
};

/**
 * List platform stores with filter and pagination
 */
export const listStores = async ({ status, page = 1, limit = 20 }) => {
  const where = {
    ...(status && { status }),
  };

  const skip = (page - 1) * limit;

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sellerProfile: {
          select: {
            businessName: true,
            isKycVerified: true,
            user: { select: { email: true, phone: true } },
          },
        },
      },
    }),
    prisma.store.count({ where }),
  ]);

  return {
    stores,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Approve, suspend, or reject a store
 */
export const updateStoreStatus = async (storeId, status) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    throw new AppError('Store not found', 404);
  }

  return prisma.store.update({
    where: { id: storeId },
    data: { status },
  });
};

/**
 * Update store commission rate
 */
export const updateStoreCommission = async (storeId, commissionRate) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    throw new AppError('Store not found', 404);
  }

  return prisma.store.update({
    where: { id: storeId },
    data: { commissionRate },
  });
};

/**
 * List delivery partners with filter and pagination
 */
export const listDeliveryPartners = async ({ isVerified, page = 1, limit = 20 }) => {
  const where = {
    ...(isVerified !== undefined && { isVerified }),
  };

  const skip = (page - 1) * limit;

  const [partners, total] = await Promise.all([
    prisma.deliveryPartner.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, phone: true, isActive: true } },
      },
    }),
    prisma.deliveryPartner.count({ where }),
  ]);

  return {
    partners,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Verify or revoke verification for a delivery partner
 */
export const verifyDeliveryPartner = async (partnerId, isVerified) => {
  const partner = await prisma.deliveryPartner.findUnique({
    where: { id: partnerId },
  });

  if (!partner) {
    throw new AppError('Delivery partner not found', 404);
  }

  return prisma.deliveryPartner.update({
    where: { id: partnerId },
    data: { isVerified },
  });
};

/**
 * List users with filter and pagination
 */
export const listUsers = async ({ role, isActive, page = 1, limit = 20 }) => {
  const where = {
    ...(role && { role }),
    ...(isActive !== undefined && { isActive }),
  };

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Ban or unban a user
 */
export const updateUserStatus = async (userId, isActive) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
};

/**
 * Create a promotional coupon
 */
export const createCoupon = async (data) => {
  const existingCoupon = await prisma.coupon.findUnique({
    where: { code: data.code },
  });

  if (existingCoupon) {
    throw new AppError(`Coupon code "${data.code}" already exists`, 400);
  }

  return prisma.coupon.create({
    data: {
      code: data.code,
      description: data.description || null,
      discountPercent: data.discountPercent ?? null,
      discountAmount: data.discountAmount ?? null,
      minOrderAmount: data.minOrderAmount ?? null,
      maxDiscount: data.maxDiscount ?? null,
      usageLimit: data.usageLimit ?? null,
      perUserLimit: data.perUserLimit || 1,
      validFrom: new Date(data.validFrom),
      validUntil: new Date(data.validUntil),
      isActive: true,
    },
  });
};

/**
 * List platform coupons with pagination
 */
export const listCoupons = async ({ isActive, page = 1, limit = 20 }) => {
  const where = {
    ...(isActive !== undefined && { isActive }),
  };

  const skip = (page - 1) * limit;

  const [coupons, total] = await Promise.all([
    prisma.coupon.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.coupon.count({ where }),
  ]);

  return {
    coupons,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update an existing coupon
 */
export const updateCoupon = async (couponId, data) => {
  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!coupon) {
    throw new AppError('Coupon not found', 404);
  }

  return prisma.coupon.update({
    where: { id: couponId },
    data: {
      ...(data.description !== undefined && { description: data.description }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit }),
      ...(data.validUntil && { validUntil: new Date(data.validUntil) }),
    },
  });
};


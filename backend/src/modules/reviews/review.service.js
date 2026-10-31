/**
 * QuickKart — Review Service
 *
 * Implements post-delivery customer reviews & dynamic rating calculation
 * for Stores and Delivery Partners.
 */

import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { ORDER_STATUS } from '../../utils/constants.js';

/**
 * Submit a review for a delivered order
 */
export const createReview = async (
  userId,
  { orderId, storeRating, storeComment, deliveryRating, deliveryComment }
) => {
  // 1. Fetch customer profile
  const customer = await prisma.customerProfile.findUnique({
    where: { userId },
  });

  if (!customer) {
    throw new AppError('Customer profile not found', 404);
  }

  // 2. Fetch order with store and delivery details
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      delivery: true,
      store: true,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.customerProfileId !== customer.id) {
    throw new AppError('Access forbidden: you do not own this order', 403);
  }

  if (order.status !== ORDER_STATUS.DELIVERED) {
    throw new AppError('Reviews can only be submitted for completed (DELIVERED) orders', 400);
  }

  // 3. Check for existing review (unique constraint: [orderId, customerProfileId])
  const existingReview = await prisma.review.findUnique({
    where: {
      orderId_customerProfileId: {
        orderId,
        customerProfileId: customer.id,
      },
    },
  });

  if (existingReview) {
    throw new AppError('You have already submitted a review for this order', 400);
  }

  // 4. Atomic review creation & dynamic average rating recalculation
  const review = await prisma.$transaction(async (tx) => {
    // 4a. Create review record
    const created = await tx.review.create({
      data: {
        orderId,
        customerProfileId: customer.id,
        storeId: order.storeId,
        deliveryPartnerId: order.delivery?.deliveryPartnerId || null,
        storeRating: storeRating ?? null,
        storeComment: storeComment || null,
        deliveryRating: deliveryRating ?? null,
        deliveryComment: deliveryComment || null,
      },
      include: {
        store: { select: { id: true, name: true } },
        deliveryPartner: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    // 4b. Recalculate Store Rating if provided
    if (storeRating != null && order.storeId) {
      const storeStats = await tx.review.aggregate({
        where: {
          storeId: order.storeId,
          storeRating: { not: null },
        },
        _avg: { storeRating: true },
        _count: { storeRating: true },
      });

      const avgStoreRating = Number((storeStats._avg.storeRating || 0).toFixed(2));
      const totalStoreRatings = storeStats._count.storeRating || 0;

      await tx.store.update({
        where: { id: order.storeId },
        data: {
          avgRating: avgStoreRating,
          totalRatings: totalStoreRatings,
        },
      });
    }

    // 4c. Recalculate Delivery Partner Rating if provided
    if (deliveryRating != null && order.delivery?.deliveryPartnerId) {
      const partnerStats = await tx.review.aggregate({
        where: {
          deliveryPartnerId: order.delivery.deliveryPartnerId,
          deliveryRating: { not: null },
        },
        _avg: { deliveryRating: true },
        _count: { deliveryRating: true },
      });

      const avgPartnerRating = Number((partnerStats._avg.deliveryRating || 0).toFixed(2));
      const totalPartnerRatings = partnerStats._count.deliveryRating || 0;

      await tx.deliveryPartner.update({
        where: { id: order.delivery.deliveryPartnerId },
        data: {
          avgRating: avgPartnerRating,
          totalRatings: totalPartnerRatings,
        },
      });
    }

    return created;
  });

  return review;
};

/**
 * Get public reviews for a store
 */
export const getStoreReviews = async (storeId, { page = 1, limit = 20 }) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) {
    throw new AppError('Store not found', 404);
  }

  const where = {
    storeId,
    storeRating: { not: null },
  };

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        storeRating: true,
        storeComment: true,
        createdAt: true,
        customerProfile: {
          select: {
            firstName: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get reviews for a delivery partner
 */
export const getDeliveryPartnerReviews = async (partnerId, { page = 1, limit = 20 }) => {
  const partner = await prisma.deliveryPartner.findUnique({
    where: { id: partnerId },
  });

  if (!partner) {
    throw new AppError('Delivery partner not found', 404);
  }

  const where = {
    deliveryPartnerId: partnerId,
    deliveryRating: { not: null },
  };

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        deliveryRating: true,
        deliveryComment: true,
        createdAt: true,
        customerProfile: {
          select: {
            firstName: true,
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get review for a specific order
 */
export const getOrderReview = async (orderId) => {
  const review = await prisma.review.findFirst({
    where: { orderId },
    include: {
      store: { select: { id: true, name: true } },
      deliveryPartner: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!review) {
    throw new AppError('No review found for this order', 404);
  }

  return review;
};

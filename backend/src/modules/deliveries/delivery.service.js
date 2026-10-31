/**
 * QuickKart — Delivery Service
 *
 * Implements delivery lifecycle:
 * - Auto-assign nearest online+verified delivery partner via Haversine
 * - Partner accept/reject assigned delivery
 * - Pickup confirmation (ACCEPTED -> PICKED_UP)
 * - OTP-verified handover to customer (PICKED_UP -> DELIVERED)
 * - Live GPS location updates for tracking
 * - Cascades order status transitions alongside delivery status
 */

import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { DELIVERY_STATUS, ORDER_STATUS } from '../../utils/constants.js';
import { calculateDistanceKm } from '../../utils/geo.js';

/**
 * Generate a random 4-digit OTP for delivery confirmation
 */
export const generateOTP = () => {
  return String(Math.floor(1000 + Math.random() * 9000));
};

/**
 * Find and assign the nearest available delivery partner to a delivery.
 * Called when seller marks order READY -> creates/updates Delivery record.
 *
 * Logic:
 * 1. Fetch all online + verified delivery partners who are NOT currently on a delivery
 * 2. Filter by distance from the store (within 10 km radius)
 * 3. Sort by distance ascending -> pick nearest
 * 4. Assign to delivery and update order status to ASSIGNED
 */
export const assignNearestPartner = async (deliveryId) => {
  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
    include: {
      order: {
        include: {
          store: true,
        },
      },
    },
  });

  if (!delivery) {
    throw new AppError('Delivery record not found', 404);
  }

  if (delivery.status !== DELIVERY_STATUS.PENDING) {
    throw new AppError('Delivery has already been assigned or completed', 400);
  }

  const storeLat = Number(delivery.order.store.latitude);
  const storeLng = Number(delivery.order.store.longitude);

  // Fetch all online + verified partners
  const availablePartners = await prisma.deliveryPartner.findMany({
    where: {
      isOnline: true,
      isVerified: true,
      currentLat: { not: null },
      currentLng: { not: null },
      // Exclude partners who already have an active delivery
      deliveries: {
        none: {
          status: { in: [DELIVERY_STATUS.ACCEPTED, DELIVERY_STATUS.PICKED_UP] },
        },
      },
    },
  });

  if (availablePartners.length === 0) {
    // No partner available right now — delivery stays PENDING for retry
    return { assigned: false, message: 'No delivery partners available nearby. Will retry.' };
  }

  // Calculate distances and filter within 10 km radius
  const MAX_RADIUS_KM = 10;
  const partnersWithDistance = availablePartners
    .map((partner) => ({
      ...partner,
      distance: calculateDistanceKm(
        storeLat,
        storeLng,
        Number(partner.currentLat),
        Number(partner.currentLng)
      ),
    }))
    .filter((p) => p.distance <= MAX_RADIUS_KM)
    .sort((a, b) => a.distance - b.distance);

  if (partnersWithDistance.length === 0) {
    return { assigned: false, message: 'No delivery partners within 10 km radius.' };
  }

  const nearestPartner = partnersWithDistance[0];
  const otp = generateOTP();

  // Assign the partner and generate OTP
  const updatedDelivery = await prisma.$transaction(async (tx) => {
    const updated = await tx.delivery.update({
      where: { id: deliveryId },
      data: {
        deliveryPartnerId: nearestPartner.id,
        status: DELIVERY_STATUS.ACCEPTED,
        otp,
      },
      include: {
        order: true,
        deliveryPartner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            vehicleType: true,
            vehicleNumber: true,
            currentLat: true,
            currentLng: true,
          },
        },
      },
    });

    // Update order status to ASSIGNED
    await tx.order.update({
      where: { id: delivery.orderId },
      data: { status: ORDER_STATUS.ASSIGNED },
    });

    return updated;
  });

  return {
    assigned: true,
    delivery: updatedDelivery,
    partnerDistance: nearestPartner.distance,
  };
};

/**
 * Get deliveries assigned to a delivery partner (paginated)
 */
export const getPartnerDeliveries = async (userId, { status, page = 1, limit = 20 }) => {
  const partner = await prisma.deliveryPartner.findUnique({
    where: { userId },
  });

  if (!partner) {
    throw new AppError('Delivery partner profile not found', 404);
  }

  const where = {
    deliveryPartnerId: partner.id,
    ...(status && { status }),
  };

  const skip = (page - 1) * limit;

  const [deliveries, total] = await Promise.all([
    prisma.delivery.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                phone: true,
                addressLine: true,
                city: true,
                latitude: true,
                longitude: true,
              },
            },
            address: true,
            items: {
              select: {
                productName: true,
                quantity: true,
              },
            },
          },
        },
      },
    }),
    prisma.delivery.count({ where }),
  ]);

  return {
    deliveries,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single delivery's full details
 */
export const getDeliveryById = async (userId, deliveryId) => {
  const partner = await prisma.deliveryPartner.findUnique({
    where: { userId },
  });

  if (!partner) {
    throw new AppError('Delivery partner profile not found', 404);
  }

  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
    include: {
      order: {
        include: {
          store: {
            select: {
              id: true,
              name: true,
              phone: true,
              addressLine: true,
              city: true,
              latitude: true,
              longitude: true,
            },
          },
          address: true,
          items: true,
          customerProfile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      deliveryPartner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          vehicleType: true,
          vehicleNumber: true,
        },
      },
    },
  });

  if (!delivery) {
    throw new AppError('Delivery not found', 404);
  }

  if (delivery.deliveryPartnerId !== partner.id) {
    throw new AppError('Access forbidden: this delivery is not assigned to you', 403);
  }

  return delivery;
};

/**
 * Partner confirms pickup from store (ACCEPTED -> PICKED_UP)
 * Cascades order to OUT_FOR_DELIVERY
 */
export const confirmPickup = async (userId, deliveryId) => {
  const partner = await prisma.deliveryPartner.findUnique({
    where: { userId },
  });

  if (!partner) {
    throw new AppError('Delivery partner profile not found', 404);
  }

  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
  });

  if (!delivery) {
    throw new AppError('Delivery not found', 404);
  }

  if (delivery.deliveryPartnerId !== partner.id) {
    throw new AppError('Access forbidden: this delivery is not assigned to you', 403);
  }

  if (delivery.status !== DELIVERY_STATUS.ACCEPTED) {
    throw new AppError(
      `Cannot confirm pickup in "${delivery.status}" status. Expected "ACCEPTED".`,
      400
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedDelivery = await tx.delivery.update({
      where: { id: deliveryId },
      data: {
        status: DELIVERY_STATUS.PICKED_UP,
        pickedUpAt: new Date(),
      },
      include: {
        order: true,
        deliveryPartner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await tx.order.update({
      where: { id: delivery.orderId },
      data: { status: ORDER_STATUS.OUT_FOR_DELIVERY },
    });

    return updatedDelivery;
  });

  return updated;
};

/**
 * Customer/Partner verifies OTP to complete delivery (PICKED_UP -> DELIVERED)
 * Cascades order to DELIVERED, increments partner's totalDeliveries
 */
export const verifyOtpAndDeliver = async (userId, deliveryId, otp) => {
  const partner = await prisma.deliveryPartner.findUnique({
    where: { userId },
  });

  if (!partner) {
    throw new AppError('Delivery partner profile not found', 404);
  }

  const delivery = await prisma.delivery.findUnique({
    where: { id: deliveryId },
  });

  if (!delivery) {
    throw new AppError('Delivery not found', 404);
  }

  if (delivery.deliveryPartnerId !== partner.id) {
    throw new AppError('Access forbidden: this delivery is not assigned to you', 403);
  }

  if (delivery.status !== DELIVERY_STATUS.PICKED_UP) {
    throw new AppError(
      `Cannot verify OTP in "${delivery.status}" status. Pickup must be confirmed first.`,
      400
    );
  }

  if (delivery.otp !== otp) {
    throw new AppError('Invalid OTP. Please ask the customer for the correct code.', 400);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedDelivery = await tx.delivery.update({
      where: { id: deliveryId },
      data: {
        status: DELIVERY_STATUS.DELIVERED,
        deliveredAt: new Date(),
        otpVerifiedAt: new Date(),
      },
      include: {
        order: true,
        deliveryPartner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Mark order as DELIVERED
    await tx.order.update({
      where: { id: delivery.orderId },
      data: {
        status: ORDER_STATUS.DELIVERED,
        deliveredAt: new Date(),
      },
    });

    // Mark COD payment as SUCCESS upon delivery
    await tx.payment.updateMany({
      where: {
        orderId: delivery.orderId,
        method: 'COD',
        status: 'PENDING',
      },
      data: {
        status: 'SUCCESS',
        paidAt: new Date(),
      },
    });

    // Increment partner's total deliveries
    await tx.deliveryPartner.update({
      where: { id: partner.id },
      data: {
        totalDeliveries: {
          increment: 1,
        },
      },
    });

    return updatedDelivery;
  });

  return updated;
};

/**
 * Update delivery partner's live GPS location
 */
export const updatePartnerLocation = async (userId, latitude, longitude) => {
  const partner = await prisma.deliveryPartner.findUnique({
    where: { userId },
  });

  if (!partner) {
    throw new AppError('Delivery partner profile not found', 404);
  }

  return prisma.deliveryPartner.update({
    where: { id: partner.id },
    data: {
      currentLat: latitude,
      currentLng: longitude,
    },
    select: {
      id: true,
      currentLat: true,
      currentLng: true,
      updatedAt: true,
    },
  });
};

/**
 * Get pending (unassigned) deliveries — for admin or auto-assignment cron
 */
export const getPendingDeliveries = async ({ page = 1, limit = 20 }) => {
  const where = { status: DELIVERY_STATUS.PENDING };
  const skip = (page - 1) * limit;

  const [deliveries, total] = await Promise.all([
    prisma.delivery.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' },
      include: {
        order: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true,
                city: true,
              },
            },
            address: {
              select: {
                addressLine1: true,
                city: true,
                pincode: true,
              },
            },
          },
        },
      },
    }),
    prisma.delivery.count({ where }),
  ]);

  return {
    deliveries,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Manually trigger assignment for a specific pending delivery (Admin)
 */
export const triggerAssignment = async (deliveryId) => {
  return assignNearestPartner(deliveryId);
};


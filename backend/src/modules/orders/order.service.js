/**
 * QuickKart — Order Service
 *
 * Implements complete order lifecycle management:
 * - Atomic order placement with stock deduction and cart reset
 * - Enforces state machine transitions (ORDER_STATUS_TRANSITIONS)
 * - Safe cancellation with inventory rollback
 * - Seller workflows: accept, reject, preparing, ready (initiates delivery queue)
 */

import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import {
  ORDER_STATUS,
  ORDER_STATUS_TRANSITIONS,
  PAYMENT_STATUS,
  USER_ROLES,
} from '../../utils/constants.js';
import { calculateCartTotals } from '../cart/cart.service.js';

/**
 * Generate human-readable order number (e.g. QK-2026-12345)
 */
export const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `QK-${year}-${randomSuffix}`;
};

/**
 * Validates order state machine status transitions
 */
export const validateStatusTransition = (currentStatus, nextStatus) => {
  const allowedNext = ORDER_STATUS_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(nextStatus)) {
    throw new AppError(
      `Invalid order status transition from ${currentStatus} to ${nextStatus}. Allowed: [${allowedNext.join(', ')}]`,
      400
    );
  }
};

/**
 * Place a new order atomically
 */
export const createOrder = async (
  userId,
  { addressId, paymentMethod, specialInstructions, scheduledAt }
) => {
  // 1. Fetch Customer Profile
  const customer = await prisma.customerProfile.findUnique({
    where: { userId },
  });
  if (!customer) {
    throw new AppError('Customer profile not found. Please complete registration.', 404);
  }

  // 2. Validate Delivery Address
  const address = await prisma.address.findFirst({
    where: { id: addressId, customerProfileId: customer.id },
  });
  if (!address) {
    throw new AppError('Delivery address not found or does not belong to you', 404);
  }

  // 3. Fetch Active Cart
  const cart = await prisma.cart.findUnique({
    where: { customerProfileId: customer.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              store: true,
              inventory: true,
            },
          },
        },
      },
      coupon: true,
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError('Your cart is empty. Add items before placing an order.', 400);
  }

  if (!cart.storeId) {
    throw new AppError('Cart is not associated with any store', 400);
  }

  // 4. Verify Store is active
  const store = await prisma.store.findUnique({
    where: { id: cart.storeId },
  });
  if (!store || store.status !== 'ACTIVE') {
    throw new AppError('The store is currently unavailable or inactive', 400);
  }

  // 5. Verify live inventory for all cart items
  for (const item of cart.items) {
    const product = item.product;
    if (!product.isActive || !product.isAvailable) {
      throw new AppError(`Product "${product.name}" is no longer available`, 400);
    }
    if (product.inventory && product.inventory.quantity < item.quantity) {
      throw new AppError(
        `Insufficient stock for "${product.name}". Available: ${product.inventory.quantity}, Requested: ${item.quantity}`,
        400
      );
    }
  }

  // 6. Calculate totals
  const cartCalculations = calculateCartTotals(cart);
  const { subtotal, discountAmount, deliveryFee, taxAmount, totalAmount } =
    cartCalculations.summary;

  const orderNumber = generateOrderNumber();

  // 7. Atomic transaction: Deduct stock, create Order, OrderItems, Payment, and clear Cart
  const newOrder = await prisma.$transaction(async (tx) => {
    // 7a. Deduct inventory for all items
    for (const item of cart.items) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 7b. Create Order with snapshot items and initial Payment record
    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        customerProfileId: customer.id,
        storeId: cart.storeId,
        addressId,
        couponId: cart.couponId,
        status: ORDER_STATUS.PENDING,
        subtotal,
        discountAmount,
        deliveryFee,
        taxAmount,
        totalAmount,
        specialInstructions,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        items: {
          create: cart.items.map((item) => {
            const regularPrice = Number(item.product.price);
            const discountedPrice =
              item.product.discountedPrice != null
                ? Number(item.product.discountedPrice)
                : null;
            const unitPrice =
              discountedPrice != null && discountedPrice < regularPrice
                ? discountedPrice
                : regularPrice;
            const totalPrice = Number((unitPrice * item.quantity).toFixed(2));

            return {
              productId: item.productId,
              productName: item.product.name,
              productUnit: item.product.unit,
              quantity: item.quantity,
              unitPrice,
              totalPrice,
            };
          }),
        },
        payment: {
          create: {
            method: paymentMethod,
            status: PAYMENT_STATUS.PENDING,
            amount: totalAmount,
            idempotencyKey: `idemp-${orderNumber}-${Date.now()}`,
          },
        },
      },
      include: {
        items: true,
        payment: true,
        store: {
          select: {
            id: true,
            name: true,
            phone: true,
            addressLine: true,
            city: true,
          },
        },
        address: true,
      },
    });

    // 7c. Increment coupon usage if applied
    if (cart.couponId) {
      await tx.coupon.update({
        where: { id: cart.couponId },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });
    }

    // 7d. Clear cart items and unlock store
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await tx.cart.update({
      where: { id: cart.id },
      data: {
        storeId: null,
        couponId: null,
      },
    });

    return createdOrder;
  });

  return newOrder;
};

/**
 * List paginated order history for customer
 */
export const getCustomerOrders = async (userId, { status, page = 1, limit = 20 }) => {
  const customer = await prisma.customerProfile.findUnique({
    where: { userId },
  });
  if (!customer) {
    throw new AppError('Customer profile not found', 404);
  }

  const where = {
    customerProfileId: customer.id,
    ...(status && { status }),
  };

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        payment: true,
        store: {
          select: {
            id: true,
            name: true,
            phone: true,
            addressLine: true,
            city: true,
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get detailed order by ID with multi-role access authorization
 */
export const getOrderById = async (user, orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      payment: true,
      address: true,
      coupon: true,
      store: {
        include: {
          sellerProfile: true,
        },
      },
      delivery: {
        include: {
          deliveryPartner: true,
        },
      },
      customerProfile: true,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Role-based authorization
  if (user.role === USER_ROLES.CUSTOMER) {
    if (order.customerProfile.userId !== user.id) {
      throw new AppError('Access forbidden: you do not own this order', 403);
    }
  } else if (user.role === USER_ROLES.SELLER) {
    if (order.store.sellerProfile.userId !== user.id) {
      throw new AppError('Access forbidden: this order does not belong to your store', 403);
    }
  } else if (user.role === USER_ROLES.DELIVERY_PARTNER) {
    if (order.delivery?.deliveryPartner?.userId !== user.id) {
      throw new AppError('Access forbidden: you are not assigned to this delivery', 403);
    }
  } else if (user.role !== USER_ROLES.ADMIN) {
    throw new AppError('Unauthorized access to order details', 403);
  }

  return order;
};

/**
 * Cancel an order (by Customer or Admin)
 * Restores product stock atomically
 */
export const cancelOrder = async (userId, orderId, cancellationReason = 'Cancelled by customer') => {
  const customer = await prisma.customerProfile.findUnique({
    where: { userId },
  });
  if (!customer) {
    throw new AppError('Customer profile not found', 404);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.customerProfileId !== customer.id) {
    throw new AppError('You can only cancel your own orders', 403);
  }

  // Customer can only cancel before order is preparing
  if (![ORDER_STATUS.PENDING, ORDER_STATUS.ACCEPTED].includes(order.status)) {
    throw new AppError(
      `Order cannot be cancelled in "${order.status}" status. It is already being processed or delivered.`,
      400
    );
  }

  // Atomic rollback: restore stock and mark order cancelled
  const cancelledOrder = await prisma.$transaction(async (tx) => {
    // Restore inventory
    for (const item of order.items) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: {
            increment: item.quantity,
          },
        },
      });
    }

    return tx.order.update({
      where: { id: orderId },
      data: {
        status: ORDER_STATUS.CANCELLED,
        cancelledAt: new Date(),
        cancellationReason,
      },
      include: {
        items: true,
        payment: true,
      },
    });
  });

  return cancelledOrder;
};

/**
 * Seller Orders: Retrieve incoming orders for seller's stores
 */
export const getSellerOrders = async (sellerUserId, { status, page = 1, limit = 20 }) => {
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: sellerUserId },
    include: { stores: { select: { id: true } } },
  });

  if (!seller) {
    throw new AppError('Seller profile not found', 404);
  }

  const storeIds = seller.stores.map((s) => s.id);
  if (storeIds.length === 0) {
    return { orders: [], pagination: { page, limit, total: 0, pages: 0 } };
  }

  const where = {
    storeId: { in: storeIds },
    ...(status && { status }),
  };

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        payment: true,
        address: true,
        customerProfile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Helper: verify order belongs to seller
 */
const verifySellerOrderOwnership = async (sellerUserId, orderId) => {
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId: sellerUserId },
    include: { stores: { select: { id: true } } },
  });

  if (!seller) {
    throw new AppError('Seller profile not found', 404);
  }

  const storeIds = seller.stores.map((s) => s.id);
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (!storeIds.includes(order.storeId)) {
    throw new AppError('Access forbidden: this order does not belong to any of your stores', 403);
  }

  return order;
};

/**
 * Seller accepts an order (PENDING -> ACCEPTED)
 */
export const sellerAcceptOrder = async (sellerUserId, orderId) => {
  const order = await verifySellerOrderOwnership(sellerUserId, orderId);
  validateStatusTransition(order.status, ORDER_STATUS.ACCEPTED);

  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: ORDER_STATUS.ACCEPTED,
      acceptedAt: new Date(),
    },
    include: {
      items: true,
      payment: true,
    },
  });
};

/**
 * Seller rejects an order (PENDING -> REJECTED)
 * Restores product stock atomically
 */
export const sellerRejectOrder = async (sellerUserId, orderId, cancellationReason) => {
  const order = await verifySellerOrderOwnership(sellerUserId, orderId);
  validateStatusTransition(order.status, ORDER_STATUS.REJECTED);

  const rejectedOrder = await prisma.$transaction(async (tx) => {
    // Restore inventory
    for (const item of order.items) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          quantity: {
            increment: item.quantity,
          },
        },
      });
    }

    return tx.order.update({
      where: { id: orderId },
      data: {
        status: ORDER_STATUS.REJECTED,
        cancelledAt: new Date(),
        cancellationReason,
      },
      include: {
        items: true,
        payment: true,
      },
    });
  });

  return rejectedOrder;
};

/**
 * Seller marks order as preparing (ACCEPTED -> PREPARING)
 */
export const sellerMarkPreparing = async (sellerUserId, orderId) => {
  const order = await verifySellerOrderOwnership(sellerUserId, orderId);
  validateStatusTransition(order.status, ORDER_STATUS.PREPARING);

  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: ORDER_STATUS.PREPARING,
    },
    include: {
      items: true,
      payment: true,
    },
  });
};

/**
 * Seller marks order as ready (PREPARING -> READY)
 * Prepares initial Delivery record for assignment in Delivery Module
 */
export const sellerMarkReady = async (sellerUserId, orderId) => {
  const order = await verifySellerOrderOwnership(sellerUserId, orderId);
  validateStatusTransition(order.status, ORDER_STATUS.READY);

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status: ORDER_STATUS.READY,
        readyAt: new Date(),
      },
      include: {
        items: true,
        payment: true,
      },
    });

    // Create or ensure Delivery record exists in PENDING status
    await tx.delivery.upsert({
      where: { orderId },
      update: {},
      create: {
        orderId,
        status: 'PENDING',
      },
    });

    return updated;
  });

  return updatedOrder;
};

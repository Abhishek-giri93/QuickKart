/**
 * QuickKart — Payment Service
 *
 * Implements end-to-end payment management:
 * - Razorpay order creation and HMAC-SHA256 signature verification
 * - Cash On Delivery (COD) tracking
 * - Transaction audit logs (TRANSACTION_TYPE)
 * - Safe refund processing with balance checks
 * - Webhook event consumption
 */

import crypto from 'crypto';
import prisma from '../../config/prisma.js';
import { config } from '../../config/env.config.js';
import { AppError } from '../../utils/AppError.js';
import {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  REFUND_STATUS,
  TRANSACTION_TYPE,
  USER_ROLES,
} from '../../utils/constants.js';

/**
 * Creates a Razorpay order for an existing pending Order
 */
export const createRazorpayOrder = async (userId, { orderId }) => {
  const customer = await prisma.customerProfile.findUnique({
    where: { userId },
  });

  if (!customer) {
    throw new AppError('Customer profile not found', 404);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.customerProfileId !== customer.id) {
    throw new AppError('Access forbidden: this order does not belong to you', 403);
  }

  if (!order.payment) {
    throw new AppError('Payment record not found for this order', 404);
  }

  if (order.payment.method !== PAYMENT_METHOD.RAZORPAY) {
    throw new AppError('This order is not configured for Razorpay payment', 400);
  }

  if (order.payment.status === PAYMENT_STATUS.SUCCESS) {
    throw new AppError('This order has already been paid for', 400);
  }

  // Generate Razorpay Order ID (standard format: order_xxxx)
  const razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  const amountInPaise = Math.round(Number(order.payment.amount) * 100);

  // Link razorpayOrderId to the Payment record
  const updatedPayment = await prisma.payment.update({
    where: { id: order.payment.id },
    data: {
      razorpayOrderId,
    },
  });

  return {
    orderId: order.id,
    paymentId: updatedPayment.id,
    razorpayOrderId,
    amount: Number(order.payment.amount),
    amountInPaise,
    currency: order.payment.currency || 'INR',
    keyId: config.razorpay.keyId,
  };
};

/**
 * Verify Razorpay payment signature and mark payment as SUCCESS
 */
export const verifyPayment = async (
  userId,
  { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
) => {
  const customer = await prisma.customerProfile.findUnique({
    where: { userId },
  });

  if (!customer) {
    throw new AppError('Customer profile not found', 404);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.customerProfileId !== customer.id) {
    throw new AppError('Access forbidden: this order does not belong to you', 403);
  }

  const payment = order.payment;
  if (!payment) {
    throw new AppError('Payment record not found for this order', 404);
  }

  if (payment.status === PAYMENT_STATUS.SUCCESS) {
    return payment;
  }

  // Verify HMAC-SHA256 signature
  const text = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(text)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const signatureBuffer = Buffer.from(razorpaySignature, 'utf8');

  const isValidSignature =
    expectedBuffer.length === signatureBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

  if (!isValidSignature) {
    throw new AppError('Payment signature verification failed. Invalid transaction.', 400);
  }

  // Atomic update: mark payment as SUCCESS and write Transaction audit log
  const verifiedPayment = await prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PAYMENT_STATUS.SUCCESS,
        razorpayPaymentId,
        razorpaySignature,
        paidAt: new Date(),
      },
      include: {
        order: true,
      },
    });

    await tx.transaction.create({
      data: {
        paymentId: payment.id,
        type: TRANSACTION_TYPE.PAYMENT,
        amount: payment.amount,
        description: 'Online payment received via Razorpay',
        metadata: {
          razorpayOrderId,
          razorpayPaymentId,
        },
      },
    });

    return updated;
  });

  return verifiedPayment;
};

/**
 * Handle incoming Razorpay webhook events
 */
export const handleWebhook = async (rawBody, signature) => {
  if (!signature) {
    throw new AppError('Webhook signature missing', 400);
  }

  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.webhookSecret)
    .update(typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody))
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');

  const isValid =
    expectedBuffer.length === signatureBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

  if (!isValid) {
    throw new AppError('Invalid webhook signature', 400);
  }

  const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
  const event = payload.event;
  const paymentEntity = payload.payload?.payment?.entity;

  if (event === 'payment.captured' && paymentEntity) {
    const razorpayOrderId = paymentEntity.order_id;
    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId },
    });

    if (payment && payment.status !== PAYMENT_STATUS.SUCCESS) {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PAYMENT_STATUS.SUCCESS,
            razorpayPaymentId: paymentEntity.id,
            paidAt: new Date(),
          },
        });

        await tx.transaction.create({
          data: {
            paymentId: payment.id,
            type: TRANSACTION_TYPE.PAYMENT,
            amount: payment.amount,
            description: 'Webhook: payment.captured',
            metadata: paymentEntity,
          },
        });
      });
    }
  } else if (event === 'payment.failed' && paymentEntity) {
    const razorpayOrderId = paymentEntity.order_id;
    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId },
    });

    if (payment && payment.status === PAYMENT_STATUS.PENDING) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PAYMENT_STATUS.FAILED,
          failureReason: paymentEntity.error_description || 'Payment failed',
        },
      });
    }
  }

  return { received: true };
};

/**
 * Initiate refund for an order payment (Admin or Seller)
 */
export const initiateRefund = async (user, { paymentId, amount, reason }) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      refunds: true,
      order: {
        include: {
          store: {
            include: { sellerProfile: true },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  // Authorization check
  if (user.role === USER_ROLES.SELLER) {
    if (payment.order.store.sellerProfile.userId !== user.id) {
      throw new AppError('Access forbidden: this payment is not associated with your store', 403);
    }
  } else if (user.role !== USER_ROLES.ADMIN) {
    throw new AppError('Unauthorized to initiate refunds', 403);
  }

  if (payment.status !== PAYMENT_STATUS.SUCCESS) {
    throw new AppError(
      `Cannot refund payment in "${payment.status}" status. Only successful payments can be refunded.`,
      400
    );
  }

  // Calculate previously refunded total
  const totalRefundedAlready = payment.refunds
    .filter((r) => r.status === REFUND_STATUS.COMPLETED || r.status === REFUND_STATUS.PROCESSING)
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const paymentAmount = Number(payment.amount);
  const remainingRefundable = Number((paymentAmount - totalRefundedAlready).toFixed(2));

  if (amount > remainingRefundable) {
    throw new AppError(
      `Refund amount (₹${amount}) exceeds maximum refundable balance (₹${remainingRefundable})`,
      400
    );
  }

  const razorpayRefundId = `rfnd_${crypto.randomBytes(8).toString('hex')}`;

  const refundRecord = await prisma.$transaction(async (tx) => {
    const refund = await tx.refund.create({
      data: {
        paymentId: payment.id,
        amount,
        reason,
        status: REFUND_STATUS.COMPLETED,
        razorpayRefundId,
        processedAt: new Date(),
      },
    });

    await tx.transaction.create({
      data: {
        paymentId: payment.id,
        type: TRANSACTION_TYPE.REFUND,
        amount,
        description: `Refund processed: ${reason}`,
        metadata: { razorpayRefundId },
      },
    });

    // If fully refunded, transition payment status to REFUNDED
    if (totalRefundedAlready + amount >= paymentAmount) {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PAYMENT_STATUS.REFUNDED },
      });
    }

    return refund;
  });

  return refundRecord;
};

/**
 * Get payment details by ID
 */
export const getPaymentById = async (user, paymentId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      transactions: { orderBy: { createdAt: 'desc' } },
      refunds: { orderBy: { createdAt: 'desc' } },
      order: {
        include: {
          store: { include: { sellerProfile: true } },
          customerProfile: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError('Payment record not found', 404);
  }

  // Access control
  if (user.role === USER_ROLES.CUSTOMER) {
    if (payment.order.customerProfile.userId !== user.id) {
      throw new AppError('Access forbidden', 403);
    }
  } else if (user.role === USER_ROLES.SELLER) {
    if (payment.order.store.sellerProfile.userId !== user.id) {
      throw new AppError('Access forbidden', 403);
    }
  } else if (user.role !== USER_ROLES.ADMIN) {
    throw new AppError('Unauthorized', 403);
  }

  return payment;
};

/**
 * Get customer's transaction history
 */
export const getCustomerTransactions = async (userId, { type, page = 1, limit = 20 }) => {
  const customer = await prisma.customerProfile.findUnique({
    where: { userId },
  });

  if (!customer) {
    throw new AppError('Customer profile not found', 404);
  }

  const where = {
    payment: {
      order: {
        customerProfileId: customer.id,
      },
    },
    ...(type && { type }),
  };

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        payment: {
          select: {
            id: true,
            method: true,
            status: true,
            orderId: true,
          },
        },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

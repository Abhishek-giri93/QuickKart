/**
 * QuickKart — Cart Service
 *
 * Implements core cart business logic:
 * - One active cart per customer
 * - Single-store locking constraint
 * - Real-time inventory validation
 * - Dynamic price & discount calculation
 * - Coupon validation (limits, expiry, minimum order value)
 */

import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';

/**
 * Calculates cart totals including items subtotal, coupon discounts, delivery fee, and tax.
 *
 * @param {Object} cart Cart with populated items, product details and coupon
 * @returns {Object} Calculated summary breakdown
 */
export const calculateCartTotals = (cart) => {
  let subtotal = 0;
  let totalQuantity = 0;

  const items = (cart.items || []).map((item) => {
    const regularPrice = Number(item.product.price);
    const discountedPrice = item.product.discountedPrice != null ? Number(item.product.discountedPrice) : null;
    const effectivePrice = discountedPrice != null && discountedPrice < regularPrice ? discountedPrice : regularPrice;
    const itemTotal = Number((effectivePrice * item.quantity).toFixed(2));

    subtotal += itemTotal;
    totalQuantity += item.quantity;

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: effectivePrice,
      regularPrice,
      discountedPrice,
      totalPrice: itemTotal,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        unit: item.product.unit,
        isAvailable: item.product.isAvailable,
        images: item.product.images || [],
        store: item.product.store || null,
      },
    };
  });

  subtotal = Number(subtotal.toFixed(2));

  // Discount calculation
  let discountAmount = 0;
  let couponDetails = null;

  if (cart.coupon && cart.coupon.isActive) {
    const coupon = cart.coupon;
    const minOrder = coupon.minOrderAmount != null ? Number(coupon.minOrderAmount) : 0;

    if (subtotal >= minOrder) {
      if (coupon.discountPercent != null) {
        discountAmount = (subtotal * Number(coupon.discountPercent)) / 100;
        if (coupon.maxDiscount != null) {
          discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
        }
      } else if (coupon.discountAmount != null) {
        discountAmount = Number(coupon.discountAmount);
      }

      discountAmount = Number(Math.min(discountAmount, subtotal).toFixed(2));

      couponDetails = {
        id: coupon.id,
        code: coupon.code,
        discountPercent: coupon.discountPercent != null ? Number(coupon.discountPercent) : null,
        discountAmount: coupon.discountAmount != null ? Number(coupon.discountAmount) : null,
        appliedDiscount: discountAmount,
      };
    }
  }

  // Delivery fee rules: free delivery on orders >= ₹500, otherwise flat ₹40
  const deliveryFee = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;

  // Estimated GST / Tax (5% on taxable amount: subtotal - discount)
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number((taxableAmount * 0.05).toFixed(2));

  // Final Total
  const totalAmount = Number((taxableAmount + deliveryFee + taxAmount).toFixed(2));

  return {
    cartId: cart.id,
    storeId: cart.storeId,
    itemCount: totalQuantity,
    items,
    summary: {
      subtotal,
      discountAmount,
      coupon: couponDetails,
      deliveryFee,
      taxAmount,
      totalAmount,
    },
  };
};

/**
 * Retrieve or automatically initialize the customer profile for a given user ID
 */
export const getCustomerProfileByUserId = async (userId) => {
  const customer = await prisma.customerProfile.findUnique({
    where: { userId },
  });

  if (!customer) {
    throw new AppError('Customer profile not found. Please complete registration.', 404);
  }

  return customer;
};

/**
 * Retrieve or initialize cart for customer profile
 */
export const getOrCreateCart = async (customerProfileId) => {
  let cart = await prisma.cart.findUnique({
    where: { customerProfileId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
              store: true,
              inventory: true,
            },
          },
        },
      },
      coupon: true,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { customerProfileId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                store: true,
                inventory: true,
              },
            },
          },
        },
        coupon: true,
      },
    });
  }

  return cart;
};

/**
 * Get active cart with full pricing breakdown
 */
export const getCart = async (userId) => {
  const customer = await getCustomerProfileByUserId(userId);
  const cart = await getOrCreateCart(customer.id);
  return calculateCartTotals(cart);
};

/**
 * Add product to cart
 *
 * Rules:
 * 1. Product must exist, be active and available
 * 2. Available inventory must satisfy requested quantity
 * 3. Single-store constraint: cannot add items from a different store
 */
export const addToCart = async (userId, { productId, quantity }) => {
  const customer = await getCustomerProfileByUserId(userId);

  // 1. Fetch Product with store & inventory
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      store: true,
      inventory: true,
    },
  });

  if (!product || !product.isActive) {
    throw new AppError('Product not found or unavailable', 404);
  }

  if (!product.isAvailable) {
    throw new AppError('Product is currently out of stock or unavailable', 400);
  }

  // 2. Fetch or create cart
  const cart = await getOrCreateCart(customer.id);

  // 3. Single Store check
  if (cart.items.length > 0 && cart.storeId && cart.storeId !== product.storeId) {
    throw new AppError(
      'Your cart already contains items from another store. Please clear your cart or complete your order first.',
      400
    );
  }

  // 4. Check existing item in cart
  const existingItem = cart.items.find((item) => item.productId === productId);
  const newTotalQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

  // 5. Stock check
  if (product.inventory && product.inventory.quantity < newTotalQuantity) {
    throw new AppError(
      `Insufficient stock. Only ${product.inventory.quantity} unit(s) available.`,
      400
    );
  }

  // 6. Upsert Cart Item
  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newTotalQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  // 7. Update cart's storeId if needed
  if (!cart.storeId || cart.items.length === 0) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: { storeId: product.storeId },
    });
  }

  // 8. Return refreshed cart
  const updatedCart = await getOrCreateCart(customer.id);
  return calculateCartTotals(updatedCart);
};

/**
 * Update quantity of a cart item
 */
export const updateCartItem = async (userId, productId, quantity) => {
  const customer = await getCustomerProfileByUserId(userId);
  const cart = await getOrCreateCart(customer.id);

  const existingItem = cart.items.find((item) => item.productId === productId);
  if (!existingItem) {
    throw new AppError('Item not found in cart', 404);
  }

  // If quantity is 0, remove item
  if (quantity <= 0) {
    return removeCartItem(userId, productId);
  }

  // Check inventory
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { inventory: true },
  });

  if (product?.inventory && product.inventory.quantity < quantity) {
    throw new AppError(
      `Insufficient stock. Only ${product.inventory.quantity} unit(s) available.`,
      400
    );
  }

  await prisma.cartItem.update({
    where: { id: existingItem.id },
    data: { quantity },
  });

  const updatedCart = await getOrCreateCart(customer.id);
  return calculateCartTotals(updatedCart);
};

/**
 * Remove an item from the cart
 */
export const removeCartItem = async (userId, productId) => {
  const customer = await getCustomerProfileByUserId(userId);
  const cart = await getOrCreateCart(customer.id);

  const existingItem = cart.items.find((item) => item.productId === productId);
  if (!existingItem) {
    throw new AppError('Item not found in cart', 404);
  }

  await prisma.cartItem.delete({
    where: { id: existingItem.id },
  });

  // If this was the last item, reset storeId and couponId
  const remainingItemsCount = cart.items.length - 1;
  if (remainingItemsCount <= 0) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: { storeId: null, couponId: null },
    });
  }

  const updatedCart = await getOrCreateCart(customer.id);
  return calculateCartTotals(updatedCart);
};

/**
 * Clear all items from the cart
 */
export const clearCart = async (userId) => {
  const customer = await getCustomerProfileByUserId(userId);
  const cart = await getOrCreateCart(customer.id);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  await prisma.cart.update({
    where: { id: cart.id },
    data: { storeId: null, couponId: null },
  });

  const updatedCart = await getOrCreateCart(customer.id);
  return calculateCartTotals(updatedCart);
};

/**
 * Apply coupon code to cart
 */
export const applyCoupon = async (userId, couponCode) => {
  const customer = await getCustomerProfileByUserId(userId);
  const cart = await getOrCreateCart(customer.id);

  if (cart.items.length === 0) {
    throw new AppError('Cannot apply coupon to an empty cart', 400);
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: couponCode },
  });

  if (!coupon) {
    throw new AppError('Invalid coupon code', 404);
  }

  if (!coupon.isActive) {
    throw new AppError('This coupon is no longer active', 400);
  }

  const now = new Date();
  if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUntil)) {
    throw new AppError('Coupon has expired or is not yet valid', 400);
  }

  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('This coupon has reached its total usage limit', 400);
  }

  // Per-user limit check against completed orders
  if (coupon.perUserLimit != null) {
    const userUsageCount = await prisma.order.count({
      where: {
        customerProfileId: customer.id,
        couponId: coupon.id,
        status: { notIn: ['CANCELLED'] },
      },
    });

    if (userUsageCount >= coupon.perUserLimit) {
      throw new AppError('You have already reached the maximum usage limit for this coupon', 400);
    }
  }

  // Calculate current subtotal to check minOrderAmount
  let subtotal = 0;
  for (const item of cart.items) {
    const price = item.product.discountedPrice != null ? Number(item.product.discountedPrice) : Number(item.product.price);
    subtotal += price * item.quantity;
  }

  if (coupon.minOrderAmount != null && subtotal < Number(coupon.minOrderAmount)) {
    throw new AppError(
      `Minimum order amount of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}`,
      400
    );
  }

  // Attach coupon to cart
  await prisma.cart.update({
    where: { id: cart.id },
    data: { couponId: coupon.id },
  });

  const updatedCart = await getOrCreateCart(customer.id);
  return calculateCartTotals(updatedCart);
};

/**
 * Remove coupon from cart
 */
export const removeCoupon = async (userId) => {
  const customer = await getCustomerProfileByUserId(userId);
  const cart = await getOrCreateCart(customer.id);

  if (!cart.couponId) {
    throw new AppError('No coupon is currently applied to your cart', 400);
  }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { couponId: null },
  });

  const updatedCart = await getOrCreateCart(customer.id);
  return calculateCartTotals(updatedCart);
};

/**
 * QuickKart — Cart Controller
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as cartService from './cart.service.js';

/**
 * Get the current authenticated customer's cart
 * GET /api/v1/cart
 */
export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  sendSuccess(res, {
    message: 'Cart retrieved successfully',
    data: cart,
  });
});

/**
 * Add an item to the cart
 * POST /api/v1/cart/items
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user.id, { productId, quantity });
  sendSuccess(res, {
    message: 'Item added to cart successfully',
    data: cart,
  });
});

/**
 * Update quantity of an item in the cart
 * PATCH /api/v1/cart/items/:productId
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user.id, productId, quantity);
  sendSuccess(res, {
    message: 'Cart item updated successfully',
    data: cart,
  });
});

/**
 * Remove an item from the cart
 * DELETE /api/v1/cart/items/:productId
 */
export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await cartService.removeCartItem(req.user.id, productId);
  sendSuccess(res, {
    message: 'Item removed from cart successfully',
    data: cart,
  });
});

/**
 * Clear all items from the cart
 * DELETE /api/v1/cart/clear
 */
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);
  sendSuccess(res, {
    message: 'Cart cleared successfully',
    data: cart,
  });
});

/**
 * Apply coupon to the cart
 * POST /api/v1/cart/coupon
 */
export const applyCoupon = asyncHandler(async (req, res) => {
  const { couponCode } = req.body;
  const cart = await cartService.applyCoupon(req.user.id, couponCode);
  sendSuccess(res, {
    message: 'Coupon applied successfully',
    data: cart,
  });
});

/**
 * Remove coupon from the cart
 * DELETE /api/v1/cart/coupon
 */
export const removeCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.removeCoupon(req.user.id);
  sendSuccess(res, {
    message: 'Coupon removed successfully',
    data: cart,
  });
});

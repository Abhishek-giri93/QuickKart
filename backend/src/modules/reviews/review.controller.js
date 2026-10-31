/**
 * QuickKart — Review Controller
 */

import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../../utils/response.js';
import * as reviewService from './review.service.js';

/**
 * Submit review for a delivered order
 * POST /api/v1/reviews
 */
export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.body);
  sendCreated(res, {
    message: 'Review submitted successfully',
    data: review,
  });
});

/**
 * Get store reviews (Public)
 * GET /api/v1/reviews/store/:storeId
 */
export const getStoreReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getStoreReviews(req.params.storeId, req.query);
  sendSuccess(res, {
    message: 'Store reviews retrieved successfully',
    data: result.reviews,
    meta: result.pagination,
  });
});

/**
 * Get delivery partner reviews
 * GET /api/v1/reviews/delivery-partner/:partnerId
 */
export const getDeliveryPartnerReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getDeliveryPartnerReviews(req.params.partnerId, req.query);
  sendSuccess(res, {
    message: 'Delivery partner reviews retrieved successfully',
    data: result.reviews,
    meta: result.pagination,
  });
});

/**
 * Get review for a specific order
 * GET /api/v1/reviews/order/:orderId
 */
export const getOrderReview = asyncHandler(async (req, res) => {
  const review = await reviewService.getOrderReview(req.params.orderId);
  sendSuccess(res, {
    message: 'Order review retrieved successfully',
    data: review,
  });
});

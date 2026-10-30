/**
 * Rate Limiter Middleware
 *
 * Protects the API from brute-force attacks and abuse.
 *
 * Two limiters are defined:
 * 1. globalLimiter  — Applied to ALL routes (general protection)
 * 2. authLimiter    — Stricter limiter applied ONLY to auth routes
 *                     (login, register, forgot-password, etc.)
 *
 * When a client exceeds the limit, a 429 Too Many Requests response
 * is returned with a Retry-After header.
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config/env.config.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Global rate limiter — applied to all routes.
 * Default: 100 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,   // Disable deprecated `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

/**
 * Auth-specific rate limiter — stricter, for login/register routes.
 * Default: 10 requests per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});


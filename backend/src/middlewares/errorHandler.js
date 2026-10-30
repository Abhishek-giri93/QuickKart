/**
 * Centralized Error Handler Middleware
 *
 * This is the LAST middleware in the Express chain.
 * All errors (thrown or passed via next(err)) land here.
 *
 * Handles:
 * - AppError (our custom operational errors)
 * - Prisma errors (database-level errors)
 * - JWT errors
 * - Zod validation errors
 * - Generic/unexpected errors
 *
 * Rule: Never expose stack traces or internal details in production.
 */

import { AppError } from '../utils/AppError.js';
import { sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { config } from '../config/env.config.js';

/**
 * Handle Prisma-specific errors and convert to AppError.
 */
function handlePrismaError(err) {
  switch (err.code) {
    // Unique constraint violation (e.g. duplicate email)
    case 'P2002': {
      const field = err.meta?.target?.join(', ') || 'field';
      return new AppError(`A record with this ${field} already exists.`, HTTP_STATUS.CONFLICT);
    }
    // Record not found
    case 'P2025':
      return new AppError('The requested record was not found.', HTTP_STATUS.NOT_FOUND);
    // Foreign key constraint violation
    case 'P2003':
      return new AppError('Related record not found. Please check your input.', HTTP_STATUS.BAD_REQUEST);
    // Required field missing
    case 'P2011':
      return new AppError('A required field is missing.', HTTP_STATUS.BAD_REQUEST);
    default:
      return new AppError('A database error occurred.', HTTP_STATUS.INTERNAL_SERVER_ERROR, false);
  }
}

/**
 * The main error handler middleware.
 * Must have 4 parameters for Express to treat it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log all errors in development; only non-operational errors in production
  if (config.server.isDev || !error.isOperational) {
    console.error('❌ ERROR:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // --- Prisma errors ---
  if (err.constructor?.name === 'PrismaClientKnownRequestError') {
    error = handlePrismaError(err);
  }

  // --- JWT errors ---
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your session has expired. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
  }

  // --- Zod validation errors ---
  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, {
      message: 'Validation failed',
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errors,
    });
  }

  // --- AppError (our intentional errors) ---
  if (error instanceof AppError && error.isOperational) {
    return sendError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  // --- Unexpected / unknown errors ---
  // Don't leak details in production
  return sendError(res, {
    message: config.server.isDev
      ? error.message || 'Internal server error'
      : 'Something went wrong. Please try again later.',
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  });
};

/**
 * 404 Not Found handler.
 * Catches any request that didn't match a route.
 */
export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND));
};


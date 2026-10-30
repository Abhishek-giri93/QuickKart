/**
 * AppError — Custom Application Error Class
 *
 * All intentional application errors should be thrown as AppError instances.
 * The centralized error handler middleware catches these and sends proper
 * HTTP responses without leaking stack traces to clients.
 *
 * Usage:
 *   throw new AppError('Store not found', 404);
 *   throw new AppError('Email already in use', 409);
 */

export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code to send
   * @param {boolean} isOperational - True for expected errors, false for bugs
   */
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'AppError';

    // Capture clean stack trace (excludes this constructor from the trace)
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common pre-built errors for convenience.
 * Keeps error creation consistent across modules.
 */
export const Errors = {
  notFound: (resource = 'Resource') =>
    new AppError(`${resource} not found`, 404),

  unauthorized: (msg = 'Unauthorized. Please log in.') =>
    new AppError(msg, 401),

  forbidden: (msg = 'You do not have permission to perform this action') =>
    new AppError(msg, 403),

  conflict: (msg = 'Resource already exists') =>
    new AppError(msg, 409),

  badRequest: (msg = 'Invalid request data') =>
    new AppError(msg, 400),

  internal: (msg = 'Internal server error') =>
    new AppError(msg, 500, false),
};


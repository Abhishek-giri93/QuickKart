/**
 * API Response Helpers
 *
 * Standardizes all API responses across the application.
 * Every endpoint must use these helpers — never send raw res.json() calls.
 *
 * Response format:
 * {
 *   success: boolean,
 *   message: string,
 *   data: object | null,
 *   meta: object | null      (for paginated responses)
 *   errors: array | null     (for validation errors)
 * }
 */

import { HTTP_STATUS } from './constants.js';

/**
 * Send a success response.
 * @param {object} res - Express response object
 * @param {object} options
 * @param {string} options.message - Human-readable success message
 * @param {any}    options.data    - Response payload
 * @param {number} options.statusCode - HTTP status code (default: 200)
 * @param {object} options.meta   - Pagination or extra metadata
 */
export const sendSuccess = (res, { message = 'Success', data = null, statusCode = HTTP_STATUS.OK, meta = null } = {}) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a created response (201).
 */
export const sendCreated = (res, { message = 'Created successfully', data = null } = {}) => {
  return sendSuccess(res, { message, data, statusCode: HTTP_STATUS.CREATED });
};

/**
 * Send an error response.
 * @param {object} res - Express response object
 * @param {object} options
 * @param {string} options.message   - Human-readable error message
 * @param {number} options.statusCode - HTTP status code (default: 500)
 * @param {array}  options.errors    - Validation error details
 */
export const sendError = (res, { message = 'Something went wrong', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null } = {}) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Build pagination metadata for list responses.
 * @param {number} total - Total record count
 * @param {number} page  - Current page number
 * @param {number} limit - Items per page
 */
export const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};


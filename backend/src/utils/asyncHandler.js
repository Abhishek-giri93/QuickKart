/**
 * Async Handler — Wrapper for async route controllers
 *
 * Eliminates try/catch boilerplate from every async controller function.
 * Any unhandled promise rejection is automatically forwarded to Express's
 * centralized error handler via next(err).
 *
 * Usage:
 *   router.get('/users', asyncHandler(async (req, res) => {
 *     const users = await userService.getAll();
 *     sendSuccess(res, { data: users });
 *   }));
 */

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


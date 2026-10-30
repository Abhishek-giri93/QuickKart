/**
 * Validate Middleware — Zod Request Validation
 *
 * A factory function that returns an Express middleware which validates
 * the incoming request against a given Zod schema.
 *
 * Supports validating:
 *   - req.body   (default)
 *   - req.params
 *   - req.query
 *
 * On validation failure → throws a ZodError which the centralized
 * errorHandler converts into a clean 422 response.
 *
 * Usage:
 *   import { validate } from '../middlewares/validate.js';
 *   import { createProductSchema } from '../validators/product.validator.js';
 *
 *   router.post('/products', validate(createProductSchema), createProduct);
 *   router.get('/products/:id', validate(idParamSchema, 'params'), getProduct);
 */

export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    // Forward ZodError to the centralized error handler
    return next(result.error);
  }

  // Replace the request source with the parsed (and possibly transformed) data
  req[source] = result.data;
  next();
};


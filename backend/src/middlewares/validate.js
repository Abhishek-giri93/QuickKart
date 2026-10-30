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
 * On validation failure → forwards ZodError to centralized errorHandler (HTTP 422).
 */

export const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    return next(result.error);
  }

  // Assign validated and coerced data back to req
  if (source === 'body') {
    req.body = result.data;
  } else {
    try {
      req[source] = result.data;
    } catch {
      // In case req.query has only a getter, mutate properties directly
      Object.keys(req[source]).forEach((k) => delete req[source][k]);
      Object.assign(req[source], result.data);
    }
  }

  next();
};

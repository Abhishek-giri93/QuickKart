/**
 * Authentication & Authorization Middlewares
 */

import { verifyAccessToken } from '../utils/jwt.js';
import { AppError, Errors } from '../utils/AppError.js';
import { HTTP_STATUS } from '../utils/constants.js';
import prisma from '../config/prisma.js';

/**
 * Protect middleware: Ensures the request is authenticated with a valid JWT Access Token.
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication token missing. Please log in.', HTTP_STATUS.UNAUTHORIZED));
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Your session has expired. Please refresh your token.', HTTP_STATUS.UNAUTHORIZED));
      }
      return next(new AppError('Invalid authentication token.', HTTP_STATUS.UNAUTHORIZED));
    }

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        customerProfile: true,
        sellerProfile: true,
        deliveryPartner: true,
      },
    });

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', HTTP_STATUS.UNAUTHORIZED));
    }

    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', HTTP_STATUS.FORBIDDEN));
    }

    // Attach user to request object (excluding password hash and refresh token hash)
    const { passwordHash, refreshToken, ...safeUser } = user;
    req.user = safeUser;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based Authorization Middleware Factory
 * @param  {...string} roles - Allowed roles (e.g., 'ADMIN', 'SELLER')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access forbidden: required role [${roles.join(', ')}], current role [${req.user?.role}]`,
          HTTP_STATUS.FORBIDDEN
        )
      );
    }
    next();
  };
};

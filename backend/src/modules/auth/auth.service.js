/**
 * Authentication Business Logic Service
 */

import prisma from '../../config/prisma.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../../utils/jwt.js';
import { AppError } from '../../utils/AppError.js';
import { HTTP_STATUS, USER_ROLES } from '../../utils/constants.js';

/**
 * Format safe user object without sensitive credentials
 */
const sanitizeUser = (user) => {
  const { passwordHash, refreshToken, ...safeUser } = user;
  return safeUser;
};

/**
 * Helper to generate tokens and store hashed refresh token in database
 */
const createSession = async (user) => {
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const rawRefreshToken = generateRefreshToken({ id: user.id });
  const hashedRefreshToken = hashToken(rawRefreshToken);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefreshToken },
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
  };
};

/**
 * Register a new Customer
 */
export const registerCustomer = async (data) => {
  const { email, phone, password, firstName, lastName } = data;

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
  });

  if (existingUser) {
    throw new AppError(
      existingUser.email === email
        ? 'Email already registered'
        : 'Phone number already registered',
      HTTP_STATUS.CONFLICT
    );
  }

  const hashedPassword = await hashPassword(password);

  // Atomic creation of User + Profile + Cart
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        phone,
        passwordHash: hashedPassword,
        role: USER_ROLES.CUSTOMER,
        customerProfile: {
          create: {
            firstName,
            lastName,
          },
        },
      },
      include: {
        customerProfile: true,
      },
    });

    // Create an empty cart for this customer
    await tx.cart.create({
      data: {
        customerProfileId: newUser.customerProfile.id,
      },
    });

    return newUser;
  });

  const tokens = await createSession(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

/**
 * Register a new Seller
 */
export const registerSeller = async (data) => {
  const { email, phone, password, firstName, lastName, businessName, gstNumber, panNumber } = data;

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
  });

  if (existingUser) {
    throw new AppError(
      existingUser.email === email
        ? 'Email already registered'
        : 'Phone number already registered',
      HTTP_STATUS.CONFLICT
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      phone,
      passwordHash: hashedPassword,
      role: USER_ROLES.SELLER,
      sellerProfile: {
        create: {
          firstName,
          lastName,
          businessName,
          gstNumber,
          panNumber,
        },
      },
    },
    include: {
      sellerProfile: true,
    },
  });

  const tokens = await createSession(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

/**
 * Register a new Delivery Partner
 */
export const registerDeliveryPartner = async (data) => {
  const { email, phone, password, firstName, lastName, vehicleType, vehicleNumber, licenseNumber } = data;

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
  });

  if (existingUser) {
    throw new AppError(
      existingUser.email === email
        ? 'Email already registered'
        : 'Phone number already registered',
      HTTP_STATUS.CONFLICT
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      phone,
      passwordHash: hashedPassword,
      role: USER_ROLES.DELIVERY_PARTNER,
      deliveryPartner: {
        create: {
          firstName,
          lastName,
          vehicleType,
          vehicleNumber,
          licenseNumber,
        },
      },
    },
    include: {
      deliveryPartner: true,
    },
  });

  const tokens = await createSession(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

/**
 * Login user via email or phone
 */
export const login = async ({ identifier, password }) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    },
    include: {
      customerProfile: true,
      sellerProfile: true,
      deliveryPartner: true,
    },
  });

  if (!user) {
    throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated. Please contact support.', HTTP_STATUS.FORBIDDEN);
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
  }

  const tokens = await createSession(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

/**
 * Rotate Refresh Token & Issue new Access Token
 */
export const refreshSession = async (token) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    throw new AppError('Invalid or expired refresh token. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user || !user.refreshToken) {
    throw new AppError('Invalid refresh token. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
  }

  const hashedInputToken = hashToken(token);
  if (user.refreshToken !== hashedInputToken) {
    // Potential token reuse / compromise - clear session!
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });
    throw new AppError('Security violation detected. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
  }

  // Issue new tokens (Token Rotation pattern)
  return createSession(user);
};

/**
 * Logout user by clearing stored refresh token
 */
export const logout = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

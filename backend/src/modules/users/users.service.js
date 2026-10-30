/**
 * Users, Profiles & Addresses Business Service
 */

import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { HTTP_STATUS } from '../../utils/constants.js';

// ── CUSTOMER SERVICE ────────────────────────────────────────────────────────

export const getCustomerProfile = async (userId) => {
  const profile = await prisma.customerProfile.findUnique({
    where: { userId },
    include: {
      addresses: {
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      },
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
        },
      },
    },
  });

  if (!profile) {
    throw new AppError('Customer profile not found', HTTP_STATUS.NOT_FOUND);
  }

  return profile;
};

export const updateCustomerProfile = async (userId, data) => {
  const profile = await prisma.customerProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError('Customer profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const updated = await prisma.customerProfile.update({
    where: { userId },
    data: {
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
    },
  });

  return updated;
};

// ── ADDRESS SERVICE ─────────────────────────────────────────────────────────

export const getAddresses = async (userId) => {
  const profile = await prisma.customerProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError('Customer profile not found', HTTP_STATUS.NOT_FOUND);
  }

  return prisma.address.findMany({
    where: { customerProfileId: profile.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
};

export const getAddressById = async (userId, addressId) => {
  const profile = await prisma.customerProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError('Customer profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      customerProfileId: profile.id,
    },
  });

  if (!address) {
    throw new AppError('Address not found', HTTP_STATUS.NOT_FOUND);
  }

  return address;
};

export const createAddress = async (userId, data) => {
  const profile = await prisma.customerProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError('Customer profile not found', HTTP_STATUS.NOT_FOUND);
  }

  const count = await prisma.address.count({
    where: { customerProfileId: profile.id },
  });

  // If this is the first address, make it default automatically
  const shouldBeDefault = count === 0 || !!data.isDefault;

  return prisma.$transaction(async (tx) => {
    if (shouldBeDefault) {
      // Clear any existing default address
      await tx.address.updateMany({
        where: { customerProfileId: profile.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    return tx.address.create({
      data: {
        ...data,
        customerProfileId: profile.id,
        isDefault: shouldBeDefault,
      },
    });
  });
};

export const updateAddress = async (userId, addressId, data) => {
  const address = await getAddressById(userId, addressId);

  return prisma.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({
        where: { customerProfileId: address.customerProfileId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return tx.address.update({
      where: { id: addressId },
      data,
    });
  });
};

export const deleteAddress = async (userId, addressId) => {
  const address = await getAddressById(userId, addressId);

  return prisma.$transaction(async (tx) => {
    await tx.address.delete({ where: { id: addressId } });

    // If the deleted address was default, promote another address to default
    if (address.isDefault) {
      const nextAddress = await tx.address.findFirst({
        where: { customerProfileId: address.customerProfileId },
        orderBy: { createdAt: 'desc' },
      });

      if (nextAddress) {
        await tx.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }
  });
};

export const setDefaultAddress = async (userId, addressId) => {
  const address = await getAddressById(userId, addressId);

  return prisma.$transaction(async (tx) => {
    await tx.address.updateMany({
      where: { customerProfileId: address.customerProfileId, isDefault: true },
      data: { isDefault: false },
    });

    return tx.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  });
};

// ── SELLER SERVICE ──────────────────────────────────────────────────────────

export const getSellerProfile = async (userId) => {
  const profile = await prisma.sellerProfile.findUnique({
    where: { userId },
    include: {
      stores: {
        select: {
          id: true,
          name: true,
          status: true,
          isOpen: true,
          avgRating: true,
          totalRatings: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
        },
      },
    },
  });

  if (!profile) {
    throw new AppError('Seller profile not found', HTTP_STATUS.NOT_FOUND);
  }

  return profile;
};

export const updateSellerProfile = async (userId, data) => {
  const profile = await prisma.sellerProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError('Seller profile not found', HTTP_STATUS.NOT_FOUND);
  }

  return prisma.sellerProfile.update({
    where: { userId },
    data,
  });
};

// ── DELIVERY PARTNER SERVICE ────────────────────────────────────────────────

export const getDeliveryPartnerProfile = async (userId) => {
  const partner = await prisma.deliveryPartner.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
        },
      },
    },
  });

  if (!partner) {
    throw new AppError('Delivery partner profile not found', HTTP_STATUS.NOT_FOUND);
  }

  return partner;
};

export const updateDeliveryPartnerProfile = async (userId, data) => {
  const partner = await prisma.deliveryPartner.findUnique({ where: { userId } });
  if (!partner) {
    throw new AppError('Delivery partner profile not found', HTTP_STATUS.NOT_FOUND);
  }

  return prisma.deliveryPartner.update({
    where: { userId },
    data,
  });
};

export const toggleOnlineStatus = async (userId, isOnline) => {
  const partner = await prisma.deliveryPartner.findUnique({ where: { userId } });
  if (!partner) {
    throw new AppError('Delivery partner profile not found', HTTP_STATUS.NOT_FOUND);
  }

  return prisma.deliveryPartner.update({
    where: { userId },
    data: { isOnline },
  });
};

export const updateLocation = async (userId, { latitude, longitude }) => {
  const partner = await prisma.deliveryPartner.findUnique({ where: { userId } });
  if (!partner) {
    throw new AppError('Delivery partner profile not found', HTTP_STATUS.NOT_FOUND);
  }

  return prisma.deliveryPartner.update({
    where: { userId },
    data: {
      currentLat: latitude,
      currentLng: longitude,
    },
  });
};
